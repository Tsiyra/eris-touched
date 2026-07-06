# Eris-Touched Deep Extraction Patch 1.0007

This patch is intended to be run after the module-refactor 1.0006 patch.

It does not edit GitHub directly. It reads your local files and applies a deeper behavior-preserving module extraction.

## Apply

From your project root:

```powershell
node .\eris-touched-deep-extraction-1.0007\apply-deep-extraction-1.0007.js
```

Then restart:

```powershell
npm start
```

## What it changes

- Keeps `public/app.js` as the entry point.
- Adds `public/js/main.js` as the module bootstrap entry.
- Keeps `public/js/app-runtime.js` as the coordinator/runtime file.
- Extracts shared behavior into modules:
  - `api.js`
  - `timer.js`
  - `navigation.js`
  - `modals.js`
  - `portrait-files.js`
  - `questboard.js`
  - `storage.js`
  - `render.js`
  - `state.js`
  - `hero.js`
  - `journey.js`
  - `collection.js`
  - `chronicle.js`
  - `bootstrap.js`
  - `version.js`

## Safety

Backups are written to:

```text
patch-backups/deep-extraction-1.0007/
```

## Validation

After applying, run:

```powershell
node --check public\app.js
node --check public\js\app-runtime.js
node --check public\js\main.js
```

Then test the app in browser:

- Questboard loads.
- Guild Request modal opens.
- Pin Request works.
- Embark starts the timer.
- Pause, Resume, Turn In Request still work.
- Hero, Journey, Collection, and Chronicle still render.
