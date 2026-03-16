import type { Sentence, SentenceType } from '../types';

export function createGuidancePicker(sentences: Sentence[]) {
  const active = sentences.filter((entry) => entry.active);
  const recentByType = new Map<SentenceType, string[]>();

  return (type: SentenceType): Sentence | undefined => {
    const pool = active.filter((entry) => entry.sentenceType === type);
    if (!pool.length) return undefined;

    const recent = recentByType.get(type) ?? [];
    const options = pool.filter((item) => !recent.includes(item.id));
    const candidates = options.length ? options : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    const nextRecent = [picked.id, ...recent].slice(0, 3);
    recentByType.set(type, nextRecent);
    return picked;
  };
}
