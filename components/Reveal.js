"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal — wraps children and triggers a CSS entrance animation
 * when the element scrolls into the viewport.
 *
 * variant : "up" | "left" | "scale"
 * delay   : ms before animation starts (use for stagger: index * 80)
 */
export default function Reveal({ children, variant = "up", delay = 0, className = "" }) {
  const ref = useRef(null);

  const variantClass = variant === "left"  ? "reveal-left"
                     : variant === "scale" ? "reveal-scale"
                     : "reveal";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${variantClass} ${className}`.trim()}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
