'use client';
import { useState } from 'react';
import AnswerCard from '../components/AnswerCard';
import DiffView from '../components/DiffView';
import EvidenceButton from '../components/EvidenceButton';
import WatcherPanel from '../components/WatcherPanel';

export default function Home() {
  const [claim, setClaim] = useState('Does Okta still retain deleted user data for 30 days?');
  const [vendor, setVendor] = useState('okta.com');
  const [internal, setInternal] = useState('Our control states vendor must delete user data within 30 days of account deletion.');
  const [resp, setResp] = useState<any>(null);

  async function submit() {
    const r = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ claim, vendorDomain: vendor, internalText: internal })
    });
    const j = await r.json();
    setResp(j);
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Prism — Evidence & Drift Guard</h1>
      <div className="grid gap-3">
        <input className="border p-3 rounded" value={claim} onChange={e=>setClaim(e.target.value)} />
        <input className="border p-3 rounded" value={vendor} onChange={e=>setVendor(e.target.value)} />
        <textarea className="border p-3 rounded" rows={3} value={internal} onChange={e=>setInternal(e.target.value)} />
        <button onClick={submit} className="bg-black text-white px-4 py-2 rounded w-fit">Verify</button>
      </div>

      {resp && (
        <>
          <AnswerCard data={resp} />
          <DiffView diff={resp.diff} />
          <div className="flex gap-2">
            <EvidenceButton resultId={resp.resultId} />
            <WatcherPanel vendor={vendor} topic={'data retention'} />
          </div>
        </>
      )}
    </main>
  );
}
