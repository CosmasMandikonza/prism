export default function EvidenceButton({ resultId }: { resultId: string }) {
  return (
    <button
      onClick={async ()=>{
        const r = await fetch('/api/evidence', { method: 'POST', body: JSON.stringify({ resultId })});
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `prism-evidence-${resultId}.pdf`; a.click();
      }}
      className="border px-3 py-2 rounded"
    >
      Export Evidence Pack (PDF)
    </button>
  );
}
