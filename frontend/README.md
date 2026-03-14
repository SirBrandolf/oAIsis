## Frontend (React + Vite)

The frontend is a small React app (managed by Vite) that consumes the backend API and presents lessons as scenes and cards.

---

### Project layout

- `package.json` – frontend dependencies and scripts.
- `vite.config.mjs` – Vite config (including `/api` proxy to the backend).
- `index.html` – Vite entry HTML.
- `src/`
  - `main.jsx` – React entry point, renders `App` into `#root`.
  - `App.jsx` – top‑level layout (header + routing between scenes and cards).
  - `SceneList.jsx` – list of scene buttons (large emoji + title).
  - `CardView.jsx` – audio‑first card view for a single scene.
  - `api.js` – thin API client (`fetchScenes`, `fetchCards`, `recognizePhrase`).
  - `sceneIcons.js` – mapping from scene ids to emojis (home/greetings, market, clinic, etc.).
  - `styles.css` – visual styling (accessible, mobile‑friendly, audio‑first).

---

### How the frontend talks to the backend

- `vite.config.mjs` configures a dev proxy:

  - Requests to `/api` are forwarded to `http://localhost:4000`.

- `src/api.js` always calls relative `/api/...` URLs:
  - `fetchScenes()` → `GET /api/scenes`.
  - `fetchCards(sceneId)` → `GET /api/scenes/:sceneId/cards`.
  - `recognizePhrase(expectedPhrase, targetLanguage)` → `POST /api/recognize`.

The React components (`App`, `SceneList`, `CardView`) use these API helpers and stay unaware of backend implementation details.

---

### Running the frontend during development

Prerequisites:

- Node.js 18+ (install via `brew install node` or from nodejs.org).

Steps (from the repo root, e.g., `~/Downloads/oaisis`):

1. Start the backend API (in another terminal):

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Start the frontend dev server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open the URL that Vite prints (usually `http://localhost:5173/`).

The dev server will hot‑reload React components on save, and all `/api/...` calls will be proxied to the backend.

---

### Building for production

To create a static build that the backend can serve:

```bash
cd frontend
npm run build
```

This writes the compiled assets to `frontend/dist/`. The Express backend is already configured to serve this folder if it exists, so in production you can:

- Start the backend (`cd backend && npm start`).
- Serve the built frontend at the same origin (e.g., `http://localhost:4000/`), with the API still under `/api`.
