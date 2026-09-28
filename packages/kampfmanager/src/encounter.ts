import { CONDITION_KEYS, type BestiaryPreset, type Combatant, type EncounterState, type SheetHeroSummary } from "./types";

const makeId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
export const emptyConditions = (): Combatant["conditions"] => Object.fromEntries(CONDITION_KEYS.map((key) => [key, 0])) as Combatant["conditions"];

export const newEncounter = (): EncounterState => ({
  version: 1,
  id: makeId("encounter"),
  name: "Neuer Kampf",
  round: 1,
  turnIndex: 0,
  started: false,
  combatants: [],
  log: [],
  updatedAt: new Date().toISOString(),
});

export const initiativeTotal = (base: number, roll?: number): number => base + (roll ?? 0);

export const rollInitiative = (combatant: Combatant, random = Math.random): Combatant => {
  const roll = Math.floor(random() * 6) + 1;
  return { ...combatant, initiativeRoll: roll, initiativeTotal: initiativeTotal(combatant.initiativeBase, roll), initiativeManual: false };
};

export const setInitiativeTotal = (combatant: Combatant, total: number): Combatant => ({
  ...combatant,
  initiativeTotal: Math.max(0, Math.round(total)),
  initiativeRoll: undefined,
  initiativeManual: true,
});

export const sortCombatants = (combatants: Combatant[]): Combatant[] => [...combatants].sort((a, b) =>
  b.initiativeTotal - a.initiativeTotal || b.initiativeBase - a.initiativeBase || a.name.localeCompare(b.name, "de"));

export const applyLifeChange = (combatant: Combatant, delta: number): Combatant => {
  const current = clamp(combatant.lp.current + delta, 0, combatant.lp.max);
  return { ...combatant, lp: { ...combatant.lp, current }, defeated: current <= 0 };
};

export const changeCondition = (combatant: Combatant, key: keyof Combatant["conditions"], delta: number): Combatant => ({
  ...combatant,
  conditions: { ...combatant.conditions, [key]: clamp(combatant.conditions[key] + delta, 0, 4) },
});

export const createFromPreset = (
  preset: BestiaryPreset,
  variant: "weak" | "normal" | "elite" = "normal",
  name = preset.name,
  legacyReviewed = false,
): Combatant => {
  if (!preset.playable) throw new Error("Dieser Eintrag ist nur als Quellenreferenz verfügbar.");
  if (preset.requiresReview && !legacyReviewed) throw new Error("DSA-4.1-Altdaten müssen vor der Übernahme bestätigt werden.");
  const factor = variant === "weak" ? 0.8 : variant === "elite" ? 1.25 : 1;
  const valueDelta = variant === "weak" ? -1 : variant === "elite" ? 2 : 0;
  const damageDelta = variant === "weak" ? " (schwach)" : variant === "elite" ? " (Elite)" : "";
  const lp = Math.max(1, Math.round(preset.lp * factor));
  return {
    id: makeId("enemy"), name, kind: "enemy", source: "preset", presetId: preset.id,
    initiativeBase: Math.max(0, preset.initiative + valueDelta), initiativeTotal: Math.max(0, preset.initiative + valueDelta),
    lp: { current: lp, max: lp },
    ...(preset.ae ? { ae: { current: preset.ae, max: preset.ae } } : {}),
    ...(preset.kp ? { kp: { current: preset.kp, max: preset.kp } } : {}),
    defense: Math.max(0, preset.defense + valueDelta), rs: Math.max(0, preset.rs + (variant === "elite" ? 1 : 0)),
    sk: preset.sk, zk: preset.zk, gs: preset.gs, actions: preset.actions,
    attacks: preset.attacks.map((attack) => ({ ...attack, id: makeId("attack"), value: Math.max(0, attack.value + valueDelta), damage: `${attack.damage}${damageDelta}` })),
    conditions: emptyConditions(), notes: `${preset.notes}${preset.equipment ? ` Ausrüstung: ${preset.equipment}.` : ""}${preset.requiresReview ? " Werte vor der Übernahme für DSA 5 bestätigt." : ""}`, defeated: false,
  };
};

export const createFromSheet = (hero: SheetHeroSummary): Combatant => ({
  id: makeId("hero"), name: hero.name, kind: "hero", source: "sheet", tokenId: hero.tokenId, tokenName: hero.tokenName,
  initiativeBase: hero.initiative, initiativeTotal: hero.initiative,
  lp: { ...hero.lp }, ...(hero.ae ? { ae: { ...hero.ae } } : {}), ...(hero.kp ? { kp: { ...hero.kp } } : {}),
  ...(hero.fate ? { fate: { ...hero.fate } } : {}), defense: hero.dodge ?? hero.parry ?? 0,
  rs: 0, sk: 0, zk: 0, gs: 8, actions: 1,
  attacks: hero.attack === undefined ? [] : [{ id: makeId("attack"), name: hero.attackName || "Hauptwaffe", type: hero.attackType || "AT", value: hero.attack, damage: "laut Heldenbogen", ...(hero.parry === undefined ? {} : { parry: hero.parry }) }],
  conditions: { ...emptyConditions(), ...(hero.conditions?.includes("Schmerz") ? { Schmerz: 1 } : {}) },
  notes: `Aus Heldenbogen importiert · Stand ${new Date(hero.updatedAt).toLocaleString("de-DE")}`, defeated: hero.lp.current <= 0,
});

export const advanceTurn = (state: EncounterState): EncounterState => {
  if (!state.combatants.length) return state;
  const nextIndex = (state.turnIndex + 1) % state.combatants.length;
  const nextRound = nextIndex === 0 ? state.round + 1 : state.round;
  return { ...state, round: nextRound, turnIndex: nextIndex, started: true, updatedAt: new Date().toISOString() };
};

export const previousTurn = (state: EncounterState): EncounterState => {
  if (!state.combatants.length) return state;
  const previousIndex = (state.turnIndex - 1 + state.combatants.length) % state.combatants.length;
  const previousRound = state.turnIndex === 0 ? Math.max(1, state.round - 1) : state.round;
  return { ...state, round: previousRound, turnIndex: previousIndex, updatedAt: new Date().toISOString() };
};

export const addLog = (state: EncounterState, text: string): EncounterState => ({
  ...state,
  log: [{ id: makeId("log"), at: new Date().toISOString(), round: state.round, text }, ...state.log].slice(0, 100),
  updatedAt: new Date().toISOString(),
});
