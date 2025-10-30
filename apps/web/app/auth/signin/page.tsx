import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="border rounded p-8 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Sign in to Prism</h1>
        {process.env.NEXT_PUBLIC_HAS_GITHUB === "true" && (
          <button
            onClick={() => signIn("github")}
            className="w-full bg-black text-white px-4 py-2 rounded"
          >
            Continue with GitHub
          </button>
        )}
        {process.env.NEXT_PUBLIC_HAS_EMAIL === "true" && (
          <form
            className="space-y-3"
            onSubmit={async (e: any) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get("email") as string;
              await signIn("resend", { email, callbackUrl: "/" });
            }}
          >
            <input name="email" type="email" required placeholder="you@company.com" className="border p-3 w-full rounded"/>
            <button className="w-full border px-4 py-2 rounded">Send magic link</button>
          </form>
        )}
        {!process.env.NEXT_PUBLIC_HAS_GITHUB && !process.env.NEXT_PUBLIC_HAS_EMAIL && (
          <p className="text-sm text-gray-500">No providers configured. Set GitHub or Resend in env.</p>
        )}
      </div>
    </main>
  );
}
