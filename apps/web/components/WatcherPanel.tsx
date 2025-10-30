export default function WatcherPanel({ vendor, topic }: { vendor: string; topic: string }) {
  async function add() {
    await fetch('/api/watchers', { method: 'POST', body: JSON.stringify({ vendor, topic })});
    alert('Watcher created — you can simulate cron or re-run later!');
  }
  return <button onClick={add} className="border px-3 py-2 rounded">Add Watcher</button>;
}
