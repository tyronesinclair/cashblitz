"use client";

import { Bell, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface TopBarProps {
  balance: number;
  streak: number;
}

export default function TopBar({ balance, streak }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-lg border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Avatar + Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            whileTap={{ scale: 0.9, rotate: 10 }}
            className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center ring-2 ring-primary/30"
          >
            <Zap size={16} className="text-background" fill="currentColor" />
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-surface" />
          </motion.div>
          <h1 className="text-lg font-extrabold tracking-tight hidden sm:block">
            <span className="gradient-text">CASH</span>
            <span className="text-foreground">BLITZ</span>
          </h1>
        </div>

        {/* Right side stats */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 bg-surface-light rounded-full px-2.5 py-1.5"
          >
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-foreground">{streak}</span>
          </motion.div>

          {/* Balance pill */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 bg-primary/10 border border-primary/25 rounded-full px-2.5 py-1.5"
          >
            <span className="text-[10px] text-primary font-semibold">CAD</span>
            <span className="text-xs font-bold text-primary">{balance.toFixed(2)}</span>
          </motion.div>

          {/* Notification bell */}
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
  );
}
