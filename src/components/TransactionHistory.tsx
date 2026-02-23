"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Gift, RotateCcw, Loader2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof DollarSign; label: string; color: string }> = {
  offer_reward: { icon: ArrowDownRight, label: "Offer Reward", color: "text-primary" },
  spin: { icon: RotateCcw, label: "Daily Spin", color: "text-cyan-400" },
  daily_bonus: { icon: Gift, label: "Daily Bonus", color: "text-orange-500" },
  referral_bonus: { icon: ArrowDownRight, label: "Referral Bonus", color: "text-purple-400" },
  withdraw: { icon: ArrowUpRight, label: "Withdrawal", color: "text-danger" },
  refund: { icon: ArrowDownRight, label: "Refund", color: "text-accent-2" },
  admin_adjustment: { icon: DollarSign, label: "Adjustment", color: "text-muted" },
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = filter === "all"
          ? "/api/user/transactions"
          : `/api/user/transactions?type=${filter}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [filter]);

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
    return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "spin", label: "Spins" },
    { id: "daily_bonus", label: "Bonuses" },
    { id: "withdraw", label: "Withdrawals" },
  ];

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <DollarSign size={16} className="text-primary" />
        <h3 className="font-bold text-sm text-foreground">Transaction History</h3>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setLoading(true); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all press-scale ${
              filter === f.id
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-surface-light text-muted border border-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign size={24} className="text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">No transactions yet</p>
          <p className="text-[10px] text-muted mt-1">Complete offers, spin the wheel, or claim daily bonuses!</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {transactions.slice(0, 30).map((tx, i) => {
            const config = typeConfig[tx.type] || typeConfig.admin_adjustment;
            const Icon = config.icon;
            const isPositive = tx.amount >= 0;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-2.5 p-2.5 bg-surface rounded-xl border border-border"
              >
                <div className={`w-8 h-8 rounded-lg ${isPositive ? "bg-primary/10" : "bg-danger/10"} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={14} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-foreground truncate">{tx.description}</p>
                  <p className="text-[9px] text-muted">{getTimeAgo(tx.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${isPositive ? "text-primary" : "text-danger"}`}>
                    {isPositive ? "+" : ""}C${Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-[8px] text-muted">C${tx.balanceAfter.toFixed(2)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
