import type { Sentence, SentenceType } from '../types';

export function createGuidancePicker(sentences: Sentence[]) {
  const active = sentences.filter((entry) => entry.active);
  const lastByType = new Map<SentenceType, string>();

  return (type: SentenceType): Sentence | undefined => {
    const pool = active.filter((entry) => entry.sentenceType === type);
    if (!pool.length) return undefined;

    const lastId = lastByType.get(type);
    const filtered = pool.filter((item) => item.id !== lastId);
    const options = filtered.length ? filtered : pool;
    const picked = options[Math.floor(Math.random() * options.length)];
    lastByType.set(type, picked.id);
    return picked;
  };
}
