"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const prizes = ["$0.25", "$0.50", "$1.00", "$0.10", "$2.00", "$0.05", "$5.00", "$0.15"];
const colors = [
  "#00e676", "#1c2333", "#ffd600", "#1c2333",
  "#ff6bff", "#1c2333", "#00bcd4", "#1c2333",
];

export default function SpinWheel({ onClose }: { onClose: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState<string | null>(null);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setWon(null);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    // Spin 5-8 full rotations + land on the prize
    const spins = (5 + Math.random() * 3) * 360;
    const targetAngle = spins + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setWon(prizes[prizeIndex]);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#00e676", "#ffd700", "#ff6bff"],
      });
    }, 4000);
  }, [spinning]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
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
        <p className="text-xs text-muted mb-4">Spin to win bonus cash!</p>

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
              {prizes.map((prize, i) => {
                const angle = (360 / prizes.length) * i;
                const rad = (angle * Math.PI) / 180;
                const nextRad = ((angle + 360 / prizes.length) * Math.PI) / 180;
                const x1 = 100 + 100 * Math.cos(rad);
                const y1 = 100 + 100 * Math.sin(rad);
                const x2 = 100 + 100 * Math.cos(nextRad);
                const y2 = 100 + 100 * Math.sin(nextRad);
                const textAngle = angle + 360 / prizes.length / 2;
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all press-scale ${
            spinning
              ? "bg-surface-light text-muted cursor-not-allowed"
              : won
              ? "bg-primary text-background pulse-glow"
              : "bg-gradient-to-r from-primary to-teal-400 text-background pulse-glow"
          }`}
        >
          {spinning ? "Spinning..." : won ? "Collect & Close" : "🎰 SPIN NOW!"}
        </button>
      </motion.div>
    </motion.div>
  );
}
