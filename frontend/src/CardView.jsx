import React, { useState, useEffect } from "react";
import { recognizePhrase } from "./api";

function createAudioElement(url) {
  return new Audio(url);
}

export function CardView({ scene, cards, onBack }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    setIndex(0);
    setFeedback(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  }, [scene.id]);

  if (!cards.length) {
    return (
      <section className="card-view">
        <button className="back-button" onClick={onBack}>
          ⬅ Scenes
        </button>
        <h2>{scene.title}</h2>
        <p>No cards in this scene yet.</p>
      </section>
    );
  }

  const card = cards[index];

  const handlePlay = () => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = createAudioElement(card.audioUrl);
    setCurrentAudio(audio);
    audio.play();
  };

  const handleTry = async () => {
    const result = await recognizePhrase(card.phrase, "en");
    setFeedback(result.evaluation);
  };

  const handlePrev = () => {
    const nextIndex = (index - 1 + cards.length) % cards.length;
    setIndex(nextIndex);
    setFeedback(null);
  };

  const handleNext = () => {
    const nextIndex = (index + 1) % cards.length;
    setIndex(nextIndex);
    setFeedback(null);
  };

  return (
    <section className="card-view">
      <button className="back-button" onClick={onBack}>
        ⬅ Scenes
      </button>
      <h2>{scene.title}</h2>
      <div className="card-container">
        <div className="card-emoji">{card.emoji}</div>
        <div className="audio-controls">
          <button
            className="audio-button arrow"
            onClick={handlePlay}
            aria-label="Play phrase"
          >
            ▶
          </button>
          <button
            className="audio-button voice"
            onClick={handleTry}
            aria-label="Practice speaking phrase"
          >
            🎤
          </button>
        </div>
        <div className="card-phrase">{card.phrase}</div>
        <div className="card-image-placeholder">Image placeholder</div>
        <div
          className={
            "feedback" + (feedback ? " " + feedback.result : "")
          }
        >
          {feedback
            ? feedback.result === "correct"
              ? "Correct!"
              : "Try again."
            : ""}
        </div>
      </div>
      <div className="card-controls">
        <button className="nav-button" onClick={handlePrev}>
          ◀
        </button>
        <button className="nav-button" onClick={handleNext}>
          ▶
        </button>
      </div>
    </section>
  );
}

