export type ThemeName = 'nachtblau' | 'waldmoos' | 'sandruhe' | 'morgennebel' | 'sternenhimmel';

export interface Preferences {
  theme: ThemeName;
  reducedMotion: boolean;
  preferredVoice?: string;
  voiceVolume: number;
  ambientVolume: number;
  lastEntry?: string;
}

export interface Sentence {
  id: string;
  module: string;
  submodule: string;
  sentenceType: 'welcome' | 'transition' | 'guidance' | 'closing';
  targetArea: string;
  textDe: string;
  directionEn: string;
  tonality: 'soft_intimate' | 'warm_reassuring' | 'sleepy_gentle' | 'calm_grounding' | 'quiet_focus' | 'poetic_light';
  lengthClass: 'short' | 'medium' | 'long';
  themeTags: Array<'nightblue' | 'forestmoss' | 'sandruhe' | 'morningmist' | 'starlight'>;
  active: boolean;
}
