import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;
        if (user.isBanned) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, set the user ID
      if (user) {
        token.id = user.id as string;
      }

      // Always refresh balance, role, and streak from the database
      // This ensures the session always has the latest values
      const userId = token.id as string;
      if (userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true, balance: true, streak: true, isBanned: true },
        });
        if (dbUser) {
          if (dbUser.isBanned) {
            return null;
          }
          token.role = dbUser.role;
          token.balance = dbUser.balance;
          token.streak = dbUser.streak;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "user";
        session.user.balance = (token.balance as number) || 0;
        session.user.streak = (token.streak as number) || 0;
      }
      return session;
    },
  },
});

// Helper: check if current user is admin
export async function isAdmin() {
  const session = await auth();
  return session?.user && session.user.role === "admin";
}

// Helper: get current authenticated user ID
export async function getAuthUserId() {
  const session = await auth();
  return session?.user?.id || null;
}
