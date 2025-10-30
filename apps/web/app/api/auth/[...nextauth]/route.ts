import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend"; // email magic link via Resend (or any SMTP)
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

const providers = [];
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(GitHub({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    allowDangerousEmailAccountLinking: true
  }));
}
if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
  providers.push(Resend({
    apiKey: process.env.RESEND_API_KEY!,
    from: process.env.EMAIL_FROM!,
  }));
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) (session.user as any).id = user.id;
      return session;
    }
  }
} satisfies NextAuthConfig;

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
