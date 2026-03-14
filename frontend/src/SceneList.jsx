import React from "react";
import { getSceneEmoji } from "./sceneIcons";

export function SceneList({ scenes, onSelectScene, activeSceneId, error }) {
  if (error) {
    return <div className="scene-list">Failed to load scenes.</div>;
  }

  return (
    <section className="scene-list">
      {scenes.map(scene => (
        <button
          key={scene.id}
          className={`scene-card${activeSceneId === scene.id ? " active" : ""}`}
          onClick={() => onSelectScene(scene)}
        >
          <div className="scene-emoji">{getSceneEmoji(scene.id)}</div>
          <div className="scene-title">{scene.title}</div>
        </button>
      ))}
    </section>
  );
}
