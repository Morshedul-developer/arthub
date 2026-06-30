# ArtHub — Client

**ArtHub** is an online art marketplace where collectors can discover and purchase original artworks, artists can showcase and sell their pieces, and admins can manage the platform. This is the Next.js 15 frontend.

**Live URL:** _https://arthub.vercel.app_ _(placeholder — update after deployment)_

## Key Features

- Browse and search artworks by title, artist, or category
- Artwork detail page with purchase, comment, and artist edit/delete controls
- Role-based dashboards (Buyer, Artist, Admin) with sidebar navigation
- User: purchase history, collection gallery, subscription management
- Artist: add/edit/delete artworks, sales history
- Admin: manage users (role changes), all artworks, transactions, analytics charts
- Authentication via Better Auth (email/password + Google OAuth)
- Stripe checkout integration (demo fallback when no key configured)
- Image uploads via imgBB
- Animated hero carousel and scroll-reveal effects

## npm Packages

| Package | Purpose |
|---|---|
| `next` 15 | App Router framework |
| `react` / `react-dom` | UI rendering |
| `tailwindcss` | Utility-first styling |
| `better-auth` | Authentication client (email + Google OAuth) |
| `lucide-react` | Icon set |
| `recharts` | Admin analytics charts (pie + bar) |
| `@stripe/stripe-js` | Stripe checkout (client-side) |

## Run Locally

```bash
npm install
cp .env.example .env.local
# fill in .env.local (see below)
npm run dev
```

Local URL: `http://localhost:3000`

## Required Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5001
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_add_later
NEXT_PUBLIC_IMGBB_API_KEY=add_later
```

## Main Routes

| Route | Description |
|---|---|
| `/` | Homepage with hero carousel and featured artworks |
| `/artworks` | Browse / search all artworks |
| `/artworks/[id]` | Artwork detail, purchase, comments |
| `/login` | Sign in |
| `/register` | Sign up (buyer, artist, or Google) |
| `/dashboard/user/*` | Buyer dashboard |
| `/dashboard/artist/*` | Artist dashboard |
| `/dashboard/admin/*` | Admin dashboard |

## Pending Before Deployment

- Add production API URL.
- Add Stripe public key.
- Add imgBB API key.
- Deploy this folder as the Vercel frontend project.
