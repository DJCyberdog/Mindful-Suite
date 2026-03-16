import type { Sentence, SentenceType } from '../types';

export function createGuidancePicker(sentences: Sentence[]) {
  const active = sentences.filter((entry) => entry.active);
<<<<<<< HEAD
  const recentByType = new Map<SentenceType, string[]>();
=======
  const lastByType = new Map<SentenceType, string>();
>>>>>>> main

  return (type: SentenceType): Sentence | undefined => {
    const pool = active.filter((entry) => entry.sentenceType === type);
    if (!pool.length) return undefined;

<<<<<<< HEAD
    const recent = recentByType.get(type) ?? [];
    const options = pool.filter((item) => !recent.includes(item.id));
    const candidates = options.length ? options : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    const nextRecent = [picked.id, ...recent].slice(0, 3);
    recentByType.set(type, nextRecent);
=======
    const lastId = lastByType.get(type);
    const filtered = pool.filter((item) => item.id !== lastId);
    const options = filtered.length ? filtered : pool;
    const picked = options[Math.floor(Math.random() * options.length)];
    lastByType.set(type, picked.id);
>>>>>>> main
    return picked;
  };
}
