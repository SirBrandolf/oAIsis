"""
AI engine for oral-first English learning: repeat evaluation and roleplay.
Uses OpenAI API. Outputs are always controlled dicts, never raw model text.
"""

import json
import os
import re
from typing import Any

from dotenv import load_dotenv

# Load .env from current directory and from project root (parent of model-service)
_load_dirs = [
    os.path.dirname(os.path.abspath(__file__)),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."),
]
for _d in _load_dirs:
    _env_path = os.path.join(_d, ".env")
    if os.path.isfile(_env_path):
        load_dotenv(_env_path)
        break
else:
    load_dotenv()

# --- Config (hackathon-friendly constants) ---
MODEL_NAME = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
TRANSCRIPTION_MODEL = os.environ.get("OPENAI_TRANSCRIPTION_MODEL", "whisper-1")
REQUEST_TIMEOUT_SEC = 30

# Allowed status values for repeat and roleplay
REPEAT_STATUS_GOOD = "GOOD"
REPEAT_STATUS_CLOSE = "CLOSE"
REPEAT_STATUS_TRY_AGAIN = "TRY_AGAIN"

# --- Scenario library (hardcoded for demo reliability) ---
SCENARIOS: dict[str, list[dict[str, Any]]] = {
    "cleaning_job": [
        {
            "system_line": "Please clean table 4.",
            "expected_ideas": [
                "Okay.",
                "I will clean table 4.",
                "Yes, I will clean it.",
            ],
        },
        {
            "system_line": "Are you finished?",
            "expected_ideas": [
                "Yes, I am finished.",
                "Not yet.",
            ],
        },
        {
            "system_line": "Do you need help?",
            "expected_ideas": [
                "Yes, I need help.",
                "No, I am okay.",
            ],
        },
    ],
    "grocery_store": [
        {
            "system_line": "Can I help you?",
            "expected_ideas": [
                "Yes, where is milk?",
                "I need milk.",
            ],
        },
        {
            "system_line": "Do you need a bag?",
            "expected_ideas": [
                "Yes, please.",
                "No, thank you.",
            ],
        },
        {
            "system_line": "That is five dollars.",
            "expected_ideas": [
                "Okay.",
                "Here.",
                "Thank you.",
            ],
        },
    ],
}


def _get_client():  # type: () -> Any
    from openai import OpenAI

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or not str(api_key).strip():
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Add it to a .env file in the project root or model-service directory."
        )
    return OpenAI(api_key=api_key.strip())


def ask_llm(prompt: str) -> str:
    """
    Send a single prompt to the LLM (OpenAI) and return the model's text response.
    Raises on missing API key or on request failure.
    """
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    if not response or not response.choices:
        raise RuntimeError("OpenAI returned an empty or invalid response.")
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("OpenAI returned empty content.")
    return content.strip()


def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """
    Transcribe audio to text using OpenAI Whisper.
    Raises on missing API key or on request failure.
    """
    if not audio_bytes:
        raise ValueError("audio_bytes must not be empty")
    client = _get_client()
    # OpenAI accepts (filename, file_content, content_type); file_content can be bytes
    file_tuple = (filename, audio_bytes, _mime_for_filename(filename))
    response = client.audio.transcriptions.create(
        model=TRANSCRIPTION_MODEL,
        file=file_tuple,
        language="en",
    )
    if not response or not getattr(response, "text", None):
        return ""
    return response.text.strip()


def _mime_for_filename(filename: str) -> str:
    """Return a MIME type for common audio extensions."""
    ext = (filename or "").lower().split(".")[-1]
    mime = {
        "webm": "audio/webm",
        "mp3": "audio/mpeg",
        "mp4": "audio/mp4",
        "m4a": "audio/mp4",
        "wav": "audio/wav",
        "ogg": "audio/ogg",
        "mpeg": "audio/mpeg",
        "mpga": "audio/mpeg",
    }
    return mime.get(ext, "audio/webm")


def verify_audio(
    audio_bytes: bytes,
    expected_phrase: str | None = None,
    filename: str = "audio.webm",
) -> dict[str, Any]:
    """
    Transcribe audio, then optionally evaluate correctness against an expected phrase.
    Returns a controlled dict:
      - transcript: str (what was heard)
      - evaluation: dict | None (if expected_phrase was provided: status, feedback, expected_phrase)
    """
    transcript = transcribe_audio(audio_bytes, filename=filename)
    result: dict[str, Any] = {"transcript": transcript}
    if expected_phrase is not None and str(expected_phrase).strip():
        evaluation = evaluate_repeat(transcript, expected_phrase.strip())
        result["evaluation"] = evaluation
    else:
        result["evaluation"] = None
    return result


def normalize_transcript(text: str) -> str:
    """
    Light normalization for learner transcripts before evaluation:
    strip, lowercase, collapse repeated spaces. No heavy rewriting.
    """
    if not text or not isinstance(text, str):
        return ""
    t = text.strip().lower()
    t = re.sub(r"\s+", " ", t)
    return t


def _safe_parse_json(raw: str, fallback: dict[str, Any]) -> dict[str, Any]:
    """Parse JSON from model output; on failure return fallback dict."""
    if not raw or not isinstance(raw, str):
        return fallback
    # Try to extract JSON from markdown code block if present
    raw = raw.strip()
    if "```" in raw:
        parts = raw.split("```")
        for p in parts:
            p = p.strip()
            if p.startswith("json"):
                p = p[4:].strip()
            if p.startswith("{"):
                try:
                    return json.loads(p)
                except json.JSONDecodeError:
                    continue
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    # Last resort: find first { ... } substring
    start = raw.find("{")
    if start >= 0:
        depth = 0
        for i in range(start, len(raw)):
            if raw[i] == "{":
                depth += 1
            elif raw[i] == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(raw[start : i + 1])
                    except json.JSONDecodeError:
                        break
    return fallback


def evaluate_repeat(user_text: str, expected_phrase: str) -> dict[str, Any]:
    """
    Evaluate a learner's repeated phrase against the expected English phrase.
    Returns a controlled dict: status (GOOD | CLOSE | TRY_AGAIN), feedback, expected_phrase.
    Lenient for beginners: small grammar/spelling mistakes accepted if meaning is correct.
    """
    user_norm = normalize_transcript(user_text)
    expected_norm = normalize_transcript(expected_phrase)

    if not expected_phrase or not expected_norm:
        return {
            "status": REPEAT_STATUS_TRY_AGAIN,
            "feedback": "Try again.",
            "expected_phrase": expected_phrase or "",
        }

    fallback = {
        "status": REPEAT_STATUS_TRY_AGAIN,
        "feedback": f"Try again. Say: {expected_phrase}.",
        "expected_phrase": expected_phrase,
    }

    prompt = f"""You are evaluating a beginner English learner who repeated a phrase. Be lenient: ignore small grammar and spelling mistakes if the meaning is correct. Ignore transcription noise.

Expected phrase (what we wanted them to say): "{expected_phrase}"
What the learner said (transcript): "{user_text}"

Respond with ONLY a JSON object, no other text. Use exactly these keys:
- "status": one of "GOOD", "CLOSE", "TRY_AGAIN"
  - GOOD: meaning matches and is clearly correct (or very close).
  - CLOSE: meaning is close but phrasing could be improved; encourage with the correct phrase.
  - TRY_AGAIN: meaning wrong or too far off; ask them to try again with the expected phrase.
- "feedback": a single short spoken sentence for the learner (e.g. "Good job." or "Good. Try this: I need help." or "Try again. Say: I need help."). Keep it brief and kind. No grammar lectures, no long explanations.
- "expected_phrase": repeat the expected phrase exactly: "{expected_phrase}"

Output only valid JSON."""

    try:
        raw = ask_llm(prompt)
    except Exception as e:
        raise RuntimeError(f"Repeat evaluation failed: {e}") from e

    out = _safe_parse_json(raw, fallback)

    status = (out.get("status") or "").strip().upper()
    if status not in (REPEAT_STATUS_GOOD, REPEAT_STATUS_CLOSE, REPEAT_STATUS_TRY_AGAIN):
        status = REPEAT_STATUS_TRY_AGAIN
    feedback = (out.get("feedback") or fallback["feedback"]).strip()
    if not feedback:
        feedback = fallback["feedback"]
    expected_out = out.get("expected_phrase")
    if expected_out is None or (isinstance(expected_out, str) and not expected_out.strip()):
        expected_out = expected_phrase

    return {
        "status": status,
        "feedback": feedback,
        "expected_phrase": expected_out if isinstance(expected_out, str) else expected_phrase,
    }


def get_roleplay_prompt(scenario_name: str, step_index: int) -> dict[str, Any]:
    """
    Get the system/supervisor line for a given scenario and step.
    Returns a controlled dict with prompt text and metadata. No LLM call.
    """
    steps = SCENARIOS.get(scenario_name)
    if not steps:
        return {
            "prompt": "",
            "scenario_name": scenario_name,
            "step_index": step_index,
            "error": "Scenario not found",
        }
    if step_index < 0 or step_index >= len(steps):
        return {
            "prompt": "",
            "scenario_name": scenario_name,
            "step_index": step_index,
            "error": "Step index out of range",
        }
    step = steps[step_index]
    return {
        "prompt": step.get("system_line", ""),
        "scenario_name": scenario_name,
        "step_index": step_index,
        "total_steps": len(steps),
    }


def evaluate_roleplay(
    user_text: str, scenario_name: str, step_index: int
) -> dict[str, Any]:
    """
    Evaluate a learner's roleplay response for a given scenario step.
    Returns: status, feedback, next_step_available, suggested_correct_phrase.
    Lenient: accept short responses if meaning is correct.
    """
    steps = SCENARIOS.get(scenario_name)
    fallback = {
        "status": REPEAT_STATUS_TRY_AGAIN,
        "feedback": "Try again.",
        "next_step_available": False,
        "suggested_correct_phrase": None,
    }
    if not steps or step_index < 0 or step_index >= len(steps):
        return {**fallback, "feedback": "Try again. This step was not found."}

    step = steps[step_index]
    system_line = step.get("system_line", "")
    expected_ideas = step.get("expected_ideas", [])
    expected_str = "; or ".join(expected_ideas) if expected_ideas else system_line

    prompt = f"""You are evaluating a beginner English learner in a roleplay. Be lenient. Accept short responses if the meaning is correct.

Scenario: {scenario_name}. Step {step_index + 1}.
What the system/supervisor said: "{system_line}"
Acceptable learner response ideas (meaning): {expected_str}
What the learner said (transcript): "{user_text}"

Respond with ONLY a JSON object, no other text. Use exactly these keys:
- "status": one of "GOOD", "CLOSE", "TRY_AGAIN"
  - GOOD: response meaning is correct or clearly acceptable for this step.
  - CLOSE: meaning is close but could be clearer; still accept and encourage.
  - TRY_AGAIN: meaning wrong or unclear; suggest the correct phrase.
- "feedback": one short spoken sentence (e.g. "Good job." or "Try again. Say: I will clean table 4."). Brief and kind. No long explanations.
- "next_step_available": true if status is GOOD or CLOSE, false if TRY_AGAIN.
- "suggested_correct_phrase": if status is TRY_AGAIN, a short correct phrase the learner can say (from the acceptable ideas or similar); otherwise null.

Output only valid JSON."""

    try:
        raw = ask_llm(prompt)
    except Exception as e:
        raise RuntimeError(f"Roleplay evaluation failed: {e}") from e

    out = _safe_parse_json(raw, fallback)

    status = (out.get("status") or "").strip().upper()
    if status not in (REPEAT_STATUS_GOOD, REPEAT_STATUS_CLOSE, REPEAT_STATUS_TRY_AGAIN):
        status = REPEAT_STATUS_TRY_AGAIN
    feedback = (out.get("feedback") or fallback["feedback"]).strip() or fallback["feedback"]
    if status == REPEAT_STATUS_TRY_AGAIN:
        next_available = False
    else:
        next_available = bool(out.get("next_step_available", True))
    suggested = out.get("suggested_correct_phrase")
    if suggested is not None and isinstance(suggested, str) and not suggested.strip():
        suggested = expected_ideas[0] if expected_ideas else None
    if status == REPEAT_STATUS_TRY_AGAIN and suggested is None and expected_ideas:
        suggested = expected_ideas[0]

    return {
        "status": status,
        "feedback": feedback,
        "next_step_available": next_available,
        "suggested_correct_phrase": suggested,
    }
