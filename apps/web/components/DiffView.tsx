export default function DiffView({ diff }: { diff: { added?: boolean; removed?: boolean; value: string }[] }) {
  if (!diff?.length) return null;
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Policy Diff</h3>
      <div className="leading-8">
        {diff.map((p, i)=>(
          <span key={i} className={
            p.added ? 'bg-green-200 text-green-900 dark:bg-green-800/40 dark:text-green-200' :
            p.removed ? 'bg-red-200 line-through text-red-900 dark:bg-red-800/40 dark:text-red-200' : ''
          }>{p.value}</span>
        ))}
      </div>
    </div>
  );
}
