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
      .then(data => {
        setScenes(data.scenes || []);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }, []);

  const handleSelectScene = async scene => {
    try {
      const data = await fetchCards(scene.id);
      setCurrentScene(scene);
      setCards(data.cards || []);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const handleBack = () => {
    setCurrentScene(null);
    setCards([]);
  };

  return (
    <main id="app">
      <header className="app-header">
        <h1>Oaisis</h1>
        <p className="subtitle">Audio-first English scenes</p>
      </header>
      {!currentScene ? (
        <SceneList
          scenes={scenes}
          onSelectScene={handleSelectScene}
          error={error}
        />
      ) : (
        <CardView scene={currentScene} cards={cards} onBack={handleBack} />
      )}
    </main>
  );
}

