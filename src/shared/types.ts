export type ThemeName = 'nachtblau' | 'waldmoos' | 'sandruhe' | 'morgennebel' | 'sternenhimmel';

export interface Preferences {
  theme: ThemeName;
  reducedMotion: boolean;
  preferredVoice?: string;
  voiceVolume: number;
  ambientVolume: number;
  ttsEnabled: boolean;
  lastEntry?: string;
  lastBreathingPattern?: string;
  lastBreathingCycles?: number;
  lastQuickCalmSequence?: string;
}

export type SentenceType =
  | 'welcome'
  | 'transition'
  | 'guidance'
  | 'closing'
  | 'intro'
  | 'preparation'
  | 'inhale_cue'
  | 'hold_cue'
  | 'exhale_cue'
  | 'reassurance'
  | 'close'
  | 'entry'
  | 'start'
  | 'grounding'
  | 'orienting';

export interface Sentence {
  id: string;
  module: string;
  submodule: string;
  sentenceType: SentenceType;
  targetArea: string;
  textDe: string;
  directionEn: string;
  tonality: 'soft_intimate' | 'warm_reassuring' | 'sleepy_gentle' | 'calm_grounding' | 'quiet_focus' | 'poetic_light';
  lengthClass: 'short' | 'medium' | 'long';
  themeTags: Array<'nightblue' | 'forestmoss' | 'sandruhe' | 'morningmist' | 'starlight'>;
  active: boolean;
}

export interface ModuleMeta {
  title: string;
  route: string;
  teaser: string;
}

export interface PortalContent {
  seo: { title: string; description: string };
  hero: { kicker: string; title: string; lede: string; subline: string };
  needs: Array<{ title: string; text: string; route: string }>;
  themes: Array<{ name: string; key: ThemeName; text: string }>;
  storyTeaser: { title: string; text: string; route: string };
  trust: { title: string; text: string; items: string[] };
}

export interface BreathingPattern {
  id: string;
  label: string;
  inhale: number;
  hold: number;
  exhale: number;
  cyclesDefault: number;
  description: string;
}

export interface BreathingDefaults {
  defaultPatternId: string;
  defaultCycles: number;
}

export interface BreathingMeta {
  title: string;
  description: string;
  sessionLabel: string;
}


export interface QuickCalmStep {
  id: string;
  label: string;
  durationSec: number;
  sentenceType: SentenceType;
}

export interface QuickCalmSequence {
  id: string;
  label: string;
  totalSeconds: number;
  steps: QuickCalmStep[];
}

export interface QuickCalmDefaults {
  defaultSequenceId: string;
}

export interface QuickCalmMeta {
  title: string;
  description: string;
  kicker: string;
  primaryAction: string;
}
