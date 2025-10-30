export function plan(question: string): { subclaims: string[] } {
  const q = question.trim();
  const parts = q
    .replace(/[?]/g,'')
    .split(/ and | & |,|;/i)
    .map(s => s.trim())
    .filter(Boolean);
  const subclaims = parts.length ? parts : [q];
  return { subclaims };
}
