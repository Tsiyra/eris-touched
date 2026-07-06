# Eris-Touched Module Refactor 1.0006

This package does **not** edit GitHub. It is a local patch package you run from your project root.

It performs a safe behavior-preserving module refactor:

- Keeps `public/app.js` as the entry point.
- Moves the current `public/app.js` runtime into `public/js/app-runtime.js`.
- Creates `public/js/` module files for the next cleanup phase:
  - `api.js`
  - `state.js`
  - `storage.js`
  - `timer.js`
  - `questboard.js`
  - `hero.js`
  - `journey.js`
  - `collection.js`
  - `chronicle.js`
  - `modals.js`
  - `render.js`
  - `bootstrap.js`
  - `version.js`
- Updates `public/app-web.html` version marker to `1.0006` if present.
- Does not change `server.js`.
- Does not redesign the UI.

This is intentionally a low-risk split. The app should behave the same because the existing runtime code remains intact in `app-runtime.js`. The new modules are ready for the next patch, where logic can be moved out section-by-section with safer testing.

## Apply

From your project root:

```powershell
node .\eris-touched-module-refactor-1.0006\apply-module-refactor-1.0006.js
```

Then run:

```powershell
npm start
```

## Backup

Backups are saved to:

```text
patch-backups/module-refactor-1.0006/
```
