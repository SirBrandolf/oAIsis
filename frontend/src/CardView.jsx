import React, { useState, useEffect, useRef } from "react";
import { verifyAudio } from "./api";

function playSequential(urls) {
  if (!urls || !urls.length) return;
  let i = 0;
  const playNext = () => {
    if (i >= urls.length) return;
    const a = new Audio(urls[i]);
    i++;
    a.onended = playNext;
    a.play();
  };
  playNext();
}

export function CardView({ scene, cards, onBack }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    setIndex(0);
    setFeedback(null);
    setTranscript(null);
    setRecordingError(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  }, [scene.id]);

  if (!cards.length) return <p>No cards in this scene yet.</p>;

  const card = cards[index];
  const isAdvanced = card.isAdvanced && (card.audioUrlEn != null || card.audioUrlRh != null);

  const handlePlay = () => {
    if (currentAudio) currentAudio.pause();
    const audio = new Audio(card.audioUrl);
    setCurrentAudio(audio);
    audio.play();
  };

  const handlePlayLanguage = (url) => {
    if (currentAudio) currentAudio.pause();
    if (!url) return;
    const base = import.meta.env.DEV ? "http://localhost:4000" : "";
    const audio = new Audio(base + url);
    setCurrentAudio(audio);
    audio.play();
  };

  const handleTry = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      return;
    }
    setRecordingError(null);
    setTranscript(null);
    setFeedback(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunksRef.current.length === 0) {
          setRecordingError("No audio recorded.");
          setIsRecording(false);
          return;
        }
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        try {
          const result = await verifyAudio(blob, card.phrase);
          setTranscript(result.transcript ?? null);
          setFeedback(result.evaluation ?? null);
        } catch (err) {
          setRecordingError(err.message || "Verification failed.");
        }
        setIsRecording(false);
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setRecordingError(err.message || "Microphone access denied.");
      setIsRecording(false);
    }
  };

  const handlePrev = () => {
    setIndex((i) => (i - 1 + cards.length) % cards.length);
    setFeedback(null);
    setTranscript(null);
    setRecordingError(null);
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % cards.length);
    setFeedback(null);
    setTranscript(null);
    setRecordingError(null);
  };

  return (
    <div className="card-view-wrapper">
      <div className="card-header">
        <h2>{scene.title}</h2>
        <span className="progress-text">
          Step {index + 1} of {cards.length}
        </span>
      </div>

      <div className="center-stage">
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

        <div className="action-buttons">
          {isAdvanced ? (
            <>
              {card.audioUrlEn && (
                <button
                  className="btn-large btn-play"
                  onClick={() => handlePlayLanguage(card.audioUrlEn)}
                  aria-label="Play in English"
                >
                  <img
                    src="/images/listening-color-icon.webp"
                    alt=""
                    className="btn-icon"
                  />
                  English
                </button>
              )}
              {card.audioUrlRh && (
                <button
                  className="btn-large btn-mic"
                  onClick={() => handlePlayLanguage(card.audioUrlRh)}
                  aria-label="Play in Rohingya"
                >
                  <img
                    src="/images/speaking-head.svg"
                    alt=""
                    className="btn-icon"
                  />
                  Rohingya
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="btn-large btn-play"
                onClick={handlePlay}
                aria-label="Play audio"
              >
                <img
                  src="/images/listening-color-icon.webp"
                  alt="Play audio"
                  className="btn-icon"
                />
              </button>
              <button
                className={`btn-large btn-mic${isRecording ? " recording" : ""}`}
                onClick={handleTry}
                aria-label={isRecording ? "Stop recording" : "Practice speaking"}
              >
                <img
                  src="/images/speaking-head.svg"
                  alt="Practice speaking"
                  className="btn-icon"
                />
              </button>
            </>
          )}
        </div>

        {!isAdvanced && Array.isArray(card.phonicsWords) && card.phonicsWords.length > 0 && (
          <div className="phonics-breakdown">
            {card.phonicsWords.map((wordEntry, wi) => (
              <div className="phonics-word-row" key={wi}>
                <span className="phonics-word-label">{wordEntry.word}</span>
                <div className="phonics-word-sounds">
                  {wordEntry.sounds.map((s, si) =>
                    s.silent ? (
                      <span
                        key={si}
                        className="phonics-button phonics-button--silent"
                        aria-label={`${s.letters} (silent)`}
                      >
                        <span className="phonics-button-label">{s.letters}</span>
                      </span>
                    ) : (
                      <button
                        key={si}
                        type="button"
                        className={
                          "phonics-button" +
                          (s.diphthong ? " phonics-button--diphthong" : "")
                        }
                        onClick={() => {
                          if (s.audioUrls?.length) {
                            playSequential(s.audioUrls);
                          } else if (s.audioUrl) {
                            new Audio(s.audioUrl).play();
                          }
                        }}
                        aria-label={`Listen to sound ${s.letters}`}
                      >
                        <span className="phonics-button-icon" aria-hidden>🔈</span>
                        <span className="phonics-button-label">{s.letters}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {recordingError && (
          <p className="feedback-toast try_again">{recordingError}</p>
        )}
        {transcript != null && (
          <p className="transcript">&ldquo;{transcript}&rdquo;</p>
        )}
        {feedback && (
          <div className={`feedback-toast ${feedback.result || ""}`}>
            {feedback.feedback ||
              (feedback.result === "correct" ? "Correct!" : "Try again.")}
          </div>
        )}

        <div className="nav-controls">
          <button className="btn-small" onClick={handlePrev} aria-label="Previous card">
            ←
          </button>
          <button className="btn-small" onClick={handleNext} aria-label="Next card">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
