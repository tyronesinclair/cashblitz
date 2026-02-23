# CashBlitz - Cash Rewards Platform

A full-stack cash rewards platform inspired by Freecash/AttaPoll where users earn real money by completing offers (games, surveys, tasks), spinning the daily wheel, claiming daily login bonuses, and referring friends.

**Live Demo:** [https://cashblitz-app-production.up.railway.app](https://cashblitz-app-production.up.railway.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.1.6 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (via Prisma 7.4) |
| **Auth** | NextAuth.js v5 (JWT strategy, credentials provider) |
| **Styling** | Tailwind CSS v4 (`@theme inline`) |
| **Animations** | Framer Motion + canvas-confetti |
| **Icons** | Lucide React |
| **Deployment** | Railway (Docker, auto-deploy from GitHub) |
| **ORM** | Prisma with `@prisma/adapter-pg` driver adapter |

---

## Features

### User-Facing Features
- **Offer Wall** — Browse and start offers categorized by games, surveys, and tasks with platform filters (iOS/Android/Desktop), category filters, and sort options
- **Daily Spin Wheel** — Server-side weighted prize wheel (1 free spin/day) with countdown timer. Prizes range from $0.05 to $5.00
- **Daily Login Bonus** — 7-day escalating reward calendar ($0.05 to $2.00). Streak resets if a day is missed
- **Cashout System** — Withdraw via PayPal, Visa, Amazon, Bitcoin, Apple, or Steam gift cards. Zero fees. Full payout history
- **XP & Level System** — Earn XP from spins, daily bonuses, and activities. 6 tiers: Rookie, Bronze, Silver, Gold, Platinum, Diamond
- **Referral Program** — Unique referral codes, share links, track referral stats and earnings
- **Achievements** — Unlock badges for milestones (first offer, 7-day streak, $100 earned, etc.)
- **Transaction History** — Complete audit trail of all balance changes with filtering
- **Notifications** — Real-time in-app notification system with unread count badge
- **Live Activity Feed** — Social proof showing recent platform activity
- **Onboarding** — 4-step walkthrough for first-time users
- **Responsive Design** — Full mobile + desktop layout with sidebar nav (desktop) and bottom tab bar (mobile)

### Admin Features (at /admin)
- **Dashboard** — User count, offer stats, total earnings, active offers, recent signups, top earners
- **Offer Management** — Full CRUD for offers with multi-step rewards, flags, external URLs
- **User Management** — View/search users, adjust balance, change roles, ban users
- **Payout Processing** — Approve/reject/process withdrawal requests. Rejections auto-refund
- **Settings** — Site name, currency, min withdrawal, feature toggles, danger zone (re-seed)
- **Documentation** — Comprehensive in-app docs tab covering all platform features, APIs, and database models

---

## Project Structure

```
src/
  app/
    page.tsx                    # Landing page (Freecash-inspired)
    about/page.tsx              # About/overview page
    login/page.tsx              # Login page
    signup/page.tsx             # Signup page
    dashboard/page.tsx          # Main dashboard with 4 tabs
    admin/page.tsx              # Admin panel with 6 tabs
    api/
      auth/[...nextauth]/       # NextAuth.js handler
      auth/signup/               # User registration
      offers/                    # List active offers
      offers/[id]/start/         # Start an offer (creates UserOffer)
      user/balance/              # User balance, streak, level, XP
      user/offers/               # User's started/completed offers
      user/notifications/        # Notification list + mark read
      user/transactions/         # Transaction history with filtering
      spin/                      # Daily spin wheel (POST spin, GET status)
      daily-reward/              # Daily login bonus (POST claim, GET status)
      cashout/                   # Withdrawal requests + history
      referral/                  # Referral code + stats
      admin/stats/               # Admin dashboard statistics
      admin/offers/              # Admin offer CRUD
      admin/users/               # Admin user management
      admin/payouts/             # Admin payout processing
      admin/seed/                # Database seeding
  components/
    EarnPage.tsx                # Offer wall with filters, sort, spin button
    OfferCard.tsx               # Individual offer card component
    OfferModal.tsx              # Offer detail modal with start functionality
    SpinWheel.tsx               # Animated spin wheel with API integration
    CashoutPage.tsx             # Withdrawal form with real balance
    MyOffersPage.tsx            # Active/completed offers tracking
    RewardsPage.tsx             # Profile, daily bonus, achievements, levels
    OnboardingModal.tsx         # First-time user walkthrough
    ReferralCard.tsx            # Referral link, copy, share, stats
    TransactionHistory.tsx      # Filtered transaction list
    LiveActivityFeed.tsx        # Social proof activity feed
  lib/
    auth.ts                     # NextAuth config + isAdmin/getAuthUserId helpers
    db.ts                       # Prisma client (lazy init via Proxy)
  types/
    next-auth.d.ts              # TypeScript augmentations for session/JWT
  data/
    offers.ts                   # Static offer type definitions
prisma/
  schema.prisma                 # Database schema (13 models)
  seed.ts                       # Database seeder
```

---

## Database Models

| Model | Purpose |
|-------|---------|
| **User** | Auth, balance, XP, streak, role, referral code, ban status |
| **Offer** | Name, image, category, rewards, flags, external URL |
| **OfferReward** | Individual reward steps per offer |
| **UserOffer** | Tracks which users started/completed which offers |
| **Payout** | Withdrawal requests with status (pending/processing/completed/rejected) |
| **Transaction** | Full audit log of all balance changes |
| **DailyReward** | Daily login bonus claim records |
| **DailySpin** | Spin wheel prize records |
| **Referral** | Referrer/referee relationships and bonus tracking |
| **Notification** | In-app notifications (reward, system, cashout, offer) |
| **Achievement** | Achievement definitions |
| **UserAchievement** | Which users unlocked which achievements |
| **AppConfig** | Key/value config store for runtime settings |

---

## API Reference

### Public APIs (require authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/offers` | List all active offers |
| POST | `/api/offers/[id]/start` | Start an offer (creates UserOffer with trackingId) |
| GET | `/api/user/balance` | User balance, streak, level, XP, active offer count |
| GET | `/api/user/offers?status=active` | User's offers (filter: all/active/completed/abandoned) |
| GET | `/api/user/notifications` | Notifications + unread count |
| POST | `/api/user/notifications` | Mark notifications as read |
| GET | `/api/user/transactions?type=spin` | Transaction history with type filter |
| POST | `/api/spin` | Spin the wheel (1/day, server-side prize) |
| GET | `/api/spin` | Check spin cooldown status |
| POST | `/api/daily-reward` | Claim daily login bonus |
| GET | `/api/daily-reward` | Check daily reward status + calendar |
| POST | `/api/cashout` | Request withdrawal (amount, method) |
| GET | `/api/cashout` | User's payout history |
| GET | `/api/referral` | Get referral code, link, stats |

### Admin APIs (require admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/offers` | List/create offers |
| PUT/DELETE | `/api/admin/offers/[id]` | Update/delete offer |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/[id]` | Update user (role, balance, ban) |
| GET/PUT | `/api/admin/payouts` | List/update payout status |
| POST | `/api/admin/seed` | Re-seed demo data |

---

## Spin Wheel Prize Distribution

| Prize | Weight | Probability |
|-------|--------|-------------|
| $0.05 | 25 | 25% |
| $0.10 | 25 | 25% |
| $0.15 | 20 | 20% |
| $0.25 | 15 | 15% |
| $0.50 | 8 | 8% |
| $1.00 | 4 | 4% |
| $2.00 | 2 | 2% |
| $5.00 | 1 | 1% |

Prize is determined **server-side** — the client animates to the server's result.

---

## Daily Login Bonus Calendar

| Day | Amount | XP |
|-----|--------|----|
| 1 | $0.05 | 25 |
| 2 | $0.10 | 25 |
| 3 | $0.15 | 25 |
| 4 | $0.25 | 25 |
| 5 | $0.50 | 25 |
| 6 | $0.75 | 25 |
| 7 | $2.00 | 25 |

Streak resets to Day 1 if a day is missed. After Day 7, cycles back to Day 1.

---

## XP Level Tiers

| Level | Name | Min XP |
|-------|------|--------|
| 0 | Rookie | 0 |
| 1 | Bronze | 100 |
| 2 | Silver | 500 |
| 3 | Gold | 1,500 |
| 4 | Platinum | 5,000 |
| 5 | Diamond | 10,000 |

XP sources: Daily spin (10 XP), Daily bonus (25 XP).

---

## Getting Started

### Prerequisites
- Node.js 22+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tyronesinclair/cashblitz.git
cd cashblitz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and auth secret
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/cashblitz"
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed demo data (optional)
npx tsx prisma/seed.ts
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Demo Accounts

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | admin@cashblitz.com | admin123 | admin |
| Demo User | demo@cashblitz.com | demo123 | user |

---

## Deployment (Railway)

The project is configured for Railway with a Dockerfile:

1. Push to GitHub `main` branch triggers auto-deploy
2. Dockerfile uses `node:22-alpine`
3. Build command: `npx prisma generate && npm run build`
4. Start command: `npx prisma db push && node server.js`
5. Required env vars: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`

### Railway Project Details
- **Public URL:** https://cashblitz-app-production.up.railway.app
- **Auto-deploy:** Enabled on `main` branch

---

## Architecture Decisions

- **JWT Balance Refresh:** The JWT callback always queries the DB for the latest balance/role/streak to prevent stale session data
- **Atomic Transactions:** All financial operations (cashout, spin, daily bonus) use `prisma.$transaction` for atomicity
- **Server-Side Spin:** Prize is determined server-side with weighted random — client only animates
- **Lazy Prisma Init:** Uses JavaScript Proxy pattern for lazy initialization to prevent build-time DB connection errors
- **Force Dynamic:** All API routes use `export const dynamic = "force-dynamic"` to prevent static rendering
- **UTC Date Comparison:** All daily cooldowns use UTC dates for timezone-agnostic behavior

---

## License

This project is for educational and demonstration purposes.
