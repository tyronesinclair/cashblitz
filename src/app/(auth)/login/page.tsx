"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 casino-bg">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Zap size={20} className="text-background" fill="currentColor" />
          </div>
          <span className="text-2xl font-extrabold">
            <span className="gradient-text">CASH</span>
            <span className="text-foreground">BLITZ</span>
          </span>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
          <h1 className="text-xl font-extrabold text-foreground text-center mb-1">Welcome back!</h1>
          <p className="text-sm text-muted text-center mb-6">Sign in to continue earning</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl mb-4"
            >
              <AlertCircle size={16} className="text-danger flex-shrink-0" />
              <span className="text-sm text-danger">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all press-scale ${
                loading
                  ? "bg-surface-light text-muted cursor-not-allowed"
                  : "bg-primary text-background hover:bg-primary-dark pulse-glow"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-5">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
