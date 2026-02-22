"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, Smartphone, Apple, Monitor, ChevronLeft, ChevronRight, Sparkles, Gift, Star, Loader2, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import OfferCard from "./OfferCard";
import OfferModal from "./OfferModal";
import SpinWheel from "./SpinWheel";
import LiveActivityFeed from "./LiveActivityFeed";

interface Reward {
  id: string;
  task: string;
  amount: number;
  timeLimit?: string;
  isBonus: boolean;
  isLimited: boolean;
  sortOrder: number;
}

export interface ApiOffer {
  id: string;
  name: string;
  image: string;
  rating: number;
  platform: string;
  totalReward: number;
  category: string;
  isPremium: boolean;
  isHot: boolean;
  isNew: boolean;
  isActive: boolean;
  description: string;
  steps: string;
  newUsersOnly: boolean;
  rewardMultiplier: number;
  externalUrl?: string;
  rewards: Reward[];
}

// Convert API offer to the format OfferCard/OfferModal expect
export function apiOfferToLocal(offer: ApiOffer) {
  return {
    id: offer.id,
    name: offer.name,
    image: offer.image,
    rating: offer.rating,
    platform: offer.platform as "ios" | "android" | "desktop",
    totalReward: offer.totalReward,
    category: offer.category as "game" | "survey" | "task",
    isPremium: offer.isPremium,
    isHot: offer.isHot,
    isNew: offer.isNew,
    description: offer.description,
    rewards: offer.rewards.map((r) => ({
      task: r.task,
      amount: r.amount,
      timeLimit: r.timeLimit || undefined,
      isBonus: r.isBonus,
      isLimited: r.isLimited,
    })),
    steps: typeof offer.steps === "string" ? JSON.parse(offer.steps) : offer.steps,
    newUsersOnly: offer.newUsersOnly,
    rewardMultiplier: offer.rewardMultiplier,
  };
}

const platformFilters = [
  { id: "all", label: "All" },
  { id: "android", label: "Android", icon: Smartphone },
  { id: "ios", label: "iOS", icon: Apple },
  { id: "desktop", label: "Desktop", icon: Monitor },
];

const categoryFilters = [
  { id: "all", label: "All" },
  { id: "game", label: "Games" },
  { id: "survey", label: "Surveys" },
  { id: "task", label: "Tasks" },
];

const sortOptions = [
  { id: "default", label: "Default" },
  { id: "reward-high", label: "Highest Reward" },
  { id: "reward-low", label: "Lowest Reward" },
  { id: "rating", label: "Best Rating" },
];

export default function EarnPage() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<ApiOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<ReturnType<typeof apiOfferToLocal> | null>(null);
  const [showSpin, setShowSpin] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [activeOfferCount, setActiveOfferCount] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch offers from API
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/offers");
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  // Fetch user balance
  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/user/balance");
        if (res.ok) {
          const data = await res.json();
          setUserBalance(data.balance);
          setActiveOfferCount(data.activeOfferCount);
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    }
    if (session?.user) fetchBalance();
  }, [session]);

  const refreshBalance = useCallback(async () => {
    try {
      const res = await fetch("/api/user/balance");
      if (res.ok) {
        const data = await res.json();
        setUserBalance(data.balance);
        setActiveOfferCount(data.activeOfferCount);
      }
    } catch { /* silent */ }
  }, []);

  const totalAvailable = useMemo(
    () => offers.reduce((sum, o) => sum + o.totalReward, 0),
    [offers]
  );

  const filtered = useMemo(() => {
    let result = offers.filter((o) => {
      const matchSearch = o.name.toLowerCase().includes(search.toLowerCase());
      const matchPlatform = platform === "all" || o.platform === platform;
      const matchCategory = category === "all" || o.category === category;
      return matchSearch && matchPlatform && matchCategory;
    });

    // Sort
    if (sortBy === "reward-high") result.sort((a, b) => b.totalReward - a.totalReward);
    else if (sortBy === "reward-low") result.sort((a, b) => a.totalReward - b.totalReward);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [search, platform, category, sortBy, offers]);

  const featured = useMemo(
    () => offers.filter((o) => o.isHot || o.isPremium).slice(0, 5),
    [offers]
  );

  const minCashout = 5;
  const progressPercent = Math.min((userBalance / minCashout) * 100, 100);

  const scrollCarousel = (dir: "left" | "right") => {
    carouselRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="ml-2 text-muted text-sm">Loading offers...</span>
      </div>
    );
  }

  return (
    <>
      <div className="pb-20 casino-bg">
        {/* === Search bar === */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search for offers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 rounded-xl border transition-all press-scale ${
                showFilters || category !== "all" || sortBy !== "default"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-surface border-border text-muted"
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* === Extra filters (category + sort) === */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-2 space-y-2">
                <div>
                  <p className="text-[10px] text-muted font-semibold mb-1">Category</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {categoryFilters.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setCategory(f.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all press-scale ${
                          category === f.id
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-surface-light text-muted border border-border"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted font-semibold mb-1">Sort by</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {sortOptions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSortBy(s.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all press-scale ${
                          sortBy === s.id
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-surface-light text-muted border border-border"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === Payout progress bar === */}
        <div className="px-4 pb-2">
          <p className="text-center text-sm font-semibold text-foreground mb-1.5">
            {progressPercent >= 100
              ? "Ready to cash out!"
              : `CAD ${(minCashout - userBalance).toFixed(2)} more to cash out`}
          </p>
          <div className="relative h-7 bg-surface-light rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-primary-dark to-primary rounded-full"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground drop-shadow-sm">
              CAD {userBalance.toFixed(2)} / CAD {minCashout.toFixed(2)}
            </span>
          </div>
        </div>

        {/* === Stats line === */}
        <div className="text-center py-3">
          <h2 className="text-2xl font-extrabold text-foreground">
            {filtered.length} Offers available
          </h2>
          <p className="text-sm text-muted mt-0.5">
            <span className="text-primary font-bold">CAD</span>{" "}
            <span className="font-bold text-foreground">
              {totalAvailable.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>{" "}
            to earn
            {activeOfferCount > 0 && (
              <span className="ml-2 text-accent-2">| {activeOfferCount} active</span>
            )}
          </p>
        </div>

        {/* === Daily spin banner === */}
        <div className="px-4 mb-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSpin(true)}
            className="w-full bg-gradient-to-r from-purple-600/20 via-accent/10 to-gold/10 border border-accent/20 rounded-2xl p-3 flex items-center gap-3 press-scale"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-3xl"
            >
              🎰
            </motion.span>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-foreground">Daily Bonus Spin!</p>
              <p className="text-xs text-muted">Spin the wheel for free cash - 1 free spin per day</p>
            </div>
            <div className="bg-accent/20 text-accent text-xs font-bold px-3 py-1.5 rounded-full">
              FREE
            </div>
          </motion.button>
        </div>

        {/* === Featured carousel === */}
        {featured.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between px-4 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent-2" />
                <h3 className="font-bold text-sm text-foreground">Featured Offers</h3>
              </div>
              <div className="flex gap-1 sm:flex">
                <button onClick={() => scrollCarousel("left")} className="p-1 bg-surface-light rounded-full border border-border">
                  <ChevronLeft size={14} className="text-muted" />
                </button>
                <button onClick={() => scrollCarousel("right")} className="p-1 bg-surface-light rounded-full border border-border">
                  <ChevronRight size={14} className="text-muted" />
                </button>
              </div>
            </div>
            <div
              ref={carouselRef}
              className="flex gap-3 px-4 overflow-x-auto no-scrollbar snap-x snap-mandatory"
            >
              {featured.map((offer) => (
                <motion.div
                  key={offer.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedOffer(apiOfferToLocal(offer))}
                  className="flex-shrink-0 w-[260px] snap-start bg-surface rounded-2xl overflow-hidden border border-border cursor-pointer press-scale"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                      <span className="text-[10px] font-bold text-white">{offer.rating}</span>
                      <Star size={8} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    {offer.isHot && (
                      <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        HOT
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-primary text-xs font-bold">CAD</span>
                      <span className="text-base font-extrabold text-foreground">{offer.totalReward.toFixed(2)}</span>
                      <span className="text-xs text-muted truncate">{offer.name}</span>
                    </div>
                    <div className="bg-primary/15 text-primary text-center py-1.5 rounded-lg text-xs font-bold">
                      Earn Now
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* === Earn on filters (platform) === */}
        <div className="px-4 mb-1">
          <p className="text-xs font-semibold text-muted mb-1.5 flex items-center gap-1.5">
            <Smartphone size={12} />
            Earn on
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {platformFilters.map((f) => {
              const count = f.id === "all" ? offers.length : offers.filter((o) => o.platform === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setPlatform(f.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all press-scale ${
                    platform === f.id
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-surface-light text-muted border border-border active:bg-border"
                  }`}
                >
                  {f.icon && <f.icon size={12} />}
                  {f.label}
                  <span className="text-[9px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* === Offer list - single column on mobile, grid on desktop === */}
        <div className="px-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((offer, i) => (
                <OfferCard
                  key={offer.id}
                  offer={apiOfferToLocal(offer)}
                  onPlay={() => setSelectedOffer(apiOfferToLocal(offer))}
                  onInfo={() => setSelectedOffer(apiOfferToLocal(offer))}
                  index={i}
                  featured={i === 0}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-muted text-base font-semibold">No offers found</p>
              <p className="text-sm text-muted mt-1">Try a different search or filter</p>
            </div>
          )}
        </div>

        {/* === Referral banner at bottom === */}
        <div className="px-4 mt-6 mb-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-primary/10 to-primary-dark/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 cursor-pointer press-scale"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gift size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">Invite friends, earn CAD 5.00</p>
              <p className="text-xs text-muted mt-0.5">Share your link and earn for each signup</p>
            </div>
            <ChevronRight size={18} className="text-muted flex-shrink-0" />
          </motion.div>
        </div>

        {/* Live Activity Feed */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <h3 className="text-xs font-bold text-muted">Live Activity</h3>
          </div>
          <LiveActivityFeed />
        </div>
      </div>

      {/* Offer modal */}
      <AnimatePresence>
        {selectedOffer && (
          <OfferModal
            offer={selectedOffer}
            onClose={() => setSelectedOffer(null)}
            onOfferStarted={refreshBalance}
          />
        )}
      </AnimatePresence>

      {/* Spin wheel modal */}
      <AnimatePresence>
        {showSpin && (
          <SpinWheel
            onClose={() => {
              setShowSpin(false);
              refreshBalance();
            }}
            onBalanceUpdate={refreshBalance}
          />
        )}
      </AnimatePresence>
    </>
  );
}
