import React, { useState, useEffect, useRef } from "react";
import { verifyAudio } from "./api";

function createAudioElement(url) {
  return new Audio(url);
}

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
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    setIndex(0);
    setFeedback(null);
    setTranscript(null);
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
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
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
    const nextIndex = (index - 1 + cards.length) % cards.length;
    setIndex(nextIndex);
    setFeedback(null);
    setTranscript(null);
    setRecordingError(null);
  };

  const handleNext = () => {
    const nextIndex = (index + 1) % cards.length;
    setIndex(nextIndex);
    setFeedback(null);
    setTranscript(null);
    setRecordingError(null);
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
            className={"audio-button voice" + (isRecording ? " recording" : "")}
            onClick={handleTry}
            aria-label={isRecording ? "Stop recording" : "Record and verify"}
          >
            {isRecording ? "😐" : "🗣️"}
          </button>
        </div>
        <div className="card-phrase">{card.phrase}</div>
        {Array.isArray(card.phonicsWords) && card.phonicsWords.length > 0 && (
          <div className="phonics-breakdown">
            {card.phonicsWords.map((wordEntry, wi) => (
              <div className="phonics-word-row" key={wi}>
                <span className="phonics-word-label">{wordEntry.word}</span>
                <div className="phonics-word-sounds">
                  {wordEntry.sounds.map((s, si) => (
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
                          if (s.audioUrls && s.audioUrls.length) {
                            playSequential(s.audioUrls);
                          } else if (s.audioUrl) {
                            const a = createAudioElement(s.audioUrl);
                            a.play();
                          }
                        }}
                        aria-label={`Listen to sound ${s.letters}`}
                      >
                        <span className="phonics-button-icon" aria-hidden>🔈</span>
                        <span className="phonics-button-label">{s.letters}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {recordingError && <p className="feedback try_again">{recordingError}</p>}
        {transcript != null && (
          <p className="transcript">
            &ldquo;{transcript}&rdquo;
          </p>
        )}
        <div className="card-image-placeholder">Image placeholder</div>
        <div
          className={
            "feedback" +
            (feedback && feedback.status
              ? " feedback--" + feedback.status.toLowerCase()
              : feedback && feedback.result
                ? " " + feedback.result
                : "")
          }
        >
          {feedback
            ? feedback.feedback ||
              (feedback.result === "correct" ? "Correct!" : "Try again.")
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

