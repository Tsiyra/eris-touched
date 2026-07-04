# Eris-Touched Guild Questboard — Split File Version

This zip splits the original single `public/app-web.html` into:

- `public/app-web.html` — HTML structure only
- `public/styles.css` — app styling
- `public/app.js` — app behavior
- `server.js` — updated to serve `/styles.css`, `/app.js`, and `/assets/...`

## Install

Copy these files into your project folder:

```text
server.js
public/app-web.html
public/styles.css
public/app.js
public/assets/.gitkeep
data/.gitkeep
```

Then restart the server:

```powershell
npm start
```

App version marker remains `1.0001`.
