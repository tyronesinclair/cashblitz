"use client";

import { useState } from "react";
import { DollarSign, CreditCard, Check, Clock, Shield, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { userProfile } from "@/data/offers";

const cashoutMethods = [
  { id: "paypal", name: "PayPal", icon: "💳", minAmount: 5, processingTime: "Instant", popular: true },
  { id: "visa", name: "Visa Gift Card", icon: "💎", minAmount: 10, processingTime: "1-2 hours", popular: false },
  { id: "amazon", name: "Amazon Gift Card", icon: "🛒", minAmount: 5, processingTime: "Instant", popular: true },
  { id: "crypto", name: "Bitcoin", icon: "₿", minAmount: 10, processingTime: "15 minutes", popular: false },
  { id: "apple", name: "Apple Gift Card", icon: "🍎", minAmount: 10, processingTime: "1-2 hours", popular: false },
  { id: "steam", name: "Steam Gift Card", icon: "🎮", minAmount: 5, processingTime: "Instant", popular: false },
];

const amounts = [5, 10, 25, 50, 100];

export default function CashoutPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCashout = () => {
    if (!selectedMethod || !selectedAmount) return;
    setShowSuccess(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ["#00e676", "#ffd700", "#ff6bff"] });
  };

  const method = cashoutMethods.find((m) => m.id === selectedMethod);
  const canCashout = selectedMethod && selectedAmount && selectedAmount <= userProfile.balance;

  return (
    <div className="px-4 py-4 pb-24 casino-bg">
      <h2 className="text-xl font-extrabold text-foreground mb-0.5">Cashout</h2>
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
          CAD {userProfile.balance.toFixed(2)}
        </span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <TrendingUp size={12} className="text-primary" />
          <span className="text-[10px] text-primary font-medium">+CAD 3.50 this week</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Amount */}
            <h3 className="font-bold text-foreground text-sm mb-2">Select Amount</h3>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  disabled={amt > userProfile.balance}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all press-scale ${
                    selectedAmount === amt
                      ? "bg-primary text-background glow-green"
                      : amt > userProfile.balance
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
              <DollarSign size={16} />
              {canCashout ? `Withdraw CAD ${selectedAmount?.toFixed(2)}` : "Select amount & method"}
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
            <p className="text-sm text-muted mb-5">CAD {selectedAmount?.toFixed(2)} is on its way to your {method?.name}</p>
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
