/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    balance?: number;
    streak?: number;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      balance: number;
      streak: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    balance: number;
    streak: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
    balance: number;
    streak: number;
  }
}

declare module "@auth/core/types" {
  interface User {
    id?: string;
    role?: string;
    balance?: number;
    streak?: number;
  }
}
