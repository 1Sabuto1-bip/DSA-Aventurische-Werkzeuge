export const CONDITION_KEYS = ["Belastung", "Betäubung", "Furcht", "Paralyse", "Schmerz", "Verwirrung"] as const;
export type ConditionKey = typeof CONDITION_KEYS[number];
export type CombatantKind = "hero" | "enemy";
export type CombatantSource = "manual" | "sheet" | "preset";

export interface Resource {
  current: number;
  max: number;
}

export interface Attack {
  id: string;
  name: string;
  type: "AT" | "FK";
  value: number;
  damage: string;
  parry?: number;
  range?: string;
}

export interface Combatant {
  id: string;
  name: string;
  kind: CombatantKind;
  source: CombatantSource;
  presetId?: string;
  tokenId?: string;
  tokenName?: string;
  initiativeBase: number;
  initiativeRoll?: number;
  initiativeTotal: number;
  initiativeManual?: boolean;
  lp: Resource;
  ae?: Resource;
  kp?: Resource;
  fate?: Resource;
  defense: number;
  rs: number;
  sk: number;
  zk: number;
  gs: number;
  actions: number;
  attacks: Attack[];
  conditions: Record<ConditionKey, number>;
  notes: string;
  defeated: boolean;
}

export interface EncounterState {
  version: 1;
  id: string;
  name: string;
  round: number;
  turnIndex: number;
  started: boolean;
  combatants: Combatant[];
  log: LogEntry[];
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  at: string;
  round: number;
  text: string;
}

export interface BestiaryPreset {
  id: string;
  name: string;
  category: string;
  rulesEdition: "DSA5" | "DSA4.1";
  playable: boolean;
  requiresReview?: boolean;
  sourceUrl?: string;
  sourceBook: string;
  sourcePage?: number;
  group?: string;
  size: string;
  initiative: number;
  lp: number;
  ae?: number;
  kp?: number;
  defense: number;
  rs: number;
  sk: number;
  zk: number;
  gs: number;
  actions: number;
  attacks: Omit<Attack, "id">[];
  notes: string;
  equipment?: string;
  habitat?: string;
  occurrence?: string;
  loot?: string;
  legacySource?: string;
  legacySummary?: string;
}

export interface SheetHeroSummary {
  tokenId: string;
  tokenName: string;
  heroId: string;
  name: string;
  lp: Resource;
  ae?: Resource;
  kp?: Resource;
  fate?: Resource;
  initiative: number;
  attackName?: string;
  attackType?: "AT" | "FK";
  attack?: number;
  parry?: number;
  dodge?: number;
  conditions?: string[];
  updatedAt: string;
}
