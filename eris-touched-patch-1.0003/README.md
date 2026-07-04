# Eris-Touched Patch 1.0003

This patch redesigns the **Questboard** page to better match the fantasy guild board reference.

## What changed

- Updates app version to `1.0003`.
- Adds a large top-center image area on the Questboard using the current hero portrait.
- Moves the pinned/current request details into a parchment card below the image.
- Adds estimated time buttons: 25, 30, 45, and 60 minutes.
- Uses the selected estimate when accepting a request.
- Adds a Guild Charter parchment card with progress-to-goal bar.
- Restyles Questboard cards, buttons, reward chips, and bottom nav toward the attached guild board look.
- Keeps Ollama/manual image workflow from patch 1.0002.

## Files updated

- `server.js`
- `public/app-web.html`
- `public/app.js`
- `public/styles.css`

## How to apply

From your project root, run:

```powershell
node .\eris-touched-patch-1.0003\apply-patch-1.0003.js
```

Or, if the patch folder is somewhere else:

```powershell
node "C:\path\to\eris-touched-patch-1.0003\apply-patch-1.0003.js"
```

The patch creates backups at:

```text
patch-backups/1.0003/
```

Restart your Node server after applying the patch.
