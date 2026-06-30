# ArtHub

ArtHub is a full-stack online art marketplace where collectors can discover and purchase original artworks, artists can showcase and manage their portfolio, and admins can oversee the entire platform — all with role-based access and Stripe-powered payments.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend (Next.js) | https://arthub-iota.vercel.app |
| Backend (Express) | https://arthub-server-zeta.vercel.app/api/health |

---

## Key Features

### Buyers
- Browse and search artworks by title, artist, or category
- Stripe checkout to purchase artworks (sandbox-ready)
- Purchase history and collection gallery in dashboard
- Subscription tiers (Free / Pro / Premium) with purchase limits
- Comment on artworks after purchase

### Artists
- Add, edit, and delete artworks with image uploads via imgBB
- Sales history and earnings overview in dashboard

### Admins
- Manage all users — change roles, view activity
- Manage all artworks and transactions across the platform
- Analytics dashboard with pie and bar charts

### Platform
- Email/password and Google OAuth via Better Auth
- HTTP-only JWT cookie session for secure API access
- Role-based dashboards (`/dashboard/user`, `/dashboard/artist`, `/dashboard/admin`)
- Fully responsive UI with dark-mode support

---

## Tech Stack

### Frontend (`client/`)

| Package | Version | Purpose |
|---|---|---|
| `next` | 15 | App Router framework |
| `react` / `react-dom` | 19 | UI rendering |
| `tailwindcss` | 3 | Utility-first CSS |
| `better-auth` | 1.3 | Auth client — email + Google OAuth |
| `lucide-react` | 0.546 | Icon library |
| `recharts` | 3 | Analytics charts (pie + bar) |
| `framer-motion` | 12 | Animations and scroll effects |
| `@heroui/react` | 3 | UI component primitives |
| `jose-cjs` | 6 | JWT decoding on client |

### Backend (`server/`)

| Package | Version | Purpose |
|---|---|---|
| `express` | 4 | HTTP server and routing |
| `mongoose` | 8 | MongoDB ODM |
| `better-auth` | 1.3 | Session management + OAuth |
| `jose-cjs` | 6 | JWT signing and verification |
| `stripe` | 17 | Checkout session creation |
| `cors` | 2 | Cross-origin request handling |
| `cookie-parser` | 1 | HTTP-only cookie parsing |
| `dotenv` | 17 | Environment variable loading |
| `nodemon` | 3 | Dev server auto-reload |

---

## Project Structure

```
modern_intern_assessment_project/
├── client/                   # Next.js 15 frontend
│   ├── app/                  # App Router pages
│   │   ├── artworks/         # Browse + artwork detail
│   │   ├── dashboard/[role]/ # Role-based dashboards
│   │   ├── login/            # Sign in
│   │   ├── register/         # Sign up
│   │   └── auth/callback/    # OAuth post-login handler
│   ├── components/           # Navbar, Footer, ArtworkCard, etc.
│   └── lib/                  # API fetch wrapper, auth client
│
└── server/                   # Express.js backend
    └── src/
        ├── config/           # Database + auth setup
        ├── middleware/        # Session attachment, requireRole
        ├── models/           # Mongoose schemas (User, Artwork, Transaction, Comment)
        ├── routes/           # artwork, dashboard, payment, profile, auth
        └── utils/            # seed script
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Stripe](https://stripe.com) account (test keys are enough)
- A [Google Cloud](https://console.cloud.google.com) OAuth 2.0 client (optional)
- An [imgBB](https://imgbb.com) API key (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/Morshedul-developer/arthub.git
cd arthub
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env   # then fill in values — see below
npm run dev            # runs on http://localhost:5001
```

**`server/.env`**

```env
PORT=5001
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:5001
BETTER_AUTH_SECRET=your_random_secret
MONGO_URI=mongodb+srv://...
MONGO_DB_NAME=arthub
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SUCCESS_URL=http://localhost:3000/dashboard/user?payment=success&session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:3000/artworks?payment=cancelled
GOOGLE_CLIENT_ID=        # optional
GOOGLE_CLIENT_SECRET=    # optional
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Set up the client

```bash
cd ../client
npm install
cp .env.example .env.local   # then fill in values — see below
npm run dev                  # runs on http://localhost:3000
```

**`client/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

---

## Demo Credentials

### Seeded accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@arthub.com` | `Admin@123` |
| Artist | `nira.artist@example.com` | `Artist@123` |
| Artist | `ayan.artist@example.com` | `Artist@123` |
| Buyer | `maya@example.com` | `Buyer@123` |
| Buyer | `rafi.collector@example.com` | `Buyer@123` |

### Stripe test card

To complete a sandbox purchase at checkout:

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g. `12/34`) |
| CVC | Any 3 digits (e.g. `123`) |
| Email | Any email address |

No real charge is made. The artwork will be marked as sold and the transaction recorded.

---

## API Overview

| Prefix | Description |
|---|---|
| `GET /api/health` | Server health check |
| `/api/auth/*` | Better Auth — sign-up, sign-in, OAuth, token exchange |
| `/api/profile/*` | Current user profile and password update |
| `/api/artworks/*` | Artwork CRUD, comments, purchase permissions |
| `/api/dashboard/*` | Role-specific data, admin user/artwork management |
| `/api/checkout/*` | Stripe purchase and subscription checkout |

---

## Deployment

Both services are deployed independently on Vercel.

| Variable to update for production | |
|---|---|
| `BETTER_AUTH_URL` | Your backend Vercel URL |
| `CLIENT_URL` | Your frontend Vercel URL |
| `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL` | Use production frontend URLs |
| `NEXT_PUBLIC_API_URL` | Your backend Vercel URL |

Google Cloud Console → Authorized redirect URI must be set to:
```
https://<your-backend>.vercel.app/api/auth/callback/google
```

---

## License

This project is for demonstration purposes.
