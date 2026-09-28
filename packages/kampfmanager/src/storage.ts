import type { EncounterState } from "./types";
import { newEncounter } from "./encounter";

const KEY = "dsa5-meister-kampfmanager-v1";

export const parseEncounter = (value: unknown): EncounterState | null => {
  if (!value || typeof value !== "object") return null;
  const state = value as Partial<EncounterState>;
  if (state.version !== 1 || !Array.isArray(state.combatants) || typeof state.round !== "number" || typeof state.name !== "string") return null;
  return state as EncounterState;
};

export const loadLocalEncounter = (): EncounterState => {
  try { return parseEncounter(JSON.parse(localStorage.getItem(KEY) || "null")) || newEncounter(); }
  catch { return newEncounter(); }
};

export const saveLocalEncounter = (state: EncounterState): void => localStorage.setItem(KEY, JSON.stringify(state));

export const downloadEncounter = (state: EncounterState): void => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${state.name.replace(/[^a-z0-9äöüß-]+/gi, "-").replace(/^-|-$/g, "") || "kampf"}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};
