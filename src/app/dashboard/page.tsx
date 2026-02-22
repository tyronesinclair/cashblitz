"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search, FileText, DollarSign, Gift, Bell, Flame, Zap,
  LogOut, Shield, ChevronRight, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EarnPage from "@/components/EarnPage";
import MyOffersPage from "@/components/MyOffersPage";
import CashoutPage from "@/components/CashoutPage";
import RewardsPage from "@/components/RewardsPage";
import OnboardingModal from "@/components/OnboardingModal";

const tabs = [
  { id: "earn", label: "Earn", icon: Search },
  { id: "my-offers", label: "My Offers", icon: FileText },
  { id: "cashout", label: "Cashout", icon: DollarSign },
  { id: "rewards", label: "Rewards", icon: Gift },
];

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("earn");

  // Real dynamic data
  const [balance, setBalance] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [activeOfferCount, setActiveOfferCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasClaimableDailyReward, setHasClaimableDailyReward] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      const [balanceRes, notifRes, dailyRes] = await Promise.all([
        fetch("/api/user/balance"),
        fetch("/api/user/notifications"),
        fetch("/api/daily-reward"),
      ]);

      if (balanceRes.ok) {
        const data = await balanceRes.json();
        setBalance(data.balance);
        setStreak(data.streak);
        setActiveOfferCount(data.activeOfferCount);
      }

      if (notifRes.ok) {
        const data = await notifRes.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }

      if (dailyRes.ok) {
        const data = await dailyRes.json();
        setHasClaimableDailyReward(!data.claimedToday);
      }
    } catch {
      // Silent fail — use session data as fallback
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUserData, 30000);
      return () => clearInterval(interval);
    }
  }, [status, fetchUserData]);

  // Use session data as initial fallback
  useEffect(() => {
    if (session?.user) {
      const user = session.user as Record<string, unknown>;
      if (typeof user.balance === "number") setBalance(user.balance);
      if (typeof user.streak === "number") setStreak(user.streak);
    }
  }, [session]);

  // Show onboarding for first-time users
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const onboardingKey = `cashblitz_onboarded_${session.user.email}`;
      if (!localStorage.getItem(onboardingKey)) {
        setShowOnboarding(true);
      }
    }
  }, [status, session]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (session?.user?.email) {
      localStorage.setItem(`cashblitz_onboarded_${session.user.email}`, "true");
    }
  };

  const markNotificationsRead = async () => {
    try {
      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Silent fail
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

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
            CAD {balance.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Flame size={12} className="text-orange-500" />
            <span className="text-[10px] text-muted font-medium">
              {streak > 0 ? `${streak} day streak 🔥` : "Start your streak!"}
            </span>
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
                {tab.id === "my-offers" && activeOfferCount > 0 && (
                  <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                    {activeOfferCount}
                  </span>
                )}
                {tab.id === "rewards" && hasClaimableDailyReward && (
                  <span className="ml-auto w-2 h-2 bg-danger rounded-full" />
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
                <span className="text-xs font-bold text-foreground">{streak}</span>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-primary/10 border border-primary/25 rounded-full px-2.5 py-1.5"
              >
                <span className="text-[10px] text-primary font-semibold">CAD</span>
                <span className="text-xs font-bold text-primary">{balance.toFixed(2)}</span>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleNotifications}
                className="relative p-1.5 text-muted"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] bg-danger rounded-full flex items-center justify-center px-0.5">
                    <span className="text-[8px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>
                  </span>
                )}
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
              onClick={toggleNotifications}
              className="relative p-2 text-muted hover:text-foreground transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-danger rounded-full flex items-center justify-center px-0.5">
                  <span className="text-[8px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>
                </span>
              )}
            </motion.button>
          </div>
        </header>

        {/* ══════ Notification Panel ══════ */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed lg:absolute top-0 lg:top-14 right-0 lg:right-4 z-50 w-full lg:w-96 max-h-[70vh] bg-surface border border-border rounded-b-2xl lg:rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-muted hover:text-foreground press-scale"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={24} className="text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-border last:border-0 ${
                        !notif.isRead ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{notif.title}</p>
                          <p className="text-[11px] text-muted mt-0.5">{notif.message}</p>
                        </div>
                        <span className="text-[9px] text-muted flex-shrink-0">
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for notifications on mobile */}
        {showNotifications && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setShowNotifications(false)}
          />
        )}

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
                  {tab.id === "my-offers" && activeOfferCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-primary rounded-full flex items-center justify-center px-1"
                    >
                      <span className="text-[9px] font-bold text-background">{activeOfferCount}</span>
                    </motion.span>
                  )}
                  {tab.id === "rewards" && hasClaimableDailyReward && (
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

      {/* ══════ Onboarding Modal ══════ */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal
            onComplete={handleOnboardingComplete}
            userName={session.user?.name || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
