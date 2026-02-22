"use client";

import { useState } from "react";
import {
  User, Settings, DollarSign, Trophy, Star, ChevronRight,
  Flame, Gift, Target, Award, Zap, Crown, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { userProfile, offers } from "@/data/offers";

const startedOffers = [offers[4], offers[1], offers[5]];

const achievements = [
  { id: 1, name: "First Offer", desc: "Complete your first offer", icon: Star, unlocked: true, color: "text-accent-2" },
  { id: 2, name: "Speed Runner", desc: "Complete within 24 hours", icon: Zap, unlocked: true, color: "text-primary" },
  { id: 3, name: "Streak Master", desc: "7-day login streak", icon: Flame, unlocked: false, color: "text-orange-500" },
  { id: 4, name: "Big Earner", desc: "Earn over $100", icon: DollarSign, unlocked: false, color: "text-primary" },
  { id: 5, name: "Game King", desc: "Complete 10 game offers", icon: Crown, unlocked: false, color: "text-accent-2" },
  { id: 6, name: "Survey Pro", desc: "Complete 20 surveys", icon: Target, unlocked: false, color: "text-cyan-400" },
];

const levels = [
  { level: 0, name: "Rookie", minCoins: 0, color: "from-gray-500 to-gray-600" },
  { level: 1, name: "Bronze", minCoins: 1000, color: "from-amber-700 to-amber-800" },
  { level: 2, name: "Silver", minCoins: 5000, color: "from-gray-400 to-gray-500" },
  { level: 3, name: "Gold", minCoins: 15000, color: "from-yellow-500 to-yellow-600" },
  { level: 4, name: "Platinum", minCoins: 50000, color: "from-cyan-400 to-cyan-500" },
  { level: 5, name: "Diamond", minCoins: 100000, color: "from-purple-400 to-purple-500" },
];

const dailyBonuses = [
  { day: 1, amount: 0.10, claimed: true },
  { day: 2, amount: 0.15, claimed: true },
  { day: 3, amount: 0.25, claimed: false },
  { day: 4, amount: 0.35, claimed: false },
  { day: 5, amount: 0.50, claimed: false },
  { day: 6, amount: 0.75, claimed: false },
  { day: 7, amount: 1.50, claimed: false },
];

export default function RewardsPage() {
  const [section, setSection] = useState<"profile" | "rewards">("profile");
  const currentLevel = levels[userProfile.level];
  const nextLevel = levels[Math.min(userProfile.level + 1, levels.length - 1)];
  const levelProgress = (userProfile.currentLevelCoins / userProfile.coinsToNextLevel) * 100;

  return (
    <div className="px-4 py-4 pb-24 casino-bg">
      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        {(["profile", "rewards"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all press-scale ${
              section === s
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-surface-light text-muted border border-border active:bg-border"
            }`}
          >
            {s === "profile" ? <User size={14} /> : <Gift size={14} />}
            <span className="capitalize">{s === "profile" ? "My Profile" : "Rewards"}</span>
          </button>
        ))}
      </div>

      {section === "profile" ? (
        <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Profile header */}
          <div className="bg-surface rounded-2xl p-4 border border-border mb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-foreground">My Profile</h2>
              <button className="p-1.5 bg-surface-light rounded-lg active:bg-border press-scale">
                <Settings size={16} className="text-primary" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-surface-light to-border flex items-center justify-center">
                  <User size={28} className="text-muted" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${currentLevel.color} flex items-center justify-center border-2 border-surface`}>
                  <span className="text-[8px] font-bold text-white">{userProfile.level}</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{userProfile.name}</h3>
                <div className="flex items-center gap-4 mt-0.5">
                  <div>
                    <p className="text-base font-extrabold text-foreground">CAD {userProfile.totalEarnings.toFixed(2)}</p>
                    <p className="text-[9px] text-muted">Total Earnings</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-foreground">{userProfile.offersCompleted}</p>
                    <p className="text-[9px] text-muted">Offers Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Level bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary">Level</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r ${currentLevel.color} text-white`}>
                    {currentLevel.name}
                  </span>
                </div>
                <span className="text-[10px] text-muted">{userProfile.coinsToNextLevel} coins to level up</span>
              </div>
              <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full`}
                />
              </div>
            </div>
          </div>

          {/* Earnings row */}
          <button className="w-full bg-surface rounded-2xl p-3.5 border border-border flex items-center justify-between mb-3 active:bg-surface-light press-scale">
            <div className="flex items-center gap-2.5">
              <DollarSign size={18} className="text-primary" />
              <span className="font-bold text-sm text-foreground">Earnings</span>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>

          {/* Started offers */}
          <div className="bg-surface rounded-2xl p-3.5 border border-border">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-accent-2" />
                <span className="font-bold text-sm text-foreground">Started offers</span>
              </div>
              <button className="text-[10px] text-primary font-medium press-scale">View all &gt;</button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {startedOffers.map((offer) => (
                <div key={offer.id} className="flex-shrink-0 w-24">
                  <img src={offer.image} alt={offer.name} className="w-24 h-24 rounded-xl object-cover" />
                  <p className="text-[10px] font-medium text-foreground mt-1 truncate">{offer.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Daily bonus */}
          <div className="bg-surface rounded-2xl p-3.5 border border-border mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Flame size={16} className="text-orange-500" />
              <h3 className="font-bold text-sm text-foreground">Daily Login Bonus</h3>
            </div>
            <p className="text-[10px] text-muted mb-2.5">Login every day to earn increasing bonuses!</p>
            <div className="grid grid-cols-7 gap-1">
              {dailyBonuses.map((bonus) => (
                <motion.div
                  key={bonus.day}
                  whileTap={{ scale: 0.95 }}
                  className={`relative rounded-lg p-1.5 text-center border press-scale ${
                    bonus.claimed
                      ? "bg-primary/12 border-primary/25"
                      : bonus.day === 3
                      ? "bg-accent-2/8 border-accent-2/25 ring-1 ring-accent-2/30"
                      : "bg-surface-light border-border"
                  }`}
                >
                  <p className="text-[8px] text-muted">Day {bonus.day}</p>
                  <p className={`text-[10px] font-bold ${bonus.claimed ? "text-primary" : bonus.day === 3 ? "text-accent-2" : "text-foreground"}`}>
                    ${bonus.amount.toFixed(2)}
                  </p>
                  {bonus.claimed && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-[7px] text-background font-bold">✓</span>
                    </div>
                  )}
                  {bonus.day === 3 && !bonus.claimed && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-2 rounded-full flex items-center justify-center">
                      <span className="text-[7px] text-background font-bold">!</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-surface rounded-2xl p-3.5 border border-border mb-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Award size={16} className="text-accent-2" />
              <h3 className="font-bold text-sm text-foreground">Achievements</h3>
              <span className="text-[9px] bg-surface-light px-1.5 py-0.5 rounded-full text-muted">
                {achievements.filter((a) => a.unlocked).length}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach, i) => {
                const Icon = ach.icon;
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`relative rounded-xl p-2.5 border press-scale ${
                      ach.unlocked
                        ? "bg-surface-light border-border"
                        : "bg-surface-light/40 border-border/50 opacity-50"
                    }`}
                  >
                    {!ach.unlocked && <Lock size={10} className="absolute top-2 right-2 text-muted" />}
                    <Icon size={18} className={ach.unlocked ? ach.color : "text-muted"} />
                    <p className="text-[11px] font-bold text-foreground mt-1">{ach.name}</p>
                    <p className="text-[9px] text-muted mt-0.5 leading-tight">{ach.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Levels */}
          <div className="bg-surface rounded-2xl p-3.5 border border-border">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Crown size={16} className="text-accent-2" />
              <h3 className="font-bold text-sm text-foreground">Level Tiers</h3>
            </div>
            <div className="space-y-1.5">
              {levels.map((lvl) => (
                <div
                  key={lvl.level}
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    userProfile.level === lvl.level
                      ? "bg-primary/8 border-primary/25"
                      : userProfile.level > lvl.level
                      ? "bg-surface-light border-border"
                      : "bg-surface-light/40 border-border/40 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${lvl.color} flex items-center justify-center`}>
                      <span className="text-[9px] font-bold text-white">{lvl.level}</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{lvl.name}</p>
                      <p className="text-[9px] text-muted">{lvl.minCoins.toLocaleString()} coins</p>
                    </div>
                  </div>
                  {userProfile.level === lvl.level && (
                    <span className="text-[8px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">CURRENT</span>
                  )}
                  {userProfile.level > lvl.level && (
                    <span className="text-primary text-xs">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
