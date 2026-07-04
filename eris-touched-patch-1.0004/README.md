# Eris-Touched Patch 1.0004

This patch changes the Questboard flow.

## Changes

- Updates app version to `1.0004`.
- Moves the Guild Charter from the Questboard page to the Journey page.
- Changes the Questboard top portrait from a wide/square image feature into a circular portrait frame like the Hero page.
- Adds a large `Guild Request` button above the pinned requests.
- Adds a Guild Request popup for task setup.
- The popup lets you choose:
  - `Pin Request` — saves the request to the pinned request list.
  - `Embark` — starts the timer immediately.
- Adds a pinned request list.
- Each pinned request has its own `Embark` button.
- Keeps Pause / Resume / Turn In Request on the active request card.

## Apply

From your project root, run:

```powershell
node .\eris-touched-patch-1.0004\apply-patch-1.0004.js
```

Then restart the Node server:

```powershell
npm start
```

## Backups

The patch creates backups in:

```text
patch-backups/1.0004/
```
