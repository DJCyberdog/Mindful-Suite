import type { ModuleMeta, PortalContent, Sentence } from './types';

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
