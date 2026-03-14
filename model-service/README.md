# Model service (AI engine)

Python FastAPI app where LLM / speech logic lives. Includes the OpenAI-based AI engine for repeat evaluation and scenario roleplay.

## How to run

1. **API key**  
   Put `OPENAI_API_KEY=your_key` in a `.env` file in the project root (`oAIsis/`) or in this directory.

2. **Install and run the API**
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8001
   ```

3. **Run AI engine tests** (repeat + roleplay demos)
   ```bash
   source .venv/bin/activate
   python test_ai_engine.py
   ```

See the main [README](../README.md) for endpoints and integration with the Node backend.
