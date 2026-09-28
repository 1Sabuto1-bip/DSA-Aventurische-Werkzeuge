import "./styles.css";
import { BESTIARY_CATEGORIES, BESTIARY_COUNTS, BESTIARY_PRESETS, HUMAN_OPPONENT_PRESETS } from "./bestiary-data";
import {
  addLog,
  advanceTurn,
  applyLifeChange,
  changeCondition,
  createFromPreset,
  createFromSheet,
  emptyConditions,
  newEncounter,
  previousTurn,
  rollInitiative,
  setInitiativeTotal,
  sortCombatants,
} from "./encounter";
import { OwlbearCombatBridge } from "./owlbear";
import { downloadEncounter, loadLocalEncounter, parseEncounter, saveLocalEncounter } from "./storage";
import { CONDITION_KEYS, type Combatant, type CombatantKind, type EncounterState, type SheetHeroSummary } from "./types";

type ModalState =
  | { kind: "enemyLibrary"; query: string; category: string; edition: "all" | "DSA5" | "DSA4.1"; limit: number }
  | { kind: "humanLibrary" }
  | { kind: "preset"; presetId: string }
  | { kind: "heroLibrary"; heroes: SheetHeroSummary[]; loading: boolean }
  | { kind: "manual"; combatantKind: CombatantKind; editId?: string }
  | { kind: "log" }
  | null;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App-Container fehlt.");

const bridge = new OwlbearCombatBridge();
let state: EncounterState = loadLocalEncounter();
let modal: ModalState = null;
let filter: "all" | CombatantKind = "all";
let search = "";
let syncTimer: number | undefined;
let notice = "";

const esc = (value: unknown): string => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[character] || character));
const num = (value: FormDataEntryValue | null, fallback = 0): number => {
  const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback;
};
const uid = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const conditionSum = (combatant: Combatant): number => Object.values(combatant.conditions).reduce((sum, value) => sum + value, 0);
const activeCombatant = (): Combatant | undefined => state.combatants[state.turnIndex];

const notify = (text: string): void => {
  notice = text;
  render();
  window.setTimeout(() => { if (notice === text) { notice = ""; render(); } }, 3200);
};

const scheduleOwlbearSync = (): void => {
  if (!bridge.available || !bridge.isGameMaster) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => void bridge.saveEncounter(state), 280);
};

const commit = (next: EncounterState, logText?: string): void => {
  state = logText ? addLog(next, logText) : { ...next, updatedAt: new Date().toISOString() };
  saveLocalEncounter(state);
  scheduleOwlbearSync();
  render();
};

const commitWithoutRender = (next: EncounterState, logText?: string): void => {
  state = logText ? addLog(next, logText) : { ...next, updatedAt: new Date().toISOString() };
  saveLocalEncounter(state);
  scheduleOwlbearSync();
};

const lifeBar = (combatant: Combatant): string => {
  const ratio = combatant.lp.max > 0 ? Math.max(0, Math.min(100, combatant.lp.current / combatant.lp.max * 100)) : 0;
  const tone = ratio <= 25 ? "danger" : ratio <= 50 ? "warning" : "healthy";
  return `<div class="life-bar ${tone}" aria-label="${ratio.toFixed(0)} Prozent Lebensenergie"><span style="width:${ratio}%"></span></div>`;
};

const resourcePill = (label: string, resource?: {current:number;max:number}): string => resource ? `<span class="resource-pill"><b>${label}</b> ${resource.current}/${resource.max}</span>` : "";

const renderCombatant = (combatant: Combatant, index: number): string => {
  const current = state.started && state.turnIndex === index;
  const conditions = CONDITION_KEYS.map((key) => {
    const level = combatant.conditions[key];
    return `<div class="condition-stepper ${level ? "active" : ""}"><span>${esc(key)}</span><button data-condition="${combatant.id}|${key}|-1" aria-label="${esc(key)} senken">−</button><b>${level}</b><button data-condition="${combatant.id}|${key}|1" aria-label="${esc(key)} erhöhen">+</button></div>`;
  }).join("");
  const attacks = combatant.attacks.length ? combatant.attacks.map((attack) => `<div class="attack-line"><b>${esc(attack.name)}</b><span>${attack.type} ${attack.value}${attack.parry === undefined ? "" : ` · PA ${attack.parry}`}</span><span>${esc(attack.damage)}${attack.range ? ` · RW ${esc(attack.range)}` : ""}</span></div>`).join("") : `<span class="muted">Keine Angriffe hinterlegt</span>`;
  return `<article class="combatant-card ${combatant.kind} ${current ? "current" : ""} ${combatant.defeated ? "defeated" : ""}" data-combatant-card="${combatant.id}">
    <header class="combatant-head">
      <div class="initiative-medallion ${combatant.kind === "hero" ? "initiative-editable" : ""}" title="${combatant.kind === "hero" ? "Selbst gewürfelten INI-Gesamtwert eintragen" : `Initiativebasis ${combatant.initiativeBase}${combatant.initiativeRoll ? ` + W6 (${combatant.initiativeRoll})` : ""}`}"><span>INI</span>${combatant.kind === "hero" ? `<input type="number" min="0" max="99" step="1" value="${combatant.initiativeTotal}" data-initiative-total="${combatant.id}" aria-label="Gewürfelte Initiative von ${esc(combatant.name)}" />` : `<b>${combatant.initiativeTotal}</b>`}</div>
      <div class="combatant-title"><div class="eyebrow">${combatant.kind === "hero" ? "Held" : "Gegner"}${combatant.tokenId ? " · Token verbunden" : ""}</div><h2>${esc(combatant.name)}</h2>${current ? `<span class="turn-badge">Am Zug</span>` : ""}</div>
      <div class="card-actions">
        <button class="icon-button" data-edit="${combatant.id}" title="Werte bearbeiten" aria-label="Werte bearbeiten">✎</button>
        ${bridge.available ? `<button class="icon-button" data-link="${combatant.id}" title="Mit ausgewähltem Owlbear-Token verbinden" aria-label="Mit Token verbinden">⌁</button>` : ""}
        <button class="icon-button danger-button" data-remove="${combatant.id}" title="Entfernen" aria-label="Entfernen">×</button>
      </div>
    </header>
    <section class="vitals">
      <div class="life-copy"><span>Lebensenergie</span><strong>${combatant.lp.current}<small> / ${combatant.lp.max}</small></strong></div>
      ${lifeBar(combatant)}
      <div class="quick-life">
        <input type="number" min="0" step="1" value="1" data-life-input="${combatant.id}" aria-label="Schaden oder Heilung" />
        <button class="damage" data-damage="${combatant.id}">Schaden</button>
        <button class="heal" data-heal="${combatant.id}">Heilen</button>
      </div>
      <div class="resource-row">${resourcePill("AsP",combatant.ae)}${resourcePill("KaP",combatant.kp)}${resourcePill("Schips",combatant.fate)}</div>
    </section>
    <section class="stat-strip">
      <span><b>VW</b>${combatant.defense}</span><span><b>RS</b>${combatant.rs}</span><span><b>SK</b>${combatant.sk}</span><span><b>ZK</b>${combatant.zk}</span><span><b>GS</b>${combatant.gs}</span><span><b>Aktionen</b>${combatant.actions}</span>
    </section>
    <details class="combat-details" ${current ? "open" : ""}><summary>Angriffe & Zustände <span>${conditionSum(combatant) ? `${conditionSum(combatant)} Zustandsstufen` : ""}</span></summary>
      <div class="detail-grid"><div><h3>Angriffe</h3><div class="attack-list">${attacks}</div>${combatant.notes ? `<p class="notes">${esc(combatant.notes)}</p>` : ""}</div><div><h3>Zustände</h3><div class="condition-grid">${conditions}</div></div></div>
    </details>
  </article>`;
};

const renderEmpty = (): string => `<section class="empty-roster"><div class="crossed-swords">⚔</div><h2>Der Kampfplatz ist noch leer</h2><p>Übernimm verbundene Helden aus Owlbear, verwende einen Gegner aus dem Bestiarium oder lege eigene Werte an.</p><div><button class="primary" data-open-hero>Held hinzufügen</button><button class="secondary" data-open-enemy>Gegner hinzufügen</button></div></section>`;

const renderSidebar = (): string => {
  const heroes = state.combatants.filter((item) => item.kind === "hero");
  const enemies = state.combatants.filter((item) => item.kind === "enemy");
  const healthy = state.combatants.filter((item) => item.lp.current > 0).length;
  const current = activeCombatant();
  return `<aside class="battle-sidebar">
    <section class="round-panel"><span>Kampfrunde</span><strong>${state.round}</strong><p>${current && state.started ? `${esc(current.name)} ist am Zug` : "Initiative auswürfeln, um zu beginnen"}</p>
      <div class="turn-controls"><button data-prev-turn title="Vorheriger Zug">←</button><button class="primary" data-next-turn>Nächster Zug</button></div>
    </section>
    <section class="summary-panel"><h3>Übersicht</h3><div><span>Helden</span><b>${heroes.length}</b></div><div><span>Gegner</span><b>${enemies.length}</b></div><div><span>Handlungsfähig</span><b>${healthy}/${state.combatants.length}</b></div></section>
    <section class="side-actions"><button class="primary" data-open-humans>＋ Menschengegner</button><button class="secondary" data-open-enemy>＋ Bestiarium</button><button class="secondary" data-open-hero>＋ Held</button><button class="ghost" data-open-manual="enemy">Freien Gegner erstellen</button></section>
    <section class="source-note"><b>${BESTIARY_COUNTS.total} Bestiarium-Einträge</b><p>${BESTIARY_COUNTS.dsa5} DSA-5-Presets und ${BESTIARY_COUNTS.legacy} gekennzeichnete Zoo-Botanica-Altdaten. Alte Werte müssen vor der Übernahme bestätigt werden.</p><a href="https://dsa.ulisses-regelwiki.de/bestiarium.html" target="_blank" rel="noreferrer">DSA-5-Bestiarium öffnen ↗</a></section>
  </aside>`;
};

const renderEnemyLibrary = (current: Extract<ModalState,{kind:"enemyLibrary"}>): string => {
  const query = current.query.trim().toLocaleLowerCase("de");
  const presets = BESTIARY_PRESETS.filter((preset) =>
    (current.edition === "all" || preset.rulesEdition === current.edition) &&
    (!current.category || preset.category === current.category) &&
    (!query || `${preset.name} ${preset.category} ${preset.group || ""} ${preset.notes} ${preset.habitat || ""} ${preset.occurrence || ""} ${preset.loot || ""} ${preset.sourceBook}`.toLocaleLowerCase("de").includes(query))
  );
  const visible = presets.slice(0, current.limit);
  return `<div class="modal wide"><header><div><span class="eyebrow">Gegnerbaukasten</span><h2>Bestiarium-Datenbank</h2></div><button class="modal-close" data-close>×</button></header>
    <nav class="edition-tabs" aria-label="Regelwerk auswählen"><button data-preset-edition="all" class="${current.edition === "all" ? "active" : ""}">Alle <b>${BESTIARY_COUNTS.total}</b></button><button data-preset-edition="DSA5" class="${current.edition === "DSA5" ? "active" : ""}">DSA 5 <b>${BESTIARY_COUNTS.dsa5}</b></button><button data-preset-edition="DSA4.1" class="legacy ${current.edition === "DSA4.1" ? "active" : ""}">Zoo-Botanica · DSA 4.1 <b>${BESTIARY_COUNTS.legacy}</b></button></nav>
    <div class="library-tools"><input id="preset-search" type="search" value="${esc(current.query)}" placeholder="Name, Lebensraum oder Quelle suchen …" autofocus/><select id="preset-category"><option value="">Alle Kategorien</option>${BESTIARY_CATEGORIES.map((category) => `<option ${category === current.category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select><button class="secondary" data-open-manual="enemy">Selbst erstellen</button></div>
    <div class="library-result-count"><b>${presets.length}</b> Treffer${presets.length > visible.length ? ` · die ersten ${visible.length} werden angezeigt` : ""}</div>
    <div class="preset-grid">${visible.map((preset) => `<article class="preset-card ${preset.rulesEdition === "DSA4.1" ? "legacy" : ""}"><div class="preset-title"><span>${esc(preset.category)}${preset.group ? ` · ${esc(preset.group)}` : ""}</span><h3>${esc(preset.name)}</h3><small>${esc(preset.size)}</small><em class="edition-badge ${preset.rulesEdition === "DSA4.1" ? "legacy" : ""}">${preset.rulesEdition === "DSA5" ? "DSA 5" : "DSA 4.1 · Altdaten"}</em></div>${preset.playable ? `<div class="preset-stats"><span><b>LeP</b>${preset.lp}</span><span><b>INI</b>${preset.initiative}+W6</span><span><b>${preset.rulesEdition === "DSA5" ? "VW" : "PA"}</b>${preset.defense}</span><span><b>RS</b>${preset.rs}</span></div>` : `<div class="reference-only">Kein eigener vollständiger Wertekasten</div>`}<p>${esc(preset.attacks.length ? preset.attacks.map((attack) => `${attack.name}: ${attack.type} ${attack.value}, ${attack.damage}`).join(" · ") : preset.legacySummary || "Spezialaktionen laut Quelle")}</p>${preset.habitat ? `<div class="preset-meta"><b>Lebensraum</b> ${esc(preset.habitat)}</div>` : ""}<footer><span class="source-label">${esc(preset.sourceBook)}</span>${preset.sourceUrl ? `<a href="${esc(preset.sourceUrl)}" target="_blank" rel="noreferrer" title="Offizielle Quelle öffnen">Quelle ↗</a>` : ""}${preset.playable ? `<button class="primary compact" data-preset="${preset.id}">${preset.requiresReview ? "Prüfen & übernehmen" : "Auswählen"}</button>` : `<button class="secondary compact" disabled>Nur Referenz</button>`}</footer></article>`).join("") || `<div class="empty-search">Keine passenden Einträge gefunden.</div>`}</div>${presets.length > visible.length ? `<div class="load-more"><button class="secondary" data-more-presets>Weitere ${Math.min(120,presets.length-visible.length)} Einträge anzeigen</button></div>` : ""}
  </div>`;
};

const renderHumanLibrary = (): string => `<div class="modal wide human-library"><header><div><span class="eyebrow">Ein-Klick-Gegner</span><h2>Menschengegner</h2></div><button class="modal-close" data-close>×</button></header>
  <div class="human-library-intro"><div><b>Gegner auswählen und sofort hinzufügen</b><span>Jede Stufe passt LeP, Initiative, Verteidigung, Rüstung und Angriffswerte automatisch an.</span></div><div class="difficulty-legend"><span class="simple">Einfach</span><span class="experienced">Erfahren</span><span class="elite">Elite</span></div></div>
  <div class="human-preset-grid">${HUMAN_OPPONENT_PRESETS.map((preset) => `<article class="human-preset-card"><header><div><span>${esc(preset.group || "Menschen")}</span><h3>${esc(preset.name)}</h3></div><b>RS ${preset.rs}</b></header><div class="human-stats"><span>LeP <b>${preset.lp}</b></span><span>INI <b>${preset.initiative}+W6</b></span><span>VW <b>${preset.defense}</b></span></div><p class="equipment"><b>Ausrüstung</b>${esc(preset.equipment || "Keine feste Ausrüstung")}</p><p>${esc(preset.notes)}</p><footer><button class="quick-difficulty simple" data-quick-human="${preset.id}|weak"><span>Einfach</span><small>−1 · 80 % LeP</small></button><button class="quick-difficulty experienced" data-quick-human="${preset.id}|normal"><span>Erfahren</span><small>Grundwerte</small></button><button class="quick-difficulty elite" data-quick-human="${preset.id}|elite"><span>Elite</span><small>+2 · 125 % LeP</small></button></footer></article>`).join("")}</div>
  <footer class="modal-footer human-footer"><span>Vereinfachte DSA-5-Spielleiterprofile für schnelle Begegnungen. Alle Werte lassen sich nach dem Hinzufügen über ✎ ändern.</span><button class="secondary" data-open-enemy>Vollständiges Bestiarium</button></footer>
</div>`;

const renderPresetEditor = (presetId: string): string => {
  const preset = BESTIARY_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) return "";
  const attackFields = (preset.attacks.length ? preset.attacks : [{name:"",type:"AT" as const,value:0,damage:""}]).map((attack,index) => `<div class="form-divider full"><span>Angriff ${index + 1}</span></div><label>Bezeichnung<input name="presetAttackName${index}" value="${esc(attack.name)}" placeholder="optional" /></label><label>Art<select name="presetAttackType${index}"><option ${attack.type !== "FK" ? "selected" : ""}>AT</option><option ${attack.type === "FK" ? "selected" : ""}>FK</option></select></label><label>Angriffswert<input name="presetAttackValue${index}" type="number" min="0" value="${attack.value}" /></label><label>Parade<input name="presetAttackParry${index}" type="number" min="0" value="${attack.parry ?? 0}" /></label><label class="full">Trefferpunkte<input name="presetAttackDamage${index}" value="${esc(attack.damage)}" placeholder="z. B. 1W6+4" /></label>`).join("");
  return `<div class="modal"><header><div><span class="eyebrow">Preset anpassen</span><h2>${esc(preset.name)}</h2></div><button class="modal-close" data-close>×</button></header>
    <form id="preset-form" class="editor-form">
      <input type="hidden" name="presetId" value="${preset.id}" />
      <input type="hidden" name="presetAttackCount" value="${Math.max(1,preset.attacks.length)}" />
      ${preset.requiresReview ? `<div class="legacy-warning full"><b>Altdaten aus DSA 4.1</b><p>Diese Werte sind keine fertige DSA-5-Konvertierung. Prüfe besonders LeP, Initiative, Verteidigung, SK, ZK und Angriffe vor der Übernahme.</p><span>${esc(preset.legacySummary || "")}</span></div>` : ""}
      <div class="preset-source full"><b>${esc(preset.sourceBook)}</b>${preset.legacySource ? `<span>Ergänzt aus ${esc(preset.legacySource)}</span>` : ""}${preset.habitat ? `<span>Lebensraum: ${esc(preset.habitat)}</span>` : ""}${preset.occurrence ? `<span>Auftreten: ${esc(preset.occurrence)}</span>` : ""}${preset.loot ? `<span>Beute: ${esc(preset.loot)}</span>` : ""}</div>
      <label class="full">Name<input name="name" value="${esc(preset.name)}" required /></label>
      <label>Anzahl<input name="count" type="number" min="1" max="30" value="1" /></label>
      <label>Variante<select name="variant"><option value="normal">Normal</option><option value="weak">Schwach</option><option value="elite">Elite</option></select></label>
      <div class="form-divider full"><span>Werte können vor dem Hinzufügen überschrieben werden</span></div>
      <label>LeP<input name="lp" type="number" min="1" value="${preset.lp}" /></label><label>INI-Basis<input name="initiative" type="number" value="${preset.initiative}" /></label>
      <label>Verteidigung<input name="defense" type="number" value="${preset.defense}" /></label><label>RS<input name="rs" type="number" min="0" value="${preset.rs}" /></label>
      <label>SK<input name="sk" type="number" value="${preset.sk}" /></label><label>ZK<input name="zk" type="number" value="${preset.zk}" /></label>
      <label>GS<input name="gs" type="number" min="0" value="${preset.gs}" /></label><label>Aktionen<input name="actions" type="number" min="1" value="${preset.actions}" /></label>
      ${attackFields}
      <p class="form-hint full">Die Varianten ändern LeP sowie Angriffs-, Verteidigungs- und Initiativewerte automatisch. Deine überschriebenen Grundwerte werden danach angewandt.</p>
      ${preset.requiresReview ? `<label class="legacy-confirm full"><input name="legacyReviewed" type="checkbox" required /> Ich habe die Altdaten geprüft und passe sie für meinen DSA-5-Kampf an.</label>` : ""}
      <footer class="form-actions full"><button type="button" class="ghost" data-back-enemy>Zurück</button><button class="primary" type="submit">Gegner hinzufügen</button></footer>
    </form>
  </div>`;
};

const renderHeroLibrary = (current: Extract<ModalState,{kind:"heroLibrary"}>): string => `<div class="modal"><header><div><span class="eyebrow">Heldengruppe</span><h2>Helden hinzufügen</h2></div><button class="modal-close" data-close>×</button></header>
  ${bridge.available ? `<div class="connection-callout ${bridge.isGameMaster ? "ok" : "warn"}"><b>${bridge.isGameMaster ? "Owlbear-Szene verbunden" : "Nur für den GM"}</b><span>${bridge.isGameMaster ? "Verbundene Charakterbögen können direkt übernommen werden." : "Die Szenendaten können nur in der GM-Rolle verwaltet werden."}</span></div>` : `<div class="connection-callout"><b>Browsermodus</b><span>Helden können vollständig manuell angelegt werden.</span></div>`}
  <div class="hero-import-list">${current.loading ? `<div class="loading">Helden werden gelesen …</div>` : current.heroes.length ? current.heroes.map((hero) => `<article><div class="hero-avatar">${esc(hero.name.slice(0,2).toUpperCase())}</div><div><h3>${esc(hero.name)}</h3><p>LeP ${hero.lp.current}/${hero.lp.max} · INI ${hero.initiative}${hero.attack === undefined ? "" : ` · ${hero.attackType || "AT"} ${hero.attack}`}</p><small>Token: ${esc(hero.tokenName)}</small></div><button class="primary compact" data-import-hero="${hero.heroId}">Übernehmen</button></article>`).join("") : `<div class="empty-search">Keine verbundenen Heldenbögen in der aktuellen Szene gefunden.</div>`}</div>
  <footer class="modal-footer"><button class="secondary" data-refresh-heroes ${!bridge.available ? "disabled" : ""}>Neu einlesen</button><button class="primary" data-open-manual="hero">Held manuell erstellen</button></footer>
  </div>`;

const renderManualForm = (current: Extract<ModalState,{kind:"manual"}>): string => {
  const existing = current.editId ? state.combatants.find((entry) => entry.id === current.editId) : undefined;
  const title = existing ? `${existing.name} bearbeiten` : current.combatantKind === "hero" ? "Held selbst erstellen" : "Gegner selbst erstellen";
  const attackFields = [0,1,2].map((index) => {
    const attack = existing?.attacks[index];
    const optional = index > 0;
    return `<div class="form-divider full"><span>${index === 0 ? "Hauptangriff" : `Weiterer Angriff ${index + 1}`}</span></div>
      <label>Bezeichnung<input name="attackName${index}" value="${esc(attack?.name || (optional ? "" : "Waffe"))}" ${optional ? 'placeholder="optional"' : ""} /></label><label>Art<select name="attackType${index}"><option ${attack?.type !== "FK" ? "selected" : ""}>AT</option><option ${attack?.type === "FK" ? "selected" : ""}>FK</option></select></label>
      <label>Angriffswert<input name="attackValue${index}" type="number" min="0" value="${attack?.value ?? (optional ? 0 : 10)}" /></label><label>Parade<input name="parry${index}" type="number" min="0" value="${attack?.parry ?? 0}" /></label>
      <label class="full">Trefferpunkte<input name="damage${index}" value="${esc(attack?.damage || (optional ? "" : "1W6+2"))}" ${optional ? 'placeholder="z. B. 1W6+4"' : ""} /></label>`;
  }).join("");
  return `<div class="modal"><header><div><span class="eyebrow">Freie Werte</span><h2>${esc(title)}</h2></div><button class="modal-close" data-close>×</button></header>
    <form id="manual-form" class="editor-form">
      <input type="hidden" name="kind" value="${existing?.kind || current.combatantKind}" /><input type="hidden" name="editId" value="${existing?.id || ""}" />
      <label class="full">Name<input name="name" required value="${esc(existing?.name || "")}" placeholder="Name" autofocus /></label>
      <label>LeP aktuell<input name="lpCurrent" type="number" min="0" value="${existing?.lp.current ?? 30}" /></label><label>LeP maximal<input name="lpMax" type="number" min="1" value="${existing?.lp.max ?? 30}" /></label>
      <label>INI-Basis<input name="initiative" type="number" value="${existing?.initiativeBase ?? 12}" /></label><label>Verteidigung<input name="defense" type="number" min="0" value="${existing?.defense ?? 6}" /></label>
      <label>RS<input name="rs" type="number" min="0" value="${existing?.rs ?? 0}" /></label><label>SK<input name="sk" type="number" value="${existing?.sk ?? 0}" /></label>
      <label>ZK<input name="zk" type="number" value="${existing?.zk ?? 0}" /></label><label>GS<input name="gs" type="number" min="0" value="${existing?.gs ?? 8}" /></label>
      <label>Aktionen<input name="actions" type="number" min="1" value="${existing?.actions ?? 1}" /></label><label>AsP maximal<input name="ae" type="number" min="0" value="${existing?.ae?.max ?? 0}" /></label>
      <label>KaP maximal<input name="kp" type="number" min="0" value="${existing?.kp?.max ?? 0}" /></label><label>Schicksalspunkte<input name="fate" type="number" min="0" value="${existing?.fate?.max ?? 0}" /></label>
      ${attackFields}
      <label class="full">Notizen<textarea name="notes" rows="3">${esc(existing?.notes || "")}</textarea></label>
      <footer class="form-actions full"><button type="button" class="ghost" data-close>Abbrechen</button><button class="primary" type="submit">${existing ? "Speichern" : "Hinzufügen"}</button></footer>
    </form>
  </div>`;
};

const renderLog = (): string => `<div class="modal"><header><div><span class="eyebrow">Chronik</span><h2>Kampfprotokoll</h2></div><button class="modal-close" data-close>×</button></header><div class="combat-log">${state.log.length ? state.log.map((entry) => `<article><span>Runde ${entry.round}</span><p>${esc(entry.text)}</p><time>${new Date(entry.at).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</time></article>`).join("") : `<div class="empty-search">Noch keine Einträge.</div>`}</div><footer class="modal-footer"><button class="secondary" data-clear-log>Protokoll leeren</button></footer></div>`;

const renderModal = (): string => {
  if (!modal) return "";
  let content = "";
  if (modal.kind === "enemyLibrary") content = renderEnemyLibrary(modal);
  if (modal.kind === "humanLibrary") content = renderHumanLibrary();
  if (modal.kind === "preset") content = renderPresetEditor(modal.presetId);
  if (modal.kind === "heroLibrary") content = renderHeroLibrary(modal);
  if (modal.kind === "manual") content = renderManualForm(modal);
  if (modal.kind === "log") content = renderLog();
  return `<div class="modal-backdrop" data-backdrop>${content}</div>`;
};

const render = (): void => {
  const visible = state.combatants.map((combatant,index) => ({combatant,index})).filter(({combatant}) => (filter === "all" || combatant.kind === filter) && (!search || combatant.name.toLocaleLowerCase("de").includes(search.toLocaleLowerCase("de"))));
  app.innerHTML = `<div class="app-shell">
    <header class="app-header"><div class="brand"><img src="./icon.svg" alt=""/><div><span>DSA5</span><h1>Meister-Kampfmanager</h1></div></div><div class="header-actions"><span class="connection-pill ${bridge.available ? bridge.isGameMaster ? "connected" : "warning" : "standalone"}"><i></i>${bridge.available ? bridge.isGameMaster ? "Owlbear · GM" : "Owlbear · Spieler" : "Browsermodus"}</span><button class="ghost" data-show-log>Protokoll</button><button class="ghost" data-export>Export</button><button class="ghost" data-import>Import</button><button class="danger-outline" data-new-encounter>Neuer Kampf</button><input id="import-file" type="file" accept="application/json" hidden/></div></header>
    <section class="encounter-toolbar"><label><span>Kampfbezeichnung</span><input id="encounter-name" value="${esc(state.name)}" /></label><div class="toolbar-actions"><button class="secondary" data-roll-enemies>🎲 Gegner-Initiative würfeln</button><button class="secondary" data-sort>↓ Nach Initiative sortieren</button></div></section>
    <div class="workspace">${renderSidebar()}<main class="roster"><div class="roster-tools"><div class="segmented"><button data-filter="all" class="${filter === "all" ? "active" : ""}">Alle <b>${state.combatants.length}</b></button><button data-filter="hero" class="${filter === "hero" ? "active" : ""}">Helden <b>${state.combatants.filter((item) => item.kind === "hero").length}</b></button><button data-filter="enemy" class="${filter === "enemy" ? "active" : ""}">Gegner <b>${state.combatants.filter((item) => item.kind === "enemy").length}</b></button></div><input id="roster-search" type="search" value="${esc(search)}" placeholder="Teilnehmer suchen …"/></div>${state.combatants.length ? `<div class="combatant-list">${visible.map(({combatant,index}) => renderCombatant(combatant,index)).join("") || `<div class="empty-search">Keine passenden Teilnehmer.</div>`}</div>` : renderEmpty()}</main></div>
    <footer class="app-footer"><span>Version 0.3.0 · Daten werden automatisch gespeichert.</span><span>${state.updatedAt ? `Zuletzt geändert ${new Date(state.updatedAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}` : ""}</span></footer>
  </div>${renderModal()}${notice ? `<div class="toast">${esc(notice)}</div>` : ""}`;
  bindEvents();
};

const openHeroes = async (): Promise<void> => {
  modal = { kind:"heroLibrary", heroes:[], loading:true }; render();
  const heroes = await bridge.getSheetHeroes().catch(() => []);
  if (modal?.kind === "heroLibrary") { modal = { kind:"heroLibrary", heroes, loading:false }; render(); }
};

const submitPreset = (form: HTMLFormElement): void => {
  const data = new FormData(form);
  const preset = BESTIARY_PRESETS.find((entry) => entry.id === data.get("presetId")); if (!preset) return;
  const legacyReviewed = data.get("legacyReviewed") === "on";
  if (preset.requiresReview && !legacyReviewed) { notify("Bitte bestätige zuerst die Prüfung der DSA-4.1-Werte."); return; }
  const count = Math.max(1, Math.min(30, num(data.get("count"),1)));
  const variant = String(data.get("variant")) as "weak"|"normal"|"elite";
  const baseName = String(data.get("name") || preset.name).trim() || preset.name;
  const attackCount = Math.max(1,num(data.get("presetAttackCount"),preset.attacks.length));
  const attacks = Array.from({length:attackCount},(_,index) => {
    const name = String(data.get(`presetAttackName${index}`) || "").trim();
    if (!name) return null;
    const parry = Math.max(0,num(data.get(`presetAttackParry${index}`),0));
    return { name, type:String(data.get(`presetAttackType${index}`)) === "FK" ? "FK" as const : "AT" as const, value:Math.max(0,num(data.get(`presetAttackValue${index}`),0)), damage:String(data.get(`presetAttackDamage${index}`) || "—"), ...(parry ? {parry} : {}) };
  }).filter((attack): attack is NonNullable<typeof attack> => attack !== null);
  const adjustedPreset = { ...preset, attacks };
  const additions = Array.from({length:count},(_,index) => {
    const enemy = createFromPreset(adjustedPreset, variant, count > 1 ? `${baseName} ${index+1}` : baseName, legacyReviewed);
    const lpOverride = Math.max(1,num(data.get("lp"),preset.lp));
    const variantFactor = variant === "weak" ? .8 : variant === "elite" ? 1.25 : 1;
    const finalLp = Math.max(1,Math.round(lpOverride*variantFactor));
    return { ...enemy, lp:{current:finalLp,max:finalLp}, initiativeBase:num(data.get("initiative"),enemy.initiativeBase)+(variant === "weak" ? -1 : variant === "elite" ? 2 : 0), defense:num(data.get("defense"),enemy.defense)+(variant === "weak" ? -1 : variant === "elite" ? 2 : 0), rs:Math.max(0,num(data.get("rs"),enemy.rs)+(variant === "elite" ? 1 : 0)), sk:num(data.get("sk"),enemy.sk), zk:num(data.get("zk"),enemy.zk), gs:num(data.get("gs"),enemy.gs), actions:Math.max(1,num(data.get("actions"),enemy.actions)) };
  }).map((enemy) => ({...enemy,initiativeTotal:enemy.initiativeBase}));
  modal = null; commit({ ...state, combatants:[...state.combatants,...additions] }, `${count}× ${baseName} hinzugefügt.`);
};

const submitManual = (form: HTMLFormElement): void => {
  const data = new FormData(form); const editId = String(data.get("editId") || "");
  const existing = state.combatants.find((entry) => entry.id === editId);
  const max = Math.max(1,num(data.get("lpMax"),30)); const current = Math.max(0,Math.min(max,num(data.get("lpCurrent"),max)));
  const ae = Math.max(0,num(data.get("ae"),0)); const kp = Math.max(0,num(data.get("kp"),0)); const fate = Math.max(0,num(data.get("fate"),0));
  const attacks = [0,1,2].flatMap((index) => {
    const name = String(data.get(`attackName${index}`) || "").trim();
    if (!name) return [];
    const parry = Math.max(0,num(data.get(`parry${index}`),0));
    return [{ id:existing?.attacks[index]?.id || uid("attack"), name, type:String(data.get(`attackType${index}`)) === "FK" ? "FK" as const : "AT" as const, value:Math.max(0,num(data.get(`attackValue${index}`),10)), damage:String(data.get(`damage${index}`) || "—"), ...(parry ? {parry} : {}) }];
  });
  const keepResource = (maximum: number, old?: {current:number;max:number}) => maximum ? { current:old ? Math.min(old.current,maximum) : maximum, max:maximum } : undefined;
  const combatant: Combatant = {
    id:existing?.id || uid("manual"), name:String(data.get("name") || "Unbenannt").trim(), kind:String(data.get("kind")) === "hero" ? "hero" : "enemy", source:existing?.source || "manual",
    ...(existing?.presetId ? {presetId:existing.presetId} : {}), ...(existing?.tokenId ? {tokenId:existing.tokenId,tokenName:existing.tokenName} : {}),
    initiativeBase:num(data.get("initiative"),12), initiativeTotal:num(data.get("initiative"),12), lp:{current,max}, ...(keepResource(ae,existing?.ae) ? {ae:keepResource(ae,existing?.ae)} : {}), ...(keepResource(kp,existing?.kp) ? {kp:keepResource(kp,existing?.kp)} : {}), ...(keepResource(fate,existing?.fate) ? {fate:keepResource(fate,existing?.fate)} : {}),
    defense:Math.max(0,num(data.get("defense"),6)), rs:Math.max(0,num(data.get("rs"),0)), sk:num(data.get("sk")), zk:num(data.get("zk")), gs:Math.max(0,num(data.get("gs"),8)), actions:Math.max(1,num(data.get("actions"),1)),
    attacks,
    conditions:existing?.conditions || emptyConditions(),notes:String(data.get("notes") || ""),defeated:current <= 0,
  };
  const combatants = existing ? state.combatants.map((entry) => entry.id === existing.id ? combatant : entry) : [...state.combatants,combatant];
  modal=null; commit({...state,combatants},existing ? `${combatant.name} bearbeitet.` : `${combatant.name} hinzugefügt.`);
};

const bindEvents = (): void => {
  document.querySelectorAll<HTMLElement>("[data-open-enemy]").forEach((element) => element.onclick = () => { modal={kind:"enemyLibrary",query:"",category:"",edition:"all",limit:120};render(); });
  document.querySelectorAll<HTMLElement>("[data-open-humans]").forEach((element) => element.onclick = () => { modal={kind:"humanLibrary"};render(); });
  document.querySelectorAll<HTMLElement>("[data-open-hero]").forEach((element) => element.onclick = () => void openHeroes());
  document.querySelectorAll<HTMLElement>("[data-open-manual]").forEach((element) => element.onclick = () => { modal={kind:"manual",combatantKind:element.dataset.openManual === "hero" ? "hero" : "enemy"};render(); });
  document.querySelectorAll<HTMLElement>("[data-close]").forEach((element) => element.onclick = () => {modal=null;render();});
  document.querySelector<HTMLElement>("[data-backdrop]")?.addEventListener("click",(event) => { if (event.target === event.currentTarget) {modal=null;render();} });
  document.querySelectorAll<HTMLElement>("[data-preset]").forEach((element) => element.onclick=()=>{modal={kind:"preset",presetId:element.dataset.preset || ""};render();});
  document.querySelectorAll<HTMLElement>("[data-quick-human]").forEach((element) => element.onclick=()=>{const [presetId,variantValue]=String(element.dataset.quickHuman || "").split("|");const preset=HUMAN_OPPONENT_PRESETS.find((entry)=>entry.id===presetId);if(!preset)return;const variant=variantValue === "weak" ? "weak" : variantValue === "elite" ? "elite" : "normal";const label=variant === "weak" ? "Einfach" : variant === "elite" ? "Elite" : "Erfahren";const copies=state.combatants.filter((entry)=>entry.presetId===preset.id).length;const name=`${preset.name}${copies ? ` ${copies+1}` : ""} · ${label}`;const addition=createFromPreset(preset,variant,name);commit({...state,combatants:[...state.combatants,addition]},`${name} hinzugefügt.`);notify(`${name} ist kampfbereit.`);});
  document.querySelector<HTMLElement>("[data-back-enemy]")?.addEventListener("click",()=>{modal={kind:"enemyLibrary",query:"",category:"",edition:"all",limit:120};render();});
  document.querySelector<HTMLInputElement>("#preset-search")?.addEventListener("input",(event)=>{if(modal?.kind==="enemyLibrary"){modal.query=(event.target as HTMLInputElement).value;modal.limit=120;const cursor=(event.target as HTMLInputElement).selectionStart;render();const input=document.querySelector<HTMLInputElement>("#preset-search");input?.focus();if(cursor!==null)input?.setSelectionRange(cursor,cursor);}});
  document.querySelector<HTMLSelectElement>("#preset-category")?.addEventListener("change",(event)=>{if(modal?.kind==="enemyLibrary"){modal.category=(event.target as HTMLSelectElement).value;render();}});
  document.querySelectorAll<HTMLElement>("[data-preset-edition]").forEach((element)=>element.onclick=()=>{if(modal?.kind==="enemyLibrary"){modal.edition=(element.dataset.presetEdition || "all") as Extract<ModalState,{kind:"enemyLibrary"}>["edition"];modal.category="";modal.limit=120;render();}});
  document.querySelector<HTMLElement>("[data-more-presets]")?.addEventListener("click",()=>{if(modal?.kind==="enemyLibrary"){modal.limit+=120;render();}});
  document.querySelector<HTMLFormElement>("#preset-form")?.addEventListener("submit",(event)=>{event.preventDefault();submitPreset(event.currentTarget as HTMLFormElement);});
  document.querySelector<HTMLFormElement>("#manual-form")?.addEventListener("submit",(event)=>{event.preventDefault();submitManual(event.currentTarget as HTMLFormElement);});
  document.querySelector<HTMLElement>("[data-refresh-heroes]")?.addEventListener("click",()=>void openHeroes());
  document.querySelectorAll<HTMLElement>("[data-import-hero]").forEach((element)=>element.onclick=()=>{if(modal?.kind!=="heroLibrary")return;const hero=modal.heroes.find((entry)=>entry.heroId===element.dataset.importHero);if(!hero)return;if(state.combatants.some((entry)=>entry.tokenId===hero.tokenId)){notify(`${hero.name} ist bereits im Kampf.`);return;}modal=null;commit({...state,combatants:[...state.combatants,createFromSheet(hero)]},`${hero.name} aus dem Heldenbogen übernommen.`);});
  document.querySelectorAll<HTMLElement>("[data-filter]").forEach((element)=>element.onclick=()=>{filter=(element.dataset.filter || "all") as typeof filter;render();});
  document.querySelector<HTMLInputElement>("#roster-search")?.addEventListener("input",(event)=>{search=(event.target as HTMLInputElement).value;render();document.querySelector<HTMLInputElement>("#roster-search")?.focus();});
  document.querySelector<HTMLInputElement>("#encounter-name")?.addEventListener("change",(event)=>commit({...state,name:(event.target as HTMLInputElement).value.trim() || "Neuer Kampf"}));
  document.querySelector<HTMLElement>("[data-roll-enemies]")?.addEventListener("click",()=>{const currentId=activeCombatant()?.id;const combatants=sortCombatants(state.combatants.map((entry)=>entry.kind === "enemy" ? rollInitiative(entry) : entry));const turnIndex=Math.max(0,currentId ? combatants.findIndex((entry)=>entry.id===currentId) : 0);commit({...state,combatants,turnIndex,started:true},"Initiative der Gegner ausgewürfelt; Heldenwerte wurden beibehalten.");});
  document.querySelector<HTMLElement>("[data-sort]")?.addEventListener("click",()=>{const currentId=activeCombatant()?.id;const combatants=sortCombatants(state.combatants);const turnIndex=Math.max(0,currentId ? combatants.findIndex((entry)=>entry.id===currentId) : 0);commit({...state,combatants,turnIndex});});
  document.querySelectorAll<HTMLInputElement>("[data-initiative-total]").forEach((input)=>{input.addEventListener("keydown",(event)=>{if(event.key==="Enter")input.blur();});input.addEventListener("change",()=>{const id=input.dataset.initiativeTotal || "";const value=Number(input.value);const target=state.combatants.find((entry)=>entry.id===id);if(!target||target.kind!=="hero"||!Number.isFinite(value)){input.value=String(target?.initiativeTotal ?? 0);return;}const adjusted=setInitiativeTotal(target,value);input.value=String(adjusted.initiativeTotal);input.classList.add("saved");commitWithoutRender({...state,combatants:state.combatants.map((entry)=>entry.id===id?adjusted:entry)},`Gewürfelte Initiative von ${target.name} auf ${adjusted.initiativeTotal} gesetzt.`);window.setTimeout(()=>input.classList.remove("saved"),900);});});
  document.querySelector<HTMLElement>("[data-next-turn]")?.addEventListener("click",()=>{const oldRound=state.round;const next=advanceTurn(state);commit(next,next.round!==oldRound ? `Runde ${next.round} beginnt.` : `${next.combatants[next.turnIndex]?.name || "Nächster Teilnehmer"} ist am Zug.`);});
  document.querySelector<HTMLElement>("[data-prev-turn]")?.addEventListener("click",()=>commit(previousTurn(state)));
  document.querySelectorAll<HTMLElement>("[data-damage]").forEach((element)=>element.onclick=()=>{const id=element.dataset.damage || "";const amount=Math.max(0,Number(document.querySelector<HTMLInputElement>(`[data-life-input="${id}"]`)?.value)||0);const target=state.combatants.find((entry)=>entry.id===id);if(!target)return;commit({...state,combatants:state.combatants.map((entry)=>entry.id===id?applyLifeChange(entry,-amount):entry)},`${target.name} erleidet ${amount} Schaden.`);});
  document.querySelectorAll<HTMLElement>("[data-heal]").forEach((element)=>element.onclick=()=>{const id=element.dataset.heal || "";const amount=Math.max(0,Number(document.querySelector<HTMLInputElement>(`[data-life-input="${id}"]`)?.value)||0);const target=state.combatants.find((entry)=>entry.id===id);if(!target)return;commit({...state,combatants:state.combatants.map((entry)=>entry.id===id?applyLifeChange(entry,amount):entry)},`${target.name} erhält ${amount} LeP.`);});
  document.querySelectorAll<HTMLElement>("[data-condition]").forEach((element)=>element.onclick=()=>{const [id,key,delta]=String(element.dataset.condition).split("|");if(!id||!key)return;commit({...state,combatants:state.combatants.map((entry)=>entry.id===id?changeCondition(entry,key as keyof Combatant["conditions"],Number(delta)):entry)});});
  document.querySelectorAll<HTMLElement>("[data-edit]").forEach((element)=>element.onclick=()=>{const target=state.combatants.find((entry)=>entry.id===element.dataset.edit);if(target){modal={kind:"manual",combatantKind:target.kind,editId:target.id};render();}});
  document.querySelectorAll<HTMLElement>("[data-remove]").forEach((element)=>element.onclick=()=>{const target=state.combatants.find((entry)=>entry.id===element.dataset.remove);if(!target||!confirm(`„${target.name}“ aus dem Kampf entfernen?`))return;const combatants=state.combatants.filter((entry)=>entry.id!==target.id);commit({...state,combatants,turnIndex:Math.min(state.turnIndex,Math.max(0,combatants.length-1))},`${target.name} aus dem Kampf entfernt.`);});
  document.querySelectorAll<HTMLElement>("[data-link]").forEach((element)=>element.onclick=async()=>{const target=state.combatants.find((entry)=>entry.id===element.dataset.link);if(!target)return;try{const token=await bridge.linkSelectedToken(target);commit({...state,combatants:state.combatants.map((entry)=>entry.id===target.id?{...entry,tokenId:token.id,tokenName:token.name}:entry)},`${target.name} mit Token ${token.name} verbunden.`);}catch(error){notify(error instanceof Error?error.message:"Token konnte nicht verbunden werden.");}});
  document.querySelector<HTMLElement>("[data-show-log]")?.addEventListener("click",()=>{modal={kind:"log"};render();});
  document.querySelector<HTMLElement>("[data-clear-log]")?.addEventListener("click",()=>{commit({...state,log:[]});modal=null;render();});
  document.querySelector<HTMLElement>("[data-export]")?.addEventListener("click",()=>downloadEncounter(state));
  document.querySelector<HTMLElement>("[data-import]")?.addEventListener("click",()=>document.querySelector<HTMLInputElement>("#import-file")?.click());
  document.querySelector<HTMLInputElement>("#import-file")?.addEventListener("change",async(event)=>{const file=(event.target as HTMLInputElement).files?.[0];if(!file)return;try{const imported=parseEncounter(JSON.parse(await file.text()));if(!imported)throw new Error();commit(imported,"Kampfstand importiert.");}catch{notify("Die Datei ist kein gültiger Kampfmanager-Export.");}});
  document.querySelector<HTMLElement>("[data-new-encounter]")?.addEventListener("click",()=>{if(!confirm("Den aktuellen Kampf wirklich beenden und einen leeren Kampf anlegen? Exportiere ihn vorher, falls du ihn behalten möchtest."))return;commit(newEncounter());});
};

render();
void bridge.initialize().then(async(available)=>{
  if(available){
    bridge.onEncounterChange((incoming)=>{if(incoming.updatedAt!==state.updatedAt){state=incoming;saveLocalEncounter(state);render();}});
    const sceneState=await bridge.loadEncounter();
    if(sceneState) state=sceneState;
  }
  render();
}).catch(()=>render());
