# Eris-Touched Patch 1.0002

This patch updates the split-file Eris-Touched app.

## What changes

- Bumps app patch version from `1.0001` to `1.0002`.
- Sets text/story generation default to Ollama:
  - `STORY_GENERATION_SERVICE=ollama`
  - `OLLAMA_URL=http://127.0.0.1:11434`
  - `OLLAMA_MODEL=llama3`
- Changes image generation to manual prompt-copy mode.
- Disables OpenAI and Stable Diffusion image generation for now.
- Adds a Gemini AI Studio placeholder path for future image generation integration.
- Changes the portrait modal button from `Generate New Image` to `Copy Image Prompt`.

## How to apply

1. Unzip this patch anywhere.
2. Open a terminal in your project root folder, the folder that contains `server.js` and `public/`.
3. Run:

```powershell
node "C:\path\to\eris-touched-patch-1.0002\apply-patch-1.0002.js"
```

Or copy this whole patch folder into your project root and run:

```powershell
node .\eris-touched-patch-1.0002\apply-patch-1.0002.js
```

The patch makes backups in:

```text
patch-backups/1.0002/
```

Restart your Node server after applying the patch.
