export default function AnswerCard({ data }: { data: any }) {
  return (
    <div className="border rounded p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Answer</h2>
        <span className="text-sm px-2 py-1 rounded bg-gray-100">Confidence: {data.confidence}</span>
      </div>
      <p>{data.answer}</p>
      <div className="text-sm text-gray-600">
        <div>Decision: <b>{data.decision}</b></div>
        <div className="mt-2">Sources:</div>
        <ul className="list-disc pl-5">
          {data.sources.map((s: any, i: number)=>(
            <li key={i}><a className="underline" href={s.url} target="_blank">{s.title || s.url}</a> (Trust {s.trustScore})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
