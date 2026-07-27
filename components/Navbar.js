"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  Moon,
  Palette,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { clearSessionHint } from "../lib/session-hint";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/artworks", label: "Browse Artworks" },
];

const dashboardItems = {
  user: [
    { label: "Overview", href: "/dashboard/user" },
    { label: "Purchase History", href: "/dashboard/user/purchases" },
    { label: "My Collection", href: "/dashboard/user/collection" },
    { label: "Subscription", href: "/dashboard/user/subscription" },
    { label: "Edit Profile", href: "/dashboard/user/profile" },
  ],
  artist: [
    { label: "Overview", href: "/dashboard/artist" },
    { label: "Add Artwork", href: "/dashboard/artist/add-artwork" },
    { label: "Manage Artworks", href: "/dashboard/artist/manage-artworks" },
    { label: "Sales History", href: "/dashboard/artist/sales" },
    { label: "Edit Profile", href: "/dashboard/artist/profile" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "All Artworks", href: "/dashboard/admin/artworks" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
    { label: "Analytics", href: "/dashboard/admin/analytics" },
    { label: "Edit Profile", href: "/dashboard/admin/profile" },
  ],
};

const roleLabels = { user: "Buyer", artist: "Artist", admin: "Admin" };
const roleColors = { user: "#0891b2", artist: "#7c3aed", admin: "#b45309" };

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [mobileDashOpen, setMobileDashOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [profileRole, setProfileRole] = useState("user");
  const { data: session, isPending } = authClient.useSession();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    if (!session?.user) {
      setProfileRole("user");
      return;
    }
    // Ensure JWT cookie exists (covers Google OAuth post-redirect and session resume)
    api("/auth/token", { method: "POST" }).catch(() => {});
    api("/profile/me")
      .then((profile) => setProfileRole(profile.role || "user"))
      .catch(() => setProfileRole("user"));
  }, [session?.user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDashboardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function logout() {
    // Clear JWT cookie on server, then clear Better Auth session
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    await authClient.signOut();
    clearSessionHint();
    // Hard navigation: soft navigation (router.push) races AuthGuard's own
    // session-driven redirect and middleware re-gating /dashboard/*, since
    // better-auth defers the session store update ~10ms after signOut()
    // resolves (see node_modules/better-auth/dist/client/proxy.mjs).
    window.location.href = "/login";
  }

  const isDashActive = pathname.startsWith("/dashboard");
  const items = dashboardItems[profileRole] || dashboardItems.user;

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        {/* Brand */}
        <Link href="/" style={styles.brand}>
          <span style={styles.brandIcon}>
            <Palette size={19} />
          </span>
          ArtHub
        </Link>

        {/* Desktop links */}
        <div
          className="hidden items-center gap-1 md:flex"
          style={styles.linksInner}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isActive ? "#383432" : "rgba(120,113,108,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? "var(--ink)" : "transparent"; }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Dashboard dropdown trigger */}
          <div ref={dropdownRef} style={styles.dropdownWrapper}>
            <button
              onClick={() => setDashboardOpen((v) => !v)}
              style={{ ...styles.navLink, ...styles.dropdownTrigger, ...(isDashActive ? styles.navLinkActive : {}) }}
              onMouseEnter={(e) => { e.currentTarget.style.background = isDashActive ? "#383432" : "rgba(120,113,108,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isDashActive ? "var(--ink)" : "transparent"; }}
              aria-expanded={dashboardOpen}
              aria-haspopup="true"
            >
              <LayoutDashboard size={15} style={{ marginRight: "0.35rem" }} />
              Dashboard
              <ChevronDown
                size={14}
                style={{
                  marginLeft: "0.3rem",
                  transition: "transform 0.2s",
                  transform: dashboardOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {dashboardOpen && (
              <div style={styles.dropdown}>
                {/* Role badge */}
                <div style={styles.dropdownHeader}>
                  <span
                    style={{
                      ...styles.roleBadge,
                      background: roleColors[profileRole] || "#6b7280",
                    }}
                  >
                    {roleLabels[profileRole] || "User"}
                  </span>
                  <span style={styles.dropdownTitle}>My Dashboard</span>
                </div>
                <div style={styles.dropdownDivider} />
                {items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setDashboardOpen(false)}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div
          className="hidden items-center gap-2 md:flex"
          style={styles.actionsInner}
        >
          {!isPending &&
            (session?.user ? (
              <button
                onClick={logout}
                style={styles.darkButton}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#57534e"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  style={styles.lightButton}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f0efee"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  style={styles.darkButton}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#44403c"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
                >
                  Join
                </Link>
              </>
            ))}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={styles.iconButton}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(120,113,108,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div
          className="flex items-center gap-2 md:hidden"
          style={styles.mobileControls}
        >
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={styles.iconButton}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(120,113,108,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
            style={styles.iconButton}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(120,113,108,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={styles.mobileDrawer}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : {}) }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isActive ? "#383432" : "rgba(120,113,108,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? "var(--ink)" : "transparent"; }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile dashboard accordion */}
          <button
            onClick={() => setMobileDashOpen((v) => !v)}
            style={{ ...styles.mobileLink, ...styles.mobileDashTrigger, ...(isDashActive ? styles.mobileLinkActive : {}) }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDashActive ? "#383432" : "rgba(120,113,108,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isDashActive ? "var(--ink)" : "transparent"; }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <LayoutDashboard size={15} />
              Dashboard
              <span
                style={{
                  ...styles.roleBadge,
                  background: roleColors[profileRole] || "#6b7280",
                  marginLeft: "0.25rem",
                }}
              >
                {roleLabels[profileRole] || "User"}
              </span>
            </span>
            <ChevronDown
              size={14}
              style={{
                transition: "transform 0.2s",
                transform: mobileDashOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {mobileDashOpen && (
            <div style={styles.mobileSubMenu}>
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileDashOpen(false);
                  }}
                  style={styles.mobileSubLink}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {!isPending && (
            <div style={styles.mobileActions}>
              {session?.user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  style={{ ...styles.darkButton, flex: 1 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#44403c"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      ...styles.lightButton,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      ...styles.darkButton,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    borderBottom: "1px solid var(--line)",
    background: "var(--nav-bg)",
    backdropFilter: "blur(10px)",
  },
  nav: {
    maxWidth: "80rem",
    minHeight: "4rem",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.55rem",
    fontWeight: 800,
    fontSize: "1.05rem",
    color: "var(--ink)",
    textDecoration: "none",
  },
  brandIcon: {
    width: "2.25rem",
    height: "2.25rem",
    display: "grid",
    placeItems: "center",
    borderRadius: "0.45rem",
    background: "#047857",
    color: "white",
    flexShrink: 0,
  },
  linksInner: {
    alignItems: "center",
    gap: "0.15rem",
  },
  navLink: {
    borderRadius: "0.35rem",
    padding: "0.5rem 0.7rem",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--muted)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    border: "none",
    background: "transparent",
    transition: "background 0.15s",
  },
  navLinkActive: {
    background: "var(--ink)",
    color: "var(--bg)",
  },
  dropdownWrapper: {
    position: "relative",
  },
  dropdownTrigger: {
    userSelect: "none",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 0.5rem)",
    left: "50%",
    transform: "translateX(-50%)",
    minWidth: "13rem",
    background: "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: "0.65rem",
    boxShadow: "0 12px 32px rgba(28,25,23,0.14)",
    overflow: "hidden",
    zIndex: 50,
    padding: "0.4rem",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.6rem 0.35rem",
  },
  dropdownTitle: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--muted)",
  },
  roleBadge: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "0.15rem 0.55rem",
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  dropdownDivider: {
    height: "1px",
    background: "var(--line)",
    margin: "0.25rem 0",
  },
  dropdownItem: {
    display: "block",
    padding: "0.55rem 0.75rem",
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "var(--ink)",
    textDecoration: "none",
    borderRadius: "0.4rem",
    background: "transparent",
    transition: "background 0.12s",
  },
  actionsInner: {
    alignItems: "center",
    gap: "0.5rem",
  },
  lightButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--line)",
    borderRadius: "0.4rem",
    background: "var(--surface)",
    color: "var(--ink)",
    padding: "0.55rem 0.9rem",
    fontSize: "0.88rem",
    fontWeight: 800,
    textDecoration: "none",
  },
  darkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--ink)",
    borderRadius: "0.4rem",
    background: "var(--ink)",
    color: "var(--bg)",
    padding: "0.55rem 0.9rem",
    fontSize: "0.88rem",
    fontWeight: 800,
    textDecoration: "none",
  },
  iconButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.4rem",
    height: "2.4rem",
    borderRadius: "0.45rem",
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--ink)",
  },
  mobileControls: {
    alignItems: "center",
    gap: "0.4rem",
  },
  mobileDrawer: {
    borderTop: "1px solid var(--line)",
    background: "var(--bg)",
    padding: "0.5rem 1rem 1rem",
  },
  mobileLink: {
    display: "block",
    borderRadius: "0.4rem",
    padding: "0.65rem 0.75rem",
    fontSize: "0.92rem",
    fontWeight: 700,
    color: "var(--ink)",
    textDecoration: "none",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
  },
  mobileLinkActive: {
    background: "var(--ink)",
    color: "var(--bg)",
  },
  mobileDashTrigger: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mobileSubMenu: {
    borderLeft: "2px solid var(--line)",
    marginLeft: "0.75rem",
    paddingLeft: "0.5rem",
    marginBottom: "0.25rem",
  },
  mobileSubLink: {
    display: "block",
    padding: "0.5rem 0.6rem",
    fontSize: "0.87rem",
    fontWeight: 700,
    color: "var(--muted)",
    textDecoration: "none",
    borderRadius: "0.35rem",
  },
  mobileActions: {
    marginTop: "0.75rem",
    display: "flex",
    gap: "0.5rem",
  },
};
