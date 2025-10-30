import "./styles.css";
import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "./api/auth/[...nextauth]/route";

export const metadata = { title: "Prism", description: "Evidence & Drift Guard" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="grid grid-cols-[260px_1fr] min-h-screen">
          <aside className="border-r p-4 space-y-4">
            <div className="text-xl font-bold">Prism</div>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="hover:underline">Verify</Link>
              <Link href="/watchers" className="hover:underline">Watchers</Link>
              <Link href="/logs" className="hover:underline">Logs</Link>
              <Link href="/settings" className="hover:underline">Settings</Link>
            </nav>
            <div className="text-xs text-gray-500 mt-6">
              {session?.user ? `Signed in as ${session.user.email ?? session.user.name ?? 'user'}` : 'Not signed in'}
            </div>
          </aside>
          <section className="p-6">
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
