"use client";

import { useState, useEffect } from "react";
import { Users, Copy, Check, Gift, TrendingUp, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  completedReferrals: number;
  totalEarned: number;
}

export default function ReferralCard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await fetch("/api/referral");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchReferral();
  }, []);

  const copyLink = async () => {
    if (!stats) return;
    try {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  };

  const shareLink = async () => {
    if (!stats) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join CashBlitz!",
          text: "Earn real cash completing tasks, games & surveys. Use my referral link to get a bonus!",
          url: stats.referralLink,
        });
      } catch {
        // User cancelled share
      }
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl p-3.5 border border-border mb-3 animate-pulse">
        <div className="h-4 bg-surface-light rounded w-32 mb-2" />
        <div className="h-3 bg-surface-light rounded w-48 mb-3" />
        <div className="h-10 bg-surface-light rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-surface rounded-2xl p-3.5 border border-border mb-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Users size={16} className="text-primary" />
        <h3 className="font-bold text-sm text-foreground">Invite Friends</h3>
      </div>
      <p className="text-[10px] text-muted mb-3">
        Share your referral link and earn $1.00 for every friend who signs up and completes their first offer!
      </p>

      {/* Referral link */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-surface-light rounded-xl px-3 py-2 border border-border overflow-hidden">
          <p className="text-[11px] text-foreground font-mono truncate">
            {stats.referralLink}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={copyLink}
          className={`px-3 rounded-xl flex items-center gap-1 text-xs font-bold transition-all press-scale ${
            copied
              ? "bg-primary text-background"
              : "bg-primary/10 text-primary border border-primary/20"
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>

      {/* Share button */}
      <button
        onClick={shareLink}
        className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-teal-400 text-background flex items-center justify-center gap-2 press-scale mb-3"
      >
        <Share2 size={14} />
        Share Invite Link
      </button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface-light rounded-xl p-2.5 text-center border border-border">
          <Users size={14} className="text-primary mx-auto mb-1" />
          <p className="text-sm font-extrabold text-foreground">{stats.totalReferrals}</p>
          <p className="text-[9px] text-muted">Invited</p>
        </div>
        <div className="bg-surface-light rounded-xl p-2.5 text-center border border-border">
          <Gift size={14} className="text-accent-2 mx-auto mb-1" />
          <p className="text-sm font-extrabold text-foreground">{stats.completedReferrals}</p>
          <p className="text-[9px] text-muted">Completed</p>
        </div>
        <div className="bg-surface-light rounded-xl p-2.5 text-center border border-border">
          <TrendingUp size={14} className="text-primary mx-auto mb-1" />
          <p className="text-sm font-extrabold text-primary">${stats.totalEarned.toFixed(2)}</p>
          <p className="text-[9px] text-muted">Earned</p>
        </div>
      </div>
    </div>
  );
}
