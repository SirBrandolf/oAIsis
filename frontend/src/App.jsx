// src/App.jsx
import React, { useEffect, useState } from "react";
import "./styles.css";
import { fetchScenes, fetchCards } from "./api";
import { SceneList } from "./SceneList";
import { CardView } from "./CardView";

export function App() {
  const [scenes, setScenes] = useState([]);
  const [currentScene, setCurrentScene] = useState(null);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScenes()
      .then(data => setScenes(data.scenes || []))
      .catch(err => setError(err));
  }, []);

  const handleSelectScene = async scene => {
    try {
      const data = await fetchCards(scene.id);
      setCurrentScene(scene);
      setCards(data.cards || []);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <main id="app" className={currentScene ? "layout-dashboard" : "layout-grid"}>
      <header className="app-header">
        <h1 onClick={() => setCurrentScene(null)} style={{cursor: 'pointer'}}>Oaisis</h1>
        <p className="subtitle">Audio-first English scenes</p>
      </header>

      <div className="main-container">
        {/* Sidebar: Only active when a scene is selected */}
        {currentScene && (
          <aside className="sidebar">
            <h3>All Lessons</h3>
            <SceneList 
              scenes={scenes} 
              onSelectScene={handleSelectScene} 
              activeSceneId={currentScene.id} 
            />
          </aside>
        )}

        {/* Center Content */}
        <section className="content-area">
          {!currentScene ? (
            <SceneList scenes={scenes} onSelectScene={handleSelectScene} error={error} />
          ) : (
            <CardView scene={currentScene} cards={cards} onBack={() => setCurrentScene(null)} />
          )}
        </section>
      </div>
    </main>
  );
}
