"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Zap, Shield, DollarSign, Gamepad2, Star, TrendingUp, Users,
  ChevronRight, Check, ChevronDown, Gift, Flame, CreditCard,
  Smartphone, Monitor, Lock, Award, Clock, ArrowRight, Menu, X,
  Globe, Heart, HelpCircle, MessageCircle, Sparkles, Target
} from "lucide-react";

/* ═══════════════════ DATA ═══════════════════ */

const stats = [
  { label: "Total Paid Out", value: "C$2.4M+", icon: DollarSign, color: "text-primary" },
  { label: "Canadian Users", value: "150K+", icon: Users, color: "text-cyan-400" },
  { label: "Available Offers", value: "200+", icon: Gamepad2, color: "text-accent-2" },
  { label: "Avg. Rating", value: "4.8★", icon: Star, color: "text-accent" },
];

const steps = [
  { num: 1, title: "Create Your Free Account", desc: "Sign up in seconds. No credit card, no strings attached.", icon: "🚀", color: "from-primary to-emerald-400" },
  { num: 2, title: "Browse & Pick Offers", desc: "Choose from games, surveys, and tasks that match your vibe.", icon: "🎯", color: "from-cyan-400 to-blue-500" },
  { num: 3, title: "Complete & Earn Cash", desc: "Hit milestones and watch your balance grow in real time.", icon: "💰", color: "from-accent-2 to-orange-500" },
  { num: 4, title: "Withdraw Instantly", desc: "Cash out via Interac e-Transfer, PayPal, crypto, or gift cards — zero fees.", icon: "🏦", color: "from-accent to-purple-500" },
];

const testimonials = [
  { name: "Sarah K.", location: "Toronto, ON", amount: "C$347", timeframe: "1st month", quote: "Made this in my first month just playing games on my commute! The payouts are legit and super fast.", avatar: "S", rating: 5 },
  { name: "Marcus D.", location: "Vancouver, BC", amount: "C$1,200", timeframe: "3 months", quote: "Best side hustle I've found. The game offers pay really well and I can do it while watching TV.", avatar: "M", rating: 5 },
  { name: "Jess T.", location: "Montreal, QC", amount: "C$89", timeframe: "1 week", quote: "Got my first PayPal payout in just 2 days. Now I'm hooked — earning every day.", avatar: "J", rating: 5 },
  { name: "Alex W.", location: "Calgary, AB", amount: "C$560", timeframe: "2 months", quote: "I was skeptical at first but the earnings are real. Withdrawn to Bitcoin multiple times.", avatar: "A", rating: 5 },
  { name: "Priya S.", location: "Mississauga, ON", amount: "C$215", timeframe: "6 weeks", quote: "Love that I can earn while commuting. The surveys are quick and the game offers are fun.", avatar: "P", rating: 4 },
  { name: "Tom B.", location: "Ottawa, ON", amount: "C$780", timeframe: "2 months", quote: "The premium offers are where the real money is. Made $300 from one game alone!", avatar: "T", rating: 5 },
];

const payoutMethods = [
  { name: "Interac", icon: "🏦", time: "Instant" },
  { name: "PayPal", icon: "💳", time: "Instant" },
  { name: "Visa", icon: "💎", time: "1-2 hours" },
  { name: "Amazon.ca", icon: "🛒", time: "Instant" },
  { name: "Bitcoin", icon: "₿", time: "15 min" },
  { name: "Apple", icon: "🍎", time: "1-2 hours" },
  { name: "Steam", icon: "🎮", time: "Instant" },
];

const topOffers = [
  { name: "Puzzles & Chaos", reward: 891.98, platform: "iOS", color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Solitaire Cash", reward: 1186.91, platform: "iOS", color: "from-red-500/20 to-orange-500/20" },
  { name: "RAID: Shadow Legends", reward: 512.00, platform: "Android", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Monopoly GO!", reward: 620.02, platform: "iOS", color: "from-purple-500/20 to-pink-500/20" },
];

const features = [
  { icon: Shield, title: "100% Safe & Legit", desc: "Trusted by 150K+ users. Your data is encrypted and never sold." },
  { icon: Clock, title: "Instant Payouts", desc: "No waiting weeks. Get paid the moment you hit the minimum." },
  { icon: Gift, title: "Daily Bonuses", desc: "Spin the wheel, complete streaks, and unlock bonus rewards every day." },
  { icon: Globe, title: "Made for Canadians", desc: "Purpose-built for the Canadian market. Earn in CAD, cash out with Interac e-Transfer and more." },
  { icon: Target, title: "High-Paying Offers", desc: "Earn up to C$1,000+ per offer. Premium games pay the most." },
  { icon: Heart, title: "Referral Program", desc: "Invite friends and earn C$5 for each person who signs up." },
];

const faqs = [
  {
    q: "Is CashBlitz really free?",
    a: "Yes, 100% free to join and use. You'll never be asked for a credit card or upfront payment. You earn money by completing offers, not by spending it.",
  },
  {
    q: "How much can I earn?",
    a: "It depends on how active you are. Casual users earn C$50-200/month, while power users can earn C$500-1,000+ by focusing on premium game offers.",
  },
  {
    q: "How do payouts work?",
    a: "Once you reach the minimum withdrawal amount (C$5 for most methods), you can cash out instantly via PayPal, gift cards, or cryptocurrency. No fees ever.",
  },
  {
    q: "What types of offers are available?",
    a: "We offer mobile games (highest paying), surveys, app signups, and desktop tasks. New offers are added daily from our network of trusted advertisers.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We use bank-level encryption and never sell your personal data. Your information is only used to match you with relevant offers.",
  },
  {
    q: "How long does it take to get paid?",
    a: "Most payouts are processed instantly. PayPal and Amazon gift cards arrive in seconds. Crypto payouts typically take 15 minutes. Visa cards take 1-2 hours.",
  },
];

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: "How It Works", href: "/about" },
    { label: "Available Offers", href: "/dashboard" },
    { label: "Payout Methods", href: "/dashboard" },
    { label: "Sign Up", href: "/signup" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "#faq" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  Support: [
    { label: "Help Center", href: "/about" },
    { label: "Contact Us", href: "/about" },
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/signup" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy" },
    { label: "PIPEDA Compliance", href: "/privacy" },
  ],
};

/* ═══════════════════ COMPONENT ═══════════════════ */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background overflow-x-hidden">
      {/* ══════════════════════════════════════════ */}
      {/* ══════ NAVBAR ══════ */}
      {/* ══════════════════════════════════════════ */}
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

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">How It Works</a>
            <a href="#offers" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Offers</a>
            <a href="#payouts" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Payouts</a>
            <a href="#faq" className="text-sm font-medium text-muted hover:text-foreground transition-colors">FAQ</a>
            <Link href="/about" className="text-sm font-medium text-muted hover:text-foreground transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 sm:px-5 py-2 bg-primary hover:bg-primary-dark text-background text-sm font-bold rounded-xl transition-colors press-scale"
            >
              Sign Up Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">How It Works</a>
                <a href="#offers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">Offers</a>
                <a href="#payouts" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">Payouts</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">FAQ</a>
                <Link href="/about" className="block text-sm font-medium text-muted hover:text-foreground">About</Link>
                <div className="border-t border-border pt-3">
                  <Link href="/login" className="block text-sm font-semibold text-primary mb-2">Log In</Link>
                  <Link href="/signup" className="block text-center py-2.5 bg-primary text-background font-bold text-sm rounded-xl">Sign Up Free</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ HERO SECTION ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section className="relative casino-bg overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl" />

        {/* Floating decorations */}
        <div className="absolute top-32 right-[15%] text-6xl opacity-10 float-anim hidden lg:block">🎰</div>
        <div className="absolute bottom-20 left-[10%] text-5xl opacity-10 float-anim hidden lg:block" style={{ animationDelay: "1s" }}>💰</div>
        <div className="absolute top-40 left-[5%] text-4xl opacity-10 float-anim hidden lg:block" style={{ animationDelay: "2s" }}>🎲</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                  <Flame size={14} className="text-primary" />
                  <span className="text-xs font-bold text-primary">Canada&apos;s #1 Rewards Platform — 2026</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.1] mb-5">
                  Get Paid to{" "}
                  <span className="gradient-text">Play Games</span>
                  <br className="hidden sm:block" />
                  {" "}<span className="hidden sm:inline">&</span><span className="sm:hidden">&amp;</span> Complete Tasks
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-muted leading-relaxed mb-8 max-w-xl">
                  Earn real cash playing mobile games, taking surveys, and completing simple offers.
                  <span className="text-foreground font-semibold"> Instant payouts</span>.
                  <span className="text-foreground font-semibold"> Zero fees</span>.
                  <span className="text-foreground font-semibold"> 100% free</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-background font-bold text-base rounded-2xl transition-all pulse-glow press-scale"
                  >
                    Start Earning — It&apos;s Free
                    <ArrowRight size={18} />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-light border border-border text-foreground font-semibold text-base rounded-2xl hover:bg-border transition-colors press-scale"
                  >
                    See How It Works
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center gap-4 text-muted text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-primary" />
                    <span>Secure & Trusted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-primary" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap size={14} className="text-primary" />
                    <span>Instant Payouts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    <span>150K+ Canadian Users</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: App preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main preview card */}
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-2xl shadow-primary/5 max-w-md mx-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <Zap size={18} className="text-background" fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted font-medium">Your Balance</p>
                        <p className="text-xl font-extrabold text-foreground">CAD 347.82</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                      <Flame size={12} className="text-orange-500" />
                      <span className="text-[10px] font-bold text-foreground">7 day streak</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[10px] text-muted mb-1.5">
                      <span>Next payout</span>
                      <span className="text-primary font-bold">CAD 347.82 / 350.00</span>
                    </div>
                    <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "99%" }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                      />
                    </div>
                  </div>

                  {/* Mini offer cards */}
                  {topOffers.slice(0, 3).map((offer, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className={`flex items-center gap-3 p-3 bg-gradient-to-r ${offer.color} rounded-xl mb-2 border border-border`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-lg">
                        {i === 0 ? "🧩" : i === 1 ? "🃏" : "⚔️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{offer.name}</p>
                        <p className="text-[10px] text-muted">{offer.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-primary">CAD {offer.reward.toFixed(2)}</p>
                        <div className="bg-primary/20 text-primary text-[9px] font-bold px-2 py-0.5 rounded-md mt-0.5">
                          Earn →
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Live activity */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-3 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <p className="text-[10px] text-muted"><span className="text-foreground font-semibold">Marcus D.</span> just withdrew <span className="text-primary font-bold">CAD 150.00</span></p>
                  </motion.div>
                </div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-4 -right-4 bg-accent-2/20 border border-accent-2/30 rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <TrendingUp size={14} className="text-accent-2" />
                  <span className="text-xs font-bold text-accent-2">+C$2.4M paid</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-accent/20 border border-accent/30 rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <Star size={14} className="text-accent fill-accent" />
                  <span className="text-xs font-bold text-accent">4.8★ rated</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ LIVE STATS BAR ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon size={22} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ TOP OFFERS PREVIEW ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section id="offers" className="py-16 sm:py-20 lg:py-24 casino-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-accent-2/10 border border-accent-2/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles size={14} className="text-accent-2" />
                <span className="text-xs font-bold text-accent-2">Top Earning Opportunities</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Earn Up to <span className="gradient-text-gold">C$1,186</span> Per Offer
              </h2>
              <p className="text-muted max-w-lg mx-auto text-sm sm:text-base">
                Premium game offers pay the most. Here are some of our top earners right now.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topOffers.map((offer, i) => (
              <motion.div
                key={offer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface rounded-2xl p-5 border border-border card-hover group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${offer.color} flex items-center justify-center mb-4 text-2xl`}>
                  {i === 0 ? "🧩" : i === 1 ? "🃏" : i === 2 ? "⚔️" : "🎲"}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{offer.name}</h3>
                <p className="text-[11px] text-muted mb-3">{offer.platform}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-primary font-semibold">CAD</span>
                  <span className="text-2xl font-extrabold text-foreground">{offer.reward.toFixed(2)}</span>
                </div>
                <Link
                  href="/signup"
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg group-hover:bg-primary group-hover:text-background transition-colors"
                >
                  Start Earning <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              View all 200+ offers <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ HOW IT WORKS ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Start Earning in <span className="gradient-text">4 Easy Steps</span>
              </h2>
              <p className="text-muted max-w-md mx-auto text-sm sm:text-base">
                From signup to cashout in minutes. Here&apos;s how it works.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-background rounded-2xl p-6 border border-border text-center card-hover"
              >
                {/* Step number */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-surface-light rounded-full px-2.5 py-0.5 mb-3">
                  <span className="text-[10px] font-bold text-muted">STEP {step.num}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>

                {/* Arrow connector (desktop) */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ChevronRight size={20} className="text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ WHY CASHBLITZ ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 casino-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Why Choose <span className="gradient-text">CashBlitz</span>?
              </h2>
              <p className="text-muted max-w-md mx-auto text-sm sm:text-base">
                We&apos;re not just another rewards app. Here&apos;s what sets us apart.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-surface rounded-2xl p-5 border border-border card-hover"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ TESTIMONIALS ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Real People, <span className="gradient-text-gold">Real Earnings</span>
              </h2>
              <p className="text-muted max-w-md mx-auto text-sm sm:text-base">
                Join 150,000+ Canadian Users earning real cash every day
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-background rounded-2xl p-5 border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-background">{t.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted">{t.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-extrabold text-primary">{t.amount}</p>
                    <p className="text-[10px] text-muted">{t.timeframe}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className={s < t.rating ? "text-accent-2 fill-accent-2" : "text-border"} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ PAYOUT METHODS ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section id="payouts" className="py-16 sm:py-20 lg:py-24 casino-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Cash Out <span className="gradient-text">Your Way</span>
              </h2>
              <p className="text-muted max-w-md mx-auto text-sm sm:text-base">
                Instant withdrawals with zero fees. Choose your preferred method.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
            {payoutMethods.map((method, i) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface rounded-2xl p-4 border border-border text-center card-hover"
              >
                <span className="text-3xl block mb-2">{method.icon}</span>
                <p className="text-sm font-bold text-foreground">{method.name}</p>
                <p className="text-[10px] text-primary font-medium mt-1">{method.time}</p>
              </motion.div>
            ))}
          </div>

          {/* Zero fees callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lock size={24} className="text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-foreground text-lg mb-1">Zero Fees, Always</h3>
              <p className="text-sm text-muted">We never charge withdrawal fees. The amount you see is the amount you get. Minimum withdrawal starts at just C$5.</p>
            </div>
            <Link
              href="/signup"
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background font-bold text-sm rounded-xl transition-colors press-scale flex-shrink-0"
            >
              Start Earning <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ FAQ ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-muted text-sm sm:text-base">
                Got questions? We&apos;ve got answers.
              </p>
            </motion.div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-background rounded-2xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left press-scale"
                >
                  <span className="font-semibold text-foreground text-sm sm:text-base pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={18} className="text-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                        <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ FINAL CTA ══════ */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 casino-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Ready to Start <span className="gradient-text">Earning</span>?
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-lg mx-auto mb-8">
              Join 150,000+ Canadian Users who are already earning real cash. Sign up free today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary-dark text-background font-bold text-lg rounded-2xl transition-all pulse-glow press-scale"
            >
              <TrendingUp size={22} />
              Create Free Account
            </Link>
            <p className="text-xs text-muted mt-4">No credit card required. Takes less than 30 seconds.</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ══════ FOOTER ══════ */}
      {/* ══════════════════════════════════════════ */}
      <footer className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Footer grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <Zap size={17} className="text-background" fill="currentColor" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">
                  <span className="gradient-text">CASH</span>
                  <span className="text-foreground">BLITZ</span>
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Canada&apos;s #1 rewards platform. Earn real CAD by playing games, completing surveys, and simple tasks.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-bold text-foreground mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-muted hover:text-foreground cursor-pointer transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted">&copy; 2026 CashBlitz. All rights reserved. Operated in Canada.</p>
            <div className="flex items-center gap-4 text-xs text-muted">
              <Link href="/privacy" className="hover:text-foreground cursor-pointer">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground cursor-pointer">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-foreground cursor-pointer">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
