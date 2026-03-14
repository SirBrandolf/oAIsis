const AUDIO_BASE_URL = "/audio";

export class AudioPlaybackService {
  /** Returns URL for scenario (phrase) audio. Files in backend/public/audio/phrases/<lang>/{cardId}.mp3. */
  getAudioUrl(cardId, targetLanguage) {
    return `${AUDIO_BASE_URL}/phrases/${targetLanguage}/${cardId}.mp3`;
  }
}

export class SpeechRecognitionService {
  constructor() {
    this.remoteUrl = process.env.LLM_SERVICE_URL || null;
  }

  async recognize(_audioBlob, expectedPhrase, targetLanguage) {
    if (!this.remoteUrl) {
      return {
        recognizedText: expectedPhrase,
        confidence: 0.99
      };
    }

    try {
      const res = await fetch(`${this.remoteUrl}/recognize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedPhrase,
          targetLanguage
        })
      });

      if (!res.ok) {
        throw new Error(`LLM service error: ${res.status}`);
      }

      const data = await res.json();
      return {
        recognizedText: data.recognizedText ?? expectedPhrase,
        confidence: data.confidence ?? 0.9
      };
    } catch (err) {
      console.error("LLM recognition failed, falling back to stub:", err);
      return {
        recognizedText: expectedPhrase,
        confidence: 0.5
      };
    }
  }
}

export class PronunciationEvaluator {
  evaluate(expectedPhrase, recognizedText) {
    const normalizedExpected = expectedPhrase.trim().toLowerCase();
    const normalizedRecognized = recognizedText.trim().toLowerCase();

    if (normalizedExpected === normalizedRecognized) {
      return { result: "correct", score: 1.0 };
    }

    return { result: "try_again", score: 0.0 };
  }
}
