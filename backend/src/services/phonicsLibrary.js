/**
 * Resolves phonics segment audio URLs. Segments are included if we have a real file
 * or a placeholder (PHONICS_PLACEHOLDERS). Run `npm run download-phonics` to fetch
 * IPA files and create placeholder copies for missing sounds.
 */

import { PHONICS_IPA_SOURCES, PHONICS_PLACEHOLDERS } from "../config/phonicsMap.js";

const PLACEHOLDER_SET = new Set(PHONICS_PLACEHOLDERS);

export function hasPhonicsFile(audioAssetId) {
  return (
    Object.prototype.hasOwnProperty.call(PHONICS_IPA_SOURCES, audioAssetId) ||
    PLACEHOLDER_SET.has(audioAssetId)
  );
}

/** Returns URL for phonics audio. Files in backend/public/audio/phonics/<lang>/{assetId}.mp3. */
export function getPhonicsAudioUrl(audioAssetId, targetLanguage, localAudioBaseUrl = "/audio") {
  return `${localAudioBaseUrl}/phonics/${targetLanguage}/${audioAssetId}.mp3`;
}
