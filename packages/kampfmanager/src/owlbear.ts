import OBR from "@owlbear-rodeo/sdk";
import type { Metadata } from "@owlbear-rodeo/sdk";
import type { EncounterState, SheetHeroSummary } from "./types";
import { parseEncounter } from "./storage";

const SHEET_SUMMARY_KEY = "de.alexander-hoffmann.dsa5-sheet/summary";
const ENCOUNTER_KEY = "de.alexander-hoffmann.dsa5-combat-manager/encounter";
const TOKEN_COMBAT_KEY = "de.alexander-hoffmann.dsa5-combat-manager/combatant";

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const resource = (value: unknown) => isObject(value) && typeof value.current === "number" && typeof value.max === "number" ? { current: value.current, max: value.max } : undefined;

export class OwlbearCombatBridge {
  available = false;
  isGameMaster = false;
  private metadataListener?: (state: EncounterState) => void;

  async initialize(): Promise<boolean> {
    if (!OBR.isAvailable) return false;
    if (!OBR.isReady) await new Promise<void>((resolve) => OBR.onReady(resolve));
    this.available = true;
    this.isGameMaster = (await OBR.player.getRole()) === "GM";
    OBR.scene.onMetadataChange((metadata) => {
      const parsed = parseEncounter(metadata[ENCOUNTER_KEY]);
      if (parsed) this.metadataListener?.(parsed);
    });
    return true;
  }

  onEncounterChange(listener: (state: EncounterState) => void): void { this.metadataListener = listener; }

  async loadEncounter(): Promise<EncounterState | null> {
    if (!this.available || !(await OBR.scene.isReady())) return null;
    return parseEncounter((await OBR.scene.getMetadata())[ENCOUNTER_KEY]);
  }

  async saveEncounter(state: EncounterState): Promise<void> {
    if (!this.available || !this.isGameMaster || !(await OBR.scene.isReady())) return;
    await OBR.scene.setMetadata({ [ENCOUNTER_KEY]: state } as Metadata);
  }

  async getSheetHeroes(): Promise<SheetHeroSummary[]> {
    if (!this.available || !(await OBR.scene.isReady())) return [];
    const items = await OBR.scene.items.getItems((item) => item.layer === "CHARACTER");
    const heroes: SheetHeroSummary[] = [];
    for (const item of items) {
      const value = item.metadata[SHEET_SUMMARY_KEY];
      if (!isObject(value) || typeof value.heroId !== "string" || typeof value.name !== "string") continue;
      const lp = resource(value.lp); if (!lp) continue;
      const combat = isObject(value.combat) ? value.combat : undefined;
      const conditions = isObject(value.conditions) && Array.isArray(value.conditions.active) ? value.conditions.active.filter((entry): entry is string => typeof entry === "string") : undefined;
      heroes.push({
        tokenId:item.id, tokenName:item.name || value.name, heroId:value.heroId, name:value.name, lp,
        ...(resource(value.ae) ? { ae: resource(value.ae) } : {}), ...(resource(value.kp) ? { kp: resource(value.kp) } : {}), ...(resource(value.fate) ? { fate: resource(value.fate) } : {}),
        initiative:typeof value.initiative === "number" ? value.initiative : typeof combat?.initiative === "number" ? combat.initiative : 0,
        ...(typeof combat?.primaryWeaponName === "string" ? { attackName: combat.primaryWeaponName } : {}),
        ...(combat?.attackLabel === "AT" || combat?.attackLabel === "FK" ? { attackType: combat.attackLabel } : {}),
        ...(typeof combat?.attack === "number" ? { attack: combat.attack } : {}), ...(typeof combat?.parry === "number" ? { parry: combat.parry } : {}),
        ...(typeof combat?.dodge === "number" ? { dodge: combat.dodge } : {}), ...(conditions ? { conditions } : {}),
        updatedAt:typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
      });
    }
    return heroes.sort((a,b) => a.name.localeCompare(b.name,"de"));
  }

  async linkSelectedToken(combatant: { id:string; name:string; kind:string; lp:{current:number;max:number}; initiativeTotal:number }): Promise<{id:string;name:string}> {
    if (!this.available) throw new Error("Owlbear Rodeo ist nicht verbunden.");
    const selection = await OBR.player.getSelection();
    if (!selection || selection.length !== 1) throw new Error("Wähle genau einen Charaktertoken auf der Karte aus.");
    const [item] = await OBR.scene.items.getItems(selection);
    if (!item || item.layer !== "CHARACTER") throw new Error("Das ausgewählte Element ist kein Charaktertoken.");
    await OBR.scene.items.updateItems([item], (items) => { for (const token of items) token.metadata[TOKEN_COMBAT_KEY] = { version:1, combatantId:combatant.id, name:combatant.name, kind:combatant.kind, lp:combatant.lp, initiative:combatant.initiativeTotal }; });
    await OBR.notification.show(`${combatant.name} wurde mit ${item.name || "dem Token"} verbunden.`, "SUCCESS");
    return { id:item.id, name:item.name || combatant.name };
  }
}
