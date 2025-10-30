import { prisma } from "@/app/lib/prisma";

export default async function LogsPage() {
  const calls = await prisma.apiCall.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  const traces = await prisma.trace.findMany({ take: 10, orderBy: { createdAt: "desc" } });

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Logs</h1>

      <section>
        <h2 className="font-semibold mb-2">API Calls (last 50)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Endpoint</th>
                <th className="p-2 text-left">Query</th>
                <th className="p-2 text-left">ReqID</th>
                <th className="p-2 text-left">Latency</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(c=>(
                <tr key={c.id} className="border-t">
                  <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="p-2">{c.endpoint}</td>
                  <td className="p-2">{c.query}</td>
                  <td className="p-2">{c.requestId || "—"}</td>
                  <td className="p-2">{c.latencyMs ? `${c.latencyMs} ms` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Traces (last 10)</h2>
        <div className="space-y-3">
          {traces.map(t=>(
            <details key={t.id} className="border rounded p-3">
              <summary className="cursor-pointer text-sm">Trace {t.id} — {new Date(t.createdAt).toLocaleString()}</summary>
              <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(t.steps, null, 2)}</pre>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
