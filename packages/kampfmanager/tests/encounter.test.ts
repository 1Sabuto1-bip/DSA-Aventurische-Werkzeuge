import { describe, expect, it } from "vitest";
import { BESTIARY_COUNTS, BESTIARY_PRESETS, HUMAN_OPPONENT_PRESETS } from "../src/bestiary-data";
import { advanceTurn, applyLifeChange, changeCondition, createFromPreset, createFromSheet, newEncounter, previousTurn, rollInitiative, setInitiativeTotal, sortCombatants } from "../src/encounter";

const wolf = () => createFromPreset(BESTIARY_PRESETS.find((entry) => entry.id === "waldwolf")!);

describe("Bestiarium-Presets", () => {
  it("enthält mehrere Gegnergruppen", () => expect(new Set(BESTIARY_PRESETS.map((entry) => entry.category)).size).toBeGreaterThanOrEqual(4));
  it("enthält die geprüften DSA-5- und Zoo-Botanica-Daten", () => {
    expect(BESTIARY_COUNTS.total).toBe(443);
    expect(BESTIARY_COUNTS.dsa5).toBe(154);
    expect(BESTIARY_COUNTS.legacy).toBe(289);
  });
  it("enthält für spielbare DSA-5-Presets vollständige Grundwerte", () => {
    for (const preset of BESTIARY_PRESETS.filter((entry) => entry.rulesEdition === "DSA5")) {
      expect(preset.lp).toBeGreaterThan(0);
      expect(preset.playable).toBe(true);
      expect(preset.sourceUrl?.startsWith("https://dsa.ulisses-regelwiki.de/")).toBe(true);
    }
  });
  it("ergänzt DSA-5-Einträge um Zoo-Botanica-Metadaten", () => {
    const basilisk = BESTIARY_PRESETS.find((entry) => entry.id === "bestiarium-i-basilisk")!;
    expect(basilisk.habitat).toContain("extrem selten");
    expect(basilisk.legacySource).toContain("Zoo-Botanica");
  });
  it("kennzeichnet Altdaten und verhindert ungeprüfte Übernahme", () => {
    const legacy = BESTIARY_PRESETS.find((entry) => entry.rulesEdition === "DSA4.1" && entry.playable)!;
    expect(legacy.requiresReview).toBe(true);
    expect(() => createFromPreset(legacy)).toThrow(/bestätigt/);
    expect(createFromPreset(legacy,"normal",legacy.name,true).name).toBe(legacy.name);
  });
  it("erzeugt normale Gegner", () => {
    const result = wolf(); expect(result.name).toBe("Waldwolf"); expect(result.lp.max).toBe(18); expect(result.attacks[0]?.value).toBe(13);
  });
  it("erzeugt schwache Varianten", () => {
    const preset = BESTIARY_PRESETS.find((entry) => entry.id === "waldwolf")!;
    const result = createFromPreset(preset,"weak"); expect(result.lp.max).toBe(14); expect(result.defense).toBe(6); expect(result.attacks[0]?.value).toBe(12);
  });
  it("erzeugt Elitevarianten", () => {
    const preset = BESTIARY_PRESETS.find((entry) => entry.id === "waldwolf")!;
    const result = createFromPreset(preset,"elite"); expect(result.lp.max).toBe(23); expect(result.rs).toBe(1); expect(result.attacks[0]?.value).toBe(15);
  });
  it("enthält zwölf ausgerüstete Menschen-Schnellgegner", () => {
    expect(HUMAN_OPPONENT_PRESETS).toHaveLength(12);
    expect(HUMAN_OPPONENT_PRESETS.map((entry) => entry.name)).toEqual(expect.arrayContaining(["Streuner","Stadtgardist","Soldat","Söldner","Pirat"]));
    expect(HUMAN_OPPONENT_PRESETS.every((entry) => Boolean(entry.equipment) && entry.attacks.length > 0)).toBe(true);
  });
  it("stuft Menschengegner in drei Schwierigkeitsgrade ab", () => {
    const preset = HUMAN_OPPONENT_PRESETS.find((entry) => entry.id === "mensch-stadtgardist")!;
    const simple = createFromPreset(preset,"weak");
    const experienced = createFromPreset(preset,"normal");
    const elite = createFromPreset(preset,"elite");
    expect(simple.lp.max).toBeLessThan(experienced.lp.max);
    expect(elite.lp.max).toBeGreaterThan(experienced.lp.max);
    expect(elite.attacks[0]!.value).toBeGreaterThan(experienced.attacks[0]!.value);
    expect(experienced.notes).toContain("Ausrüstung:");
  });
});

describe("Kampfablauf", () => {
  it("startet in Runde eins", () => { const result=newEncounter();expect(result.round).toBe(1);expect(result.combatants).toEqual([]); });
  it("würfelt Initiative von 1 bis 6", () => { expect(rollInitiative(wolf(),()=>0).initiativeRoll).toBe(1);expect(rollInitiative(wolf(),()=>.999).initiativeRoll).toBe(6); });
  it("sortiert Initiative absteigend", () => { const a={...wolf(),name:"A",initiativeTotal:10};const b={...wolf(),name:"B",initiativeTotal:16};expect(sortCombatants([a,b]).map((entry)=>entry.name)).toEqual(["B","A"]); });
  it("übernimmt einen selbst gewürfelten INI-Gesamtwert", () => {
    const hero=createFromSheet({tokenId:"t1",tokenName:"Token",heroId:"h1",name:"Alrik",lp:{current:30,max:30},initiative:12,updatedAt:"2026-01-01T00:00:00Z"});
    const adjusted=setInitiativeTotal(hero,17);
    expect(adjusted.initiativeBase).toBe(12);
    expect(adjusted.initiativeTotal).toBe(17);
    expect(adjusted.initiativeManual).toBe(true);
    expect(adjusted.initiativeRoll).toBeUndefined();
  });
  it("geht zum nächsten Teilnehmer", () => { const initial={...newEncounter(),combatants:[wolf(),wolf()]};expect(advanceTurn(initial).turnIndex).toBe(1); });
  it("erhöht nach dem letzten Teilnehmer die Runde", () => { const initial={...newEncounter(),combatants:[wolf(),wolf()],turnIndex:1};const next=advanceTurn(initial);expect(next.turnIndex).toBe(0);expect(next.round).toBe(2); });
  it("geht eine Runde zurück", () => { const initial={...newEncounter(),combatants:[wolf(),wolf()],round:2,turnIndex:0};const next=previousTurn(initial);expect(next.turnIndex).toBe(1);expect(next.round).toBe(1); });
});

describe("Lebenspunkte und Zustände", () => {
  it("zieht Schaden ab", () => expect(applyLifeChange(wolf(),-5).lp.current).toBe(13));
  it("fällt nicht unter null", () => expect(applyLifeChange(wolf(),-100).lp.current).toBe(0));
  it("markiert bei null als besiegt", () => expect(applyLifeChange(wolf(),-100).defeated).toBe(true));
  it("heilt nicht über das Maximum", () => { const hurt=applyLifeChange(wolf(),-5);expect(applyLifeChange(hurt,20).lp.current).toBe(18); });
  it("begrenzt Zustände auf vier", () => { let target=wolf();for(let i=0;i<8;i++)target=changeCondition(target,"Furcht",1);expect(target.conditions.Furcht).toBe(4); });
  it("senkt Zustände nicht unter null", () => expect(changeCondition(wolf(),"Schmerz",-1).conditions.Schmerz).toBe(0));
});

describe("Heldenimport", () => {
  it("übernimmt Ressourcen und Kampfwerte", () => {
    const hero=createFromSheet({tokenId:"t1",tokenName:"Alrik Token",heroId:"h1",name:"Alrik",lp:{current:28,max:32},initiative:14,attackName:"Schwert",attackType:"AT",attack:15,parry:9,dodge:7,updatedAt:"2026-01-01T00:00:00Z"});
    expect(hero.kind).toBe("hero");expect(hero.lp.current).toBe(28);expect(hero.attacks[0]?.value).toBe(15);expect(hero.tokenId).toBe("t1");
  });
  it("funktioniert auch ohne Angriff", () => {
    const hero=createFromSheet({tokenId:"t1",tokenName:"Token",heroId:"h1",name:"Alrik",lp:{current:30,max:30},initiative:12,updatedAt:"2026-01-01T00:00:00Z"});
    expect(hero.attacks).toEqual([]);
  });
});
