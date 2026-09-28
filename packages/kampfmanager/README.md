# DSA5 Meister-Kampfmanager 0.3.0

Eigenständige Web-App und Owlbear-Rodeo-Erweiterung zur Verwaltung von DSA5-Kämpfen.

## Funktionen

- Helden aus dem Aventurischen Heldenbogen der aktuellen Owlbear-Szene übernehmen
- Helden und Gegner vollständig manuell anlegen und bearbeiten
- 154 direkt einsetzbare DSA-5-Presets aus dem Regelwiki, den beiden Aventurischen Bestiarien und den Menschen-Schnellgegnern
- 289 zusätzliche Zoo-Botanica-Einträge aus DSA 4.1 als klar gekennzeichnete Altdaten
- zwölf Menschen-Archetypen mit Basisausrüstung und den Ein-Klick-Stufen Einfach, Erfahren und Elite
- Suche nach Name, Kategorie, Gruppe, Lebensraum, Auftreten, Beute und Quelle
- Editions- und Kategorienfilter
- deutlich sichtbare Editionsschaltflächen und schrittweises Nachladen aller Treffer
- Lebensraum-, Auftreten- und Beutedaten aus der Zoo-Botanica bei 70 verknüpften DSA-5-Kreaturen
- DSA-4.1-Werte können nur nach ausdrücklicher Prüfung und Bestätigung übernommen werden
- schwache, normale und Elitevarianten sowie beliebig viele Kopien eines Presets
- Kampfrunden, Zugreihenfolge und W6-Initiative der Gegner
- direkt editierbarer, von den Spielern gewürfelter INI-Gesamtwert für Helden
- Schnellschaden, Heilung, LeP-Anzeige und sechs DSA5-Zustände
- Angriffe, Verteidigung, RS, SK, ZK, GS und Aktionen auf einen Blick
- Kampfprotokoll, JSON-Import und -Export
- automatische lokale Speicherung
- gemeinsame Speicherung im aktuellen Owlbear-Szenenstand für den GM
- responsive Darstellung für Safari, Tablet und Desktop

Die Datenbank enthält nur kompakte spielrelevante Werte und Quellenmetadaten. Längere Regel- und Beschreibungstexte werden nicht kopiert. DSA 5 bleibt die maßgebliche Regelebene; Zoo-Botanica-Werte sind als Altdaten gekennzeichnet und werden nie unbemerkt als fertige DSA-5-Werte behandelt.

## GitHub Pages veröffentlichen

1. Ein neues öffentliches Repository `DSA-Meister-Kampfmanager` anlegen.
2. Den gesamten Inhalt dieses Ordners in das Repository hochladen.
3. Unter **Settings → Pages** als Quelle `Deploy from a branch`, Branch `main` und Ordner `/docs` wählen.
4. Nach der Veröffentlichung diese Owlbear-Installationsadresse verwenden:

   `https://1sabuto1-bip.github.io/DSA-Meister-Kampfmanager/manifest.json`

Soll das Repository anders heißen, müssen die drei URLs in `public/manifest.json` vor dem Build angepasst werden.

## Entwicklung

```bash
npm install
npm run dev
```

Prüfung und Build:

```bash
npm test
npm run build
```

Die generierte Bestiarium-Datei kann aus den kompakten Quelldaten neu erstellt werden:

```bash
npm run generate:bestiary
```

Nach dem Build den Inhalt von `dist` nach `docs` kopieren, damit GitHub Pages die fertige App ausliefert.
