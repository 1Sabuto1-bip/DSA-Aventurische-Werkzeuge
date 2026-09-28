import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, "..");
const dsa5Path = path.join(project, "data-sources/DSA5-Bestiarien-Presetdaten-Pruefung-v0.1.json");
const legacyPath = path.join(project, "data-sources/DSA-Zoo-Botanica-Altdatenbank-v0.1.json");
const curatedPath = path.join(project, "src/bestiary-data.ts");
const outputPath = path.join(project, "src/generated-bestiary-data.ts");

const dsa5 = JSON.parse(fs.readFileSync(dsa5Path, "utf8"));
const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf8"));
const curatedText = fs.readFileSync(curatedPath, "utf8");
const curatedNames = new Set([...curatedText.matchAll(/\bname:"([^"]+)"/g)].map((match) => normalize(match[1])));

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("de").replace(/[^a-z0-9]+/g, "");
}

function firstNumber(value, fallback = 0) {
  const match = String(value ?? "").replace(/\./g, "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : fallback;
}

function clean(value) {
  const result = String(value ?? "").replace(/\s+/g, " ").trim();
  return result || undefined;
}

function attackFromDsa5(attack) {
  return {
    name: attack.name,
    type: attack.type === "FK" ? "FK" : "AT",
    value: firstNumber(attack.value),
    ...(attack.parry === undefined ? {} : { parry: firstNumber(attack.parry) }),
    damage: clean(attack.damage) || "siehe Sonderregel",
    ...(clean(attack.range) ? { range: clean(attack.range) } : {}),
  };
}

function zbaForDsa5(entry) {
  return legacy.creatures.find((candidate) => candidate.dsa5Matches?.some((match) => match.id === entry.id || normalize(match.name) === normalize(entry.name)));
}

function enrichment(candidate) {
  if (!candidate) return {};
  const values = candidate.legacyValues || {};
  return {
    ...(clean(values.distribution) ? { habitat: clean(values.distribution) } : {}),
    ...(clean(values.occurrence) ? { occurrence: clean(values.occurrence) } : {}),
    ...(clean(values.loot) ? { loot: clean(values.loot) } : {}),
    legacySource: `Zoo-Botanica Aventurica S. ${candidate.source.printedPage}`,
  };
}

const generatedDsa5 = dsa5.entries
  .filter((entry) => !curatedNames.has(normalize(entry.name)))
  .map((entry) => {
    const values = entry.values;
    const systemNotes = entry.review.systemKeywords?.length ? `Sonderregeln: ${entry.review.systemKeywords.join(", ")}.` : "";
    const integrationNote = entry.review.integration === "eigene Systemlogik" ? "Im Kampfmanager als Grundprofil; Spezialaktionen bitte anhand der Quelle führen." : "";
    return {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      rulesEdition: "DSA5",
      playable: true,
      sourceUrl: "https://dsa.ulisses-regelwiki.de/bestiarium.html",
      sourceBook: `${entry.book} S. ${entry.printedPage}`,
      sourcePage: entry.printedPage,
      size: clean(values.size) || "unbekannt",
      initiative: firstNumber(values.initiative),
      lp: Math.max(1, firstNumber(values.lp, 1)),
      ...(firstNumber(values.asp) > 0 ? { ae: firstNumber(values.asp) } : {}),
      ...(firstNumber(values.kap) > 0 ? { kp: firstNumber(values.kap) } : {}),
      defense: firstNumber(values.defense),
      rs: firstNumber(String(values.rsBe).split("/")[0]),
      sk: firstNumber(values.sk),
      zk: firstNumber(values.zk),
      gs: firstNumber(values.gs),
      actions: Math.max(1, firstNumber(values.actions, 1)),
      attacks: (values.attacks || []).map(attackFromDsa5),
      notes: [systemNotes, integrationNote].filter(Boolean).join(" ") || "Kompaktes DSA-5-Grundprofil.",
      ...enrichment(zbaForDsa5(entry)),
    };
  });

const groupProfiles = new Map(
  legacy.creatures
    .filter((entry) => entry.recordType === "legacy-stat-block")
    .map((entry) => [normalize(entry.name), entry.legacyValues || {}]),
);

function inheritedLegacyValues(entry) {
  const group = entry.group ? groupProfiles.get(normalize(entry.group)) : undefined;
  return { ...(group || {}), ...(entry.legacyValues || {}) };
}

function legacyAttack(attack) {
  return {
    name: attack.name,
    type: "AT",
    value: firstNumber(attack.at),
    ...(firstNumber(attack.pa) > 0 ? { parry: firstNumber(attack.pa) } : {}),
    damage: clean(attack.damage) || "prüfen",
    ...(clean(attack.distanceClass) ? { range: `DK ${clean(attack.distanceClass)}` } : {}),
  };
}

const generatedLegacy = legacy.creatures
  .filter((entry) => !entry.dsa5Matches?.length)
  .map((entry) => {
    const values = inheritedLegacyValues(entry);
    const lp = firstNumber(values.lp);
    const initiative = firstNumber(values.initiative);
    const playable = lp > 0;
    const legacySummary = [
      values.lp && `LeP ${values.lp}`,
      values.initiative && `INI ${values.initiative}`,
      values.parry && `PA ${values.parry}`,
      values.rs && `RS ${values.rs}`,
      values.gs && `GS ${values.gs}`,
      values.mr && `MR ${values.mr}`,
      values.threat && `GW ${values.threat}`,
    ].filter(Boolean).join(" · ");
    return {
      id: entry.id,
      name: entry.name,
      category: "Zoo-Botanica",
      ...(entry.group && entry.group !== entry.name ? { group: entry.group } : {}),
      rulesEdition: "DSA4.1",
      playable,
      requiresReview: true,
      sourceBook: `Zoo-Botanica Aventurica S. ${entry.source.printedPage}`,
      sourcePage: entry.source.printedPage,
      size: clean(values.size) || "nicht einzeln angegeben",
      initiative,
      lp,
      defense: firstNumber(values.parry),
      rs: firstNumber(values.rs),
      sk: 0,
      zk: 0,
      gs: firstNumber(values.gs),
      actions: 1,
      attacks: (values.attacks || []).map(legacyAttack),
      notes: `DSA-4.1-Altdaten${entry.recordType === "shared-profile-variant" ? `; Grundwerte aus dem Gruppenprofil ${entry.group}` : ""}. SK, ZK und DSA-5-Sonderregeln müssen geprüft werden.`,
      legacySummary: legacySummary || "Kein eigener Wertekasten; als Rechercheeintrag verfügbar.",
      ...(clean(values.distribution) ? { habitat: clean(values.distribution) } : {}),
      ...(clean(values.occurrence) ? { occurrence: clean(values.occurrence) } : {}),
      ...(clean(values.loot) ? { loot: clean(values.loot) } : {}),
    };
  });

const enrichments = Object.fromEntries(
  legacy.creatures
    .filter((entry) => entry.dsa5Matches?.length)
    .flatMap((entry) => entry.dsa5Matches.map((match) => [normalize(match.name), enrichment(entry)])),
);

const output = `// Automatisch aus den geprüften Bestiarium- und Zoo-Botanica-Daten erzeugt.\n` +
  `// Nicht manuell bearbeiten; stattdessen scripts/generate-bestiary-data.mjs ausführen.\n` +
  `import type { BestiaryPreset } from "./types";\n\n` +
  `export const GENERATED_DSA5_PRESETS: BestiaryPreset[] = ${JSON.stringify(generatedDsa5, null, 2)};\n\n` +
  `export const GENERATED_LEGACY_PRESETS: BestiaryPreset[] = ${JSON.stringify(generatedLegacy, null, 2)};\n\n` +
  `export const ZBA_ENRICHMENTS: Record<string, Partial<BestiaryPreset>> = ${JSON.stringify(enrichments, null, 2)};\n`;

fs.writeFileSync(outputPath, output, "utf8");
console.log(JSON.stringify({ dsa5: generatedDsa5.length, legacy: generatedLegacy.length, totalGenerated: generatedDsa5.length + generatedLegacy.length }, null, 2));
