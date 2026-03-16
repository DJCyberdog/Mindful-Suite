import type { Preferences, ThemeName } from './types';

const KEY = 'mindful-suite.preferences.v1';

const defaults: Preferences = {
  theme: 'nachtblau',
  reducedMotion: false,
  voiceVolume: 0.85,
<<<<<<< HEAD
  ambientVolume: 0.35,
  ttsEnabled: true,
  soundscapeEnabled: false,
  selectedSoundscape: 'none'
=======
  ambientVolume: 0.35
>>>>>>> main
};

export function getPreferences(): Preferences {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function savePreferences(patch: Partial<Preferences>) {
  const merged = { ...getPreferences(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function applyMotionPreference(reducedMotion: boolean) {
  document.documentElement.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
}
