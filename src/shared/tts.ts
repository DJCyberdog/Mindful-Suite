import { getPreferences, savePreferences } from './preferences';

export interface VoiceOption {
  name: string;
  lang: string;
}

function getVoices() {
  return window.speechSynthesis.getVoices();
}

export function discoverVoices(): VoiceOption[] {
  return getVoices().map((v) => ({ name: v.name, lang: v.lang }));
}

export function pickGermanVoice() {
  const prefs = getPreferences();
  const voices = getVoices();

  const preferred = prefs.preferredVoice && voices.find((voice) => voice.name === prefs.preferredVoice);
  if (preferred) return preferred;

  return voices.find((voice) => voice.lang.toLowerCase().startsWith('de')) ?? voices[0];
}

export function speak(text: string) {
  const prefs = getPreferences();
  if (!prefs.ttsEnabled) return;
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickGermanVoice();
  utterance.voice = voice ?? null;
  utterance.rate = 0.96;
  utterance.pitch = 0.98;
  utterance.volume = prefs.voiceVolume;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function savePreferredVoice(name: string) {
  savePreferences({ preferredVoice: name });
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
