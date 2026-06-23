import Link from "next/link";
import { ArrowRight, BadgeCheck, Brush, ShieldCheck, Sparkles } from "lucide-react";
import ArtworkCard from "../components/ArtworkCard";
import HeroCarousel from "../components/HeroCarousel";
import Reveal from "../components/Reveal";
import { API_URL } from "../lib/api";

async function getHomeData() {
  try {
    const [featuredRes, artistsRes] = await Promise.all([
      fetch(`${API_URL}/api/artworks/featured`, { cache: "no-store" }),
      fetch(`${API_URL}/api/artworks/top-artists`, { cache: "no-store" })
    ]);

    return {
      featured: featuredRes.ok ? await featuredRes.json() : [],
      artists: artistsRes.ok ? await artistsRes.json() : []
    };
  } catch {
    return { featured: [], artists: [] };
  }
}

const categories = ["Painting", "Digital", "Sculpture", "Abstract", "Photography", "Mixed Media"];

const features = [
  { icon: BadgeCheck, title: "Role based dashboards",  text: "Buyer, artist, and admin screens — each with their own CRUD operations and analytics." },
  { icon: ShieldCheck, title: "JWT + Better Auth",     text: "Email/password and Google OAuth flow through Better Auth, then issue a signed JWT cookie." },
  { icon: Sparkles,   title: "Stripe payments",        text: "Artwork purchases and subscription upgrades run through Stripe Checkout." }
];

export default async function HomePage() {
  const { featured, artists } = await getHomeData();

  return (
    <>
      <HeroCarousel />

      {/* ── Featured Artworks ───────────────────────────────────── */}
      <section className="section" style={styles.section}>
        <Reveal variant="up">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end" style={styles.sectionHead}>
            <div>
              <p className="font-semibold text-emerald-700" style={styles.kicker}>Fresh picks</p>
              <h2 className="mt-2 text-3xl font-black text-stone-950" style={styles.sectionTitle}>Featured Artworks</h2>
            </div>
            <Link href="/artworks" className="inline-flex items-center font-bold text-emerald-700" style={styles.textLink}>
              View all <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
        </Reveal>

        {featured.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={styles.cardGrid}>
            {featured.map((artwork, i) => (
              <Reveal key={artwork._id} variant="up" delay={i * 90}>
                <ArtworkCard artwork={artwork} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal variant="up">
            <div className="card p-8 text-center text-stone-600" style={styles.emptyState}>
              No artworks yet. Run the seed script after adding MongoDB.
            </div>
          </Reveal>
        )}
      </section>

      {/* ── Why ArtHub feature boxes ────────────────────────────── */}
      <section className="bg-white" style={styles.whiteBand}>
        <div className="section" style={styles.section}>
          <div className="grid gap-5 md:grid-cols-3" style={styles.featureGrid}>
            {features.map((item, i) => (
              <Reveal key={item.title} variant="up" delay={i * 110}>
                <div className="rounded-lg border border-stone-200 p-6" style={styles.featureBox}>
                  <item.icon className="text-emerald-700" />
                  <h3 className="mt-4 font-bold" style={styles.featureTitle}>{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600" style={styles.featureText}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Artists + Categories ────────────────────────────── */}
      <section className="section grid gap-8 lg:grid-cols-[0.9fr_1.1fr]" style={{ ...styles.section, ...styles.splitSection }}>
        <div>
          <Reveal variant="up">
            <p className="font-semibold text-emerald-700" style={styles.kicker}>Top artists</p>
            <h2 className="mt-2 text-3xl font-black" style={styles.sectionTitle}>Creators collectors notice</h2>
          </Reveal>
          <div className="mt-6 grid gap-3" style={styles.artistList}>
            {artists.map((artist, i) => (
              <Reveal key={artist._id} variant="left" delay={i * 110}>
                <div className="card flex items-center gap-4 p-4" style={styles.artistCard}>
                  <img
                    src={artist.avatarUrl || `https://i.pravatar.cc/120?u=${artist.email}`}
                    alt={artist.name}
                    className="h-14 w-14 rounded-full object-cover"
                    style={styles.artistAvatar}
                  />
                  <div>
                    <h3 className="font-bold" style={styles.artistName}>{artist.name}</h3>
                    <p className="text-sm text-stone-500" style={styles.artistMeta}>{artist.sales || 0} sales</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal variant="up">
            <p className="font-semibold text-emerald-700" style={styles.kicker}>Explore by category</p>
            <h2 className="mt-2 text-3xl font-black" style={styles.sectionTitle}>Find your style faster</h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" style={styles.categoryGrid}>
            {categories.map((category, i) => (
              <Reveal key={category} variant="scale" delay={i * 65}>
                <Link
                  href={`/artworks?category=${encodeURIComponent(category)}`}
                  className="card flex items-center gap-3 p-4 font-bold hover:border-emerald-600"
                  style={styles.categoryCard}
                >
                  <Brush className="text-amber-600" size={18} />
                  {category}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const styles = {
  section: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "4rem 1rem"
  },
  sectionHead: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap"
  },
  kicker: {
    margin: 0,
    color: "var(--accent)",
    fontWeight: 850
  },
  sectionTitle: {
    margin: "0.45rem 0 0",
    color: "var(--ink)",
    fontSize: "clamp(1.8rem, 4vw, 2.25rem)",
    lineHeight: 1.1,
    fontWeight: 950
  },
  textLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "var(--accent)",
    fontWeight: 850,
    textDecoration: "none"
  },
  cardGrid: {
    display: "grid",
    gap: "1.25rem"
  },
  emptyState: {
    border: "1px solid var(--line)",
    borderRadius: "0.65rem",
    background: "var(--surface)",
    color: "var(--muted)",
    padding: "2rem",
    textAlign: "center"
  },
  whiteBand: {
    background: "var(--surface)"
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.25rem"
  },
  featureBox: {
    border: "1px solid var(--line)",
    borderRadius: "0.65rem",
    padding: "1.5rem",
    background: "var(--surface)"
  },
  featureTitle: {
    margin: "1rem 0 0",
    color: "var(--ink)",
    fontWeight: 900
  },
  featureText: {
    margin: "0.55rem 0 0",
    color: "var(--muted)",
    fontSize: "0.95rem",
    lineHeight: 1.65
  },
  splitSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem"
  },
  artistList: {
    display: "grid",
    gap: "0.8rem",
    marginTop: "1.5rem"
  },
  artistCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    border: "1px solid var(--line)",
    borderRadius: "0.65rem",
    background: "var(--surface)",
    padding: "1rem"
  },
  artistAvatar: {
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: "999px",
    objectFit: "cover"
  },
  artistName: {
    margin: 0,
    fontWeight: 900,
    color: "var(--ink)"
  },
  artistMeta: {
    margin: "0.25rem 0 0",
    color: "var(--muted)",
    fontSize: "0.9rem"
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "0.75rem",
    marginTop: "1.5rem"
  },
  categoryCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid var(--line)",
    borderRadius: "0.65rem",
    background: "var(--surface)",
    color: "var(--ink)",
    padding: "1rem",
    fontWeight: 850,
    textDecoration: "none"
  }
};
