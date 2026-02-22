"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Shield, DollarSign, Gamepad2, Star, TrendingUp, Users, ChevronRight, Check } from "lucide-react";

const stats = [
  { label: "Total Paid Out", value: "$2.4M+", icon: DollarSign },
  { label: "Active Users", value: "150K+", icon: Users },
  { label: "Available Offers", value: "200+", icon: Gamepad2 },
  { label: "Avg. Rating", value: "4.8/5", icon: Star },
];

const steps = [
  { num: 1, title: "Sign Up Free", desc: "Create your account in seconds. No credit card required.", icon: "🚀" },
  { num: 2, title: "Play Games & Complete Tasks", desc: "Choose from hundreds of games, surveys, and tasks.", icon: "🎮" },
  { num: 3, title: "Earn Real Cash", desc: "Complete milestones and watch your balance grow.", icon: "💰" },
  { num: 4, title: "Cash Out Instantly", desc: "Withdraw via PayPal, gift cards, or crypto.", icon: "🏦" },
];

const testimonials = [
  { name: "Sarah K.", amount: "$347", quote: "Made this in my first month just playing games on my commute!", avatar: "S" },
  { name: "Mike R.", amount: "$1,200", quote: "Best side hustle ever. The game offers pay really well.", avatar: "M" },
  { name: "Jess T.", amount: "$89", quote: "Got my first payout in 2 days. PayPal instant withdrawal!", avatar: "J" },
];

const payoutMethods = ["PayPal", "Visa", "Amazon", "Bitcoin", "Apple", "Steam"];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background overflow-x-hidden">
      {/* ══════ Navbar ══════ */}
      <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Zap size={16} className="text-background" fill="currentColor" />
            </div>
            <span className="text-lg font-extrabold">
              <span className="gradient-text">CASH</span>
              <span className="text-foreground">BLITZ</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 sm:px-5 py-2 bg-primary hover:bg-primary-dark text-background text-sm font-bold rounded-xl transition-colors press-scale"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════ Hero Section ══════ */}
      <section className="relative casino-bg overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 text-6xl opacity-10 float-anim">🎰</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 float-anim" style={{ animationDelay: "1s" }}>💰</div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                  <span className="text-xs font-bold text-primary">🔥 #1 Rewards Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-5">
                  Get Paid to{" "}
                  <span className="gradient-text">Play Games</span>
                  <br />
                  & Complete Tasks
                </h1>

                <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-lg">
                  Earn real cash by playing your favorite mobile games, taking surveys, and completing simple tasks. Instant payouts. No catches.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-background font-bold text-base rounded-2xl transition-all pulse-glow press-scale"
                  >
                    Start Earning Free
                    <ChevronRight size={18} />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-surface-light border border-border text-foreground font-semibold text-base rounded-2xl hover:bg-border transition-colors press-scale"
                  >
                    I Have an Account
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-4 text-muted text-xs">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-primary" />
                    <span>Secure & Trusted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check size={14} className="text-primary" />
                    <span>Free to Join</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={14} className="text-primary" />
                    <span>Instant Payouts</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Preview card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-surface rounded-3xl border border-border p-5 shadow-2xl shadow-primary/5 max-w-sm mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">💰</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Your Balance</p>
                    <p className="text-lg font-extrabold text-foreground">CAD 347.82</p>
                  </div>
                </div>
                {/* Mini offer cards */}
                {[
                  { name: "Monopoly GO!", reward: 620, img: "🎲" },
                  { name: "Solitaire Cash", reward: 1186, img: "🃏" },
                  { name: "Coin Master", reward: 156, img: "🪙" },
                ].map((offer, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl mb-2 border border-border">
                    <span className="text-2xl">{offer.img}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{offer.name}</p>
                      <p className="text-[10px] text-primary font-semibold">CAD {offer.reward.toFixed(2)}</p>
                    </div>
                    <div className="bg-primary/15 text-primary text-[10px] font-bold px-2 py-1 rounded-lg">
                      Earn
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ Stats bar ══════ */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon size={20} className="text-primary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ How it works ══════ */}
      <section className="py-16 sm:py-20 casino-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted max-w-md mx-auto">
              Four simple steps to start earning real cash
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface rounded-2xl p-5 border border-border text-center card-hover"
              >
                <span className="text-4xl mb-3 block">{step.icon}</span>
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-bold text-primary">{step.num}</span>
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Testimonials ══════ */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Real People, Real Earnings
            </h2>
            <p className="text-muted">Join thousands earning every day</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-5 border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <span className="text-sm font-bold text-background">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-primary font-semibold">Earned {t.amount}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex mt-3 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="text-accent-2 fill-accent-2" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Payout methods ══════ */}
      <section className="py-16 sm:py-20 casino-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Cash Out Your Way
          </h2>
          <p className="text-muted mb-10">Instant withdrawals with zero fees</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {payoutMethods.map((method) => (
              <div
                key={method}
                className="bg-surface border border-border rounded-xl px-6 py-3 text-sm font-semibold text-foreground"
              >
                {method}
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary-dark text-background font-bold text-lg rounded-2xl transition-all pulse-glow press-scale"
          >
            <TrendingUp size={20} />
            Start Earning Now — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ══════ Footer ══════ */}
      <footer className="bg-surface border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <Zap size={13} className="text-background" fill="currentColor" />
              </div>
              <span className="text-sm font-extrabold">
                <span className="gradient-text">CASH</span>
                <span className="text-foreground">BLITZ</span>
              </span>
            </div>
            <p className="text-xs text-muted">&copy; 2026 CashBlitz. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-muted">
              <span className="hover:text-foreground cursor-pointer">Privacy</span>
              <span className="hover:text-foreground cursor-pointer">Terms</span>
              <span className="hover:text-foreground cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
