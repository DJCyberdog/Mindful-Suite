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
  lastSheepFlow?: string;
  lastPmrSession?: string;
  lastBodyScanSession?: string;
  selectedSoundscape?: string;
  soundscapeEnabled: boolean;
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
  | 'orienting'
  | 'count_anchor'
  | 'sleepy_transition'
  | 'drift_prompt'
  | 'tense'
  | 'hold'
  | 'release'
  | 'notice'
  | 'outro'
  | 'aftercare'
  | 'arrival'
  | 'settling'
  | 'awareness'
  | 'drifting_close';

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
  storyTeaser: { title: string; text: string; route: string; highlights?: string[]; featuredStorySlugs?: string[] };
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

export interface SheepFlow {
  id: string;
  label: string;
  targetCount: number;
  cadenceMs: number;
  ttsEvery: number;
}

export interface SheepDefaults {
  defaultFlowId: string;
}

export interface SheepMeta {
  title: string;
  description: string;
  kicker: string;
  primaryAction: string;
}

export interface PmrZone {
  id: string;
  label: string;
  targetArea: string;
}

export interface PmrSessionTiming {
  tenseSec: number;
  holdSec: number;
  releaseSec: number;
  noticeSec: number;
  transitionSec: number;
}

export interface PmrSession {
  id: string;
  label: string;
  zoneOrder: string[];
  timing: PmrSessionTiming;
}

export interface PmrDefaults {
  defaultSessionId: string;
}

export interface PmrMeta {
  title: string;
  description: string;
  kicker: string;
  primaryAction: string;
}

export interface BodyScanRegion {
  id: string;
  label: string;
  targetArea: string;
}

export interface BodyScanSessionTiming {
  arrivalSec: number;
  settlingSec: number;
  awarenessSec: number;
  transitionSec: number;
}

export interface BodyScanSession {
  id: string;
  label: string;
  regionOrder: string[];
  timing: BodyScanSessionTiming;
}

export interface BodyScanDefaults {
  defaultSessionId: string;
}

export interface BodyScanMeta {
  title: string;
  description: string;
  kicker: string;
  primaryAction: string;
}


export interface StoryCategory {
  id: string;
  name: string;
  description: string;
}

export interface StorySummary {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  world: string;
  kicker: string;
  teaser: string;
  durationMin: number;
  tone: string;
  themeHints: ThemeName[];
}

export interface StorySegment {
  id: string;
  role: 'intro' | 'flow' | 'settling' | 'close' | 'outro';
  text: string;
}

export interface StoryWorld {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  entryTitle: string;
  entryDescription: string;
  endingNote: string;
  segments: StorySegment[];
}

export interface StoryHubMeta {
  seo: { title: string; description: string };
  kicker: string;
  title: string;
  intro: string;
  categoryIntro: string;
  primaryAction: string;
  secondaryAction: string;
}

export interface SoundscapeDefinition {
  id: string;
  label: string;
  type: 'none' | 'noise';
  color?: 'white' | 'pink' | 'brown';
  lowpassHz?: number;
  gain?: number;
}
