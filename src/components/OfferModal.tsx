"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X, Star, Apple, Smartphone, Monitor, Clock, ChevronRight,
  Download, Shield, Shuffle, Users, ChevronDown, HelpCircle, Sparkles, CheckCircle, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Offer } from "@/data/offers";

interface OfferModalProps {
  offer: Offer | null;
  onClose: () => void;
  onOfferStarted?: () => void;
}

const platformIcon = {
  ios: Apple,
  android: Smartphone,
  desktop: Monitor,
};

export default function OfferModal({ offer, onClose, onOfferStarted }: OfferModalProps) {
  const [activeTab, setActiveTab] = useState<"rewards" | "details">("rewards");
  const [showAllRewards, setShowAllRewards] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startStatus, setStartStatus] = useState<"idle" | "started" | "already" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const confettiFired = useRef(false);

  const handleStart = useCallback(async () => {
    if (!offer || isStarting) return;
    setIsStarting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/offers/${offer.id}/start`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        if (!confettiFired.current) {
          confettiFired.current = true;
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.7 },
            colors: ["#00e676", "#ffd700", "#ff6bff", "#00bcd4"],
          });
        }

        if (data.message === "Offer already started") {
          setStartStatus("already");
        } else {
          setStartStatus("started");
          onOfferStarted?.();
        }

        if (data.externalUrl) {
          setTimeout(() => {
            window.open(data.externalUrl, "_blank");
          }, 1500);
        }
      } else {
        setStartStatus("error");
        setErrorMsg(data.error || "Failed to start offer");
      }
    } catch {
      setStartStatus("error");
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }, [offer, isStarting, onOfferStarted]);

  useEffect(() => {
    confettiFired.current = false;
    setActiveTab("rewards");
    setShowAllRewards(false);
    setStartStatus("idle");
    setErrorMsg("");
  }, [offer]);

  useEffect(() => {
    if (offer) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [offer]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!offer) return null;

  const PlatformIcon = platformIcon[offer.platform];
  const displayRewards = showAllRewards ? offer.rewards : offer.rewards.slice(0, 4);
  const hasMore = offer.rewards.length > 4;
  const multiplierDots = Array.from({ length: 5 }, (_, i) => i < offer.rewardMultiplier);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${offer.name} offer details`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="absolute bottom-0 left-0 right-0 max-h-[94vh] bg-surface rounded-t-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="px-4 pb-2 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground truncate pr-2">{offer.name}</h2>
              <button onClick={onClose} className="p-2 bg-surface-light rounded-full active:bg-border transition-colors flex-shrink-0">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 overscroll-contain pb-24">
            <div className="relative mx-4 rounded-2xl overflow-hidden h-44 sm:h-52">
              <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-xs font-bold text-white">{offer.rating}</span>
                <Star size={9} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm rounded-lg p-1.5">
                <PlatformIcon size={14} className="text-white" />
              </div>
            </div>

            <div className="px-4 mt-3 flex items-end justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                CAD {offer.totalReward.toFixed(2)}
              </span>
              <div className="text-right">
                <div className="flex items-center gap-1 text-muted text-xs">
                  <span>Reward Multiplier</span>
                  <HelpCircle size={12} />
                </div>
                <div className="flex gap-1 mt-1 justify-end">
                  {multiplierDots.map((filled, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-full ${filled ? "bg-gradient-to-br from-accent to-purple-500" : "bg-surface-light border border-border"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Status messages */}
            {startStatus === "started" && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-3 bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-primary flex-shrink-0" />
                <p className="text-xs text-primary font-medium">Offer started! Complete the tasks below to earn rewards.</p>
              </motion.div>
            )}
            {startStatus === "already" && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-3 bg-accent-2/10 border border-accent-2/20 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-accent-2 flex-shrink-0" />
                <p className="text-xs text-accent-2 font-medium">You&apos;ve already started this offer. Keep earning!</p>
              </motion.div>
            )}
            {startStatus === "error" && errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-3 bg-danger/10 border border-danger/20 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-danger flex-shrink-0" />
                <p className="text-xs text-danger font-medium">{errorMsg}</p>
              </motion.div>
            )}

            <div className="px-4 mt-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                disabled={isStarting}
                className={`w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all press-scale ${
                  startStatus === "started" || startStatus === "already"
                    ? "bg-primary-dark text-background"
                    : isStarting
                    ? "bg-surface-light text-muted"
                    : "bg-primary text-background pulse-glow"
                }`}
              >
                {isStarting ? (
                  <><Sparkles size={18} className="coin-spin" /> Starting...</>
                ) : startStatus === "started" ? (
                  <><CheckCircle size={18} /> Offer Started! Complete tasks to earn</>
                ) : startStatus === "already" ? (
                  <><CheckCircle size={18} /> Already Started - Continue Earning</>
                ) : (
                  <><span className="text-lg">&#9654;</span> Earn CAD {offer.totalReward.toFixed(2)}</>
                )}
              </motion.button>
            </div>

            <div className="flex px-4 mt-5 border-b border-border">
              {(["rewards", "details"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2.5 px-4 text-sm font-semibold capitalize relative transition-colors ${activeTab === tab ? "text-foreground" : "text-muted"}`}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "rewards" ? (
                <motion.div key="rewards" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="px-4 py-4">
                  <div className="bg-surface-light/80 rounded-2xl p-4 mb-4 border border-border text-center">
                    <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-2">
                      <Download size={18} className="text-primary" />
                    </div>
                    <p className="text-sm text-foreground leading-snug">
                      <span className="text-primary font-bold">Install & Play for 2 minutes</span>{" "}
                      to unlock all rewards, and earn up to CAD {offer.totalReward.toFixed(2)}
                    </p>
                  </div>

                  {offer.rewards.some((r) => r.isLimited) && (
                    <div className="flex items-center gap-2 mb-2.5">
                      <Clock size={14} className="text-accent" />
                      <span className="font-bold text-foreground text-sm">Limited Rewards</span>
                      <HelpCircle size={12} className="text-muted" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {displayRewards.map((reward, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className={`flex items-center justify-between p-3 rounded-xl border ${reward.isBonus ? "bg-accent-2/5 border-accent-2/15" : reward.isLimited ? "bg-accent/5 border-accent/15" : "bg-surface-light/60 border-border"}`}>
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${reward.amount === 0 ? "bg-muted/15 text-muted" : reward.isBonus ? "bg-accent-2/15 text-accent-2" : reward.isLimited ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                            CAD {reward.amount.toFixed(2)}
                          </span>
                          <span className="text-[13px] text-foreground leading-tight">{reward.task}</span>
                        </div>
                        {reward.timeLimit && (
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0 bg-surface rounded-md px-1.5 py-0.5">
                            <Clock size={10} className="text-muted" />
                            <span className="text-[10px] font-medium text-muted">{reward.timeLimit}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {hasMore && !showAllRewards && (
                    <button onClick={() => setShowAllRewards(true)} className="w-full mt-2.5 py-2 flex items-center justify-center gap-1.5 text-sm font-medium text-muted bg-surface-light/60 rounded-xl transition-colors active:bg-border press-scale">
                      <ChevronDown size={15} /> More Rewards
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="details" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="px-4 py-4 space-y-3">
                  <div className="bg-surface-light/80 rounded-2xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2"><Star size={15} className="text-accent-2" /><span className="font-bold text-foreground text-sm">Your Reward Multiplier</span></div>
                    <div className="flex gap-1.5">
                      {multiplierDots.map((filled, i) => (<div key={i} className={`w-5 h-5 rounded-full ${filled ? "bg-gradient-to-br from-accent to-purple-500" : "bg-surface border border-border"}`} />))}
                    </div>
                  </div>
                  <div className="bg-surface-light/80 rounded-2xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-1.5"><Shuffle size={15} className="text-primary" /><span className="font-bold text-foreground text-sm">Task Order Flexibility</span></div>
                    <p className="text-[13px] text-muted leading-relaxed">You don&apos;t need to complete the steps in any particular order.</p>
                  </div>
                  {offer.newUsersOnly && (
                    <div className="bg-surface-light/80 rounded-2xl p-4 border border-border">
                      <div className="flex items-center gap-2 mb-1.5"><Users size={15} className="text-cyan-400" /><span className="font-bold text-foreground text-sm">New Users Only</span></div>
                      <p className="text-[13px] text-muted leading-relaxed">Only new users who haven&apos;t installed &quot;{offer.name}&quot; on their device before are eligible.</p>
                    </div>
                  )}
                  <div className="bg-surface-light/80 rounded-2xl p-4 border border-border">
                    <h4 className="font-bold text-foreground text-sm mb-2">Description</h4>
                    <p className="text-[13px] text-muted leading-relaxed">{offer.description}</p>
                  </div>
                  <div className="bg-surface-light/80 rounded-2xl p-4 border border-border">
                    <h4 className="font-bold text-foreground text-sm mb-3">Steps</h4>
                    <div className="space-y-2.5">
                      {offer.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[11px] font-bold text-primary">{i + 1}</span>
                          </div>
                          <span className="text-[13px] text-foreground leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-surface-light/80 rounded-2xl p-4 border border-border">
                    <div className="flex items-start gap-2.5">
                      <Shield size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-[13px] text-muted leading-relaxed space-y-1.5">
                        <p><strong className="text-foreground">New users only.</strong></p>
                        <p>Make sure to &quot;Allow tracking&quot; when the pop-up shows up</p>
                        <p>Some tasks have a maximum completion time (Limited tasks)</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 bg-gradient-to-t from-surface via-surface/95 to-surface/0 safe-bottom">
            <motion.button whileTap={{ scale: 0.98 }} onClick={handleStart} disabled={isStarting}
              className={`w-full py-3.5 font-bold text-[15px] rounded-2xl flex items-center justify-center gap-2 press-scale ${startStatus === "started" || startStatus === "already" ? "bg-primary-dark text-background" : "bg-primary text-background pulse-glow"}`}>
              {startStatus === "started" || startStatus === "already" ? (<><CheckCircle size={18} /> Continue Earning</>) : (<><span className="text-lg">&#9654;</span> Play and Earn CAD {offer.totalReward.toFixed(2)}</>)}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
