"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, ChevronRight, TrendingUp, AlertCircle, Zap, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserOffer {
  id: string;
  status: string;
  earnedAmount: number;
  completedTasks: string | null;
  trackingId: string;
  startedAt: string;
  completedAt: string | null;
  offer: {
    id: string;
    name: string;
    image: string;
    totalReward: number;
    category: string;
    platform: string;
    externalUrl: string | null;
    rewards: {
      id: string;
      task: string;
      amount: number;
      timeLimit: string | null;
      isBonus: boolean;
      isLimited: boolean;
      sortOrder: number;
    }[];
  };
}

export default function MyOffersPage() {
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [activeOffers, setActiveOffers] = useState<UserOffer[]>([]);
  const [completedOffers, setCompletedOffers] = useState<UserOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const [activeRes, completedRes] = await Promise.all([
          fetch("/api/user/offers?status=active"),
          fetch("/api/user/offers?status=completed"),
        ]);

        if (activeRes.ok) {
          const data = await activeRes.json();
          setActiveOffers(data);
        }
        if (completedRes.ok) {
          const data = await completedRes.json();
          setCompletedOffers(data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const getProgress = (userOffer: UserOffer) => {
    if (!userOffer.offer.rewards || userOffer.offer.rewards.length === 0) return 0;
    // Parse completed tasks if available
    let completedCount = 0;
    if (userOffer.completedTasks) {
      try {
        const tasks = JSON.parse(userOffer.completedTasks);
        completedCount = Array.isArray(tasks) ? tasks.length : 0;
      } catch {
        completedCount = 0;
      }
    }
    return Math.round((completedCount / userOffer.offer.rewards.length) * 100);
  };

  const getCompletedTaskCount = (userOffer: UserOffer) => {
    if (userOffer.completedTasks) {
      try {
        const tasks = JSON.parse(userOffer.completedTasks);
        return Array.isArray(tasks) ? tasks.length : 0;
      } catch {
        return 0;
      }
    }
    return 0;
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
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="px-4 py-4 pb-24 casino-bg flex items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24 casino-bg">
      <h2 className="text-xl font-extrabold text-foreground mb-0.5">My Offers</h2>
      <p className="text-xs text-muted mb-4">Track your progress and earnings</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["active", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all press-scale ${
              tab === t
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-surface-light text-muted border border-border active:bg-border"
            }`}
          >
            {t === "active" ? <Clock size={13} /> : <CheckCircle size={13} />}
            <span className="capitalize">{t}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              tab === t ? "bg-primary/20 text-primary" : "bg-border text-muted"
            }`}>
              {t === "active" ? activeOffers.length : completedOffers.length}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "active" ? (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {activeOffers.length > 0 && (
              <>
                {/* Summary */}
                <div className="bg-gradient-to-r from-primary/8 to-accent/5 rounded-2xl p-4 border border-primary/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted mb-0.5">Active Earnings</p>
                      <p className="text-xl font-extrabold text-foreground">
                        CAD {activeOffers.reduce((s, o) => s + o.earnedAmount, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted mb-0.5">Potential Total</p>
                      <p className="text-base font-bold gradient-text">
                        CAD {activeOffers.reduce((s, o) => s + o.offer.totalReward, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {activeOffers.map((userOffer, i) => {
                  const progress = getProgress(userOffer);
                  const completedTaskCount = getCompletedTaskCount(userOffer);
                  const totalTasks = userOffer.offer.rewards.length;

                  return (
                    <motion.div
                      key={userOffer.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-surface rounded-2xl p-3.5 border border-border press-scale cursor-pointer active:bg-surface-light"
                      onClick={() => {
                        if (userOffer.offer.externalUrl) {
                          window.open(userOffer.offer.externalUrl, "_blank");
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <img
                          src={userOffer.offer.image}
                          alt={userOffer.offer.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-bold text-[13px] text-foreground truncate">{userOffer.offer.name}</h3>
                            {userOffer.offer.externalUrl ? (
                              <ExternalLink size={14} className="text-primary flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronRight size={14} className="text-muted flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-primary font-bold">CAD {userOffer.earnedAmount.toFixed(2)}</span>
                            <span className="text-[10px] text-muted">of CAD {userOffer.offer.totalReward.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <TrendingUp size={10} className="text-muted" />
                            <span className="text-[10px] text-muted">{completedTaskCount}/{totalTasks} tasks</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2.5">
                        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[9px] text-muted">Started {getTimeAgo(userOffer.startedAt)}</span>
                          <span className="text-[9px] font-semibold text-primary">{progress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}

            {activeOffers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">🎮</p>
                <p className="text-foreground font-semibold text-sm">No active offers</p>
                <p className="text-xs text-muted mt-1">Start an offer from the Earn tab to see it here!</p>
              </div>
            )}

            {/* Tip */}
            <div className="bg-surface-light/80 rounded-2xl p-3.5 border border-border flex items-start gap-2.5">
              <Zap size={16} className="text-accent-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-foreground mb-0.5">Pro Tip</p>
                <p className="text-[11px] text-muted leading-relaxed">
                  Focus on time-limited tasks first to maximize your earnings! Bonus tasks offer the best rewards per effort.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {completedOffers.map((userOffer, i) => (
              <motion.div
                key={userOffer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface rounded-2xl p-3.5 border border-border flex items-center gap-3"
              >
                <img
                  src={userOffer.offer.image}
                  alt={userOffer.offer.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[13px] text-foreground truncate">{userOffer.offer.name}</h3>
                  <p className="text-[10px] text-muted">
                    {userOffer.completedAt ? getTimeAgo(userOffer.completedAt) : "Completed"}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <CheckCircle size={13} className="text-primary" />
                  <span className="text-xs font-bold text-primary">+CAD {userOffer.earnedAmount.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}

            {completedOffers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">🎮</p>
                <p className="text-muted text-sm">No completed offers yet</p>
                <p className="text-xs text-muted mt-1">Start earning by completing offers!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
