# Upload auf GitHub mit dem Mac-Terminal

Lege auf GitHub zuerst ein **leeres** Repository mit diesem Namen an:

`DSA-Aventurische-Werkzeuge`

Entpacke anschließend die ZIP-Datei im Downloads-Ordner. Öffne die App **Terminal** und führe diese Befehle nacheinander aus:

```bash
cd ~/Downloads/DSA-Aventurische-Werkzeuge
git init
git add .
git commit -m "Aventurische Werkzeuge zusammenführen"
git branch -M main
git remote add origin https://github.com/1Sabuto1-bip/DSA-Aventurische-Werkzeuge.git
git push -u origin main
```

Falls GitHub nach einem Passwort fragt, wird statt des normalen Passworts ein persönlicher Zugriffstoken benötigt. Alternativ kann der letzte Befehl nach Anmeldung mit GitHub Desktop ausgeführt werden.

Danach in GitHub:

1. `Settings` öffnen.
2. Links `Pages` auswählen.
3. Bei `Source` beziehungsweise `Build and deployment` → `Deploy from a branch` einstellen.
4. `main` und `/docs` auswählen.
5. `Save` drücken.

Die Veröffentlichung benötigt gewöhnlich einige Minuten.
