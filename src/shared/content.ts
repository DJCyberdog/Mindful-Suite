import type { Sentence } from './types';

export interface ModuleMeta {
  title: string;
  route: string;
  teaser: string;
}

export async function loadModuleList() {
  const response = await fetch('/content/modules/modules.json');
  return (await response.json()) as ModuleMeta[];
}

export async function loadSentences(module: string) {
  const response = await fetch(`/content/sentences/${module}.json`);
  if (!response.ok) return [] as Sentence[];
  return (await response.json()) as Sentence[];
}
