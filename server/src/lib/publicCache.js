/**
 * Cache-Control for public read-only GET responses.
 * Netlify's CDN honours s-maxage; browsers use max-age via the shared value.
 */
export function setPublicCache(res, { maxAge = 60, swr = 300 } = {}) {
  res.set(
    "Cache-Control",
    `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${swr}`,
  );
}
