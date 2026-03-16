import type {
  BodyScanDefaults,
  BodyScanMeta,
  BodyScanRegion,
  BodyScanSession,
  BreathingDefaults,
  BreathingMeta,
  BreathingPattern,
  ModuleMeta,
  PmrDefaults,
  PmrMeta,
  PmrSession,
  PmrZone,
  PortalContent,
  QuickCalmDefaults,
  QuickCalmMeta,
  QuickCalmSequence,
  Sentence,
  SheepDefaults,
  SheepFlow,
  SheepMeta,
  SoundscapeDefinition
} from './types';

export async function loadModuleList() {
  const response = await fetch('/content/modules/modules.json');
  return (await response.json()) as ModuleMeta[];
}

export async function loadSentences(module: string) {
  const response = await fetch(`/content/sentences/${module}.json`);
  if (!response.ok) return [] as Sentence[];
  return (await response.json()) as Sentence[];
}

export async function loadPortalContent() {
  const response = await fetch('/content/portal-home.json');
  return (await response.json()) as PortalContent;
}

export async function loadLegalContent(slug: string) {
  const response = await fetch('/content/legal-pages.json');
  const all = (await response.json()) as Record<string, {
    title: string;
    description: string;
    intro: string;
    items: string[];
  }>;
  return all[slug];
}

export async function loadBreathingPatterns() {
  const response = await fetch('/content/breathing/patterns.json');
  return (await response.json()) as BreathingPattern[];
}

export async function loadBreathingDefaults() {
  const response = await fetch('/content/breathing/defaults.json');
  return (await response.json()) as BreathingDefaults;
}

export async function loadBreathingMeta() {
  const response = await fetch('/content/breathing/meta.json');
  return (await response.json()) as BreathingMeta;
}

export async function loadQuickCalmMeta() {
  const response = await fetch('/content/quick-calm/meta.json');
  return (await response.json()) as QuickCalmMeta;
}

export async function loadQuickCalmDefaults() {
  const response = await fetch('/content/quick-calm/defaults.json');
  return (await response.json()) as QuickCalmDefaults;
}

export async function loadQuickCalmSequences() {
  const response = await fetch('/content/quick-calm/sequences.json');
  return (await response.json()) as QuickCalmSequence[];
}

export async function loadSheepMeta() {
  const response = await fetch('/content/schaefchen/meta.json');
  return (await response.json()) as SheepMeta;
}

export async function loadSheepDefaults() {
  const response = await fetch('/content/schaefchen/defaults.json');
  return (await response.json()) as SheepDefaults;
}

export async function loadSheepFlows() {
  const response = await fetch('/content/schaefchen/flows.json');
  return (await response.json()) as SheepFlow[];
}

export async function loadPmrMeta() {
  const response = await fetch('/content/pmr/meta.json');
  return (await response.json()) as PmrMeta;
}

export async function loadPmrDefaults() {
  const response = await fetch('/content/pmr/defaults.json');
  return (await response.json()) as PmrDefaults;
}

export async function loadPmrZones() {
  const response = await fetch('/content/pmr/zones.json');
  return (await response.json()) as PmrZone[];
}

export async function loadPmrSessions() {
  const response = await fetch('/content/pmr/sessions.json');
  return (await response.json()) as PmrSession[];
}

export async function loadBodyScanMeta() {
  const response = await fetch('/content/bodyscan/meta.json');
  return (await response.json()) as BodyScanMeta;
}

export async function loadBodyScanDefaults() {
  const response = await fetch('/content/bodyscan/defaults.json');
  return (await response.json()) as BodyScanDefaults;
}

export async function loadBodyScanRegions() {
  const response = await fetch('/content/bodyscan/regions.json');
  return (await response.json()) as BodyScanRegion[];
}

export async function loadBodyScanSessions() {
  const response = await fetch('/content/bodyscan/sessions.json');
  return (await response.json()) as BodyScanSession[];
}


export async function loadSoundscapes() {
  const response = await fetch('/content/soundscapes.json');
  return (await response.json()) as SoundscapeDefinition[];
}
