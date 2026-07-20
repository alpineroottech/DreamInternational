import { img } from "../lib/cms-import-utils.js";

function routeRow(title, slug, fromCity, toCity, fromAirport, toAirport, airline, duration, frequency, price, ticketType, order, featured, imgN, extra = {}) {
  return {
    title,
    slug,
    ticketType,
    fromCity,
    toCity,
    fromAirport,
    toAirport,
    airline,
    flightDuration: duration,
    frequency,
    priceFrom: price,
    priceDisplay: `From $${price}`,
    shortDescription: extra.shortDescription || `Book ${fromCity} to ${toCity} flights with competitive fares and local support from Dream International.`,
    description: extra.description || `<p>Secure your seat on the <strong>${title}</strong> route with Dream International.</p>`,
    imageUrl: ticketType === "international" ? null : img.tour(imgN),
    cardImageUrl: ticketType === "international" ? null : null,
    imageAlt: title,
    highlights: extra.highlights || ["Instant fare quote", "Date change assistance", "Group fares", "Airport transfer add-ons"],
    baggageInfo: extra.baggageInfo || "Standard 15–20 kg checked baggage on most sectors; exact allowance varies by airline and fare class.",
    bookingNotes: extra.bookingNotes || "<p>Fares are indicative and subject to availability.</p>",
    status: "PUBLISHED",
    isFeatured: featured,
    order,
  };
}

export function buildFlightRoutes() {
  const domestic = [
    routeRow("Kathmandu to Lukla", "kathmandu-to-lukla", "Kathmandu", "Lukla", "KTM", "LUA", "Tara Air / Summit Air / Sita Air", "30 min", "Multiple daily (weather permitting)", 215, "domestic", 0, true, 1, {
      description: "<p>The Kathmandu–Lukla flight is the gateway to Everest Base Camp and the Khumbu region. This 30-minute scenic flight lands at Tenzing-Hillary Airport (2,860 m) — one of the world's most dramatic airstrips. Views include rolling hills giving way to towering Himalayan peaks as you approach the Solu-Khumbu.</p><p>Dream International books confirmed seats on Tara Air, Summit Air, and Sita Air, and advises on seasonal Ramechhap diversions when Kathmandu air traffic is congested.</p>",
      highlights: ["Gateway to Everest Base Camp treks", "Tenzing-Hillary Airport landing", "Multiple daily departures in season", "Trekker baggage coordination", "Ramechhap transfer packages available"],
      baggageInfo: "Domestic mountain flights typically allow 10–15 kg checked + 5–7 kg cabin. Excess baggage charged per kg — important for trekking gear.",
      bookingNotes: "<p><strong>Seasonal note:</strong> March–November, flights may depart from Ramechhap (4–5 hr drive from Kathmandu). Weather delays are common — keep 1–2 buffer days. Passport required for booking.</p>",
    }),
    routeRow("Kathmandu to Pokhara", "kathmandu-to-pokhara", "Kathmandu", "Pokhara", "KTM", "PKR", "Buddha Air / Yeti Airlines / Shree Airlines", "25 min", "10+ flights daily", 119, "domestic", 1, true, 2, {
      description: "<p>Nepal's busiest domestic route connects the capital to lakeside Pokhara in just 25 minutes. Buddha Air and Yeti Airlines operate ATR 72 turboprops with reliable schedules from early morning through late afternoon. On clear days, window seats offer Annapurna and Manaslu views on approach.</p><p>Ideal for trekkers connecting to Annapurna trailheads or travellers who want to avoid the 6–7 hour road journey.</p>",
      highlights: ["25-minute flight vs 7-hour road", "Multiple airlines and daily departures", "Himalayan views on approach", "Easy Pokhara airport to Lakeside transfer", "Same-day trek connections available"],
      baggageInfo: "Usually 15–20 kg checked + 7 kg hand luggage on Buddha Air and Yeti economy fares.",
    }),
    routeRow("Kathmandu to Bhairahawa", "kathmandu-to-bhairahawa", "Kathmandu", "Bhairahawa", "KTM", "BWA", "Buddha Air / Yeti Airlines", "30–45 min", "4–6 daily", 140, "domestic", 2, false, 3, {
      description: "<p>Bhairahawa (Gautam Buddha Airport) serves Lumbini — birthplace of Lord Buddha — and the western Terai. The flight takes 30–45 minutes; Lumbini's sacred garden is a 30-minute drive from the airport.</p>",
      highlights: ["Closest airport to Lumbini", "Pilgrimage and Terai tour connections", "Daily Buddha Air and Yeti departures"],
    }),
    routeRow("Kathmandu to Bharatpur", "kathmandu-to-bharatpur", "Kathmandu", "Bharatpur", "KTM", "BHR", "Buddha Air / Yeti Airlines", "20 min", "5+ daily", 111, "domestic", 3, false, 4, {
      description: "<p>Bharatpur Airport is the air gateway to Chitwan National Park. Fly in 20 minutes from Kathmandu, then a 30–45 minute drive to Sauraha or Meghauli lodges for jungle safari packages.</p>",
      highlights: ["Fastest access to Chitwan safaris", "Frequent daily flights", "Pairs with Kathmandu–Pokhara itineraries"],
    }),
    routeRow("Pokhara to Jomsom", "pokhara-to-jomsom", "Pokhara", "Jomsom", "PKR", "JMO", "Tara Air / Summit Air", "20 min", "Morning flights (weather dependent)", 160, "domestic", 4, true, 5, {
      description: "<p>One of Nepal's most spectacular short flights — the route threads through the Kali Gandaki gorge with Annapurna and Dhaulagiri rising on either side. Jomsom (2,700 m) is the hub for Mustang, Muktinath, and Upper Mustang permits.</p>",
      highlights: ["Kali Gandaki gorge scenery", "Muktinath and Mustang access", "Morning departures only — weather dependent"],
      bookingNotes: "<p>Flights operate early morning when wind is calm. Afternoon cancellations are common. Allow a buffer day.</p>",
    }),
    routeRow("Everest Mountain Flight", "everest-mountain-flight", "Kathmandu", "Everest Region", "KTM", "—", "Buddha Air / Yeti Airlines", "50–60 min", "Daily early morning", 250, "domestic", 5, true, 1, {
      shortDescription: "Guaranteed window seat aerial tour of Everest and the central Himalaya — no trekking required.",
      description: "<p>The Everest Mountain Flight departs Kathmandu around dawn when visibility is best. Every passenger is assigned a window seat as the aircraft flies east along the Himalayan chain — Langtang, Dorje Lakpa, Cho Oyu, and Everest (8,848 m) with the Khumbu icefall and surrounding peaks.</p><p>Includes hotel pick-up/drop-off from Thamel area hotels and a flight certificate. Ideal for families, seniors, or anyone who cannot trek to altitude.</p>",
      highlights: ["Guaranteed window seat", "Everest and Lhotse at eye level", "Certificate of flight", "Hotel transfers included", "Operates year-round (weather permitting)"],
      baggageInfo: "Hand luggage only — this is a scenic flight with no checked baggage.",
    }),
    routeRow("Kathmandu to Bhadrapur", "kathmandu-to-bhadrapur", "Kathmandu", "Bhadrapur", "KTM", "BDP", "Buddha Air / Yeti Airlines", "45–55 min", "2–3 daily", 182, "domestic", 6, false, 2, {
      description: "<p>Bhadrapur serves eastern Nepal and is the access point for Ilam tea country, Pathivara Temple, and overland routes to Darjeeling/Sikkim border areas.</p>",
    }),
    routeRow("Ramechhap to Lukla", "ramechhap-to-lukla", "Ramechhap", "Lukla", "RHP", "LUA", "Tara Air / Summit Air", "18 min", "Seasonal (peak trekking months)", 175, "domestic", 7, false, 3, {
      description: "<p>During peak seasons (Oct–Nov, Mar–Apr), Lukla flights shift to Manthali (Ramechhap) Airport. Dream International arranges Kathmandu–Ramechhap road transfer (4–5 hours) plus the 18-minute mountain flight.</p>",
    }),
    routeRow("Kathmandu to Nepalgunj", "kathmandu-to-nepalgunj", "Kathmandu", "Nepalgunj", "KTM", "KEP", "Buddha Air / Shree Airlines", "55 min", "3–4 daily", 125, "domestic", 8, false, 4, {
      description: "<p>Nepalgunj is the hub for western Nepal — connect here for flights to Jumla, Talcha (Rara Lake), and Simikot (Humla). Essential for remote trek logistics.</p>",
    }),
    routeRow("Kathmandu to Biratnagar", "kathmandu-to-biratnagar", "Kathmandu", "Biratnagar", "KTM", "BIR", "Yeti Airlines / Buddha Air", "40 min", "3–4 daily", 108, "domestic", 9, false, 5, {
      description: "<p>Biratnagar is eastern Nepal's commercial centre and the access point for Koshi Tappu Wildlife Reserve and routes toward Darjeeling and Sikkim.</p>",
    }),
    routeRow("Kathmandu to Dhangadhi", "kathmandu-to-dhangadhi", "Kathmandu", "Dhangadhi", "KTM", "DHI", "Buddha Air", "1h 10m", "2 daily", 145, "domestic", 10, false, 6, {
      description: "<p>Dhangadhi serves far-western Nepal — gateway to Khaptad National Park and the Sudurpashchim region.</p>",
    }),
    routeRow("Kathmandu to Tumlingtar", "kathmandu-to-tumlingtar", "Kathmandu", "Tumlingtar", "KTM", "TMI", "Tara Air", "50 min", "Several weekly", 155, "domestic", 11, false, 1, {
      description: "<p>Tumlingtar is the trailhead access for Makalu Base Camp and Arun Valley treks. Limited seats — book well in advance during trekking season.</p>",
    }),
    routeRow("Kathmandu to Jomsom", "kathmandu-to-jomsom", "Kathmandu", "Jomsom", "KTM", "JMO", "Tara Air (via Pokhara)", "—", "Seasonal", 195, "domestic", 12, false, 2, {
      description: "<p>Direct Kathmandu–Jomsom sectors are seasonal. Most travellers fly KTM–Pokhara–Jomsom. We build multi-sector tickets with minimum connection times.</p>",
    }),
  ];

  const international = [
    routeRow("Kathmandu to Delhi", "kathmandu-to-delhi", "Kathmandu", "Delhi", "KTM", "DEL", "Nepal Airlines / Air India / IndiGo", "1h 45m", "6+ flights daily", 195, "international", 0, true, 3, {
      shortDescription: "Nepal's busiest international route — multiple daily non-stops to Delhi IGI Airport.",
      description: "<p>The Kathmandu–Delhi sector is Nepal's most important international connection, linking Tribhuvan International Airport (KTM) with Indira Gandhi International (DEL) in approximately 1 hour 45 minutes. Nepal Airlines, Air India, and IndiGo operate multiple daily non-stop flights, making Delhi the primary gateway for Indian transit, medical travel, shopping, and onward connections worldwide.</p><p>Delhi connections work well for Europe (via Air India/Vistara), North America, and Middle East hubs. Indian visa required for most nationalities — e-Tourist Visa available online for many countries.</p>",
      highlights: ["6+ daily non-stop flights", "Nepal Airlines, Air India, IndiGo", "Shortest international sector from KTM", "Ideal for India transit and medical travel", "Same-day connections across India"],
      baggageInfo: "Economy typically 20–30 kg checked + 7 kg cabin on Nepal Airlines and Air India. IndiGo hand baggage only on lowest fares — check fare rules.",
      bookingNotes: "<p>Indian visa required for most passport holders. Carry printed e-visa confirmation. Peak demand during Dashain/Tihar and Indian holidays — book 2–3 weeks ahead.</p>",
    }),
    routeRow("Kathmandu to Dubai", "kathmandu-to-dubai", "Kathmandu", "Dubai", "KTM", "DXB", "Flydubai / Emirates / Nepal Airlines", "4h 30m", "2–3 daily", 380, "international", 1, true, 4, {
      shortDescription: "Daily non-stops to Dubai — major hub for Europe, Americas, and Africa connections.",
      description: "<p>Fly Kathmandu to Dubai International (DXB) in approximately 4 hours 30 minutes. Flydubai offers competitive economy fares with baggage options; Emirates provides full-service connections to 150+ destinations including London, Paris, New York, and Sydney via a single stop.</p><p>Dubai is popular with Nepali workers and tourists alike. UAE visa on arrival for many nationalities (30–90 days depending on passport). Excellent for travellers connecting to Europe without backtracking through India.</p>",
      highlights: ["Flydubai and Emirates daily departures", "Major hub for Europe and Africa", "UAE visa on arrival for many passports", "Competitive Flydubai economy fares", "Emirates business class connections"],
      baggageInfo: "Flydubai: 20–40 kg depending on fare bundle. Emirates economy: 25–30 kg. Nepal Airlines: typically 30 kg.",
      bookingNotes: "<p>Flydubai lowest fares are hand-baggage only — add baggage at booking for savings. Emirates connections under 24 hours may not require UAE visa for transit — verify with airline.</p>",
    }),
    routeRow("Kathmandu to Doha", "kathmandu-to-doha", "Kathmandu", "Doha", "KTM", "DOH", "Qatar Airways / Himalaya Airlines", "4h 15m", "Daily", 420, "international", 2, true, 5, {
      shortDescription: "Qatar Airways daily service — premium connections to Europe, UK, and the Americas.",
      description: "<p>Qatar Airways operates a daily non-stop from Kathmandu to Hamad International (DOH) in about 4 hours 15 minutes. Doha is one of the world's best-connected hubs — single-stop service to London, Frankfurt, Paris, New York, Sydney, and 160+ destinations with award-winning onboard service.</p><p>Himalaya Airlines also operates select KTM–DOH sectors. Qatar transit visa not required for connections under 24 hours for most nationalities.</p>",
      highlights: ["Qatar Airways daily non-stop", "160+ onward destinations", "Premium economy and business options", "Excellent transit facilities in Doha", "Popular route for UK and EU travel"],
      baggageInfo: "Qatar economy: 23–30 kg depending on fare class. Business: 32–40 kg.",
      bookingNotes: "<p>Qatar often has competitive business class fares from Kathmandu. Book 6–8 weeks ahead for best economy pricing on UK/Europe routes.</p>",
    }),
    routeRow("Kathmandu to Bangkok", "kathmandu-to-bangkok", "Kathmandu", "Bangkok", "KTM", "BKK", "Thai Airways / Nepal Airlines", "3h 10m", "Daily", 295, "international", 3, true, 6, {
      shortDescription: "Direct flights to Bangkok Suvarnabhumi — gateway for Thailand holidays and Asia connections.",
      description: "<p>Reach Bangkok Suvarnabhumi (BKK) in roughly 3 hours 10 minutes on Thai Airways or Nepal Airlines. Bangkok is Nepal's favourite short-haul holiday destination and a major hub for Southeast Asia, Japan, Korea, and Australia connections.</p><p>Thai tourist visa exemption for many nationalities (30 days by air). Excellent value packages combining Nepal trekking with Thai beach extensions.</p>",
      highlights: ["Daily Thai Airways service", "3h 10m flight time", "Thailand visa exemption for many passports", "Suvarnabhumi hub connections", "Popular post-trek beach add-on"],
      baggageInfo: "Thai Airways economy: 23–30 kg. Nepal Airlines: 30 kg typically.",
      bookingNotes: "<p>Thai Airways offers free date change on many fare types. Combine with domestic Thailand flights to Phuket, Chiang Mai, or Krabi.</p>",
    }),
    routeRow("Kathmandu to Singapore", "kathmandu-to-singapore", "Kathmandu", "Singapore", "KTM", "SIN", "Singapore Airlines / Scoot", "5h", "Daily", 450, "international", 4, true, 1, {
      shortDescription: "Singapore Airlines and Scoot connect Kathmandu to Changi — Asia's top transit hub.",
      description: "<p>Fly Kathmandu to Singapore Changi (SIN) in approximately 5 hours. Singapore Airlines offers full-service connections to Australia, New Zealand, Japan, and the USA. Scoot (low-cost subsidiary) provides budget options with add-on baggage.</p><p>Singapore visa-free transit for many nationalities (96 hours for some). Changi Airport is consistently rated the world's best — comfortable for long layovers.</p>",
      highlights: ["Singapore Airlines daily service", "Gateway to Australia and NZ", "96-hour visa-free transit for many", "Changi Airport premium facilities", "Scoot budget alternative"],
      baggageInfo: "Singapore Airlines economy: 25–30 kg. Scoot: 10–20 kg depending on bundle purchased.",
      bookingNotes: "<p>Popular route for Australian Nepali diaspora. Book Scoot baggage bundles at purchase — airport fees are higher.</p>",
    }),
    routeRow("Kathmandu to Kuala Lumpur", "kathmandu-to-kuala-lumpur", "Kathmandu", "Kuala Lumpur", "KTM", "KUL", "AirAsia / Malindo Air / Nepal Airlines", "4h 40m", "4–5 weekly", 275, "international", 5, false, 2, {
      shortDescription: "Budget-friendly flights to KLIA — Malaysia holidays and Australia connections.",
      description: "<p>AirAsia and Malindo Air connect Kathmandu to Kuala Lumpur International (KUL) in about 4 hours 40 minutes. Malaysia offers visa-free entry for many nationalities (30–90 days). KL is a useful hub for Australia connections via AirAsia X or Malaysia Airlines.</p>",
      highlights: ["AirAsia low fares", "Malaysia visa-free for many", "Australia connection hub", "4h 40m flight time"],
      baggageInfo: "AirAsia lowest fares: 7 kg cabin only. Add 20–40 kg checked baggage at booking.",
    }),
    routeRow("Kathmandu to London", "kathmandu-to-london", "Kathmandu", "London", "KTM", "LHR", "Qatar Airways / Turkish Airlines / Emirates (1 stop)", "14–16h total", "Daily connections", 620, "international", 6, true, 3, {
      shortDescription: "One-stop connections to London Heathrow via Doha, Istanbul, or Dubai.",
      description: "<p>There are no direct flights from Kathmandu to London. Dream International books optimised one-stop itineraries via Doha (Qatar Airways), Istanbul (Turkish Airlines), or Dubai (Emirates) with total journey times of 14–16 hours including connection.</p><p>UK Standard Visitor visa required for Nepali and most non-UK passport holders. We advise minimum 2-hour connection in Doha/Istanbul. Turkish Airlines often has competitive pricing via Istanbul with free city tour for long layovers.</p>",
      highlights: ["Qatar, Turkish, Emirates connections daily", "Heathrow and Gatwick options", "Competitive shoulder-season fares", "Assistance with connection timing", "Multi-airline ticket support"],
      baggageInfo: "Interline baggage usually checked through to LHR on single-ticket bookings. Confirm at booking for separate tickets.",
      bookingNotes: "<p>UK visa required — apply via gov.uk. Book connection allowing 2+ hours. Winter schedules may include overnight layovers in the Gulf.</p>",
    }),
    routeRow("Kathmandu to Mumbai", "kathmandu-to-mumbai", "Kathmandu", "Mumbai", "KTM", "BOM", "Nepal Airlines / Air India / IndiGo", "2h 30m", "3–4 daily", 210, "international", 7, false, 4, {
      shortDescription: "Direct flights to Mumbai Chhatrapati Shivaji — India's financial capital.",
      description: "<p>Fly Kathmandu to Mumbai (BOM) in approximately 2 hours 30 minutes. Useful for business travel, Bollywood tourism, and connections to Goa, Bangalore, and southern India. Indian e-visa required for most foreign nationals.</p>",
      highlights: ["2h 30m direct flight", "Multiple daily departures", "Gateway to western and southern India"],
      baggageInfo: "Typically 20–30 kg checked on full-service carriers.",
    }),
    routeRow("Kathmandu to Hong Kong", "kathmandu-to-hong-kong", "Kathmandu", "Hong Kong", "KTM", "HKG", "Cathay Pacific / Nepal Airlines", "4h 30m", "4 weekly", 390, "international", 8, false, 5, {
      shortDescription: "Cathay Pacific service to Hong Kong — gateway to China, Taiwan, and North America.",
      description: "<p>Cathay Pacific operates Kathmandu–Hong Kong (HKG) in approximately 4 hours 30 minutes, four times weekly. Hong Kong is a major hub for mainland China, Taiwan, Japan, Korea, and transpacific routes to North America.</p><p>Hong Kong visa requirements vary by nationality — many Western passports receive 90-day visa-free entry. Useful for combining Nepal trekking with Hong Kong city breaks or China connections.</p>",
      highlights: ["Cathay Pacific 4x weekly", "China and Taiwan connections", "Transpacific hub options", "4h 30m flight time"],
      baggageInfo: "Cathay economy: 23–30 kg depending on fare.",
      bookingNotes: "<p>Cathay schedules vary seasonally — confirm current frequency at booking.</p>",
    }),
    routeRow("Kathmandu to Abu Dhabi", "kathmandu-to-abu-dhabi", "Kathmandu", "Abu Dhabi", "KTM", "AUH", "Etihad Airways / Air Arabia", "4h 45m", "Daily", 365, "international", 9, false, 6, {
      shortDescription: "Etihad daily flights to Abu Dhabi — connections across Europe and the Middle East.",
      description: "<p>Etihad Airways flies Kathmandu to Abu Dhabi (AUH) daily in about 4 hours 45 minutes. Abu Dhabi competes with Doha and Dubai as a Gulf hub with connections to London, Paris, Rome, and New York. Air Arabia offers budget Abu Dhabi–area options via Sharjah (SHJ) with bus connections.</p>",
      highlights: ["Etihad daily service", "European connection hub", "Air Arabia budget alternative via Sharjah", "Competitive business class"],
      baggageInfo: "Etihad economy: 23–30 kg. Air Arabia: baggage bundles required.",
    }),
    routeRow("Kathmandu to Tokyo (Narita)", "kathmandu-to-tokyo-narita", "Kathmandu", "Tokyo", "KTM", "NRT", "Nepal Airlines / Cathay Pacific (1 stop)", "10–12h total", "Daily connections", 580, "international", 10, false, 1, {
      shortDescription: "One-stop itineraries to Tokyo Narita via Hong Kong, Bangkok, or Kuala Lumpur.",
      description: "<p>No regular non-stop exists between Kathmandu and Tokyo. We book one-stop routes via Hong Kong (Cathay Pacific), Bangkok (Thai), or Kuala Lumpur with total travel times of 10–12 hours. Japan tourist visa requirements depend on nationality — many passports receive visa-free entry for 15–90 days.</p><p>Popular with Japanese trekkers and Nepal-bound tourists from Japan. Cherry blossom season (March–April) and autumn foliage (October–November) are peak booking periods.</p>",
      highlights: ["Cathay Pacific via Hong Kong", "Thai via Bangkok option", "Japan visa-free for many passports", "Autumn and spring peak seasons"],
      bookingNotes: "<p>Japan Rail Pass and trek permit planning — we coordinate arrival dates with your trekking schedule.</p>",
    }),
    routeRow("Kathmandu to Osaka", "kathmandu-to-osaka", "Kathmandu", "Osaka", "KTM", "KIX", "Various (1 stop via Bangkok/HK)", "11–13h total", "Several weekly", 595, "international", 11, false, 2, {
      shortDescription: "Connect to Osaka Kansai via Bangkok or Hong Kong for Kansai region travel.",
      description: "<p>Osaka Kansai (KIX) is served via one-stop connections through Bangkok or Hong Kong. Useful for travellers visiting Kyoto, Nara, and western Japan after a Nepal trek. Total journey 11–13 hours.</p>",
      highlights: ["Kansai airport access", "Kyoto and Nara connections", "Via Bangkok or Hong Kong"],
    }),
    routeRow("Kathmandu to Sydney", "kathmandu-to-sydney", "Kathmandu", "Sydney", "KTM", "SYD", "Qatar / Singapore Airlines (1–2 stops)", "16–20h total", "Daily connections", 720, "international", 12, false, 3, {
      shortDescription: "Australia connections via Singapore, Doha, or Bangkok — popular with Nepali diaspora.",
      description: "<p>Reach Sydney Kingsford Smith (SYD) from Kathmandu via one or two stops — typically Singapore (Singapore Airlines/Scoot), Doha (Qatar Airways), or Bangkok (Thai). Total journey 16–20 hours depending on connection time.</p><p>Australian visitor visa (subclass 600) required for most nationalities — apply online via immi.gov.au. High demand during Nepali New Year (Baisakh) and Australian school holidays.</p>",
      highlights: ["Singapore and Doha hub options", "Qatar and Singapore Airlines service", "Melbourne and Brisbane connections available", "Diaspora peak-season expertise"],
      baggageInfo: "Australian biosecurity rules apply — declare all food, wooden items, and trekking gear. Clean boots before packing.",
      bookingNotes: "<p>Australian visa required for most travellers. Allow 2+ weeks for visa processing. Declare trekking equipment on arrival card.</p>",
    }),
  ];

  return [...domestic, ...international];
}
