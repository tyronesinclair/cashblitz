"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const PRIZE_LABELS = ["$0.05", "$0.10", "$0.15", "$0.25", "$0.50", "$1.00", "$2.00", "$5.00"];
const colors = [
  "#00e676", "#1c2333", "#ffd600", "#1c2333",
  "#ff6bff", "#1c2333", "#00bcd4", "#1c2333",
];

interface SpinWheelProps {
  onClose: () => void;
  onBalanceUpdate?: () => void;
}

export default function SpinWheel({ onClose, onBalanceUpdate }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState<string | null>(null);
  const [wonAmount, setWonAmount] = useState<number>(0);
  const [canSpin, setCanSpin] = useState(true);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check spin status on mount
  useEffect(() => {
    const checkSpinStatus = async () => {
      try {
        const res = await fetch("/api/spin");
        if (res.ok) {
          const data = await res.json();
          setCanSpin(data.canSpin);
          if (!data.canSpin) {
            setCooldownMs(data.cooldownMs || 0);
          }
        }
      } catch {
        // Silently fail — user can try spinning
      } finally {
        setLoading(false);
      }
    };
    checkSpinStatus();
  }, []);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownMs <= 0) return;
    const interval = setInterval(() => {
      setCooldownMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          setCanSpin(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownMs]);

  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const spin = useCallback(async () => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setWon(null);
    setError(null);

    try {
      const res = await fetch("/api/spin", { method: "POST" });
      const data = await res.json();

      if (res.status === 429) {
        // Already spun today
        setCanSpin(false);
        setCooldownMs(data.cooldownMs || 0);
        setSpinning(false);
        setError("You already spun today! Come back tomorrow.");
        return;
      }

      if (!res.ok) {
        setSpinning(false);
        setError(data.error || "Something went wrong");
        return;
      }

      // Animate to the server-determined prize
      const prizeIndex = data.prizeIndex ?? PRIZE_LABELS.indexOf(data.prize);
      const segmentAngle = 360 / PRIZE_LABELS.length;
      const spins = (5 + Math.random() * 3) * 360;
      const targetAngle = spins + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

      setRotation(targetAngle);

      setTimeout(() => {
        setSpinning(false);
        setWon(data.prize);
        setWonAmount(data.amount);
        setCanSpin(false);

        // Calculate cooldown until next UTC midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);
        setCooldownMs(tomorrow.getTime() - now.getTime());

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#00e676", "#ffd700", "#ff6bff"],
        });
      }, 4000);
    } catch {
      setSpinning(false);
      setError("Network error. Please try again.");
    }
  }, [spinning, canSpin]);

  const handleClose = () => {
    if (won && onBalanceUpdate) {
      onBalanceUpdate();
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-surface rounded-3xl p-6 max-w-sm w-full text-center border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold text-foreground mb-1">
          🎰 Daily Spin
        </h3>
        <p className="text-xs text-muted mb-4">
          {canSpin ? "Spin to win bonus cash!" : "Come back tomorrow for another spin!"}
        </p>

        {/* Wheel */}
        <div className="relative w-56 h-56 mx-auto mb-5">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-2xl">
            ▼
          </div>

          {/* Wheel body */}
          <motion.div
            className="w-full h-full rounded-full border-4 border-primary/40 overflow-hidden relative"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {PRIZE_LABELS.map((prize, i) => {
                const angle = (360 / PRIZE_LABELS.length) * i;
                const rad = (angle * Math.PI) / 180;
                const nextRad = ((angle + 360 / PRIZE_LABELS.length) * Math.PI) / 180;
                const x1 = 100 + 100 * Math.cos(rad);
                const y1 = 100 + 100 * Math.sin(rad);
                const x2 = 100 + 100 * Math.cos(nextRad);
                const y2 = 100 + 100 * Math.sin(nextRad);
                const textAngle = angle + 360 / PRIZE_LABELS.length / 2;
                const textRad = (textAngle * Math.PI) / 180;
                const tx = 100 + 62 * Math.cos(textRad);
                const ty = 100 + 62 * Math.sin(textRad);

                return (
                  <g key={i}>
                    <path
                      d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                      fill={colors[i]}
                      stroke="#0d1117"
                      strokeWidth="1"
                    />
                    <text
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                    >
                      {prize}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Center cap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center">
            <span className="text-lg">💰</span>
          </div>
        </div>

        {/* Won prize */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4"
            >
              <p className="text-xs text-muted">You won</p>
              <p className="text-3xl font-extrabold gradient-text-gold">{won}</p>
              <p className="text-[10px] text-primary mt-1">
                +${wonAmount.toFixed(2)} added to your balance!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && !won && (
          <div className="mb-4 text-xs text-danger">{error}</div>
        )}

        {/* Cooldown timer */}
        {!canSpin && cooldownMs > 0 && !won && !spinning && (
          <div className="mb-4">
            <p className="text-[10px] text-muted">Next spin available in</p>
            <p className="text-lg font-bold text-accent-2 font-mono">
              {formatCountdown(cooldownMs)}
            </p>
          </div>
        )}

        {/* Spin/Close button */}
        <button
          onClick={won ? handleClose : spin}
          disabled={spinning || loading || (!canSpin && !won)}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all press-scale ${
            spinning || loading
              ? "bg-surface-light text-muted cursor-not-allowed"
              : won
              ? "bg-primary text-background pulse-glow"
              : canSpin
              ? "bg-gradient-to-r from-primary to-teal-400 text-background pulse-glow"
              : "bg-surface-light text-muted cursor-not-allowed"
          }`}
        >
          {loading
            ? "Loading..."
            : spinning
            ? "Spinning..."
            : won
            ? "Collect & Close"
            : canSpin
            ? "🎰 SPIN NOW!"
            : "Already Spun Today"}
        </button>
      </motion.div>
    </motion.div>
  );
}
