"use client";

import { useState, useMemo, useRef } from "react";
import { Search, Smartphone, Apple, Monitor, ChevronLeft, ChevronRight, Sparkles, Gift, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { offers, userProfile } from "@/data/offers";
import OfferCard from "./OfferCard";
import OfferModal from "./OfferModal";
import SpinWheel from "./SpinWheel";
import type { Offer } from "@/data/offers";

const filters = [
  { id: "all", label: "All" },
  { id: "android", label: "Android", icon: Smartphone },
  { id: "ios", label: "iOS", icon: Apple },
  { id: "desktop", label: "Desktop", icon: Monitor },
];

export default function EarnPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showSpin, setShowSpin] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalAvailable = useMemo(
    () => offers.reduce((sum, o) => sum + o.totalReward, 0),
    []
  );

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      const matchSearch = o.name.toLowerCase().includes(search.toLowerCase());
      const matchPlatform = platform === "all" || o.platform === platform;
      return matchSearch && matchPlatform;
    });
  }, [search, platform]);

  const featured = offers.filter((o) => o.isHot || o.isPremium).slice(0, 5);

  const progressPercent = Math.min(
    (userProfile.balance / userProfile.nextPayoutThreshold) * 100,
    100
  );

  const scrollCarousel = (dir: "left" | "right") => {
    carouselRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <>
      <div className="pb-20 casino-bg">
        {/* === Search bar === */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search for offers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* === Payout progress bar === */}
        <div className="px-4 pb-2">
          <p className="text-center text-sm font-semibold text-foreground mb-1.5">
            Next payout for CAD {userProfile.nextPayoutThreshold}
          </p>
          <div className="relative h-7 bg-surface-light rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-primary-dark to-primary rounded-full"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground drop-shadow-sm">
              CAD {userProfile.balance.toFixed(2)} / CAD {userProfile.nextPayoutThreshold}
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
              <p className="text-xs text-muted">Spin the wheel for free cash</p>
            </div>
            <div className="bg-accent/20 text-accent text-xs font-bold px-3 py-1.5 rounded-full">
              FREE
            </div>
          </motion.button>
        </div>

        {/* === Featured carousel === */}
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
                onClick={() => setSelectedOffer(offer)}
                className="flex-shrink-0 w-[260px] snap-start bg-surface rounded-2xl overflow-hidden border border-border cursor-pointer press-scale"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
                  {/* Rating */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                    <span className="text-[10px] font-bold text-white">{offer.rating}</span>
                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  {offer.isHot && (
                    <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      🔥 HOT
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
                    Earn Now →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* === Earn on filters (like Freecash) === */}
        <div className="px-4 mb-1">
          <p className="text-xs font-semibold text-muted mb-1.5 flex items-center gap-1.5">
            <Smartphone size={12} />
            Earn on
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map((f) => (
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
              </button>
            ))}
          </div>
        </div>

        {/* === Offer list - single column on mobile, grid on desktop === */}
        <div className="px-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((offer, i) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onPlay={() => setSelectedOffer(offer)}
                  onInfo={() => setSelectedOffer(offer)}
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
      </div>

      {/* Offer modal */}
      <AnimatePresence>
        {selectedOffer && (
          <OfferModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
        )}
      </AnimatePresence>

      {/* Spin wheel modal */}
      <AnimatePresence>
        {showSpin && <SpinWheel onClose={() => setShowSpin(false)} />}
      </AnimatePresence>
    </>
  );
}
