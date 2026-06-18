/** True when running on a serverless host (Netlify Functions, Vercel, etc.). */
export function isServerlessHost() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY === "true"
  );
}

/** Normalize a site URL for CORS allowlists. */
export function normalizeOrigin(url) {
  if (!url) return null;
  const withScheme = url.startsWith("http") ? url : `https://${url}`;
  return withScheme.replace(/\/$/, "");
}
