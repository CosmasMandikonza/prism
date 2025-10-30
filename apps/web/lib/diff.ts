import { diffWords } from 'diff';

export function createDiff(a: string, b: string) {
  const parts = diffWords(a, b);
  return parts.map(p => ({ added: !!p.added, removed: !!p.removed, value: p.value }));
}
