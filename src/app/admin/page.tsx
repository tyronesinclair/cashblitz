"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3, Users, Gamepad2, DollarSign, Plus, Pencil, Trash2,
  Zap, ArrowLeft, Search, ChevronDown, Save,
  X, Shield, Star, Clock, Eye, EyeOff, AlertCircle, Check,
  TrendingUp, Activity, Flame, Crown, Gift, Settings,
  CreditCard, ChevronRight, ChevronLeft, Home, RefreshCw,
  UserCheck, UserX, Download, Filter, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════ TYPES ═══════════════ */

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

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  balance: number;
  totalEarnings: number;
  level: number;
  streak: number;
  createdAt: string;
  _count?: { userOffers: number };
}

interface Stats {
  userCount: number;
  offerCount: number;
  activeOfferCount: number;
  premiumOfferCount: number;
  totalEarnings: number;
  totalBalance: number;
  activeUserOffers: number;
  completedUserOffers: number;
  recentUsers: { id: string; name: string | null; email: string; balance: number; totalEarnings: number; createdAt: string; role: string }[];
  topEarners: { id: string; name: string | null; email: string; totalEarnings: number }[];
}

type AdminTab = "dashboard" | "offers" | "users" | "payouts" | "settings" | "docs";
type SubView = "list" | "edit" | "detail";

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

const adminTabs = [
  { id: "dashboard" as AdminTab, label: "Dashboard", icon: BarChart3 },
  { id: "offers" as AdminTab, label: "Offers", icon: Gamepad2 },
  { id: "users" as AdminTab, label: "Users", icon: Users },
  { id: "payouts" as AdminTab, label: "Payouts", icon: CreditCard },
  { id: "settings" as AdminTab, label: "Settings", icon: Settings },
  { id: "docs" as AdminTab, label: "Docs", icon: BookOpen },
];

/* ═══════════════ COMPONENT ═══════════════ */

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [subView, setSubView] = useState<SubView>("list");
  const [stats, setStats] = useState<Stats | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersPagination, setUsersPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isNewOffer, setIsNewOffer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");

  const userRole = (session?.user as Record<string, unknown>)?.role as string;

  /* ═══════ DATA FETCHING ═══════ */

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/offers");
      if (res.ok) setOffers(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchUsers = useCallback(async (page = 1, search = "", role = "") => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setUsersPagination({ total: data.total, page: data.page, pages: data.pages });
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && userRole !== "admin") { router.push("/dashboard"); return; }
    if (status === "authenticated") {
      Promise.all([fetchStats(), fetchOffers(), fetchUsers()]).then(() => setLoading(false));
    }
  }, [status, userRole, router, fetchStats, fetchOffers, fetchUsers]);

  /* ═══════ OFFER HANDLERS ═══════ */

  const handleSaveOffer = async () => {
    if (!editingOffer?.name || !editingOffer?.description) { setError("Name and description are required"); return; }
    setSaving(true); setError("");
    try {
      const totalReward = (editingOffer.rewards || []).reduce((s, r) => s + r.amount, 0);
      const body = {
        ...editingOffer, totalReward,
        steps: typeof editingOffer.steps === "string" ? editingOffer.steps : JSON.stringify(editingOffer.steps),
        rewards: (editingOffer.rewards || []).map((r, i) => ({
          task: r.task, amount: r.amount, timeLimit: r.timeLimit || null,
          isBonus: r.isBonus || false, isLimited: r.isLimited || false, sortOrder: i,
        })),
      };
      const res = isNewOffer
        ? await fetch("/api/admin/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch(`/api/admin/offers/${editingOffer.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        setSuccess(isNewOffer ? "Offer created!" : "Offer updated!");
        await fetchOffers(); await fetchStats();
        setTimeout(() => { setSuccess(""); setSubView("list"); setEditingOffer(null); }, 1200);
      } else { const data = await res.json(); setError(data.error || "Failed to save"); }
    } catch { setError("Failed to save offer"); }
    setSaving(false);
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/offers/${offerId}`, { method: "DELETE" });
      if (res.ok) { setSuccess("Offer deleted"); await fetchOffers(); await fetchStats(); setTimeout(() => setSuccess(""), 2000); }
    } catch { setError("Failed to delete"); }
  };

  const handleEditOffer = (offer: Offer) => { setEditingOffer({ ...offer }); setIsNewOffer(false); setSubView("edit"); };
  const handleNewOffer = () => { setEditingOffer({ ...emptyOffer, rewards: [] }); setIsNewOffer(true); setSubView("edit"); };

  const addReward = () => {
    if (!editingOffer) return;
    setEditingOffer({
      ...editingOffer,
      rewards: [...(editingOffer.rewards || []), { task: "", amount: 0, timeLimit: null, isBonus: false, isLimited: false, sortOrder: (editingOffer.rewards?.length || 0) }],
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

  /* ═══════ USER HANDLERS ═══════ */

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editingUser.role, balance: editingUser.balance, totalEarnings: editingUser.totalEarnings, name: editingUser.name }),
      });
      if (res.ok) {
        setSuccess("User updated!"); await fetchUsers(usersPagination.page, userSearch, userRoleFilter); await fetchStats();
        setTimeout(() => { setSuccess(""); setSubView("list"); setEditingUser(null); }, 1200);
      } else { setError("Failed to update user"); }
    } catch { setError("Failed to update user"); }
    setSaving(false);
  };

  /* ═══════ SEARCH EFFECTS ═══════ */

  useEffect(() => {
    if (activeTab === "users" && !loading) {
      const timeout = setTimeout(() => fetchUsers(1, userSearch, userRoleFilter), 300);
      return () => clearTimeout(timeout);
    }
  }, [userSearch, userRoleFilter, activeTab, loading, fetchUsers]);

  const filteredOffers = offers.filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()));

  /* ═══════ LOADING STATE ═══════ */

  if (status === "loading" || loading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </motion.div>
      </div>
    );
  }

  /* ═══════ RENDER ═══════ */

  return (
    <div className="min-h-dvh bg-background flex">
      {/* ══════ Sidebar (Desktop) ══════ */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-border fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-foreground">Admin Panel</span>
            <p className="text-[9px] text-muted">CashBlitz Management</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSubView("list"); setEditingOffer(null); setEditingUser(null); setError(""); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all press-scale ${isActive ? "bg-accent/10 text-accent border border-accent/20" : "text-muted hover:bg-surface-light hover:text-foreground"}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-border space-y-1">
          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surface-light hover:text-foreground transition-all press-scale">
            <Home size={18} />
            Back to App
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all press-scale">
            <X size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════ Main Content ══════ */}
      <div className="flex-1 lg:ml-60">
        {/* ══════ Mobile Top Bar ══════ */}
        <header className="lg:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <span className="text-sm font-extrabold text-foreground">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => router.push("/dashboard")} className="p-2 text-muted hover:text-foreground"><Home size={18} /></button>
              <button onClick={() => { fetchStats(); fetchOffers(); fetchUsers(usersPagination.page, userSearch, userRoleFilter); }} className="p-2 text-muted hover:text-foreground"><RefreshCw size={18} /></button>
            </div>
          </div>
          {/* Mobile tab bar */}
          <div className="flex overflow-x-auto no-scrollbar border-t border-border">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSubView("list"); setError(""); }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${isActive ? "border-accent text-accent" : "border-transparent text-muted"}`}>
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ══════ Desktop Header ══════ */}
        <header className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {subView !== "list" && (
              <button onClick={() => { setSubView("list"); setEditingOffer(null); setEditingUser(null); setError(""); }}
                className="p-2 bg-surface-light rounded-xl hover:bg-border transition-colors press-scale">
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-extrabold text-foreground capitalize">
                {activeTab === "dashboard" ? "Dashboard" : activeTab === "offers" ? (subView === "edit" ? (isNewOffer ? "New Offer" : "Edit Offer") : "Manage Offers") : activeTab === "users" ? (subView === "edit" ? "Edit User" : "Manage Users") : activeTab === "payouts" ? "Payouts" : "Settings"}
              </h2>
              <p className="text-xs text-muted">{session?.user?.email}</p>
            </div>
          </div>
          <button onClick={() => { fetchStats(); fetchOffers(); fetchUsers(usersPagination.page, userSearch, userRoleFilter); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-light rounded-xl text-xs font-medium text-muted hover:text-foreground transition-colors press-scale">
            <RefreshCw size={12} /> Refresh
          </button>
        </header>

        {/* ══════ Alerts ══════ */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto px-4 sm:px-6 mt-3">
              <div className={`flex items-center gap-2 p-3 rounded-xl ${error ? "bg-danger/10 border border-danger/20" : "bg-primary/10 border border-primary/20"}`}>
                {error ? <AlertCircle size={16} className="text-danger flex-shrink-0" /> : <Check size={16} className="text-primary flex-shrink-0" />}
                <span className={`text-sm flex-1 ${error ? "text-danger" : "text-primary"}`}>{error || success}</span>
                <button onClick={() => { setError(""); setSuccess(""); }} className={error ? "text-danger" : "text-primary"}><X size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

          {/* ═══════════════════════════════════════ */}
          {/* ══════ DASHBOARD TAB ══════ */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "dashboard" && stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Users", value: stats.userCount, icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                  { label: "Active Offers", value: `${stats.activeOfferCount}/${stats.offerCount}`, icon: Gamepad2, color: "text-primary", bg: "bg-primary/10" },
                  { label: "Total Paid Out", value: `$${stats.totalEarnings.toFixed(0)}`, icon: DollarSign, color: "text-accent-2", bg: "bg-accent-2/10" },
                  { label: "Pending Balance", value: `$${stats.totalBalance.toFixed(0)}`, icon: CreditCard, color: "text-accent", bg: "bg-accent/10" },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-surface rounded-2xl p-4 border border-border">
                    <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                      <stat.icon size={18} className={stat.color} />
                    </div>
                    <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Premium Offers", value: stats.premiumOfferCount, icon: Crown, color: "text-accent" },
                  { label: "Active Tasks", value: stats.activeUserOffers, icon: Activity, color: "text-cyan-400" },
                  { label: "Completed Tasks", value: stats.completedUserOffers, icon: Check, color: "text-primary" },
                  { label: "Conversion Rate", value: stats.userCount > 0 ? `${((stats.completedUserOffers / Math.max(stats.userCount, 1)) * 100).toFixed(1)}%` : "0%", icon: TrendingUp, color: "text-accent-2" },
                ].map((stat, i) => (
                  <div key={stat.label} className="bg-surface rounded-xl p-3 border border-border flex items-center gap-3">
                    <stat.icon size={16} className={stat.color} />
                    <div>
                      <p className="text-sm font-bold text-foreground">{stat.value}</p>
                      <p className="text-[9px] text-muted">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <button onClick={() => { setActiveTab("offers"); handleNewOffer(); }}
                  className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3 hover:bg-surface-light transition-colors press-scale text-left">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Plus size={18} className="text-primary" /></div>
                  <div><p className="font-bold text-foreground text-sm">Create Offer</p><p className="text-[10px] text-muted">Add new earning opportunity</p></div>
                </button>
                <button onClick={() => setActiveTab("offers")}
                  className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3 hover:bg-surface-light transition-colors press-scale text-left">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Gamepad2 size={18} className="text-accent" /></div>
                  <div><p className="font-bold text-foreground text-sm">Manage Offers</p><p className="text-[10px] text-muted">{stats.offerCount} offers total</p></div>
                </button>
                <button onClick={() => setActiveTab("users")}
                  className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3 hover:bg-surface-light transition-colors press-scale text-left">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center"><Users size={18} className="text-cyan-400" /></div>
                  <div><p className="font-bold text-foreground text-sm">Manage Users</p><p className="text-[10px] text-muted">{stats.userCount} users total</p></div>
                </button>
              </div>

              {/* Two columns: Recent users + Top earners */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Recent users */}
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2"><Users size={16} className="text-cyan-400" /><h3 className="font-bold text-sm text-foreground">Recent Users</h3></div>
                    <button onClick={() => setActiveTab("users")} className="text-[10px] text-primary font-semibold">View All →</button>
                  </div>
                  <div className="divide-y divide-border">
                    {stats.recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center gap-3 px-4 py-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">{user.name?.[0]?.toUpperCase() || "U"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{user.name || "Unnamed"}</p>
                          <p className="text-[9px] text-muted truncate">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-primary">CAD {user.balance.toFixed(2)}</p>
                          <p className="text-[9px] text-muted">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top earners */}
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                    <Crown size={16} className="text-accent-2" />
                    <h3 className="font-bold text-sm text-foreground">Top Earners</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {stats.topEarners.map((user, i) => (
                      <div key={user.id} className="flex items-center gap-3 px-4 py-2.5">
                        <span className={`text-xs font-extrabold ${i === 0 ? "text-accent-2" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-muted"}`}>
                          #{i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{user.name || "Unnamed"}</p>
                          <p className="text-[9px] text-muted truncate">{user.email}</p>
                        </div>
                        <p className="text-xs font-bold text-primary">CAD {user.totalEarnings.toFixed(2)}</p>
                      </div>
                    ))}
                    {stats.topEarners.length === 0 && <div className="p-6 text-center text-muted text-xs">No earnings yet</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* ══════ OFFERS TAB ══════ */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "offers" && subView === "list" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" placeholder="Search offers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors" />
                </div>
                <button onClick={handleNewOffer}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-background font-bold text-sm rounded-xl transition-colors press-scale">
                  <Plus size={16} /> New Offer
                </button>
              </div>

              <div className="space-y-2">
                {filteredOffers.map((offer, i) => (
                  <motion.div key={offer.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-surface rounded-2xl border border-border overflow-hidden">
                    <div className="flex items-center gap-3 p-3 sm:p-4">
                      <img src={offer.image} alt={offer.name} className="w-16 h-16 sm:w-20 sm:h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="font-bold text-sm text-foreground truncate">{offer.name}</h3>
                          {!offer.isActive && <span className="text-[8px] font-bold bg-danger/20 text-danger px-1.5 py-0.5 rounded-full">INACTIVE</span>}
                          {offer.isPremium && <span className="text-[8px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">PREMIUM</span>}
                          {offer.isHot && <span className="text-[8px] font-bold bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">HOT</span>}
                          {offer.isNew && <span className="text-[8px] font-bold bg-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded-full">NEW</span>}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted flex-wrap">
                          <span className="text-primary font-bold">CAD {offer.totalReward.toFixed(2)}</span>
                          <span>{offer.platform}</span>
                          <span>{offer.category}</span>
                          <span>{offer.rewards?.length || 0} rewards</span>
                          <span>{offer._count?.userOffers || 0} users</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleEditOffer(offer)} className="p-2 bg-surface-light rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors press-scale"><Pencil size={14} /></button>
                        <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 bg-surface-light rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors press-scale"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredOffers.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-3xl mb-3">📦</p>
                    <p className="text-muted text-base font-semibold">No offers found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════ OFFER EDIT VIEW ══════ */}
          {activeTab === "offers" && subView === "edit" && editingOffer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {/* Basic info */}
                <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border">
                  <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2"><Gamepad2 size={16} className="text-primary" />Basic Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted mb-1.5">Offer Name *</label>
                      <input type="text" value={editingOffer.name || ""} onChange={(e) => setEditingOffer({ ...editingOffer, name: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="e.g., Monopoly GO!" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted mb-1.5">Image URL</label>
                      <input type="text" value={editingOffer.image || ""} onChange={(e) => setEditingOffer({ ...editingOffer, image: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Platform</label>
                      <select value={editingOffer.platform || "ios"} onChange={(e) => setEditingOffer({ ...editingOffer, platform: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="ios">iOS</option><option value="android">Android</option><option value="desktop">Desktop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Category</label>
                      <select value={editingOffer.category || "game"} onChange={(e) => setEditingOffer({ ...editingOffer, category: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="game">Game</option><option value="survey">Survey</option><option value="task">Task</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Rating</label>
                      <input type="number" value={editingOffer.rating || 4.5} onChange={(e) => setEditingOffer({ ...editingOffer, rating: parseFloat(e.target.value) })}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" min="0" max="5" step="0.1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Multiplier</label>
                      <input type="number" value={editingOffer.rewardMultiplier || 1} onChange={(e) => setEditingOffer({ ...editingOffer, rewardMultiplier: parseInt(e.target.value) })}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" min="1" max="5" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted mb-1.5">Description *</label>
                      <textarea value={editingOffer.description || ""} onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })} rows={3}
                        className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" placeholder="Describe the offer..." />
                    </div>
                  </div>
                  {/* Toggles */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { key: "isActive", label: "Active", activeColor: "bg-primary/15 text-primary border-primary/30" },
                      { key: "isPremium", label: "Premium", activeColor: "bg-accent/15 text-accent border-accent/30" },
                      { key: "isHot", label: "Hot", activeColor: "bg-orange-500/15 text-orange-500 border-orange-500/30" },
                      { key: "isNew", label: "New", activeColor: "bg-cyan-400/15 text-cyan-400 border-cyan-400/30" },
                      { key: "newUsersOnly", label: "New Users Only", activeColor: "bg-primary/15 text-primary border-primary/30" },
                    ].map(({ key, label, activeColor }) => (
                      <button key={key} onClick={() => setEditingOffer({ ...editingOffer, [key]: !(editingOffer as Record<string, unknown>)[key] })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all press-scale border ${(editingOffer as Record<string, unknown>)[key] ? activeColor : "bg-surface-light text-muted border-border"}`}>
                        {(editingOffer as Record<string, unknown>)[key] ? <Eye size={12} /> : <EyeOff size={12} />}{label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border">
                  <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-accent-2" />Steps (JSON)</h3>
                  <textarea value={typeof editingOffer.steps === "string" ? editingOffer.steps : JSON.stringify(editingOffer.steps || [], null, 2)}
                    onChange={(e) => setEditingOffer({ ...editingOffer, steps: e.target.value })} rows={4}
                    className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors resize-none" placeholder='["Step 1", "Step 2"]' />
                </div>

                {/* Rewards */}
                <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-2"><Gift size={16} className="text-primary" />Rewards ({editingOffer.rewards?.length || 0})</h3>
                    <button onClick={addReward} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors press-scale"><Plus size={14} />Add</button>
                  </div>
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-3 flex items-center justify-between">
                    <span className="text-xs text-muted">Total Reward</span>
                    <span className="text-lg font-extrabold text-primary">CAD {(editingOffer.rewards || []).reduce((s, r) => s + (r.amount || 0), 0).toFixed(2)}</span>
                  </div>
                  <div className="space-y-2">
                    {(editingOffer.rewards || []).map((reward, i) => (
                      <div key={i} className="bg-surface-light rounded-xl p-3 border border-border">
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] font-bold text-muted bg-background rounded-md px-1.5 py-0.5 mt-1">#{i + 1}</span>
                          <div className="flex-1 grid sm:grid-cols-2 gap-2">
                            <div className="sm:col-span-2">
                              <input type="text" value={reward.task} onChange={(e) => updateReward(i, "task", e.target.value)}
                                className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Task description" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-muted mb-1">Amount (CAD)</label>
                              <input type="number" value={reward.amount} onChange={(e) => updateReward(i, "amount", parseFloat(e.target.value) || 0)}
                                className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" step="0.01" min="0" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-muted mb-1">Time Limit</label>
                              <input type="text" value={reward.timeLimit || ""} onChange={(e) => updateReward(i, "timeLimit", e.target.value || null)}
                                className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="e.g., 3D, 7D" />
                            </div>
                            <div className="flex gap-2 items-center sm:col-span-2">
                              <button onClick={() => updateReward(i, "isLimited", !reward.isLimited)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors press-scale border ${reward.isLimited ? "bg-accent/15 text-accent border-accent/30" : "bg-surface border-border text-muted"}`}>
                                <Clock size={10} className="inline mr-1" />Limited
                              </button>
                              <button onClick={() => updateReward(i, "isBonus", !reward.isBonus)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors press-scale border ${reward.isBonus ? "bg-accent-2/15 text-accent-2 border-accent-2/30" : "bg-surface border-border text-muted"}`}>
                                <Star size={10} className="inline mr-1" />Bonus
                              </button>
                            </div>
                          </div>
                          <button onClick={() => removeReward(i)} className="p-1.5 text-muted hover:text-danger transition-colors press-scale"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(editingOffer.rewards?.length || 0) === 0 && <div className="text-center py-6"><p className="text-2xl mb-2">🎯</p><p className="text-sm text-muted">No rewards yet.</p></div>}
                </div>

                {/* Save */}
                <div className="flex gap-3 pb-8">
                  <button onClick={() => { setSubView("list"); setEditingOffer(null); setError(""); }}
                    className="flex-1 py-3 bg-surface-light border border-border rounded-xl font-semibold text-sm text-muted hover:text-foreground transition-colors press-scale">Cancel</button>
                  <button onClick={handleSaveOffer} disabled={saving}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all press-scale ${saving ? "bg-surface-light text-muted cursor-not-allowed" : "bg-primary text-background hover:bg-primary-dark pulse-glow"}`}>
                    <Save size={16} />{saving ? "Saving..." : isNewOffer ? "Create Offer" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* ══════ USERS TAB ══════ */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "users" && subView === "list" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors" />
                </div>
                <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-surface border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/40">
                  <option value="">All Roles</option><option value="user">Users</option><option value="admin">Admins</option>
                </select>
              </div>

              <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-border text-[10px] font-bold text-muted uppercase">
                  <div className="col-span-4">User</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Balance</div>
                  <div className="col-span-2">Earned</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y divide-border">
                  {users.map((user) => (
                    <div key={user.id} className="flex sm:grid sm:grid-cols-12 gap-2 items-center px-4 py-3">
                      <div className="sm:col-span-4 flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${user.role === "admin" ? "bg-gradient-to-br from-accent to-purple-500" : "bg-gradient-to-br from-primary/20 to-primary-dark/20"}`}>
                          <span className={`text-[10px] font-bold ${user.role === "admin" ? "text-white" : "text-primary"}`}>{user.name?.[0]?.toUpperCase() || "U"}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{user.name || "Unnamed"}</p>
                          <p className="text-[9px] text-muted truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="hidden sm:block sm:col-span-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-accent/20 text-accent" : "bg-surface-light text-muted"}`}>{user.role}</span>
                      </div>
                      <div className="hidden sm:block sm:col-span-2">
                        <p className="text-xs font-bold text-foreground">CAD {user.balance.toFixed(2)}</p>
                      </div>
                      <div className="hidden sm:block sm:col-span-2">
                        <p className="text-xs font-bold text-primary">CAD {user.totalEarnings.toFixed(2)}</p>
                      </div>
                      <div className="sm:col-span-2 flex justify-end gap-1.5 flex-shrink-0">
                        <span className="sm:hidden text-[10px] font-bold text-primary mr-2">CAD {user.balance.toFixed(2)}</span>
                        <button onClick={() => { setEditingUser({ ...user }); setSubView("edit"); }}
                          className="p-2 bg-surface-light rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors press-scale"><Pencil size={13} /></button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && <div className="p-8 text-center text-muted text-sm">No users found</div>}
                </div>
              </div>

              {/* Pagination */}
              {usersPagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button onClick={() => fetchUsers(usersPagination.page - 1, userSearch, userRoleFilter)} disabled={usersPagination.page <= 1}
                    className="p-2 bg-surface border border-border rounded-lg text-muted hover:text-foreground disabled:opacity-30 press-scale"><ChevronLeft size={16} /></button>
                  <span className="text-xs text-muted">Page {usersPagination.page} of {usersPagination.pages}</span>
                  <button onClick={() => fetchUsers(usersPagination.page + 1, userSearch, userRoleFilter)} disabled={usersPagination.page >= usersPagination.pages}
                    className="p-2 bg-surface border border-border rounded-lg text-muted hover:text-foreground disabled:opacity-30 press-scale"><ChevronRight size={16} /></button>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════ USER EDIT VIEW ══════ */}
          {activeTab === "users" && subView === "edit" && editingUser && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
              <div className="bg-surface rounded-2xl p-5 border border-border mb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${editingUser.role === "admin" ? "bg-gradient-to-br from-accent to-purple-500" : "bg-gradient-to-br from-primary to-primary-dark"}`}>
                    <span className="text-lg font-bold text-white">{editingUser.name?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{editingUser.name || "Unnamed"}</h3>
                    <p className="text-xs text-muted">{editingUser.email}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Name</label>
                    <input type="text" value={editingUser.name || ""} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
                    <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                      <option value="user">User</option><option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Balance (CAD)</label>
                    <input type="number" value={editingUser.balance} onChange={(e) => setEditingUser({ ...editingUser, balance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" step="0.01" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Total Earnings (CAD)</label>
                    <input type="number" value={editingUser.totalEarnings} onChange={(e) => setEditingUser({ ...editingUser, totalEarnings: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" step="0.01" min="0" />
                  </div>
                </div>

                <div className="text-xs text-muted mt-4 space-y-1">
                  <p>Joined: {new Date(editingUser.createdAt).toLocaleDateString()}</p>
                  <p>Active Offers: {editingUser._count?.userOffers || 0}</p>
                </div>
              </div>

              <div className="flex gap-3 pb-8">
                <button onClick={() => { setSubView("list"); setEditingUser(null); setError(""); }}
                  className="flex-1 py-3 bg-surface-light border border-border rounded-xl font-semibold text-sm text-muted hover:text-foreground transition-colors press-scale">Cancel</button>
                <button onClick={handleUpdateUser} disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all press-scale ${saving ? "bg-surface-light text-muted cursor-not-allowed" : "bg-primary text-background hover:bg-primary-dark"}`}>
                  <Save size={16} />{saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* ══════ PAYOUTS TAB ══════ */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "payouts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface rounded-2xl p-4 border border-border">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2"><DollarSign size={18} className="text-primary" /></div>
                  <p className="text-2xl font-extrabold text-foreground">${stats?.totalEarnings.toFixed(2) || "0.00"}</p>
                  <p className="text-[10px] text-muted mt-0.5">Total Paid Out</p>
                </div>
                <div className="bg-surface rounded-2xl p-4 border border-border">
                  <div className="w-9 h-9 rounded-xl bg-accent-2/10 flex items-center justify-center mb-2"><CreditCard size={18} className="text-accent-2" /></div>
                  <p className="text-2xl font-extrabold text-foreground">${stats?.totalBalance.toFixed(2) || "0.00"}</p>
                  <p className="text-[10px] text-muted mt-0.5">Pending Balances</p>
                </div>
                <div className="bg-surface rounded-2xl p-4 border border-border">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-2"><TrendingUp size={18} className="text-accent" /></div>
                  <p className="text-2xl font-extrabold text-foreground">{stats?.userCount || 0}</p>
                  <p className="text-[10px] text-muted mt-0.5">Users with Balance</p>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-border p-5">
                <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2"><CreditCard size={16} className="text-primary" />Payout Methods</h3>
                <div className="space-y-3">
                  {[
                    { name: "PayPal", icon: "💳", status: "active", minPayout: 5, fee: 0 },
                    { name: "Visa Gift Card", icon: "💎", status: "active", minPayout: 10, fee: 0 },
                    { name: "Amazon Gift Card", icon: "🛒", status: "active", minPayout: 5, fee: 0 },
                    { name: "Bitcoin", icon: "₿", status: "active", minPayout: 10, fee: 0 },
                    { name: "Apple Gift Card", icon: "🍎", status: "active", minPayout: 10, fee: 0 },
                    { name: "Steam Gift Card", icon: "🎮", status: "active", minPayout: 5, fee: 0 },
                  ].map((method) => (
                    <div key={method.name} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-border">
                      <span className="text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{method.name}</p>
                        <p className="text-[10px] text-muted">Min: ${method.minPayout} · Fee: {method.fee === 0 ? "Free" : `$${method.fee}`}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.status === "active" ? "bg-primary/15 text-primary" : "bg-danger/15 text-danger"}`}>{method.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* ══════ SETTINGS TAB ══════ */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {/* General Settings */}
                <div className="bg-surface rounded-2xl p-5 border border-border">
                  <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2"><Settings size={16} className="text-primary" />General Settings</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Site Name</label>
                      <input type="text" defaultValue="CashBlitz" className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Currency</label>
                      <select defaultValue="CAD" className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Min Withdrawal ($)</label>
                      <input type="number" defaultValue={5} className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" min="1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Referral Bonus ($)</label>
                      <input type="number" defaultValue={5} className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" min="0" step="0.5" />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-surface rounded-2xl p-5 border border-border">
                  <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2"><Activity size={16} className="text-accent-2" />Feature Toggles</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Daily Spin Wheel", desc: "Allow users to spin for free rewards", enabled: true },
                      { label: "Referral Program", desc: "Enable referral bonuses for invites", enabled: true },
                      { label: "Streak Rewards", desc: "Bonus for consecutive daily logins", enabled: true },
                      { label: "New User Bonus", desc: "Welcome bonus for new signups", enabled: false },
                      { label: "Maintenance Mode", desc: "Show maintenance page to non-admin users", enabled: false },
                    ].map((feature) => (
                      <div key={feature.label} className="flex items-center justify-between p-3 bg-surface-light rounded-xl border border-border">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                          <p className="text-[10px] text-muted">{feature.desc}</p>
                        </div>
                        <button className={`w-10 h-5.5 rounded-full transition-colors relative ${feature.enabled ? "bg-primary" : "bg-border"}`}>
                          <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${feature.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-surface rounded-2xl p-5 border border-danger/20">
                  <h3 className="font-bold text-danger text-sm mb-4 flex items-center gap-2"><AlertCircle size={16} />Danger Zone</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-danger/5 rounded-xl border border-danger/10">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Re-seed Database</p>
                        <p className="text-[10px] text-muted">Reset demo data (admin + demo user + offers)</p>
                      </div>
                      <button onClick={async () => {
                        if (!confirm("Re-seed the database? This will add demo data.")) return;
                        const res = await fetch("/api/admin/seed", { method: "POST" });
                        if (res.ok) { setSuccess("Database seeded!"); setTimeout(() => setSuccess(""), 2000); await fetchStats(); await fetchOffers(); await fetchUsers(); }
                      }}
                        className="px-3 py-1.5 bg-danger/10 text-danger text-xs font-bold rounded-lg hover:bg-danger/20 transition-colors press-scale">
                        Re-seed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* ═══════════════════════════════════════ */}
          {/* ══════ DOCS TAB ══════ */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "docs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-4">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary-dark/5 rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={20} className="text-primary" />
                  <h2 className="text-lg font-extrabold text-foreground">CashBlitz Admin Documentation</h2>
                </div>
                <p className="text-sm text-muted">Complete guide to all platform features, APIs, and admin controls.</p>
              </div>

              {/* Platform Overview */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Zap size={16} className="text-primary" />Platform Overview</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">CashBlitz</strong> is a cash rewards platform where users earn money by completing offers (games, surveys, tasks), spinning the daily wheel, claiming daily login bonuses, and referring friends.</p>
                  <p><strong className="text-foreground">Tech Stack:</strong> Next.js 16, TypeScript, Prisma 7, PostgreSQL, NextAuth.js v5, Tailwind CSS v4, Framer Motion.</p>
                  <p><strong className="text-foreground">Deployment:</strong> Railway with Docker, auto-deploys from GitHub main branch.</p>
                </div>
              </div>

              {/* User System */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Users size={16} className="text-primary" />User System</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">Authentication:</strong> Email/password via NextAuth.js with JWT sessions. Passwords are bcrypt-hashed.</p>
                  <p><strong className="text-foreground">Roles:</strong> &quot;user&quot; (default) and &quot;admin&quot;. Admins can access /admin panel.</p>
                  <p><strong className="text-foreground">Balance:</strong> Real-time balance tracked in the database. Refreshed on every JWT token rotation.</p>
                  <p><strong className="text-foreground">XP &amp; Levels:</strong> Users earn XP from spins (10 XP), daily bonuses (25 XP), and actions. Levels: Rookie (0), Bronze (100), Silver (500), Gold (1500), Platinum (5000), Diamond (10000).</p>
                  <p><strong className="text-foreground">Streaks:</strong> Consecutive daily login tracking. Resets if a day is missed.</p>
                  <p><strong className="text-foreground">Banning:</strong> Set isBanned=true on a user to prevent login.</p>
                </div>
              </div>

              {/* Offers System */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Gamepad2 size={16} className="text-accent-2" />Offers System</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">Creating Offers:</strong> Use the Offers tab to create/edit. Each offer has a name, image URL, description, category (game/survey/task), platform, total reward, and multi-step rewards.</p>
                  <p><strong className="text-foreground">Rewards:</strong> Each offer has multiple reward steps with individual amounts, time limits, and bonus flags. Tasks are completed in order.</p>
                  <p><strong className="text-foreground">Flags:</strong> isPremium (featured), isHot (trending badge), isNew (new badge), isActive (visible to users), newUsersOnly.</p>
                  <p><strong className="text-foreground">External URL:</strong> If set, clicking &quot;Start&quot; opens the URL in a new tab (for real offer wall integration).</p>
                  <p><strong className="text-foreground">User Tracking:</strong> When a user starts an offer, a UserOffer record is created with a unique trackingId for postback verification.</p>
                </div>
              </div>

              {/* Financial System */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><DollarSign size={16} className="text-primary" />Financial System</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">Cashouts:</strong> Users can withdraw via PayPal ($5 min), Visa ($10), Amazon ($5), Bitcoin ($10), Apple ($10), or Steam ($5). All zero-fee.</p>
                  <p><strong className="text-foreground">Payout Processing:</strong> Payouts start as &quot;pending&quot;. Admin can approve (→completed), reject (→rejected, auto-refunds balance), or set processing status via Payouts tab.</p>
                  <p><strong className="text-foreground">Transactions:</strong> Every balance change creates a Transaction record with type, amount, balanceBefore/After, and metadata for full audit trail.</p>
                  <p><strong className="text-foreground">Transaction Types:</strong> offer_reward, spin, daily_bonus, referral_bonus, withdraw, refund, admin_adjustment.</p>
                  <p><strong className="text-foreground">Atomicity:</strong> All financial operations use Prisma.$transaction for atomicity — no partial updates.</p>
                </div>
              </div>

              {/* Daily Spin */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Gift size={16} className="text-accent-2" />Daily Spin Wheel</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">Cooldown:</strong> 1 free spin per UTC calendar day. Cooldown resets at midnight UTC.</p>
                  <p><strong className="text-foreground">Prize Distribution (weighted):</strong></p>
                  <div className="bg-surface-light rounded-xl p-3 border border-border mt-1">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span>$0.05 — 25% chance</span><span>$0.50 — 8% chance</span>
                      <span>$0.10 — 25% chance</span><span>$1.00 — 4% chance</span>
                      <span>$0.15 — 20% chance</span><span>$2.00 — 2% chance</span>
                      <span>$0.25 — 15% chance</span><span>$5.00 — 1% chance</span>
                    </div>
                  </div>
                  <p><strong className="text-foreground">Server-side:</strong> Prize is determined server-side (not client). The frontend animates to the server&apos;s result.</p>
                </div>
              </div>

              {/* Daily Login Bonus */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Flame size={16} className="text-orange-500" />Daily Login Bonus</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">7-Day Escalating Calendar:</strong></p>
                  <div className="bg-surface-light rounded-xl p-3 border border-border mt-1">
                    <div className="grid grid-cols-7 gap-2 text-xs text-center">
                      <div><strong>Day 1</strong><br/>$0.05</div>
                      <div><strong>Day 2</strong><br/>$0.10</div>
                      <div><strong>Day 3</strong><br/>$0.15</div>
                      <div><strong>Day 4</strong><br/>$0.25</div>
                      <div><strong>Day 5</strong><br/>$0.50</div>
                      <div><strong>Day 6</strong><br/>$0.75</div>
                      <div><strong>Day 7</strong><br/>$2.00</div>
                    </div>
                  </div>
                  <p><strong className="text-foreground">Streak Logic:</strong> If a user misses a day, streak resets to Day 1. After Day 7, it cycles back to Day 1.</p>
                  <p><strong className="text-foreground">Awards:</strong> 25 XP per claim + the cash amount.</p>
                </div>
              </div>

              {/* Referral System */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Users size={16} className="text-primary" />Referral System</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">How it works:</strong> Each user gets a unique referral code (auto-generated). Share link: /signup?ref=CODE.</p>
                  <p><strong className="text-foreground">Bonus:</strong> Configurable referral bonus ($1.00 default) when referred user completes their first offer.</p>
                  <p><strong className="text-foreground">Tracking:</strong> Referral model tracks referrer, referee, status (pending/completed), and bonus amount.</p>
                </div>
              </div>

              {/* API Reference */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Shield size={16} className="text-primary" />API Reference</h3>
                <div className="text-sm text-muted space-y-2">
                  <p className="font-semibold text-foreground">Public APIs (require auth):</p>
                  <div className="bg-surface-light rounded-xl p-3 border border-border font-mono text-xs space-y-1">
                    <p>GET  /api/offers — List all active offers</p>
                    <p>POST /api/offers/[id]/start — Start an offer (creates UserOffer)</p>
                    <p>GET  /api/user/balance — User balance, streak, level, XP</p>
                    <p>GET  /api/user/offers?status=active|completed — User&apos;s offers</p>
                    <p>GET  /api/user/notifications — Notifications + unread count</p>
                    <p>POST /api/user/notifications — Mark as read</p>
                    <p>GET  /api/user/transactions?type=spin|withdraw — Transaction history</p>
                    <p>POST /api/spin — Spin the wheel (1/day)</p>
                    <p>GET  /api/spin — Check spin cooldown</p>
                    <p>POST /api/daily-reward — Claim daily bonus</p>
                    <p>GET  /api/daily-reward — Check daily reward status</p>
                    <p>POST /api/cashout — Request withdrawal</p>
                    <p>GET  /api/cashout — Payout history</p>
                    <p>GET  /api/referral — Get referral code + stats</p>
                  </div>
                  <p className="font-semibold text-foreground mt-3">Admin APIs (require admin role):</p>
                  <div className="bg-surface-light rounded-xl p-3 border border-border font-mono text-xs space-y-1">
                    <p>GET  /api/admin/stats — Dashboard statistics</p>
                    <p>GET  /api/admin/offers — List all offers</p>
                    <p>POST /api/admin/offers — Create offer</p>
                    <p>PUT  /api/admin/offers/[id] — Update offer</p>
                    <p>DELETE /api/admin/offers/[id] — Delete offer</p>
                    <p>GET  /api/admin/users — List all users</p>
                    <p>PUT  /api/admin/users/[id] — Update user (role, balance, ban)</p>
                    <p>GET  /api/admin/payouts — List payouts (filterable)</p>
                    <p>PUT  /api/admin/payouts — Update payout status</p>
                    <p>POST /api/admin/seed — Re-seed demo data</p>
                  </div>
                </div>
              </div>

              {/* Database Models */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><BarChart3 size={16} className="text-accent-2" />Database Models</h3>
                <div className="text-sm text-muted space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">User</strong> — Auth, balance, XP, streak, role, referral code, ban status</p>
                  <p><strong className="text-foreground">Offer</strong> — Name, image, category, rewards, flags, external URL</p>
                  <p><strong className="text-foreground">OfferReward</strong> — Individual reward steps per offer</p>
                  <p><strong className="text-foreground">UserOffer</strong> — Tracks which users started/completed which offers</p>
                  <p><strong className="text-foreground">Payout</strong> — Withdrawal requests with status tracking</p>
                  <p><strong className="text-foreground">Transaction</strong> — Full audit log of all balance changes</p>
                  <p><strong className="text-foreground">DailyReward</strong> — Daily login bonus claim records</p>
                  <p><strong className="text-foreground">DailySpin</strong> — Spin wheel prize records</p>
                  <p><strong className="text-foreground">Referral</strong> — Referrer/referee relationships and bonus tracking</p>
                  <p><strong className="text-foreground">Notification</strong> — In-app notifications (reward, system, cashout, offer)</p>
                  <p><strong className="text-foreground">Achievement / UserAchievement</strong> — Achievement definitions and unlocks</p>
                  <p><strong className="text-foreground">AppConfig</strong> — Key/value config store for runtime settings</p>
                </div>
              </div>

              {/* Demo Accounts */}
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Crown size={16} className="text-accent-2" />Demo Accounts</h3>
                <div className="text-sm text-muted space-y-2">
                  <div className="bg-surface-light rounded-xl p-3 border border-border font-mono text-xs space-y-1">
                    <p><strong>Admin:</strong> admin@cashblitz.com / admin123</p>
                    <p><strong>Demo User:</strong> demo@cashblitz.com / demo123</p>
                  </div>
                  <p>Use the &quot;Re-seed Database&quot; button in Settings to reset demo data if needed.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
