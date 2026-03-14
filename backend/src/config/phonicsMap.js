/**
 * Single source of truth for phonics audio (PhoneticFlashCards / Wikipedia IPA).
 * Run `npm run download-phonics` to fetch real files and create placeholders for missing sounds.
 *
 * PHONICS_PLACEHOLDERS: assetIds with no external source yet; placeholder files are created
 * so all segments show a button. Replace those files when real recordings arrive.
 */
export const IPA_BASE =
  "https://raw.githubusercontent.com/joshstephenson/PhoneticFlashCards/main/ipa_audio";

/** assetId -> [subdir, filename] for every sound we can download from IPA repo. */
export const PHONICS_IPA_SOURCES = {
  // Consonants (single letter or digraph)
  "phonics-h": ["consonants", "Voiced_glottal_fricative_h.ogg.mp3"],
  "phonics-t": ["consonants", "Voiceless_alveolar_plosive_t.ogg.mp3"],
  "phonics-d": ["consonants", "Voiced_alveolar_plosive_d.ogg.mp3"],
  "phonics-s": ["consonants", "Voiceless_alveolar_sibilant_s.ogg.mp3"],
  "phonics-z": ["consonants", "Voiced_alveolar_sibilant_z.ogg.mp3"],
  "phonics-m": ["consonants", "Bilabial_nasal_m.ogg.mp3"],
  "phonics-n": ["consonants", "Alveolar_nasal_n.ogg.mp3"],
  "phonics-ng": ["consonants", "Velar_nasal_ŋ.ogg.mp3"],
  "phonics-l": ["consonants", "Voiced_alveolar_lateral_approximant_l.ogg.mp3"],
  "phonics-k": ["consonants", "Voiceless_velar_plosive_k.ogg.mp3"],
  "phonics-g": ["consonants", "Voiced_velar_plosive_g.ogg.mp3"],
  "phonics-f": ["consonants", "Voiceless_labio-dental_fricative_f.ogg.mp3"],
  "phonics-v": ["consonants", "Voiced_labio-dental_fricative_v.ogg.mp3"],
  "phonics-ch": ["consonants", "Voiceless_palato-alveolar_sibilant_ʃ.ogg.mp3"],
  "phonics-sh": ["consonants", "Voiceless_palato-alveolar_sibilant_ʃ.ogg.mp3"],
  "phonics-j": ["consonants", "Voiced_palatal_approximant_j.ogg.mp3"],
  "phonics-th-voiced": ["consonants", "Voiced_dental_fricative_ð.ogg.mp3"],
  "phonics-th-unvoiced": ["consonants", "Voiceless_dental_fricative_θ.ogg.mp3"],
  "phonics-wh": ["consonants", "Voiced_glottal_fricative_h.ogg.mp3"],
  // Vowels
  "phonics-short-a": ["vowels", "Near-open_front_unrounded_vowel_æ.ogg.mp3"],
  "phonics-short-e": ["vowels", "Open-mid_front_unrounded_vowel_ɛ.ogg.mp3"],
  "phonics-short-i": ["vowels", "Near-close_near-front_unrounded_vowel_ɪ.ogg.mp3"],
  "phonics-short-u": ["vowels", "Near-close_near-back_rounded_vowel_ʊ.ogg.mp3"],
  "phonics-long-a": ["vowels", "Open_front_unrounded_vowel_a.ogg.mp3"],
  "phonics-long-e": ["vowels", "Close_front_unrounded_vowel_i.ogg.mp3"],
  "phonics-long-i": ["vowels", "Close_front_unrounded_vowel_i.ogg.mp3"],
  "phonics-long-o": ["vowels", "Close_mid_back_rounded_vowel_o.ogg.mp3"],
  "phonics-ow": ["vowels", "Close_mid_back_rounded_vowel_o.ogg.mp3"],
  "phonics-er": ["vowels", "Mid-central_vowel_ə.ogg.mp3"],
  "phonics-air": ["vowels", "Open-mid_front_unrounded_vowel_ɛ.ogg.mp3"],
  "phonics-y-oo": ["vowels", "Close_back_rounded_vowel_u.ogg.mp3"],
  "phonics-lk": ["consonants", "Voiced_alveolar_lateral_approximant_l.ogg.mp3"],
};

/**
 * Phonics that have no external IPA source; we use our own .mp3s in public/audio/en.
 * Real recordings exist for: b, p, w, r, zh, ice, ow-diphthong, oy. Only strut is still placeholder.
 */
export const PHONICS_PLACEHOLDERS = [
  "phonics-b",
  "phonics-p",
  "phonics-w",
  "phonics-r",
  "phonics-zh",
  "phonics-ice",
  "phonics-ow-diphthong",
  "phonics-oy",
  "phonics-strut",
];

/**
 * English graphemes (letters and common combinations) -> phonics assetId.
 * Use for building phonicsSegments in content. Placeholder IDs get a file via download script.
 */
export const GRAPHEME_TO_PHONICS = {
  a: "phonics-short-a",
  e: "phonics-short-e",
  i: "phonics-short-i",
  o: "phonics-long-o",
  u: "phonics-short-u",
  b: "phonics-b",
  c: "phonics-k",
  d: "phonics-d",
  f: "phonics-f",
  g: "phonics-g",
  h: "phonics-h",
  j: "phonics-j",
  k: "phonics-k",
  l: "phonics-l",
  m: "phonics-m",
  n: "phonics-n",
  p: "phonics-p",
  s: "phonics-s",
  t: "phonics-t",
  v: "phonics-v",
  w: "phonics-w",
  z: "phonics-z",
  ch: "phonics-ch",
  sh: "phonics-sh",
  zh: "phonics-zh",
  th: "phonics-th-voiced",
  th_voiced: "phonics-th-voiced",
  th_unvoiced: "phonics-th-unvoiced",
  wh: "phonics-wh",
  ng: "phonics-ng",
  er: "phonics-er",
  ar: "phonics-er",
  or: "phonics-er",
  air: "phonics-air",
  ee: "phonics-long-e",
  ea: "phonics-long-e",
  oo: "phonics-y-oo",
  ow: "phonics-ow-diphthong",
  ie: "phonics-long-i",
  ice: "phonics-ice",
  oy: "phonics-oy",
  strut: "phonics-strut",
};
