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
  if (id.includes("fable") || id.includes("advanced") || id.includes("story")) {
    return "📖";
  }

  return "📚";
}

