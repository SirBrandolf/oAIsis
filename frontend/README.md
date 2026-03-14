## Frontend (Audio‑First Web UI)

The frontend is a small, audio‑first web app that consumes the backend API and presents lessons as scenes and cards. It is designed to be very simple to run and easy to modify visually.

---

### Project layout

- `index.html` – Basic HTML shell and main layout.
- `styles.css` – Visual styling (audio‑first, mobile‑friendly cards).
- `app.js` – All client‑side behavior and API calls.

Key elements in `index.html`:

- Scene list (`#scene-list`) – shows large buttons for each scene.
- Card view (`#card-view`) – shows one card at a time with:
  - Large emoji.
  - Image placeholder (for future scene‑specific images).
  - **Prominent audio controls**:
    - "🔊 Listen" button – plays the card's audio.
    - "🎤 Try" button – sends a recognition request to the backend.
  - Phrase text – reinforces, but does not replace, the audio.

---

### How the frontend talks to the backend

The JavaScript file `app.js` is intentionally thin and service‑like:

- `const API_BASE = "http://localhost:4000/api";`
  - All API requests go through this base URL.

- **Data fetch functions**
  - `fetchScenes()` – calls `GET /api/scenes` to get the list of scenes.
  - `fetchCards(sceneId)` – calls `GET /api/scenes/:sceneId/cards` to get cards for a scene, including `audioUrl` for each card.
  - `recognizePhrase(expectedPhrase, targetLanguage)` – calls `POST /api/recognize` to evaluate the learner's attempt.

- **Rendering**
  - `renderScenes(data)` – builds the scene buttons from the backend response.
  - `openScene(sceneId, title)` – loads the cards for a scene and switches to card view.
  - `renderCurrentCard(feedback)` – renders a single card with emoji, image placeholder, audio buttons, phrase text, and feedback.

- **Audio behavior**
  - When the user clicks "🔊 Listen", the app:
    - Creates an `Audio` element using the `audioUrl` provided by the backend.
    - Plays it immediately.
  - When the user clicks "🎤 Try", the app:
    - Currently calls `recognizePhrase` with only the expected phrase and language.
    - The backend returns a stubbed recognition and evaluation result.
    - The UI displays "Correct!" or "Try again." based on that evaluation.

When you later wire in real TTS/ASR (Claude, etc.) on the backend, the only change on the frontend should be how you send audio to `/api/recognize` (e.g., attaching recorded audio instead of just the text prompt).

---

### Running the frontend on macOS

The frontend is now served directly by the backend Express app; you do **not** need a separate static site server.

Prerequisites:

- Node.js 18+ (install via `brew install node` or from nodejs.org).

Steps (from the repo root, e.g., `~/Downloads/oaisis`):

```bash
cd backend
npm install
npm start
```

This will:

- Start the API on `http://localhost:4000/api`.
- Serve the React frontend from `frontend/` at `http://localhost:4000/`.

Then open a browser and visit:

- `http://localhost:4000/`

From there you can:

- Click on a scene.
- Use the big audio buttons on each card to:
  - **Listen** to the phrase audio (from the backend).
  - **Try** speaking (currently simulated by the backend stub).

---

### Where TTS / ASR models matter for the frontend

The frontend does **not** talk directly to Claude or any other model. Instead:

- It relies on the backend to:
  - Provide ready‑to‑play `audioUrl` values for each card.
  - Accept a recognition request (`/api/recognize`) and return evaluation feedback.

This separation means:

- All Claude / TTS / ASR configuration and API keys live in the backend (see `backend/README.md`), specifically in the service layer (`audioService.js`).
- The frontend stays focused on:
  - Presenting a clear, audio‑first learning experience.
  - Calling the backend through simple, stable endpoints.

If you later add real microphone recording on the frontend, the only required code changes will be:

- Capturing audio in `app.js`.
- Sending it with the `recognizePhrase` request to the backend.

The backend will remain the integration point for any external model providers.

