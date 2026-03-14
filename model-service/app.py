from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional


class RecognizeRequest(BaseModel):
  expectedPhrase: str
  targetLanguage: Optional[str] = "en"


class RecognizeResponse(BaseModel):
  recognizedText: str
  confidence: float


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


# To run locally:
#   uvicorn app:app --reload --port 8001
