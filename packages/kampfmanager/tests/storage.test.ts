import { describe, expect, it } from "vitest";
import { newEncounter } from "../src/encounter";
import { parseEncounter } from "../src/storage";

describe("Kampfstand-Import", () => {
  it("akzeptiert Version 1", () => expect(parseEncounter(newEncounter())?.version).toBe(1));
  it("weist leere Eingaben ab", () => expect(parseEncounter(null)).toBeNull());
  it("weist fremde Versionen ab", () => expect(parseEncounter({...newEncounter(),version:2})).toBeNull());
  it("weist fehlende Teilnehmerliste ab", () => { const value={...newEncounter()} as Record<string,unknown>;delete value.combatants;expect(parseEncounter(value)).toBeNull(); });
});
