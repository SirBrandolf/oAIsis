const API_BASE = "/api";

export async function fetchScenes() {
  const res = await fetch(`${API_BASE}/scenes`);
  if (!res.ok) throw new Error("Failed to load scenes");
  return res.json();
}

export async function fetchCards(sceneId) {
  const res = await fetch(`${API_BASE}/scenes/${sceneId}/cards`);
  if (!res.ok) throw new Error("Failed to load cards");
  return res.json();
}

export async function recognizePhrase(expectedPhrase, targetLanguage) {
  const res = await fetch(`${API_BASE}/recognize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expectedPhrase, targetLanguage })
  });
  if (!res.ok) throw new Error("Recognition failed");
  return res.json();
}

/**
 * Send recorded audio to the model service for transcription and optional evaluation.
 * @param {Blob} audioBlob - Recorded audio (e.g. from MediaRecorder).
 * @param {string|null} expectedPhrase - If provided, response includes evaluation.
 * @returns {Promise<{ transcript: string, evaluation?: { result: string, score?: number } }>}
 */
export async function verifyAudio(audioBlob, expectedPhrase = null) {
  const form = new FormData();
  form.append("audio", audioBlob, "audio.webm");
  if (expectedPhrase) form.append("expectedPhrase", expectedPhrase);

  const res = await fetch(`${API_BASE}/verify-audio`, {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.detail || err.error || "Verification failed");
  }
  return res.json();
}

