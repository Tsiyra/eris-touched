# Eris-Touched Patch 1.0005

This patch fixes the Questboard interaction issue from 1.0004.

## Changes

- Updates app version to 1.0005.
- Keeps the 1.0004 Questboard layout.
- Makes the Guild Request modal buttons more reliable.
- Adds a status line inside the Guild Request modal.
- Makes Pin Request and Embark handlers safer.
- Makes pinned request Embark buttons explicitly clickable buttons.
- Adds stronger CSS click/touch handling for Guild Request, Pin Request, and Embark.
- Improves API error handling so failed requests show the real server message when possible.

## Apply

Run from your app project root:

```powershell
node .\eris-touched-patch-1.0005\apply-patch-1.0005.js
```

Then restart:

```powershell
npm start
```

Backups are saved to:

```text
patch-backups/1.0005/
```
