## oAIsis – Audio‑First English Learning

### What this repo contains

- `backend/`: Node/Express API that serves lesson content and talks to the model service (and, in production, can serve the built frontend).
- `frontend/`: React + Vite UI (audio‑first cards) that talks to the backend.
- `model-service/`: Python FastAPI app where LLM / speech logic lives.

### Quick start for local dev (macOS or Windows with Node 18+)

1. **Start the backend API**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   - API base: `http://localhost:4000/api`

2. **Start the frontend (React + Vite)**

   In a second terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   - Vite dev server (UI): usually `http://localhost:5173/`
   - All `/api/...` requests from the frontend are proxied to `http://localhost:4000`.

3. Open the Vite URL in your browser and use the app.

#### Optional: run the Python model service

If you want the speech recognition to go through a Python service (for LLM / ASR integration), from the project root:

```bash
cd model-service
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

Then, in the terminal where you start the backend, set:

```bash
cd backend
export LLM_SERVICE_URL=http://localhost:8001   # Windows PowerShell: $env:LLM_SERVICE_URL="http://localhost:8001"
npm run dev
```

With `LLM_SERVICE_URL` set, the backend will call the Python FastAPI service for recognition; without it, it falls back to a simple stub.

#### Running the AI engine (OpenAI) and tests

The model-service includes an AI engine (`ai_engine.py`) for repeat evaluation and scenario-based roleplay using the OpenAI API.

1. **Set your API key**  
   Create a `.env` file in the project root (`oAIsis/`) or in `model-service/` with:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   Optional: set `OPENAI_MODEL=gpt-4o` (or another model) in `.env`; default is `gpt-4o-mini`.

2. **Install and run the model-service** (from project root):
   ```bash
   cd model-service
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8001
   ```

3. **Run the AI engine tests** (repeat evaluation, roleplay prompt, roleplay evaluation):
   ```bash
   cd model-service
   source .venv/bin/activate
   python test_ai_engine.py
   ```
   Or from project root:
   ```bash
   cd oAIsis/model-service && python test_ai_engine.py
   ```

4. **HTTP endpoints** (for the Node backend to call when `LLM_SERVICE_URL` is set):
   - `POST /verify-audio` — multipart: `audio` (file), optional `expectedPhrase` (form field). Transcribes with Whisper, then if `expectedPhrase` is provided evaluates correctness. Returns `{ transcript, evaluation }` (evaluation is null when no expected phrase).
   - `POST /evaluate-repeat` — body: `{ "userText": "...", "expectedPhrase": "..." }` → `{ status, feedback, expected_phrase }`
   - `POST /evaluate-roleplay` — body: `{ "userText": "...", "scenarioName": "...", "stepIndex": 0 }` → `{ status, feedback, next_step_available, suggested_correct_phrase }`
   - `GET /roleplay-prompt?scenarioName=cleaning_job&stepIndex=0` → `{ prompt, scenario_name, step_index, total_steps }`

If `OPENAI_API_KEY` is missing, the AI endpoints return 500 with a clear error message.

### More details

For architecture and extension points (e.g., wiring in TTS/ASR providers like Claude), see:

- `backend/README.md`
- `frontend/README.md`