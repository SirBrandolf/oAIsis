export function getSceneEmoji(sceneId) {
  if (!sceneId) return "📚";
  const id = sceneId.toLowerCase();

  if (id.includes("home") || id.includes("greet")) {
    return "👋";
  }
  if (id.includes("market")) {
    return "🛒";
  }
  if (id.includes("clinic") || id.includes("doctor")) {
    return "🩺";
  }

  return "📚";
}

