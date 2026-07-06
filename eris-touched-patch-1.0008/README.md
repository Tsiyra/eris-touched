# Eris-Touched Patch 1.0008

This patch fixes the post-extraction issue where buttons stopped navigating/responding correctly and saved data did not appear to load.

## Root cause

After the deep extraction, `public/app.js` imports modules from `public/js/`, but `server.js` was only serving these public files:

- `/styles.css`
- `/app.js`
- `/questboard-result-state.js`
- `/assets/...`

That meant browser requests for `/js/main.js`, `/js/app-runtime.js`, and the other extracted modules returned `404`, so the app runtime did not fully load.

## What this patch changes

- Allows the local server to serve `/js/*.js` module files.
- Updates version markers to `1.0008`.
- Keeps all UI and app behavior unchanged.
- Does not edit GitHub directly.

## Apply

From your project root:

```powershell
node .\eris-touched-patch-1.0008\apply-patch-1.0008.js
```

Then restart:

```powershell
npm start
```

## Backups

Backups are saved to:

```text
patch-backups/1.0008/
```
