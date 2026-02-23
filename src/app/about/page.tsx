"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap, Shield, Users, Globe, Heart, TrendingUp, Award,
  ArrowRight, Star, Clock, Target, ChevronRight, Gift,
  Smartphone, Monitor, Lock, MessageCircle, Menu, X, CheckCircle
} from "lucide-react";
import { useState } from "react";

const milestones = [
  { year: "2024", event: "CashBlitz founded", detail: "Started with a mission to make earning rewards fun and accessible." },
  { year: "2024", event: "10K users milestone", detail: "Reached 10,000 active users within our first 3 months." },
  { year: "2025", event: "C$1M paid out", detail: "Crossed C$1 million in total payouts to our community." },
  { year: "2025", event: "100K users", detail: "Community grew to over 100,000 Canadian users from coast to coast." },
  { year: "2026", event: "C$2.4M paid out", detail: "Total payouts exceeded C$2.4 million with 150K+ active Canadian users." },
  { year: "2026", event: "200+ offers", detail: "Partnered with 200+ advertisers to bring the best earning opportunities." },
];

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "We're upfront about how we make money and how you earn. No hidden fees, no scams, no surprises." },
  { icon: Heart, title: "Community First", desc: "Every decision we make starts with our users. Your feedback shapes our platform." },
  { icon: Award, title: "Fair Rewards", desc: "We negotiate the best payouts from advertisers and pass the maximum value to you." },
  { icon: Lock, title: "Privacy & Security", desc: "Your data is encrypted and never sold. We use bank-level security to protect your information." },
  { icon: Globe, title: "Coast to Coast", desc: "Available to Canadians from Victoria to St. John's. Every province, every territory." },
  { icon: Target, title: "Quality Offers", desc: "We vet every offer on our platform. If it's not worth your time, it doesn't make the cut." },
];

const teamStats = [
  { label: "Team Members", value: "35+", icon: Users },
  { label: "Provinces & Territories", value: "13", icon: Globe },
  { label: "Uptime", value: "99.9%", icon: Clock },
  { label: "Support Response", value: "<2hrs", icon: MessageCircle },
];

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background overflow-x-hidden">
      {/* ══════ Navbar ══════ */}
      <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Zap size={17} className="text-background" fill="currentColor" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="gradient-text">CASH</span>
              <span className="text-foreground">BLITZ</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/#offers" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Offers</Link>
            <Link href="/#payouts" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Payouts</Link>
            <Link href="/#faq" className="text-sm font-medium text-muted hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/about" className="text-sm font-medium text-primary transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors">Log In</Link>
            <Link href="/signup" className="px-4 sm:px-5 py-2 bg-primary hover:bg-primary-dark text-background text-sm font-bold rounded-xl transition-colors press-scale">Sign Up Free</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-muted">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-4 py-4 space-y-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted">Home</Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted">How It Works</Link>
            <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted">FAQ</Link>
            <div className="border-t border-border pt-3">
              <Link href="/login" className="block text-sm font-semibold text-primary mb-2">Log In</Link>
              <Link href="/signup" className="block text-center py-2.5 bg-primary text-background font-bold text-sm rounded-xl">Sign Up Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══════ Hero ══════ */}
      <section className="relative casino-bg overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Heart size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-5">
              Making Earning <span className="gradient-text">Fun & Fair</span>
              <br className="hidden sm:block" /> For Everyone
            </h1>
            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-8">
              Based in Canada and built specifically for Canadians, CashBlitz was built on a simple idea: everyone should be able to earn extra income doing things they enjoy.
              We connect people with brands who want real engagement — and we make sure you get paid fairly for it.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span><span className="text-foreground font-bold">150K+</span> Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                <span><span className="text-foreground font-bold">C$2.4M+</span> Paid Out</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                <span><span className="text-foreground font-bold">13</span> Provinces &amp; Territories</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ Team Stats ══════ */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teamStats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <stat.icon size={22} className="text-primary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Our Mission ══════ */}
      <section className="py-16 sm:py-20 lg:py-24 casino-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-5">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                We believe that everyone deserves access to fair earning opportunities. Whether you&apos;re a student looking for pocket money,
                a parent earning during your free time, or anyone who wants to make the most of their screen time — CashBlitz is for you.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                We partner with game developers and brands who want real user engagement. When you play a game or complete a task,
                the advertiser pays us — and we pass the majority of that revenue directly to you. It&apos;s that simple.
              </p>
              <div className="space-y-3">
                {[
                  "No hidden fees or catches — ever",
                  "Maximum payouts from advertisers passed to users",
                  "Instant withdrawals with multiple payment options",
                  "Transparent tracking of your earnings in real-time",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-4">How We Make Money</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Brands pay us", desc: "Game developers and advertisers pay CashBlitz to connect with real users." },
                    { step: "2", title: "You earn rewards", desc: "You complete offers and earn a share of what the advertiser pays us." },
                    { step: "3", title: "We keep a small margin", desc: "We take a small percentage to keep the platform running and improving." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{item.step}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ Our Values ══════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                What We Stand For
              </h2>
              <p className="text-muted max-w-md mx-auto">Our core values guide everything we do.</p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-background rounded-2xl p-5 border border-border card-hover">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <value.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{value.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Timeline ══════ */}
      <section className="py-16 sm:py-20 lg:py-24 casino-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
                Our <span className="gradient-text-gold">Journey</span>
              </h2>
              <p className="text-muted">From idea to 150K+ users and counting.</p>
            </motion.div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-4 mb-8 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} sm:text-${i % 2 === 0 ? "right" : "left"}`}
              >
                {/* Desktop: alternating sides */}
                <div className={`hidden sm:block flex-1 ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <span className="text-xs font-bold text-primary">{m.year}</span>
                  <h3 className="font-bold text-foreground text-sm mt-0.5">{m.event}</h3>
                  <p className="text-xs text-muted mt-1">{m.detail}</p>
                </div>
                <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border-2 border-primary z-10 flex-shrink-0 absolute left-1/2 -translate-x-1/2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div className="hidden sm:block flex-1" />

                {/* Mobile: all left-aligned */}
                <div className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border-2 border-primary z-10 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div className="sm:hidden flex-1">
                  <span className="text-xs font-bold text-primary">{m.year}</span>
                  <h3 className="font-bold text-foreground text-sm mt-0.5">{m.event}</h3>
                  <p className="text-xs text-muted mt-1">{m.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Join the <span className="gradient-text">CashBlitz</span> Community
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-lg mx-auto mb-8">
              Be part of 150,000+ Canadians earning real cash every day. Your time is worth more than you think.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary hover:bg-primary-dark text-background font-bold text-lg rounded-2xl transition-all pulse-glow press-scale">
                <TrendingUp size={22} />
                Start Earning Free
              </Link>
              <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-light border border-border text-foreground font-semibold rounded-2xl hover:bg-border transition-colors press-scale">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ Footer ══════ */}
      <footer className="bg-background border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <Zap size={13} className="text-background" fill="currentColor" />
              </div>
              <span className="text-sm font-extrabold">
                <span className="gradient-text">CASH</span><span className="text-foreground">BLITZ</span>
              </span>
            </Link>
            <p className="text-xs text-muted">&copy; 2026 CashBlitz. All rights reserved. Operated in Canada.</p>
            <div className="flex gap-4 text-xs text-muted">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
