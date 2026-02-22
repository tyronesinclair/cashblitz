"use client";

import { useState } from "react";
import { Clock, CheckCircle, ChevronRight, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { offers } from "@/data/offers";

interface ActiveOffer {
  offer: typeof offers[0];
  progress: number;
  completedTasks: number;
  totalTasks: number;
  earned: number;
  startedAt: string;
  daysLeft?: number;
}

const activeOffers: ActiveOffer[] = [
  {
    offer: offers[4],
    progress: 15,
    completedTasks: 1,
    totalTasks: 7,
    earned: 2.20,
    startedAt: "2 hours ago",
    daysLeft: 21,
  },
  {
    offer: offers[1],
    progress: 35,
    completedTasks: 3,
    totalTasks: 9,
    earned: 35.50,
    startedAt: "1 day ago",
    daysLeft: 18,
  },
  {
    offer: offers[5],
    progress: 60,
    completedTasks: 8,
    totalTasks: 14,
    earned: 21.28,
    startedAt: "5 days ago",
    daysLeft: 25,
  },
];

const completedOffersList = [
  { offer: offers[8], earned: 3.50, completedAt: "Yesterday" },
];

export default function MyOffersPage() {
  const [tab, setTab] = useState<"active" | "completed">("active");

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
              {t === "active" ? activeOffers.length : completedOffersList.length}
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
            {/* Summary */}
            <div className="bg-gradient-to-r from-primary/8 to-accent/5 rounded-2xl p-4 border border-primary/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted mb-0.5">Active Earnings</p>
                  <p className="text-xl font-extrabold text-foreground">
                    CAD {activeOffers.reduce((s, o) => s + o.earned, 0).toFixed(2)}
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

            {activeOffers.map((active, i) => (
              <motion.div
                key={active.offer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface rounded-2xl p-3.5 border border-border press-scale cursor-pointer active:bg-surface-light"
              >
                <div className="flex gap-3">
                  <img
                    src={active.offer.image}
                    alt={active.offer.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-[13px] text-foreground truncate">{active.offer.name}</h3>
                      <ChevronRight size={14} className="text-muted flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-primary font-bold">CAD {active.earned.toFixed(2)}</span>
                      <span className="text-[10px] text-muted">of CAD {active.offer.totalReward.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp size={10} className="text-muted" />
                      <span className="text-[10px] text-muted">{active.completedTasks}/{active.totalTasks} tasks</span>
                      {active.daysLeft && (
                        <>
                          <Clock size={10} className="text-accent-2" />
                          <span className="text-[10px] text-accent-2 font-medium">{active.daysLeft}d left</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${active.progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-muted">Started {active.startedAt}</span>
                    <span className="text-[9px] font-semibold text-primary">{active.progress}%</span>
                  </div>
                </div>
              </motion.div>
            ))}

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
            {completedOffersList.map((item, i) => (
              <motion.div
                key={item.offer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface rounded-2xl p-3.5 border border-border flex items-center gap-3"
              >
                <img
                  src={item.offer.image}
                  alt={item.offer.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[13px] text-foreground truncate">{item.offer.name}</h3>
                  <p className="text-[10px] text-muted">{item.completedAt}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <CheckCircle size={13} className="text-primary" />
                  <span className="text-xs font-bold text-primary">+CAD {item.earned.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}

            {completedOffersList.length === 0 && (
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
