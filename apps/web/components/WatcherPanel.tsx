"use client";
import { useState, useEffect } from "react";

export default function WatcherPanel({ vendor, topic }: { vendor: string; topic: string }) {
  const [list, setList] = useState<any[]>([]);

  async function load() {
    const r = await fetch("/api/watchers");
    if (r.ok) setList(await r.json());
  }
  useEffect(()=>{ load(); },[]);

  async function add() {
    const r = await fetch("/api/watchers", {
      method: "POST",
      body: JSON.stringify({ vendor, topic })
    });
    if (r.ok) { await load(); alert("Watcher created"); }
  }

  return (
    <div className="border rounded p-3">
      <div className="font-semibold mb-2">Watchers</div>
      <button onClick={add} className="border px-2 py-1 rounded">Add Watcher for {vendor} / {topic}</button>
      <ul className="mt-3 space-y-2">
        {list.map((w)=>(
          <li key={w.id} className="text-sm flex justify-between border p-2 rounded">
            <span>{w.vendor} — {w.topic}</span>
            <span className="text-gray-500">{w.lastRun ? new Date(w.lastRun).toLocaleString() : "never"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

