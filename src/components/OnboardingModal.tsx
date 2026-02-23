"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Gift, DollarSign, Trophy, ChevronRight, X, Sparkles } from "lucide-react";

interface OnboardingModalProps {
  onComplete: () => void;
  userName?: string;
}

const steps = [
  {
    icon: Zap,
    emoji: "🎉",
    title: "Welcome to CashBlitz!",
    description: "Earn real Canadian dollars by completing simple tasks, playing games, and taking surveys.",
    color: "from-primary to-teal-400",
  },
  {
    icon: Gift,
    emoji: "🎁",
    title: "Daily Bonuses",
    description: "Login every day to collect escalating bonuses. 7 days in a row unlocks a massive C$2.00 reward! Don't break your streak!",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: DollarSign,
    emoji: "💰",
    title: "Earn & Cashout",
    description: "Withdraw anytime via Interac e-Transfer, PayPal, crypto, or gift cards",
    color: "from-primary to-emerald-500",
  },
  {
    icon: Trophy,
    emoji: "🏆",
    title: "Level Up & Win",
    description: "Earn XP to level up from Rookie to Diamond. Spin the daily wheel for bonus cash. Unlock achievements as you play!",
    color: "from-purple-500 to-pink-500",
  },
];

export default function OnboardingModal({ onComplete, userName }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-surface rounded-3xl p-6 max-w-sm w-full text-center border border-border relative overflow-hidden"
      >
        {/* Skip button */}
        {!isLast && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 text-muted hover:text-foreground transition-colors press-scale z-10"
          >
            <X size={18} />
          </button>
        )}

        {/* Decorative bg */}
        <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${step.color} opacity-5`} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              <Icon size={36} className="text-white" />
            </motion.div>

            {/* Welcome with name on first step */}
            {currentStep === 0 && userName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-primary font-semibold mb-1"
              >
                Hey {userName}! 👋
              </motion.p>
            )}

            <h3 className="text-xl font-extrabold text-foreground mb-2">
              {step.emoji} {step.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === currentStep ? 24 : 8,
                backgroundColor: i === currentStep ? "var(--color-primary)" : "var(--color-border)",
              }}
              className="h-2 rounded-full transition-all"
            />
          ))}
        </div>

        {/* Action button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r ${step.color} text-white flex items-center justify-center gap-2 press-scale pulse-glow`}
        >
          {isLast ? (
            <>
              <Sparkles size={16} />
              Let&apos;s Start Earning!
            </>
          ) : (
            <>
              Next
              <ChevronRight size={16} />
            </>
          )}
        </motion.button>

        {/* Step counter */}
        <p className="text-[10px] text-muted mt-3">
          {currentStep + 1} of {steps.length}
        </p>
      </motion.div>
    </motion.div>
  );
}
