import { createDiff } from '../../apps/web/lib/diff';

export function present(internalText: string, externalText: string) {
  const diff = createDiff(internalText, externalText);
  return { diff };
}
