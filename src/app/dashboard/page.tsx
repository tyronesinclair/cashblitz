"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search, FileText, DollarSign, Gift, Bell, Flame, Zap,
  LogOut, Shield, ChevronRight, User, Settings, Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EarnPage from "@/components/EarnPage";
import MyOffersPage from "@/components/MyOffersPage";
import CashoutPage from "@/components/CashoutPage";
import RewardsPage from "@/components/RewardsPage";

const tabs = [
  { id: "earn", label: "Earn", icon: Search },
  { id: "my-offers", label: "My Offers", icon: FileText },
  { id: "cashout", label: "Cashout", icon: DollarSign },
  { id: "rewards", label: "Rewards", icon: Gift },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("earn");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center"
        >
          <Zap size={20} className="text-background" fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  const userRole = (session.user as Record<string, unknown>)?.role as string;
  const userBalance = (session.user as Record<string, unknown>)?.balance as number ?? 0;

  return (
    <div className="min-h-dvh bg-background flex">
      {/* ══════ Desktop Sidebar ══════ */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Zap size={17} className="text-background" fill="currentColor" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="gradient-text">CASH</span>
            <span className="text-foreground">BLITZ</span>
          </span>
        </div>

        {/* Balance card */}
        <div className="mx-4 mt-4 mb-2 p-3.5 bg-gradient-to-br from-primary/10 to-primary-dark/5 border border-primary/20 rounded-2xl">
          <p className="text-[10px] text-muted font-medium">Available Balance</p>
          <p className="text-2xl font-extrabold text-foreground mt-0.5">
            CAD {userBalance.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Flame size={12} className="text-orange-500" />
            <span className="text-[10px] text-muted font-medium">0 day streak</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all press-scale ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted hover:bg-surface-light hover:text-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
                {tab.id === "my-offers" && (
                  <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">3</span>
                )}
              </button>
            );
          })}

          {/* Admin link */}
          {userRole === "admin" && (
            <>
              <div className="border-t border-border my-3" />
              <button
                onClick={() => router.push("/admin")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-accent hover:bg-accent/10 transition-all press-scale"
              >
                <Shield size={18} />
                Admin Dashboard
                <ChevronRight size={14} className="ml-auto" />
              </button>
            </>
          )}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-xs font-bold text-background">
                {session.user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-[10px] text-muted truncate">
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 text-muted hover:text-danger transition-colors press-scale"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ══════ Main Content ══════ */}
      <div className="flex-1 lg:ml-64">
        {/* ══════ Mobile Top Bar ══════ */}
        <header className="lg:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-lg border-b border-border safe-top">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <motion.div
                whileTap={{ scale: 0.9, rotate: 10 }}
                className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center ring-2 ring-primary/30"
              >
                <Zap size={16} className="text-background" fill="currentColor" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-surface" />
              </motion.div>
              <h1 className="text-lg font-extrabold tracking-tight hidden sm:block">
                <span className="gradient-text">CASH</span>
                <span className="text-foreground">BLITZ</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-surface-light rounded-full px-2.5 py-1.5"
              >
                <Flame size={14} className="text-orange-500" />
                <span className="text-xs font-bold text-foreground">0</span>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-primary/10 border border-primary/25 rounded-full px-2.5 py-1.5"
              >
                <span className="text-[10px] text-primary font-semibold">CAD</span>
                <span className="text-xs font-bold text-primary">{userBalance.toFixed(2)}</span>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="relative p-1.5 text-muted"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* ══════ Desktop Top Bar ══════ */}
        <header className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-extrabold text-foreground capitalize">
              {tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}
            </h2>
            <p className="text-xs text-muted">
              Welcome back, {session.user?.name || "Player"}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-muted hover:text-foreground transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </motion.button>
          </div>
        </header>

        {/* ══════ Page Content ══════ */}
        <main className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "earn" && <EarnPage />}
              {activeTab === "my-offers" && <MyOffersPage />}
              {activeTab === "cashout" && <CashoutPage />}
              {activeTab === "rewards" && <RewardsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ══════ Mobile Bottom Nav ══════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-border safe-bottom">
        <div className="flex items-stretch justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center py-2 pt-2.5 flex-1 group press-scale"
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-b-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon
                    size={21}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {tab.id === "my-offers" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-primary rounded-full flex items-center justify-center px-1"
                    >
                      <span className="text-[9px] font-bold text-background">3</span>
                    </motion.span>
                  )}
                  {tab.id === "rewards" && (
                    <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-danger rounded-full border border-surface" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
