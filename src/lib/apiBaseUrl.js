/**
 * Resolves the CMS API base URL (always includes the /api suffix).
 *
 * Production uses REACT_APP_API_URL=/api (same-origin, proxied on Netlify).
 * Local dev: when the env is a relative /api path, talk to Express on :4000
 * so DELETE/POST/PATCH are not swallowed by the React dev server (404).
 */
export function resolveApiBaseUrl() {
  const configured = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

  if (configured.startsWith("http://") || configured.startsWith("https://")) {
    return configured.endsWith("/api") ? configured : `${configured}/api`;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:4000/api";
    }
    const origin = window.location.origin.replace(/\/$/, "");
    const path = configured.startsWith("/") ? configured : `/${configured}`;
    return `${origin}${path}`;
  }

  return "http://localhost:4000/api";
}
