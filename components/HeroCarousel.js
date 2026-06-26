"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Original art, direct from artists",
    heading: "Discover & Buy\nOriginal Art",
    body: "Browse fresh paintings, digital art, sculptures, and photography from independent artists around the world.",
    cta: { label: "Browse Artworks", href: "/artworks" },
    secondary: { label: "Join as Artist", href: "/register" }
  },
  {
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Support independent creators",
    heading: "Every Piece\nTells a Story",
    body: "Each artwork is handpicked from talented artists. Own something unique that speaks to your soul.",
    cta: { label: "Explore the Gallery", href: "/artworks" },
    secondary: { label: "Learn More", href: "/register" }
  },
  {
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Secure payments · Role dashboards",
    heading: "Your Next\nMasterpiece Awaits",
    body: "From abstract canvases to digital prints — find art that transforms your space and inspires your world.",
    cta: { label: "Start Collecting", href: "/artworks" },
    secondary: { label: "Sell Your Art", href: "/register" }
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = slides.length;

  function goTo(index, direction) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(((index % total) + total) % total);
      setAnimating(false);
    }, 0);
  }

  function prev() {
    goTo(current - 1);
  }

  function next() {
    goTo(current + 1);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const slide = slides[current];

  return (
    <div style={styles.root}>
      {/* Slides track */}
      <div style={styles.track}>
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              ...styles.slide,
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
              transition: "opacity 0.8s ease"
            }}
            aria-hidden={i !== current}
          >
            <img src={s.image} alt="" style={styles.bg} />
            <div style={styles.overlay} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <p style={styles.eyebrow} className="hero-badge-pulse">{slide.eyebrow}</p>
        <h1 style={styles.heading}>
          {slide.heading.split("\n").map((line, i) => (
            <span key={i} style={{ display: "block" }}>{line}</span>
          ))}
        </h1>
        <p style={styles.body}>{slide.body}</p>
        <div style={styles.actions}>
          <Link href={slide.cta.href} style={styles.primaryBtn}>
            {slide.cta.label}
          </Link>
          <Link href={slide.secondary.href} style={styles.secondaryBtn}>
            {slide.secondary.label}
          </Link>
        </div>
      </div>

      {/* Arrow controls */}
      <button onClick={prev} aria-label="Previous slide" style={{ ...styles.arrow, left: "1.25rem" }}>
        <ArrowLeft size={20} />
      </button>
      <button onClick={next} aria-label="Next slide" style={{ ...styles.arrow, right: "1.25rem" }}>
        <ArrowRight size={20} />
      </button>

      {/* Dot indicators */}
      <div style={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              ...styles.dot,
              background: i === current ? "#ffffff" : "rgba(255,255,255,0.4)",
              width: i === current ? "2rem" : "0.55rem"
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  root: {
    position: "relative",
    overflow: "hidden",
    background: "#1c1917",
    minHeight: "540px",
    display: "flex",
    alignItems: "flex-end"
  },
  track: {
    position: "absolute",
    inset: 0
  },
  slide: {
    position: "absolute",
    inset: 0
  },
  bg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(28,25,23,0.85) 0%, rgba(28,25,23,0.45) 55%, rgba(28,25,23,0.25) 100%)"
  },
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "80rem",
    width: "100%",
    margin: "0 auto",
    padding: "6rem 1.5rem 5rem",
    color: "white"
  },
  eyebrow: {
    display: "inline-flex",
    margin: "0 0 1rem",
    borderRadius: "999px",
    background: "rgba(16,185,129,0.2)",
    border: "1px solid rgba(16,185,129,0.35)",
    color: "#d1fae5",
    padding: "0.38rem 0.9rem",
    fontSize: "0.88rem",
    fontWeight: 700,
    letterSpacing: "0.02em"
  },
  heading: {
    margin: 0,
    fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
    lineHeight: 1.04,
    fontWeight: 950,
    color: "white"
  },
  body: {
    marginTop: "1.2rem",
    maxWidth: "38rem",
    color: "#e7e5e4",
    fontSize: "1.08rem",
    lineHeight: 1.75
  },
  actions: {
    marginTop: "2rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem"
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "0.45rem",
    background: "#059669",
    color: "white",
    padding: "0.85rem 1.4rem",
    fontWeight: 800,
    textDecoration: "none",
    fontSize: "0.95rem"
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "0.45rem",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    padding: "0.85rem 1.4rem",
    fontWeight: 800,
    textDecoration: "none",
    fontSize: "0.95rem"
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.75rem",
    height: "2.75rem",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    backdropFilter: "blur(6px)",
    transition: "background 0.2s"
  },
  dots: {
    position: "absolute",
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  dot: {
    height: "0.55rem",
    borderRadius: "999px",
    border: "none",
    padding: 0,
    transition: "all 0.3s ease"
  }
};
