from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from typing import Optional

from ai_engine import evaluate_repeat, evaluate_roleplay, get_roleplay_prompt, verify_audio


class RecognizeRequest(BaseModel):
    expectedPhrase: str
    targetLanguage: Optional[str] = "en"


class RecognizeResponse(BaseModel):
    recognizedText: str
    confidence: float


class EvaluateRepeatRequest(BaseModel):
    userText: str
    expectedPhrase: str


class EvaluateRoleplayRequest(BaseModel):
    userText: str
    scenarioName: str
    stepIndex: int


app = FastAPI(title="Oaisis Model Service")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recognize", response_model=RecognizeResponse)
def recognize(req: RecognizeRequest):
    return RecognizeResponse(
        recognizedText=req.expectedPhrase,
        confidence=0.99,
    )


@app.post("/evaluate-repeat")
def api_evaluate_repeat(req: EvaluateRepeatRequest):
    """Evaluate learner's repeated phrase. Returns { status, feedback, expected_phrase }."""
    try:
        return evaluate_repeat(req.userText, req.expectedPhrase)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/evaluate-roleplay")
def api_evaluate_roleplay(req: EvaluateRoleplayRequest):
    """Evaluate learner's roleplay response. Returns { status, feedback, next_step_available, suggested_correct_phrase }."""
    try:
        return evaluate_roleplay(req.userText, req.scenarioName, req.stepIndex)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/roleplay-prompt")
def api_roleplay_prompt(scenarioName: str, stepIndex: int):
    """Get the system/supervisor line for a scenario step. Returns { prompt, scenario_name, step_index, total_steps }."""
    return get_roleplay_prompt(scenarioName, stepIndex)


@app.post("/verify-audio")
async def api_verify_audio(
    audio: UploadFile = File(..., description="Audio file (e.g. webm, mp3, wav)"),
    expectedPhrase: Optional[str] = Form(None, description="Optional correct sentence to verify against"),
):
    """
    Transcribe audio with OpenAI, then optionally verify against an expected phrase.
    Returns { transcript, evaluation } where evaluation is null if no expectedPhrase was sent.
    """
    try:
        audio_bytes = await audio.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read audio: {e}") from e
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio file is empty")
    filename = audio.filename or "audio.webm"
    try:
        return verify_audio(
            audio_bytes,
            expected_phrase=expectedPhrase.strip() if expectedPhrase and expectedPhrase.strip() else None,
            filename=filename,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# To run locally:
#   uvicorn app:app --reload --port 8001
