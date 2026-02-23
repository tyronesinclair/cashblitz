"use client";

import { Search, FileText, DollarSign, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  myOffersCount?: number;
  rewardsBadge?: boolean;
}

const tabs = [
  { id: "earn", label: "Earn", icon: Search },
  { id: "my-offers", label: "My Offers", icon: FileText, showBadge: "offers" as const },
  { id: "cashout", label: "Cashout", icon: DollarSign },
  { id: "rewards", label: "Rewards", icon: Gift, showBadge: "reward" as const },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  myOffersCount = 0,
  rewardsBadge = false,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showCount = tab.showBadge === "offers" && myOffersCount > 0;
          const showDot = tab.showBadge === "reward" && rewardsBadge;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center py-2 pt-2.5 flex-1 group press-scale"
            >
              {/* Active indicator bar */}
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
                {/* Offer count badge */}
                {showCount && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-primary rounded-full flex items-center justify-center px-1"
                  >
                    <span className="text-[9px] font-bold text-background">{myOffersCount}</span>
                  </motion.span>
                )}
                {/* Reward dot */}
                {showDot && (
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
  );
}
