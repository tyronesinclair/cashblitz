"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Generate realistic-looking fake activity for social proof
const firstNames = [
  "Alex", "Jordan", "Sam", "Taylor", "Casey", "Morgan", "Jamie", "Riley",
  "Quinn", "Avery", "Blake", "Drew", "Parker", "Hayden", "Charlie", "Dakota",
  "Sage", "Reese", "Finley", "Phoenix", "Cameron", "Rowan", "River", "Skyler",
  "Jean-Pierre", "Marie-Claire", "Guillaume", "Isabelle", "Sophie", "Mathieu",
  "Camille", "\u00c9tienne", "Luc", "\u00c9milie",
];

const actions = [
  { verb: "earned", emoji: "💰", color: "text-primary" },
  { verb: "cashed out", emoji: "💸", color: "text-accent-2" },
  { verb: "won", emoji: "🎰", color: "text-cyan-400" },
  { verb: "completed", emoji: "✅", color: "text-primary" },
];

const offerNames = [
  "Puzzles & Chaos", "Monopoly GO!", "RAID: Shadow Legends",
  "Rise of Kingdoms", "State of Survival", "a quick survey",
  "AFK Arena", "Township", "Coin Master", "a daily spin",
];

function generateActivity() {
  const name = firstNames[Math.floor(Math.random() * firstNames.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const offer = offerNames[Math.floor(Math.random() * offerNames.length)];

  let amount: string;
  if (action.verb === "cashed out") {
    amount = `C$${(Math.floor(Math.random() * 20) * 5 + 5).toFixed(2)}`;
  } else if (action.verb === "won") {
    const prizes = [0.05, 0.10, 0.25, 0.50, 1.00, 2.00];
    amount = `C$${prizes[Math.floor(Math.random() * prizes.length)].toFixed(2)}`;
  } else {
    amount = `C$${(Math.random() * 50 + 1).toFixed(2)}`;
  }

  const timeAgo = `${Math.floor(Math.random() * 59) + 1}m ago`;
  const initial = name[0];

  return {
    id: Math.random().toString(36).slice(2),
    name: `${name} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
    initial,
    action: action.verb,
    emoji: action.emoji,
    color: action.color,
    offer: action.verb === "won" ? "the daily spin" : action.verb === "cashed out" ? ["via Interac e-Transfer", "via PayPal", "via Amazon.ca"][Math.floor(Math.random() * 3)] : offer,
    amount,
    timeAgo,
  };
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState(() =>
    Array.from({ length: 3 }, generateActivity)
  );

  // Auto-rotate activities
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = generateActivity();
        return [newActivity, ...prev.slice(0, 2)];
      });
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1.5">
      <AnimatePresence mode="popLayout">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 p-2 bg-surface/80 rounded-lg border border-border/50"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-primary">{activity.initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted truncate">
                <span className="font-semibold text-foreground">{activity.name}</span>{" "}
                {activity.action}{" "}
                <span className={`font-bold ${activity.color}`}>{activity.amount}</span>{" "}
                from {activity.offer}
              </p>
            </div>
            <span className="text-[8px] text-muted flex-shrink-0">{activity.timeAgo}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
