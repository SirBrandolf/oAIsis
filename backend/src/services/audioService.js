const AUDIO_BASE_URL = "/audio";

export class AudioPlaybackService {
  getAudioUrl(audioAssetId, targetLanguage) {
    return `${AUDIO_BASE_URL}/${targetLanguage}/${audioAssetId}.mp3`;
  }
}

export class SpeechRecognitionService {
  async recognize(_audioBlob, expectedPhrase, _targetLanguage) {
    return {
      recognizedText: expectedPhrase,
      confidence: 0.99
    };
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
