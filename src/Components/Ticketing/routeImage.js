import { resolveAssetUrl } from "../../public-cms/hooks";

const CITY_EMOJI = {
  kathmandu: "🏔️",
  pokhara: "🏞️",
  lukla: "🥾",
  bharatpur: "🦏",
  bhairahawa: "🛕",
  nepalgunj: "🌾",
  biratnagar: "🏙️",
  dhangadhi: "🌅",
  tumlingtar: "⛰️",
  jomsom: "🏔️",
  delhi: "🏛️",
  mumbai: "🌆",
  dubai: "🏙️",
  doha: "🌇",
  singapore: "🦁",
  "kuala lumpur": "🌃",
  bangkok: "🛕",
  london: "🎡",
  frankfurt: "🏢",
  "hong kong": "🌉",
  tokyo: "🗼",
  seoul: "🌸",
  guangzhou: "🏙️",
  istanbul: "🕌",
  "abu dhabi": "🏙️",
  riyadh: "🏜️",
  colombo: "🌴",
  sydney: "🌊",
  osaka: "🍣",
};

function emojiForCity(city) {
  return CITY_EMOJI[String(city || "").toLowerCase()] || "✈️";
}

function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function buildRouteImage(route) {
  const from = route?.fromCity || "From";
  const to = route?.toCity || "To";
  const fromEmoji = emojiForCity(from);
  const toEmoji = emojiForCity(to);
  const fromCode = route?.fromAirport || from.slice(0, 3).toUpperCase();
  const toCode = route?.toAirport || to.slice(0, 3).toUpperCase();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b2d5a"/>
      <stop offset="100%" stop-color="#1e5fbf"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)" />
  <text x="600" y="320" font-size="124" text-anchor="middle" fill="#ffffff">${fromEmoji} ➜ ${toEmoji}</text>
  <text x="600" y="440" font-family="Arial, sans-serif" font-size="72" text-anchor="middle" fill="#ffffff" font-weight="700">${fromCode} → ${toCode}</text>
  <text x="600" y="520" font-family="Arial, sans-serif" font-size="42" text-anchor="middle" fill="#d7e7ff">${from} to ${to}</text>
</svg>`;

  return encodeSvg(svg);
}

/** International listings use generated route art; domestic keeps CMS uploads when set. */
export function resolveRouteImage(route, ticketType) {
  if (ticketType === "international") {
    return buildRouteImage(route);
  }
  return resolveAssetUrl(route.cardImageUrl || route.imageUrl) || buildRouteImage(route);
}
