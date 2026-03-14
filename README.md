## oAIsis – Audio‑First English Learning

### What this repo contains

- `backend/`: Node/Express API that serves lesson content and talks to the model service (and, in production, can serve the built frontend).
- `frontend/`: React + Vite UI (audio‑first cards) that talks to the backend.
- `model-service/`: Python FastAPI app where LLM / speech logic lives.

### Quick start for local dev (macOS or Windows with Node 18+)

The **Python model service is required** for the app: the frontend records your voice and sends it to the backend, which forwards it to Python for transcription and evaluation.

1. **Start the Python model service** (terminal 1)

   From the project root:

   ```bash
   cd model-service
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8001
   ```

   Leave this running. Put `OPENAI_API_KEY=your_key` in a **root-level `.env`** (in the folder that contains `backend/`, `frontend/`, `model-service/`) for real transcription and evaluation.

2. **Start the backend** (terminal 2)

   From the project root, **with `LLM_SERVICE_URL` set** so the backend talks to Python:

   ```bash
   cd backend
   npm install
   export LLM_SERVICE_URL=http://localhost:8001   # Windows PowerShell: $env:LLM_SERVICE_URL="http://localhost:8001"
   npm run dev
   ```

   - API base: `http://localhost:4000/api`  
   - If `LLM_SERVICE_URL` is not set, `/api/recognize` and `/api/verify-audio` return 503 (model service not configured).

3. **Start the frontend** (terminal 3)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   - UI: usually `http://localhost:5173/`
   - `/api` is proxied to the backend. Use the 🎤 button on a card: click to start recording, click again to stop; the app sends the recording to the backend → Python and shows transcript + evaluation.

#### Running the AI engine (OpenAI) and tests

The model-service includes an AI engine (`ai_engine.py`) for repeat evaluation and scenario-based roleplay using the OpenAI API.

1. **Set your API key**  
   Create a **`.env` file at the project root** (the folder that contains `backend/`, `frontend/`, `model-service/`) with:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   Optional: set `OPENAI_MODEL=gpt-4o` (or another model) in the same `.env`; default is `gpt-4o-mini`.

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