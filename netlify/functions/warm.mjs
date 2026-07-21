/**
 * Keeps the Netlify API function warm to reduce cold-start latency.
 * Scheduled every 5 minutes via netlify.toml.
 */
export const handler = async () => {
  const base =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.SITE_URL ||
    "http://localhost:8888";

  const origin = base.replace(/\/$/, "");

  try {
    await Promise.all([
      fetch(`${origin}/api/health`),
      fetch(`${origin}/api/public/home`),
    ]);
    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("[warm] failed:", err);
    return { statusCode: 500, body: "warm failed" };
  }
};
