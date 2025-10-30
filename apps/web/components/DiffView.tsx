export default function DiffView({ diff }: { diff: { added?: boolean; removed?: boolean; value: string }[] }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Policy Diff</h3>
      <div className="leading-8">
        {diff.map((p, i)=>(
          <span key={i} className={
            p.added ? 'bg-green-200' : p.removed ? 'bg-red-200 line-through' : ''
          }>{p.value}</span>
        ))}
      </div>
    </div>
  );
}
