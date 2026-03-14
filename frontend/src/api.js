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

