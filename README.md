# Aventurische Werkzeuge

Gemeinsames Repository für vier DSA-5-Webwerkzeuge von Alexander Hoffmann.

## Enthaltene Werkzeuge

| Werkzeug | Browseradresse | Owlbear-Manifest |
| --- | --- | --- |
| Aventurischer Heldenbogen | `/heldenbogen/` | `/heldenbogen/manifest.json` |
| Meister-Kampfmanager | `/kampfmanager/` | `/kampfmanager/manifest.json` |
| NSC-Generator | `/nsc-generator/` | `/nsc-generator/manifest.json` |
| Händlergenerator | `/haendlergenerator/` | `/haendlergenerator/manifest.json` |

Die gemeinsame Startseite liegt im Ordner `docs`. Die bearbeitbaren Projektdateien liegen getrennt unter `packages`.

## Veröffentlichung mit GitHub Pages

Dieses Paket setzt den Repository-Namen `DSA-Aventurische-Werkzeuge` voraus.

1. Auf GitHub ein leeres Repository mit dem Namen `DSA-Aventurische-Werkzeuge` anlegen.
2. Den gesamten Inhalt dieses Ordners in das Repository übertragen.
3. In GitHub `Settings` → `Pages` öffnen.
4. Unter `Build and deployment` die Option `Deploy from a branch` wählen.
5. Branch `main` und Ordner `/docs` auswählen und speichern.

Die Übersichtsseite ist anschließend erreichbar unter:

`https://1sabuto1-bip.github.io/DSA-Aventurische-Werkzeuge/`

## Direkte Adressen

- Heldenbogen: `https://1sabuto1-bip.github.io/DSA-Aventurische-Werkzeuge/heldenbogen/`
- Kampfmanager: `https://1sabuto1-bip.github.io/DSA-Aventurische-Werkzeuge/kampfmanager/`
- NSC-Generator: `https://1sabuto1-bip.github.io/DSA-Aventurische-Werkzeuge/nsc-generator/`
- Händlergenerator: `https://1sabuto1-bip.github.io/DSA-Aventurische-Werkzeuge/haendlergenerator/`

## Projektstruktur

```text
docs/                         fertige GitHub-Pages-Webseite
  heldenbogen/                ausführbare Version 0.25.0
  kampfmanager/               ausführbare Version 0.3.0
  nsc-generator/              ausführbare Version 0.5.0
  haendlergenerator/          ausführbare Version 1.0.0
packages/                     bearbeitbare Projektdateien
  heldenbogen/
  kampfmanager/
  nsc-generator/
  haendlergenerator/
```

## Hinweise

- Die bisherigen einzelnen Repositories müssen nicht sofort gelöscht werden. Sie können als Sicherung bestehen bleiben.
- Die Links in den Owlbear-Manifesten verweisen bereits auf dieses gemeinsame Repository.
- Browserdaten der bisherigen Einzeladressen werden wegen der neuen Internetadressen nicht automatisch übernommen. Vorhandene Helden sollten vorher als JSON exportiert und anschließend wieder importiert werden.
- Dies ist ein inoffizielles Fanprojekt für *Das Schwarze Auge* und steht in keiner Verbindung zu Ulisses Spiele.
