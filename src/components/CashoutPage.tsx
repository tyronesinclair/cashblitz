"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Check, Clock, Shield, TrendingUp, Loader2, AlertCircle, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const cashoutMethods = [
  { id: "paypal", name: "PayPal", icon: "💳", minAmount: 5, processingTime: "Instant", popular: true },
  { id: "visa", name: "Visa Gift Card", icon: "💎", minAmount: 10, processingTime: "1-2 hours", popular: false },
  { id: "amazon", name: "Amazon Gift Card", icon: "🛒", minAmount: 5, processingTime: "Instant", popular: true },
  { id: "crypto", name: "Bitcoin", icon: "₿", minAmount: 10, processingTime: "15 minutes", popular: false },
  { id: "apple", name: "Apple Gift Card", icon: "🍎", minAmount: 10, processingTime: "1-2 hours", popular: false },
  { id: "steam", name: "Steam Gift Card", icon: "🎮", minAmount: 5, processingTime: "Instant", popular: false },
];

const amounts = [5, 10, 25, 50, 100];

interface Payout {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

export default function CashoutPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(0);

  // Fetch real balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/user/balance");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
          setWeeklyEarnings(data.totalEarnings || 0);
        }
      } catch {
        // Fallback to 0
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  // Fetch payout history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/cashout");
        if (res.ok) {
          const data = await res.json();
          setPayoutHistory(data);
        }
      } catch {
        // Silent fail
      }
    };
    fetchHistory();
  }, [showSuccess]);

  const handleCashout = async () => {
    if (!selectedMethod || !selectedAmount || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount, method: selectedMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Cashout failed. Please try again.");
        setSubmitting(false);
        return;
      }

      // Success
      setBalance((prev) => prev - selectedAmount);
      setShowSuccess(true);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ["#00e676", "#ffd700", "#ff6bff"] });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const method = cashoutMethods.find((m) => m.id === selectedMethod);
  const canCashout = selectedMethod && selectedAmount && selectedAmount <= balance && !submitting;

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-primary";
      case "pending": return "text-accent-2";
      case "processing": return "text-cyan-400";
      case "rejected": return "text-danger";
      default: return "text-muted";
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-4 pb-24 casino-bg flex items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24 casino-bg">
      <div className="flex items-center justify-between mb-0.5">
        <h2 className="text-xl font-extrabold text-foreground">Cashout</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1 text-xs font-medium text-primary press-scale"
        >
          <History size={14} />
          {showHistory ? "Back" : "History"}
        </button>
      </div>
      <p className="text-xs text-muted mb-4">Withdraw your earnings</p>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-surface rounded-2xl p-4 mb-5 border border-border"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted">Available Balance</span>
        </div>
        <span className="text-3xl font-extrabold text-foreground">
          CAD {balance.toFixed(2)}
        </span>
        {weeklyEarnings > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <TrendingUp size={12} className="text-primary" />
            <span className="text-[10px] text-primary font-medium">CAD {weeklyEarnings.toFixed(2)} total earned</span>
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          /* ── Payout History ── */
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="font-bold text-foreground text-sm mb-3">Withdrawal History</h3>
            {payoutHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">💸</p>
                <p className="text-muted text-sm">No withdrawals yet</p>
                <p className="text-xs text-muted mt-1">Complete offers to earn and withdraw!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {payoutHistory.map((payout, i) => (
                  <motion.div
                    key={payout.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-surface rounded-xl p-3 border border-border flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {cashoutMethods.find((m) => m.id === payout.method)?.icon}{" "}
                        {cashoutMethods.find((m) => m.id === payout.method)?.name || payout.method}
                      </p>
                      <p className="text-[10px] text-muted">
                        {new Date(payout.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">CAD {payout.amount.toFixed(2)}</p>
                      <p className={`text-[10px] font-semibold capitalize ${statusColor(payout.status)}`}>
                        {payout.status}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : !showSuccess ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 border border-danger/20 rounded-xl p-3 mb-4 flex items-center gap-2"
              >
                <AlertCircle size={14} className="text-danger flex-shrink-0" />
                <p className="text-xs text-danger">{error}</p>
              </motion.div>
            )}

            {/* Amount */}
            <h3 className="font-bold text-foreground text-sm mb-2">Select Amount</h3>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  disabled={amt > balance}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all press-scale ${
                    selectedAmount === amt
                      ? "bg-primary text-background glow-green"
                      : amt > balance
                      ? "bg-surface-light text-muted/30 border border-border cursor-not-allowed"
                      : "bg-surface-light text-foreground border border-border active:bg-border"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Methods */}
            <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-1.5">
              <CreditCard size={14} className="text-primary" />
              Payment Method
            </h3>
            <div className="space-y-1.5 mb-5">
              {cashoutMethods.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all press-scale ${
                    selectedMethod === m.id
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-surface border border-border active:bg-surface-light"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[13px] text-foreground">{m.name}</span>
                      {m.popular && (
                        <span className="text-[8px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">POPULAR</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted flex items-center gap-0.5"><Clock size={8} /> {m.processingTime}</span>
                      <span className="text-[10px] text-muted">Min: ${m.minAmount}</span>
                      <span className="text-[10px] text-primary font-medium">No fee</span>
                    </div>
                  </div>
                  {selectedMethod === m.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-background" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Summary */}
            {selectedAmount && selectedMethod && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-2xl p-3.5 border border-border mb-4 text-sm">
                <div className="flex justify-between mb-1.5"><span className="text-muted">Amount</span><span className="font-bold text-foreground">CAD {selectedAmount?.toFixed(2)}</span></div>
                <div className="flex justify-between mb-1.5"><span className="text-muted">Method</span><span className="font-bold text-foreground">{method?.name}</span></div>
                <div className="flex justify-between mb-1.5"><span className="text-muted">Fee</span><span className="font-bold text-primary">FREE</span></div>
                <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between">
                  <span className="font-bold text-foreground">You receive</span>
                  <span className="font-extrabold gradient-text">CAD {selectedAmount?.toFixed(2)}</span>
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.button
              whileTap={canCashout ? { scale: 0.98 } : {}}
              onClick={handleCashout}
              disabled={!canCashout}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 press-scale ${
                canCashout
                  ? "bg-primary text-background pulse-glow"
                  : "bg-surface-light text-muted border border-border cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <DollarSign size={16} />
              )}
              {submitting
                ? "Processing..."
                : canCashout
                ? `Withdraw CAD ${selectedAmount?.toFixed(2)}`
                : "Select amount & method"}
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={12} className="text-muted" />
              <span className="text-[10px] text-muted">Secure, encrypted transactions</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Check size={32} className="text-primary" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-foreground mb-1">Cashout Successful! 🎉</h3>
            <p className="text-sm text-muted mb-1">CAD {selectedAmount?.toFixed(2)} is on its way to your {method?.name}</p>
            <p className="text-xs text-muted mb-5">You&apos;ll be notified when it&apos;s processed.</p>
            <button
              onClick={() => { setShowSuccess(false); setSelectedAmount(null); setSelectedMethod(null); }}
              className="px-8 py-2.5 bg-surface-light border border-border rounded-xl text-sm font-semibold text-foreground active:bg-border press-scale"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
