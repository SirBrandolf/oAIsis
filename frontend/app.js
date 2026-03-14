const API_BASE = "http://localhost:4000/api";

async function fetchScenes() {
  const res = await fetch(`${API_BASE}/scenes`);
  if (!res.ok) throw new Error("Failed to load scenes");
  return res.json();
}

async function fetchCards(sceneId) {
  const res = await fetch(`${API_BASE}/scenes/${sceneId}/cards`);
  if (!res.ok) throw new Error("Failed to load cards");
  return res.json();
}

async function recognizePhrase(expectedPhrase, targetLanguage) {
  const res = await fetch(`${API_BASE}/recognize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expectedPhrase, targetLanguage })
  });
  if (!res.ok) throw new Error("Recognition failed");
  return res.json();
}

function createAudioElement(url) {
  const audio = new Audio(url);
  return audio;
}

const { useState, useEffect } = React;

function SceneList({ scenes, onSelectScene, error }) {
  if (error) {
    return React.createElement(
      "div",
      { className: "scene-list" },
      "Failed to load scenes."
    );
  }

  return React.createElement(
    "section",
    { className: "scene-list" },
    scenes.map(scene =>
      React.createElement(
        "button",
        {
          key: scene.id,
          className: "scene-card",
          onClick: () => onSelectScene(scene)
        },
        React.createElement(
          "div",
          { className: "scene-emoji" },
          "📚"
        ),
        React.createElement(
          "div",
          { className: "scene-title" },
          scene.title
        )
      )
    )
  );
}

function CardView({ scene, cards, onBack }) {
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
    return React.createElement(
      "section",
      { className: "card-view" },
      React.createElement(
        "button",
        { className: "back-button", onClick: onBack },
        "⬅ Scenes"
      ),
      React.createElement("h2", null, scene.title),
      React.createElement("p", null, "No cards in this scene yet.")
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

  return React.createElement(
    "section",
    { className: "card-view" },
    React.createElement(
      "button",
      { className: "back-button", onClick: onBack },
      "⬅ Scenes"
    ),
    React.createElement("h2", null, scene.title),
    React.createElement(
      "div",
      { className: "card-container" },
      React.createElement(
        "div",
        { className: "card-emoji" },
        card.emoji
      ),
      React.createElement(
        "div",
        { className: "card-image-placeholder" },
        "Image placeholder"
      ),
      React.createElement(
        "div",
        { className: "audio-controls" },
        React.createElement(
          "button",
          { className: "audio-button primary", onClick: handlePlay },
          "🔊 Listen"
        ),
        React.createElement(
          "button",
          { className: "audio-button secondary", onClick: handleTry },
          "🎤 Try"
        )
      ),
      React.createElement(
        "div",
        { className: "card-phrase" },
        card.phrase
      ),
      React.createElement(
        "div",
        {
          className:
            "feedback" + (feedback ? " " + feedback.result : "")
        },
        feedback
          ? feedback.result === "correct"
            ? "Correct!"
            : "Try again."
          : ""
      )
    ),
    React.createElement(
      "div",
      { className: "card-controls" },
      React.createElement(
        "button",
        { className: "nav-button", onClick: handlePrev },
        "◀"
      ),
      React.createElement(
        "button",
        { className: "nav-button", onClick: handleNext },
        "▶"
      )
    )
  );
}

function App() {
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

  return React.createElement(
    "main",
    { id: "app" },
    React.createElement(
      "header",
      { className: "app-header" },
      React.createElement("h1", null, "Oaisis"),
      React.createElement(
        "p",
        { className: "subtitle" },
        "Audio-first English scenes"
      )
    ),
    !currentScene
      ? React.createElement(SceneList, {
          scenes,
          onSelectScene: handleSelectScene,
          error
        })
      : React.createElement(CardView, {
          scene: currentScene,
          cards,
          onBack: handleBack
        })
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));

