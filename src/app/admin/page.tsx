"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3, Users, Gamepad2, DollarSign, Plus, Pencil, Trash2,
  Zap, ArrowLeft, Search, Filter, ChevronDown, ChevronUp, Save,
  X, Shield, Star, Clock, Eye, EyeOff, AlertCircle, Check,
  TrendingUp, Activity, Flame, Crown, Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Reward {
  id?: string;
  task: string;
  amount: number;
  timeLimit?: string | null;
  isBonus: boolean;
  isLimited: boolean;
  sortOrder: number;
}

interface Offer {
  id: string;
  name: string;
  image: string;
  rating: number;
  platform: string;
  totalReward: number;
  category: string;
  isPremium: boolean;
  isHot: boolean;
  isNew: boolean;
  isActive: boolean;
  description: string;
  steps: string;
  newUsersOnly: boolean;
  rewardMultiplier: number;
  rewards: Reward[];
  _count?: { userOffers: number };
  createdAt?: string;
}

interface Stats {
  totalUsers: number;
  totalOffers: number;
  activeOffers: number;
  totalEarnings: number;
  recentUsers: { id: string; name: string; email: string; balance: number; createdAt: string }[];
}

type AdminView = "dashboard" | "offers" | "offer-edit";

const emptyOffer: Partial<Offer> = {
  name: "",
  image: "https://placehold.co/400x220/1a1a2e/00e676?text=New+Offer&font=montserrat",
  rating: 4.5,
  platform: "ios",
  totalReward: 0,
  category: "game",
  isPremium: false,
  isHot: false,
  isNew: true,
  isActive: true,
  description: "",
  steps: "[]",
  newUsersOnly: true,
  rewardMultiplier: 1,
  rewards: [],
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [view, setView] = useState<AdminView>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [isNewOffer, setIsNewOffer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = (session?.user as Record<string, unknown>)?.role as string;

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch { /* ignore */ }
  }, []);

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/offers");
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && userRole !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") {
      Promise.all([fetchStats(), fetchOffers()]).then(() => setLoading(false));
    }
  }, [status, userRole, router, fetchStats, fetchOffers]);

  const handleSaveOffer = async () => {
    if (!editingOffer?.name || !editingOffer?.description) {
      setError("Name and description are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      // Calculate totalReward from rewards
      const totalReward = (editingOffer.rewards || []).reduce((s, r) => s + r.amount, 0);

      const body = {
        ...editingOffer,
        totalReward,
        steps: typeof editingOffer.steps === "string" ? editingOffer.steps : JSON.stringify(editingOffer.steps),
        rewards: (editingOffer.rewards || []).map((r, i) => ({
          task: r.task,
          amount: r.amount,
          timeLimit: r.timeLimit || null,
          isBonus: r.isBonus || false,
          isLimited: r.isLimited || false,
          sortOrder: i,
        })),
      };

      let res;
      if (isNewOffer) {
        res = await fetch("/api/admin/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/admin/offers/${editingOffer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setSuccess(isNewOffer ? "Offer created successfully!" : "Offer updated successfully!");
        await fetchOffers();
        await fetchStats();
        setTimeout(() => {
          setSuccess("");
          setView("offers");
          setEditingOffer(null);
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save offer");
      }
    } catch {
      setError("Failed to save offer");
    }
    setSaving(false);
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/offers/${offerId}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Offer deleted");
        await fetchOffers();
        await fetchStats();
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch {
      setError("Failed to delete offer");
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer({ ...offer });
    setIsNewOffer(false);
    setView("offer-edit");
  };

  const handleNewOffer = () => {
    setEditingOffer({ ...emptyOffer, rewards: [] });
    setIsNewOffer(true);
    setView("offer-edit");
  };

  const addReward = () => {
    if (!editingOffer) return;
    setEditingOffer({
      ...editingOffer,
      rewards: [
        ...(editingOffer.rewards || []),
        { task: "", amount: 0, timeLimit: null, isBonus: false, isLimited: false, sortOrder: (editingOffer.rewards?.length || 0) },
      ],
    });
  };

  const updateReward = (index: number, field: keyof Reward, value: unknown) => {
    if (!editingOffer) return;
    const rewards = [...(editingOffer.rewards || [])];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rewards[index] as any)[field] = value;
    setEditingOffer({ ...editingOffer, rewards });
  };

  const removeReward = (index: number) => {
    if (!editingOffer) return;
    const rewards = [...(editingOffer.rewards || [])];
    rewards.splice(index, 1);
    setEditingOffer({ ...editingOffer, rewards });
  };

  const filteredOffers = offers.filter((o) =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center"
        >
          <Zap size={20} className="text-background" fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* ══════ Admin Header ══════ */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            {view !== "dashboard" && (
              <button
                onClick={() => { setView(view === "offer-edit" ? "offers" : "dashboard"); setEditingOffer(null); setError(""); }}
                className="p-2 bg-surface-light rounded-xl hover:bg-border transition-colors press-scale"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <Shield size={15} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-foreground">Admin Panel</h1>
                <p className="text-[10px] text-muted">
                  {view === "dashboard" ? "Overview" : view === "offers" ? "Manage Offers" : isNewOffer ? "New Offer" : "Edit Offer"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-light rounded-xl text-xs font-medium text-muted hover:text-foreground transition-colors press-scale"
            >
              <ArrowLeft size={12} />
              Back to App
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 text-muted hover:text-danger transition-colors press-scale"
            >
              <Zap size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════ Alerts ══════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 mt-3"
          >
            <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl">
              <AlertCircle size={16} className="text-danger flex-shrink-0" />
              <span className="text-sm text-danger flex-1">{error}</span>
              <button onClick={() => setError("")} className="text-danger"><X size={14} /></button>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 mt-3"
          >
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl">
              <Check size={16} className="text-primary flex-shrink-0" />
              <span className="text-sm text-primary">{success}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════════════════════════════════════ */}
        {/* ══════ DASHBOARD VIEW ══════ */}
        {/* ═══════════════════════════════════════ */}
        {view === "dashboard" && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                { label: "Total Offers", value: stats.totalOffers, icon: Gamepad2, color: "text-primary", bg: "bg-primary/10" },
                { label: "Active Offers", value: stats.activeOffers, icon: Activity, color: "text-accent-2", bg: "bg-accent-2/10" },
                { label: "Total Earnings", value: `$${stats.totalEarnings.toFixed(2)}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface rounded-2xl p-4 border border-border"
                >
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setView("offers")}
                className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3 hover:bg-surface-light transition-colors press-scale text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Gamepad2 size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Manage Offers</p>
                  <p className="text-[11px] text-muted">Add, edit, or remove offers</p>
                </div>
                <ChevronDown size={16} className="text-muted ml-auto -rotate-90" />
              </button>

              <button
                onClick={handleNewOffer}
                className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3 hover:bg-surface-light transition-colors press-scale text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Plus size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Create New Offer</p>
                  <p className="text-[11px] text-muted">Add a new earning opportunity</p>
                </div>
                <ChevronDown size={16} className="text-muted ml-auto -rotate-90" />
              </button>
            </div>

            {/* Recent users */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <h3 className="font-bold text-sm text-foreground">Recent Users</h3>
              </div>
              <div className="divide-y divide-border">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name || "Unnamed"}</p>
                      <p className="text-[10px] text-muted truncate">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">CAD {user.balance.toFixed(2)}</p>
                      <p className="text-[10px] text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {stats.recentUsers.length === 0 && (
                  <div className="p-8 text-center text-muted text-sm">No users yet</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/* ══════ OFFERS LIST VIEW ══════ */}
        {/* ═══════════════════════════════════════ */}
        {view === "offers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search & actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <button
                onClick={handleNewOffer}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-background font-bold text-sm rounded-xl transition-colors press-scale"
              >
                <Plus size={16} />
                New Offer
              </button>
            </div>

            {/* Offers table/cards */}
            <div className="space-y-2">
              {filteredOffers.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-surface rounded-2xl border border-border overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    <img
                      src={offer.image}
                      alt={offer.name}
                      className="w-16 h-16 sm:w-20 sm:h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-sm text-foreground truncate">{offer.name}</h3>
                        {!offer.isActive && (
                          <span className="text-[8px] font-bold bg-danger/20 text-danger px-1.5 py-0.5 rounded-full">INACTIVE</span>
                        )}
                        {offer.isPremium && (
                          <span className="text-[8px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">PREMIUM</span>
                        )}
                        {offer.isHot && (
                          <span className="text-[8px] font-bold bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">HOT</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted">
                        <span className="text-primary font-bold">CAD {offer.totalReward.toFixed(2)}</span>
                        <span>{offer.platform}</span>
                        <span>{offer.category}</span>
                        <span>{offer.rewards?.length || 0} rewards</span>
                        <span>{offer._count?.userOffers || 0} users</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEditOffer(offer)}
                        className="p-2 bg-surface-light rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors press-scale"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-2 bg-surface-light rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors press-scale"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredOffers.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-3xl mb-3">📦</p>
                  <p className="text-muted text-base font-semibold">No offers found</p>
                  <p className="text-sm text-muted mt-1">Create your first offer to get started</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/* ══════ OFFER EDIT VIEW ══════ */}
        {/* ═══════════════════════════════════════ */}
        {view === "offer-edit" && editingOffer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {/* Basic info */}
              <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border">
                <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                  <Gamepad2 size={16} className="text-primary" />
                  Basic Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1.5">Offer Name *</label>
                    <input
                      type="text"
                      value={editingOffer.name || ""}
                      onChange={(e) => setEditingOffer({ ...editingOffer, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g., Monopoly GO!"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1.5">Image URL</label>
                    <input
                      type="text"
                      value={editingOffer.image || ""}
                      onChange={(e) => setEditingOffer({ ...editingOffer, image: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Platform</label>
                    <select
                      value={editingOffer.platform || "ios"}
                      onChange={(e) => setEditingOffer({ ...editingOffer, platform: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="ios">iOS</option>
                      <option value="android">Android</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Category</label>
                    <select
                      value={editingOffer.category || "game"}
                      onChange={(e) => setEditingOffer({ ...editingOffer, category: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="game">Game</option>
                      <option value="survey">Survey</option>
                      <option value="task">Task</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Rating</label>
                    <input
                      type="number"
                      value={editingOffer.rating || 4.5}
                      onChange={(e) => setEditingOffer({ ...editingOffer, rating: parseFloat(e.target.value) })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Reward Multiplier</label>
                    <input
                      type="number"
                      value={editingOffer.rewardMultiplier || 1}
                      onChange={(e) => setEditingOffer({ ...editingOffer, rewardMultiplier: parseInt(e.target.value) })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      min="1"
                      max="5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1.5">Description *</label>
                    <textarea
                      value={editingOffer.description || ""}
                      onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                      rows={3}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Describe the offer..."
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {[
                    { key: "isActive", label: "Active", color: "primary" },
                    { key: "isPremium", label: "Premium", color: "accent" },
                    { key: "isHot", label: "Hot", color: "orange-500" },
                    { key: "isNew", label: "New", color: "cyan-400" },
                    { key: "newUsersOnly", label: "New Users Only", color: "primary" },
                  ].map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() =>
                        setEditingOffer({
                          ...editingOffer,
                          [key]: !(editingOffer as Record<string, unknown>)[key],
                        })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all press-scale ${
                        (editingOffer as Record<string, unknown>)[key]
                          ? `bg-${color}/15 text-${color} border border-${color}/30`
                          : "bg-surface-light text-muted border border-border"
                      }`}
                    >
                      {(editingOffer as Record<string, unknown>)[key] ? (
                        <Eye size={12} />
                      ) : (
                        <EyeOff size={12} />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border">
                <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-accent-2" />
                  Steps (JSON array)
                </h3>
                <textarea
                  value={
                    typeof editingOffer.steps === "string"
                      ? editingOffer.steps
                      : JSON.stringify(editingOffer.steps || [], null, 2)
                  }
                  onChange={(e) => setEditingOffer({ ...editingOffer, steps: e.target.value })}
                  rows={5}
                  className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder='["Step 1", "Step 2", "Step 3"]'
                />
              </div>

              {/* Rewards */}
              <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Gift size={16} className="text-primary" />
                    Rewards ({editingOffer.rewards?.length || 0})
                  </h3>
                  <button
                    onClick={addReward}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors press-scale"
                  >
                    <Plus size={14} />
                    Add Reward
                  </button>
                </div>

                {/* Calculated total */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-3 flex items-center justify-between">
                  <span className="text-xs text-muted">Calculated Total Reward</span>
                  <span className="text-lg font-extrabold text-primary">
                    CAD {(editingOffer.rewards || []).reduce((s, r) => s + (r.amount || 0), 0).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  {(editingOffer.rewards || []).map((reward, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface-light rounded-xl p-3 border border-border"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-muted bg-background rounded-md px-1.5 py-0.5 mt-1">
                          #{i + 1}
                        </span>
                        <div className="flex-1 grid sm:grid-cols-2 gap-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={reward.task}
                              onChange={(e) => updateReward(i, "task", e.target.value)}
                              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                              placeholder="Task description"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-muted mb-1">Amount (CAD)</label>
                            <input
                              type="number"
                              value={reward.amount}
                              onChange={(e) => updateReward(i, "amount", parseFloat(e.target.value) || 0)}
                              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-muted mb-1">Time Limit</label>
                            <input
                              type="text"
                              value={reward.timeLimit || ""}
                              onChange={(e) => updateReward(i, "timeLimit", e.target.value || null)}
                              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                              placeholder="e.g., 3D, 7D"
                            />
                          </div>
                          <div className="flex gap-2 items-center sm:col-span-2">
                            <button
                              onClick={() => updateReward(i, "isLimited", !reward.isLimited)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors press-scale ${
                                reward.isLimited
                                  ? "bg-accent/15 text-accent border border-accent/30"
                                  : "bg-surface border border-border text-muted"
                              }`}
                            >
                              <Clock size={10} className="inline mr-1" />
                              Limited
                            </button>
                            <button
                              onClick={() => updateReward(i, "isBonus", !reward.isBonus)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors press-scale ${
                                reward.isBonus
                                  ? "bg-accent-2/15 text-accent-2 border border-accent-2/30"
                                  : "bg-surface border border-border text-muted"
                              }`}
                            >
                              <Star size={10} className="inline mr-1" />
                              Bonus
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeReward(i)}
                          className="p-1.5 text-muted hover:text-danger transition-colors press-scale"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {(editingOffer.rewards?.length || 0) === 0 && (
                  <div className="text-center py-8">
                    <p className="text-2xl mb-2">🎯</p>
                    <p className="text-sm text-muted">No rewards yet. Add rewards to define earning milestones.</p>
                  </div>
                )}
              </div>

              {/* Save button */}
              <div className="flex gap-3 pb-8">
                <button
                  onClick={() => { setView("offers"); setEditingOffer(null); setError(""); }}
                  className="flex-1 py-3 bg-surface-light border border-border rounded-xl font-semibold text-sm text-muted hover:text-foreground transition-colors press-scale"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOffer}
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all press-scale ${
                    saving
                      ? "bg-surface-light text-muted cursor-not-allowed"
                      : "bg-primary text-background hover:bg-primary-dark pulse-glow"
                  }`}
                >
                  <Save size={16} />
                  {saving ? "Saving..." : isNewOffer ? "Create Offer" : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
