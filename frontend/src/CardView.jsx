import React, { useState, useEffect } from "react";
import { recognizePhrase } from "./api";

export function CardView({ scene, cards, onBack }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const card = cards[index];

  if (!cards.length) return <p>Loading cards...</p>;

  return (
    <div className="card-view-wrapper">
      <div className="card-header">
        <h2>{scene.title}</h2>
        <span className="progress-text">Step {index + 1} of {cards.length}</span>
      </div>

      <div className="center-stage">
        {/* Large Image */}
        <div className="large-image-placeholder">
          <div className="card-image-wrapper">
            {card.imagePlaceholder ? (
              <img
                src={card.imagePlaceholder}
                alt={card.phrase}
                className="card-image"
              />
            ) : (
              <span className="main-emoji">{card.emoji}</span>
            )}
          </div>
          <p>{card.phrase}</p>
        </div>

        {/* 2 Large Audio Buttons */}
        <div className="action-buttons">
          <button
            className="btn-large btn-play"
            onClick={() => new Audio(card.audioUrl).play()}
            aria-label="Play audio"
          >
            <img
              src="/images/listening-color-icon.webp"
              alt="Play audio"
              className="btn-icon"
            />
          </button>
          <button
            className="btn-large btn-mic"
            onClick={async () => {
              const res = await recognizePhrase(card.phrase, "en");
              setFeedback(res.evaluation);
            }}
            aria-label="Practice speaking"
          >
            <img
              src="/images/speaking-head.svg"
              alt="Practice speaking"
              className="btn-icon"
            />
          </button>
        </div>

        {/* 2 Small Nav Buttons */}
        <div className="nav-controls">
          <button
            className="btn-small"
            onClick={() => setIndex(Math.max(0, index - 1))}
            aria-label="Previous card"
          >
            ←
          </button>
          <button
            className="btn-small"
            onClick={() => setIndex(Math.min(cards.length - 1, index + 1))}
            aria-label="Next card"
          >
            →
          </button>
        </div>

        {feedback && <div className={`feedback-toast ${feedback.result}`}>{feedback.result}</div>}
      </div>
    </div>
  );
}