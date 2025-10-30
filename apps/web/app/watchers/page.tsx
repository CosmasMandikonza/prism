"use client";
import { useEffect, useState } from "react";

export default function WatchersPage() {
  const [list, setList] = useState<any[]>([]);
  const [vendor, setVendor] = useState("");
  const [topic, setTopic] = useState("");

  async function load() {
    const r = await fetch("/api/watchers");
    if (r.ok) setList(await r.json());
  }
  useEffect(()=>{ load(); },[]);

  async function create() {
    if (!vendor || !topic) return;
    const r = await fetch("/api/watchers", { method: "POST", body: JSON.stringify({ vendor, topic }) });
    if (r.ok) { setVendor(""); setTopic(""); await load(); }
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Watchers</h1>
      <div className="flex gap-2">
        <input placeholder="vendor domain (okta.com)" className="border p-2 rounded" value={vendor} onChange={e=>setVendor(e.target.value)} />
        <input placeholder="topic (data retention)" className="border p-2 rounded" value={topic} onChange={e=>setTopic(e.target.value)} />
        <button className="border px-3 rounded" onClick={create}>Add</button>
      </div>
      <ul className="space-y-2">
        {list.map(w=>(
          <li key={w.id} className="border rounded p-3 flex justify-between">
            <span>{w.vendor} — {w.topic}</span>
            <span className="text-gray-500">{w.lastRun ? new Date(w.lastRun).toLocaleString() : "never"}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

