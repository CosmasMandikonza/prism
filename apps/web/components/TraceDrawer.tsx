"use client";
import { useState } from "react";

export default function TraceDrawer({ steps }: { steps: any[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setOpen(true)} className="border px-3 py-2 rounded">View Trace</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex">
          <div className="ml-auto w-[520px] h-full bg-white dark:bg-neutral-900 p-4 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Agent Trace</h3>
              <button onClick={()=>setOpen(false)} className="text-sm underline">Close</button>
            </div>
            <div className="mt-3 space-y-3">
              {steps?.map((s, i)=>(
                <div key={i} className="border rounded p-3">
                  <div className="text-sm font-medium">{s.step}</div>
                  <pre className="text-xs whitespace-pre-wrap mt-2">
                    {JSON.stringify(s, null, 2)}
                  </pre>
                </div>
              )) ?? <p className="text-sm text-gray-500">No steps recorded.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
