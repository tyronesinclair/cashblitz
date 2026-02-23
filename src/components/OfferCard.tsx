"use client";

import { Star, Apple, Smartphone, Monitor, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { Offer } from "@/data/offers";

interface OfferCardProps {
  offer: Offer;
  onPlay: () => void;
  onInfo: () => void;
  index: number;
  featured?: boolean;
}

const platformIcon = {
  ios: Apple,
  android: Smartphone,
  desktop: Monitor,
};

export default function OfferCard({ offer, onPlay, onInfo, index, featured }: OfferCardProps) {
  const PlatformIcon = platformIcon[offer.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="card-hover bg-surface rounded-2xl overflow-hidden border border-border"
    >
      {/* Large banner image - full width, tappable opens info */}
      <button onClick={onInfo} className="relative w-full block press-scale">
        <div className={`relative w-full ${featured ? "h-52" : "h-44"} overflow-hidden`}>
          <img
            src={offer.image}
            alt={offer.name}
            className="w-full h-full object-cover"
          />

          {/* Rating badge top-left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-xs font-bold text-white">{offer.rating}</span>
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
          </div>

          {/* Platform icon top-right */}
          <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-sm rounded-lg p-1.5">
            <PlatformIcon size={14} className="text-white" />
          </div>

          {/* Premium / Hot / New badge over image */}
          {(offer.isPremium || offer.isHot || offer.isNew) && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {offer.isPremium && (
                <span className="bg-gradient-to-r from-purple-600 to-accent text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg">
                  Premium
                </span>
              )}
              {offer.isHot && (
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg">
                  🔥 HOT
                </span>
              )}
              {offer.isNew && (
                <span className="bg-gradient-to-r from-primary to-teal-400 text-background text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg">
                  NEW
                </span>
              )}
            </div>
          )}

          {/* Carousel arrow hint — only for featured cards */}
          {featured && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white text-xs">&#8250;</span>
            </div>
          )}
        </div>
      </button>

      {/* Info row below image: CAD amount | Name | info button */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-3">
        <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
          <span className="text-primary text-xs font-bold">CAD</span>
          <span className="text-lg font-extrabold text-foreground">{offer.totalReward.toFixed(2)}</span>
          <span className="text-sm font-semibold text-foreground truncate ml-1">{offer.name}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onInfo(); }}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/40 flex items-center justify-center press-scale"
        >
          <Info size={14} className="text-primary" />
        </button>
      </div>

      {/* CTA button */}
      <div className="px-4 pb-4 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onPlay}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-background font-bold text-sm rounded-xl transition-colors pulse-glow press-scale"
        >
          Play and Earn CAD {offer.totalReward.toFixed(2)}
        </motion.button>
      </div>
    </motion.div>
  );
}
