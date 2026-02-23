"use client";

import { useState, useEffect } from "react";
import {
  User, Settings, DollarSign, Trophy, Star,
  Flame, Gift, Target, Award, Zap, Crown, Lock, Loader2, Check
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ReferralCard from "./ReferralCard";
import TransactionHistory from "./TransactionHistory";

const achievements = [
  { id: "first_offer", name: "First Offer", desc: "Complete your first offer", icon: Star, color: "text-accent-2" },
  { id: "speed_runner", name: "Speed Runner", desc: "Complete within 24 hours", icon: Zap, color: "text-primary" },
  { id: "streak_master", name: "Streak Master", desc: "7-day login streak", icon: Flame, color: "text-orange-500" },
  { id: "big_earner", name: "Big Earner", desc: "Earn over C$100", icon: DollarSign, color: "text-primary" },
  { id: "game_king", name: "Game King", desc: "Complete 10 game offers", icon: Crown, color: "text-accent-2" },
  { id: "survey_pro", name: "Survey Pro", desc: "Complete 20 surveys", icon: Target, color: "text-cyan-400" },
];

const levels = [
  { level: 0, name: "Rookie", minXp: 0, color: "from-gray-500 to-gray-600" },
  { level: 1, name: "Bronze", minXp: 100, color: "from-amber-700 to-amber-800" },
  { level: 2, name: "Silver", minXp: 500, color: "from-gray-400 to-gray-500" },
  { level: 3, name: "Gold", minXp: 1500, color: "from-yellow-500 to-yellow-600" },
  { level: 4, name: "Platinum", minXp: 5000, color: "from-cyan-400 to-cyan-500" },
  { level: 5, name: "Diamond", minXp: 10000, color: "from-purple-400 to-purple-500" },
];

interface DailyCalendarDay {
  day: number;
  amount: number;
  claimed: boolean;
  isToday: boolean;
  isNext: boolean;
}

interface UserStats {
  balance: number;
  totalEarnings: number;
  streak: number;
  level: number;
  xp: number;
  activeOfferCount: number;
}

interface StartedOffer {
  id: string;
  offer: {
    id: string;
    name: string;
    image: string;
    totalReward: number;
  };
}

export default function RewardsPage() {
  const { data: session } = useSession();
  const [section, setSection] = useState<"profile" | "rewards">("profile");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [calendar, setCalendar] = useState<DailyCalendarDay[]>([]);
  const [claimedToday, setClaimedToday] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [startedOffers, setStartedOffers] = useState<StartedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [balanceRes, dailyRes, offersRes] = await Promise.all([
          fetch("/api/user/balance"),
          fetch("/api/daily-reward"),
          fetch("/api/user/offers?status=active"),
        ]);

        if (balanceRes.ok) {
          const data = await balanceRes.json();
          setStats(data);
        }

        if (dailyRes.ok) {
          const data = await dailyRes.json();
          setCalendar(data.calendar || []);
          setClaimedToday(data.claimedToday || false);
        }

        if (offersRes.ok) {
          const data = await offersRes.json();
          setStartedOffers(data.slice(0, 5));
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const claimDaily = async () => {
    if (claiming || claimedToday) return;
    setClaiming(true);
    setClaimMessage(null);

    try {
      const res = await fetch("/api/daily-reward", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setClaimedToday(true);
        setClaimMessage(`+C$${data.amount.toFixed(2)} Day ${data.day} bonus claimed!`);
        if (stats) {
          setStats({ ...stats, balance: data.newBalance, streak: data.newStreak });
        }
        // Refresh calendar
        const calRes = await fetch("/api/daily-reward");
        if (calRes.ok) {
          const calData = await calRes.json();
          setCalendar(calData.calendar || []);
        }
      } else {
        setClaimMessage(data.error || "Could not claim reward");
      }
    } catch {
      setClaimMessage("Network error");
    } finally {
      setClaiming(false);
    }
  };

  // Calculate level info from XP
  const userXp = stats?.xp || 0;
  const currentLevel = levels.reduce((acc, lvl) => (userXp >= lvl.minXp ? lvl : acc), levels[0]);
  const nextLevel = levels[Math.min(currentLevel.level + 1, levels.length - 1)];
  const xpInCurrentLevel = userXp - currentLevel.minXp;
  const xpNeeded = nextLevel.minXp - currentLevel.minXp;
  const levelProgress = xpNeeded > 0 ? Math.min((xpInCurrentLevel / xpNeeded) * 100, 100) : 100;

  // Determine which achievements are unlocked based on real data
  const totalEarnings = stats?.totalEarnings || 0;
  const streak = stats?.streak || 0;
  const unlockedAchievements = new Set<string>();
  if (startedOffers.length > 0) unlockedAchievements.add("first_offer");
  if (streak >= 7) unlockedAchievements.add("streak_master");
  if (totalEarnings >= 100) unlockedAchievements.add("big_earner");

  if (loading) {
    return (
      <div className="px-4 py-4 pb-24 casino-bg flex items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

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
                  <span className="text-[8px] font-bold text-white">{currentLevel.level}</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{session?.user?.name || "Player"}</h3>
                <div className="flex items-center gap-4 mt-0.5">
                  <div>
                    <p className="text-base font-extrabold text-foreground">CAD {(stats?.totalEarnings || 0).toFixed(2)}</p>
                    <p className="text-[9px] text-muted">Total Earnings</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-foreground">{stats?.activeOfferCount || 0}</p>
                    <p className="text-[9px] text-muted">Active Offers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Level bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary">Level {currentLevel.level}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r ${currentLevel.color} text-white`}>
                    {currentLevel.name}
                  </span>
                </div>
                <span className="text-[10px] text-muted">{xpNeeded > 0 ? `${xpNeeded - xpInCurrentLevel} XP to level up` : "Max level!"}</span>
              </div>
              <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full`}
                />
              </div>
              <p className="text-[9px] text-muted mt-1">{userXp} XP total</p>
            </div>
          </div>

          {/* Balance row */}
          <div className="w-full bg-surface rounded-2xl p-3.5 border border-border flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <DollarSign size={18} className="text-primary" />
              <div>
                <span className="font-bold text-sm text-foreground">Balance</span>
                <p className="text-[10px] text-muted">Available to cashout</p>
              </div>
            </div>
            <span className="text-lg font-extrabold text-primary">CAD {(stats?.balance || 0).toFixed(2)}</span>
          </div>

          {/* Streak row */}
          <div className="w-full bg-surface rounded-2xl p-3.5 border border-border flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <Flame size={18} className="text-orange-500" />
              <div>
                <span className="font-bold text-sm text-foreground">Login Streak</span>
                <p className="text-[10px] text-muted">Keep it going!</p>
              </div>
            </div>
            <span className="text-lg font-extrabold text-orange-500">{stats?.streak || 0} days</span>
          </div>

          {/* Referral Card */}
          <ReferralCard />

          {/* Transaction History */}
          <div className="bg-surface rounded-2xl p-3.5 border border-border mb-3">
            <TransactionHistory />
          </div>

          {/* Started offers */}
          {startedOffers.length > 0 && (
            <div className="bg-surface rounded-2xl p-3.5 border border-border">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-accent-2" />
                  <span className="font-bold text-sm text-foreground">Active Offers</span>
                </div>
                <span className="text-[10px] text-primary font-medium">{startedOffers.length} active</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {startedOffers.map((userOffer) => (
                  <div key={userOffer.id} className="flex-shrink-0 w-24">
                    <img src={userOffer.offer.image} alt={userOffer.offer.name} className="w-24 h-24 rounded-xl object-cover" />
                    <p className="text-[10px] font-medium text-foreground mt-1 truncate">{userOffer.offer.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <div className="grid grid-cols-7 gap-1 mb-3">
              {calendar.length > 0
                ? calendar.map((bonus) => (
                    <motion.div
                      key={bonus.day}
                      whileTap={{ scale: 0.95 }}
                      className={`relative rounded-lg p-1.5 text-center border press-scale ${
                        bonus.claimed
                          ? "bg-primary/12 border-primary/25"
                          : bonus.isToday
                          ? "bg-accent-2/8 border-accent-2/25 ring-1 ring-accent-2/30"
                          : "bg-surface-light border-border"
                      }`}
                    >
                      <p className="text-[8px] text-muted">Day {bonus.day}</p>
                      <p className={`text-[10px] font-bold ${bonus.claimed ? "text-primary" : bonus.isToday ? "text-accent-2" : "text-foreground"}`}>
                        C${bonus.amount.toFixed(2)}
                      </p>
                      {bonus.claimed && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                          <Check size={8} className="text-background" />
                        </div>
                      )}
                      {bonus.isToday && !bonus.claimed && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-2 rounded-full flex items-center justify-center">
                          <span className="text-[7px] text-background font-bold">!</span>
                        </div>
                      )}
                    </motion.div>
                  ))
                : [1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div key={day} className="rounded-lg p-1.5 text-center border bg-surface-light border-border">
                      <p className="text-[8px] text-muted">Day {day}</p>
                      <p className="text-[10px] font-bold text-foreground">--</p>
                    </div>
                  ))}
            </div>

            {/* Claim button */}
            {!claimedToday ? (
              <button
                onClick={claimDaily}
                disabled={claiming}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-background press-scale pulse-glow"
              >
                {claiming ? "Claiming..." : "🎁 Claim Daily Bonus"}
              </button>
            ) : (
              <div className="w-full py-2.5 rounded-xl text-sm font-bold bg-primary/10 text-primary text-center border border-primary/20">
                ✓ Claimed Today!
              </div>
            )}

            {claimMessage && (
              <p className={`text-xs text-center mt-2 ${claimedToday ? "text-primary" : "text-danger"}`}>
                {claimMessage}
              </p>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-surface rounded-2xl p-3.5 border border-border mb-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Award size={16} className="text-accent-2" />
              <h3 className="font-bold text-sm text-foreground">Achievements</h3>
              <span className="text-[9px] bg-surface-light px-1.5 py-0.5 rounded-full text-muted">
                {unlockedAchievements.size}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach, i) => {
                const Icon = ach.icon;
                const unlocked = unlockedAchievements.has(ach.id);
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`relative rounded-xl p-2.5 border press-scale ${
                      unlocked
                        ? "bg-surface-light border-border"
                        : "bg-surface-light/40 border-border/50 opacity-50"
                    }`}
                  >
                    {!unlocked && <Lock size={10} className="absolute top-2 right-2 text-muted" />}
                    <Icon size={18} className={unlocked ? ach.color : "text-muted"} />
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
                    currentLevel.level === lvl.level
                      ? "bg-primary/8 border-primary/25"
                      : currentLevel.level > lvl.level
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
                      <p className="text-[9px] text-muted">{lvl.minXp.toLocaleString()} XP</p>
                    </div>
                  </div>
                  {currentLevel.level === lvl.level && (
                    <span className="text-[8px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">CURRENT</span>
                  )}
                  {currentLevel.level > lvl.level && (
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
