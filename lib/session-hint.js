const COOKIE = "arthub_hint";

// Non-sensitive marker cookie on the frontend's own domain, used only by
// middleware.js to pre-empt obviously-logged-out visitors at the edge.
// The real session lives in an httpOnly cookie on the backend's domain and
// is never readable here — AuthGuard is the actual source of truth.
export function setSessionHint() {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=1; path=/; max-age=1209600; samesite=lax${secure}`;
}

export function clearSessionHint() {
  document.cookie = `${COOKIE}=; path=/; max-age=0`;
}
