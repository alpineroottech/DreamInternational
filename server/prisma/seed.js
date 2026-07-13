import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";
import { seedInternationalTours } from "./seedInternationalTours.js";

if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const now = () => new Date();

// Create rows only when a collection is still empty (idempotent re-seeding).
async function seedIfEmpty(model, rows) {
  const count = await model.count();
  if (count === 0 && rows.length) {
    for (const data of rows) {
      // create() (not createMany) keeps Json fields portable across providers
      // eslint-disable-next-line no-await-in-loop
      await model.create({ data });
    }
  }
}

async function main() {
  // ---------- Admin user ----------
  const email = process.env.SEED_ADMIN_EMAIL || "admin@dreaminternationaltours.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.SEED_ADMIN_NAME || "Dream Admin";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name, isActive: true },
    create: { email, passwordHash, name, role: "SUPER_ADMIN" },
  });

  // ---------- Settings (incl. navigation + social) ----------
  const settings = {
    siteTitle: { v: "Dream International Travel and Tours", t: "string" },
    tagline: { v: "Trekking, Cultural and Custom Journeys across Nepal", t: "string" },
    contactEmail: { v: "info@dreaminternationaltours.com", t: "string" },
    contactPhone: { v: "+977-1-0000000", t: "string" },
    whatsappNumber: { v: "+9779800000000", t: "string" },
    address: { v: "Thamel, Kathmandu, Nepal", t: "string" },
    facebookUrl: { v: "https://facebook.com/", t: "string" },
    instagramUrl: { v: "https://instagram.com/", t: "string" },
    youtubeUrl: { v: "https://youtube.com/", t: "string" },
    tripadvisorUrl: { v: "https://tripadvisor.com/", t: "string" },
    defaultSeoTitle: { v: "%page_title% | Dream International Travel and Tours", t: "string" },
    defaultSeoDescription: {
      v: "Nepal travel and tour experiences — trekking, cultural tours, and tailor-made journeys.",
      t: "string",
    },
    aboutSubtitle: { v: "Welcome To Dream International", t: "string" },
    aboutTitle: { v: "Trusted Nepal travel specialists for adventure, culture, and comfort", t: "string" },
    aboutText1: {
      v: "Dream International is a Kathmandu-based travel company helping guests explore Nepal through curated trekking, cultural, pilgrimage, and nature journeys.",
      t: "string",
    },
    aboutText2: {
      v: "From airport arrival to final departure, our local team handles permits, transport, and on-ground support so every trip runs smoothly.",
      t: "string",
    },
    aboutFeatureOneTitle: { v: "Custom Itineraries", t: "string" },
    aboutFeatureOneText: { v: "Personalized travel plans tailored to your pace, budget, and interests.", t: "string" },
    aboutFeatureTwoTitle: { v: "Safety First Always", t: "string" },
    aboutFeatureTwoText: { v: "Reliable guides, practical route planning, and clear communication from start to finish.", t: "string" },
    aboutFeatureThreeTitle: { v: "Professional Guide", t: "string" },
    aboutFeatureThreeText: { v: "Licensed local guides who share authentic stories, culture, and hidden highlights.", t: "string" },
    aboutCtaLabel: { v: "Contact With Us", t: "string" },
    aboutCtaUrl: { v: "/contact", t: "string" },
    headerNav: {
      t: "json",
      v: JSON.stringify([
        { label: "Home", url: "/" },
        { label: "About", url: "/about" },
        { label: "Nepal Experiences", url: "/tour" },
        { label: "International Holidays", url: "/international-holidays" },
        { label: "Activities", url: "/activities" },
        { label: "Services", url: "/service" },
        {
          label: "Ticketing",
          url: "#",
          children: [
            { label: "Domestic Flights", url: "/ticketing/domestic" },
            { label: "International Flights", url: "/ticketing/international" },
          ],
        },
        { label: "Blog", url: "/blog" },
      ]),
    },
    footerColumns: {
      t: "json",
      v: JSON.stringify([
        {
          title: "Quick Links",
          links: [
            { label: "About Us", url: "/about" },
            { label: "Tours", url: "/tour" },
            { label: "Destinations", url: "/destination" },
            { label: "Contact", url: "/contact" },
          ],
        },
        {
          title: "Support",
          links: [
            { label: "FAQ", url: "/faq" },
            { label: "Gallery", url: "/gallery" },
            { label: "Services", url: "/service" },
          ],
        },
      ]),
    },
  };
  for (const [key, { v, t }] of Object.entries(settings)) {
    // eslint-disable-next-line no-await-in-loop
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: v, type: t },
    });
  }

  // Ensure Ticketing appears in saved header navigation (existing installs).
  const headerNavRow = await prisma.setting.findUnique({ where: { key: "headerNav" } });
  if (headerNavRow?.type === "json") {
    let nav = [];
    try {
      nav = JSON.parse(headerNavRow.value);
    } catch {
      nav = [];
    }
    const hasTicketing = Array.isArray(nav) && nav.some(
      (item) =>
        item.label === "Ticketing" ||
        item.children?.some((child) => child.url?.startsWith("/ticketing"))
    );
    let nextNav = nav;
    if (Array.isArray(nav) && nav.length && !hasTicketing) {
      const ticketing = JSON.parse(settings.headerNav.v).find((item) => item.label === "Ticketing");
      const blogIdx = nav.findIndex((item) => item.label === "Blog" || item.url === "/blog");
      const insertAt = blogIdx >= 0 ? blogIdx : nav.length;
      nextNav = [...nav.slice(0, insertAt), ticketing, ...nav.slice(insertAt)];
    }
    // Remove Contact from nav — Book Now CTA covers it.
    // Upgrade legacy nav labels/URLs without overwriting custom CMS entries.
    if (Array.isArray(nextNav) && nextNav.length) {
      nextNav = nextNav.map((item) => {
        if (item.url === "/destination") {
          return { ...item, label: "International Holidays", url: "/international-holidays" };
        }
        if (item.url === "/tour" && item.label === "Tours") {
          return { ...item, label: "Nepal Experiences", url: "/tour" };
        }
        return item;
      });
      const changed = JSON.stringify(nextNav) !== JSON.stringify(nav);
      if (changed) {
        await prisma.setting.update({
          where: { key: "headerNav" },
          data: { value: JSON.stringify(nextNav) },
        });
      }
    }

    if (Array.isArray(nextNav) && nextNav.length) {
      const withoutContact = nextNav.filter(
        (item) =>
          item.children?.length ||
          !((item.url || "").replace(/\/$/, "") === "/contact" || (item.label || "").toLowerCase() === "contact")
      );
      if (withoutContact.length !== nextNav.length) {
        await prisma.setting.update({
          where: { key: "headerNav" },
          data: { value: JSON.stringify(withoutContact) },
        });
      } else if (nextNav !== nav) {
        await prisma.setting.update({
          where: { key: "headerNav" },
          data: { value: JSON.stringify(nextNav) },
        });
      }
    }
  }

  // ---------- Featured destination: Pokhara ----------
  await prisma.destination.upsert({
    where: { slug: "pokhara-city" },
    update: {},
    create: {
      slug: "pokhara-city",
      name: "Pokhara City",
      shortDescription:
        "Nepal's lakeside city with Phewa Lake, mountain views, paragliding, and easy access to Annapurna treks.",
      description:
        "<p>Pokhara is Nepal's most visited lakeside city and the gateway to the Annapurna region. Set beside Phewa Lake with the Annapurna and Machhapuchhre (Fishtail) peaks reflected on the water, it blends adventure, culture, and relaxation in one destination.</p>",
      heroImageUrl: "/assets/img/destination/destination_4_1.jpg",
      heroImageAlt: "Pokhara City and Phewa Lake",
      bestTimeToVisit: "<p>Best seasons are Mar-May and Sep-Nov for clear mountain views.</p>",
      gettingThere:
        "<p>Tourist buses and private cars run daily from Kathmandu (6-7 hours). Flights take about 25 minutes.</p>",
      tips: "<p>Stay in Lakeside (Baidam) for the widest choice of hotels and restaurants.</p>",
      thingsToDo: [
        "Phewa Lake boating with views of Machhapuchhre",
        "Sarangkot sunrise over the Annapurna Himalayas",
        "World Peace Pagoda (Shanti Stupa)",
        "Davis Falls and Gupteshwor Cave",
        "Paragliding from Sarangkot (seasonal)",
      ],
      status: "PUBLISHED",
      isFeatured: true,
      publishedAt: now(),
      seoTitle: "Pokhara City, Nepal — Travel Guide",
      seoDescription:
        "Plan your Pokhara trip: Phewa Lake, Sarangkot sunrise, paragliding, and Annapurna trek gateways.",
    },
  });

  // ---------- Tour categories ----------
  const categories = [
    ["Trekking", "trekking", "category_1_1.jpg", "High-altitude treks across the Himalayas."],
    ["Cultural Tours", "cultural-tours", "category_1_2.jpg", "Temples, heritage sites, and local life."],
    ["Adventure", "adventure", "category_1_3.jpg", "Rafting, paragliding, and adrenaline."],
    ["Jungle Safari", "jungle-safari", "category_1_4.jpg", "Wildlife in Chitwan and Bardia."],
    ["Pilgrimage", "pilgrimage", "category_1_5.jpg", "Sacred journeys and spiritual sites."],
    ["Peak Climbing", "peak-climbing", "category_2_1.jpg", "Guided climbs for aspiring mountaineers."],
  ];
  for (let i = 0; i < categories.length; i += 1) {
    const [cname, cslug, cimg, cdesc] = categories[i];
    // eslint-disable-next-line no-await-in-loop
    await prisma.category.upsert({
      where: { slug: cslug },
      update: {},
      create: {
        name: cname,
        slug: cslug,
        type: "tour",
        imageUrl: `/assets/img/category/${cimg}`,
        description: cdesc,
        order: i,
        isVisible: true,
      },
    });
  }

  // ---------- Counters ----------
  await seedIfEmpty(prisma.counter, [
    { label: "Years of Experience", value: "12", suffix: "+", order: 0 },
    { label: "Happy Travelers", value: "5000", suffix: "+", order: 1 },
    { label: "Tour Packages", value: "150", suffix: "+", order: 2 },
    { label: "Expert Guides", value: "25", suffix: "+", order: 3 },
  ]);

  // ---------- Partner brands (text names for marquee) ----------
  const partnerNames = [
    "Buddha Air",
    "Yeti Airlines",
    "Qatar Airways",
    "Emirates",
    "Singapore Airlines",
    "Turkish Airlines",
    "Nepal Airlines",
    "IndiGo",
  ];
  await seedIfEmpty(
    prisma.brand,
    partnerNames.map((name, i) => ({
      name,
      logoUrl: "",
      order: i,
      isVisible: true,
    }))
  );

  // ---------- Team / Guides ----------
  const team = [
    ["Michel Smith", "Senior Trek Guide"],
    ["Janny Willson", "Tour Manager"],
    ["Jacob Jones", "Cultural Guide"],
    ["Maria Prova", "Travel Consultant"],
    ["Rebeka Maliha", "Customer Care Lead"],
    ["Alif Mahmud", "Adventure Specialist"],
  ];
  await seedIfEmpty(
    prisma.teamMember,
    team.map(([tname, role], i) => ({
      name: tname,
      slug: tname.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      role,
      photoUrl: `/assets/img/team/team_1_${i + 1}.jpg`,
      bio: `<p>${tname} is part of the Dream International team, dedicated to crafting memorable journeys across Nepal.</p>`,
      status: "PUBLISHED",
      isFeatured: true,
      order: i,
      publishedAt: now(),
    }))
  );

  // ---------- Reviews / testimonials ----------
  await seedIfEmpty(prisma.review, [
    {
      reviewerName: "Sarah Thompson",
      reviewerCountry: "United Kingdom",
      reviewerPhoto: "/assets/img/testimonial/testi-img-1.jpg",
      rating: 5,
      reviewText:
        "An unforgettable trek to Annapurna Base Camp. The guides were knowledgeable and the arrangements were flawless.",
      source: "TRIPADVISOR",
      isFeatured: true,
      isVisible: true,
    },
    {
      reviewerName: "David Chen",
      reviewerCountry: "Singapore",
      reviewerPhoto: "/assets/img/testimonial/testi-img-2.jpg",
      rating: 5,
      reviewText:
        "Dream International planned our family trip to Pokhara and Chitwan perfectly. Highly recommended!",
      source: "GOOGLE",
      isFeatured: true,
      isVisible: true,
    },
    {
      reviewerName: "Emma Wilson",
      reviewerCountry: "Australia",
      rating: 5,
      reviewText: "Seamless cultural tour of Kathmandu Valley. Great value and wonderful local guides.",
      source: "DIRECT",
      isFeatured: true,
      isVisible: true,
    },
  ]);

  // ---------- Activities ----------
  const activities = [
    ["Paragliding", "$120.00", "tour_5_1.jpg"],
    ["Coastal Adventure", "$88.00", "tour_5_2.jpg"],
    ["White Water Rafting", "$68.00", "tour_5_3.jpg"],
    ["Cultural Immersion", "$58.00", "tour_5_4.jpg"],
    ["Mountain Hiking", "$48.00", "tour_5_5.jpg"],
    ["Lake Boating", "$30.00", "tour_5_6.jpg"],
  ];
  await seedIfEmpty(
    prisma.activity,
    activities.map(([atitle, price, img], i) => ({
      title: atitle,
      slug: atitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDescription: `${atitle} experiences with Dream International.`,
      description: `<p>Enjoy ${atitle.toLowerCase()} with experienced local guides and full safety support.</p>`,
      price,
      imageUrl: `/assets/img/tour/${img}`,
      status: "PUBLISHED",
      isFeatured: true,
      order: i,
      publishedAt: now(),
    }))
  );

  // ---------- Services ----------
  const services = [
    ["Custom Itinerary Planning", "feature_1_1.svg"],
    ["Licensed Tour Guides", "feature_1_2.svg"],
    ["Airport & Transport", "feature_1_3.svg"],
    ["Hotel & Lodge Booking", "feature_1_4.svg"],
    ["Trekking Permits & TIMS", "tour_icon_1.svg"],
    ["24/7 Travel Support", "tour_icon_2.svg"],
  ];
  await seedIfEmpty(
    prisma.service,
    services.map(([stitle, icon], i) => ({
      title: stitle,
      slug: stitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDescription: `${stitle} for a smooth and worry-free journey.`,
      description: `<p>Dream International provides ${stitle.toLowerCase()} as part of our end-to-end travel service.</p>`,
      iconUrl: `/assets/img/icon/${icon}`,
      status: "PUBLISHED",
      isFeatured: true,
      order: i,
      publishedAt: now(),
    }))
  );

  // ---------- Resorts ----------
  const resorts = [
    ["Ocean View Resort", "$350.00", "resort_1_1.jpg"],
    ["Premier Forest Resort", "$250.00", "resort_1_2.jpg"],
    ["Deluxe Hilltop Resort", "$180.00", "resort_1_3.jpg"],
  ];
  await seedIfEmpty(
    prisma.resort,
    resorts.map(([rtitle, price, img], i) => ({
      title: rtitle,
      slug: rtitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDescription: `${rtitle} — comfortable stays with great views.`,
      description: `<p>${rtitle} offers a relaxing stay with modern amenities.</p>`,
      price,
      location: "Nepal",
      imageUrl: `/assets/img/destination/destination_4_${i + 1}.jpg`,
      amenities: ["Free Wi-Fi", "Restaurant", "Mountain View", "Airport Transfer"],
      status: "PUBLISHED",
      isFeatured: true,
      order: i,
      publishedAt: now(),
    }))
  );

  // ---------- Tours ----------
  const tours = [
    ["Everest Base Camp Trek", 1450, 14, "tour_4_1.jpg", "Trek to the foot of the world's highest peak."],
    ["Annapurna Circuit Trek", 1150, 12, "tour_4_2.jpg", "Classic circuit through diverse landscapes."],
    ["Ghorepani Poon Hill Trek", 650, 5, "tour_4_3.jpg", "Short scenic trek with sunrise views."],
    ["Chitwan Jungle Safari", 420, 3, "tour_4_4.jpg", "Wildlife adventure in the Terai lowlands."],
    ["Kathmandu Valley Cultural Tour", 380, 4, "tour_4_5.jpg", "UNESCO heritage sites and temples."],
    ["Langtang Valley Trek", 890, 8, "tour_4_6.jpg", "Glacial valley close to Kathmandu."],
  ];
  await seedIfEmpty(
    prisma.tour,
    tours.map(([ttitle, price, days, img, desc], i) => ({
      title: ttitle,
      slug: ttitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDescription: desc,
      description: `<p>${desc} Operated by Dream International with licensed guides, permits, and full support.</p>`,
      highlights: ["Licensed guide", "Permits included", "Daily breakfast", "Airport transfers"],
      basePrice: price,
      durationDays: days,
      durationNights: Math.max(days - 1, 0),
      difficulty: "MODERATE",
      featuredImageUrl: `/assets/img/tour/${img}`,
      market: "nepal",
      status: "PUBLISHED",
      isFeatured: i < 6,
      publishedAt: now(),
    }))
  );

  // ---------- Gallery ----------
  await seedIfEmpty(
    prisma.galleryImage,
    [1, 2, 3, 4, 5, 6].map((n) => ({
      title: `Gallery image ${n}`,
      imageUrl: `/assets/img/gallery/gallery_6_${n}.jpg`,
      category: "Tours",
      order: n - 1,
      isVisible: true,
    }))
  );

  // ---------- FAQs ----------
  await seedIfEmpty(prisma.faq, [
    {
      question: "How do I book a tour?",
      answer: "<p>Contact us via the inquiry form or email and our team will tailor a package for you.</p>",
      order: 0,
    },
    {
      question: "Do I need a visa for Nepal?",
      answer: "<p>Most nationalities can obtain a tourist visa on arrival at Kathmandu airport.</p>",
      order: 1,
    },
    {
      question: "What is the best season to trek?",
      answer: "<p>Spring (Mar–May) and autumn (Sep–Nov) offer the clearest mountain views.</p>",
      order: 2,
    },
    {
      question: "Are permits included in the price?",
      answer: "<p>Yes, trekking permits and TIMS cards are included in our standard packages.</p>",
      order: 3,
    },
  ]);

  // ---------- Blog ----------
  await seedIfEmpty(prisma.blogPost, [
    {
      title: "Top 5 Treks in Nepal for First-Timers",
      slug: "top-5-treks-in-nepal-for-first-timers",
      excerpt: "New to trekking in Nepal? Start with these beginner-friendly classics.",
      content: "<p>From Poon Hill to Langtang, here are the best treks to begin your Himalayan journey.</p>",
      coverImageUrl: "/assets/img/blog/blog_1_1.jpg",
      tags: ["trekking", "guide"],
      status: "PUBLISHED",
      publishedAt: now(),
    },
    {
      title: "A Cultural Guide to Kathmandu Valley",
      slug: "a-cultural-guide-to-kathmandu-valley",
      excerpt: "Explore the temples, stupas, and durbar squares of the Kathmandu Valley.",
      content: "<p>The Kathmandu Valley is home to seven UNESCO World Heritage Sites.</p>",
      coverImageUrl: "/assets/img/blog/blog_1_2.jpg",
      tags: ["culture", "kathmandu"],
      status: "PUBLISHED",
      publishedAt: now(),
    },
  ]);

  // ---------- Flight routes (ticketing) ----------
  const domesticRoutes = [
    ["Kathmandu to Pokhara", "kathmandu-to-pokhara", "Kathmandu", "Pokhara", "KTM", "PKR", "Buddha Air / Yeti", "25 min", "Multiple daily", 95, "/assets/img/destination/destination_4_1.jpg", true],
    ["Kathmandu to Lukla", "kathmandu-to-lukla", "Kathmandu", "Lukla", "KTM", "LUA", "Tara / Summit", "35 min", "Weather dependent", 180, "/assets/img/tour/tour_4_1.jpg", true],
    ["Kathmandu to Bharatpur", "kathmandu-to-bharatpur", "Kathmandu", "Bharatpur", "KTM", "BHR", "Buddha Air", "20 min", "Daily", 85, "/assets/img/destination/destination_4_3.jpg", false],
    ["Kathmandu to Nepalgunj", "kathmandu-to-nepalgunj", "Kathmandu", "Nepalgunj", "KTM", "KEP", "Buddha Air", "55 min", "Daily", 120, "/assets/img/destination/destination_4_4.jpg", false],
    ["Kathmandu to Bhairahawa", "kathmandu-to-bhairahawa", "Kathmandu", "Bhairahawa", "KTM", "BWA", "Buddha Air", "30 min", "Daily", 90, "/assets/img/destination/destination_4_5.jpg", false],
    ["Kathmandu to Biratnagar", "kathmandu-to-biratnagar", "Kathmandu", "Biratnagar", "KTM", "BIR", "Yeti Airlines", "40 min", "Daily", 105, "/assets/img/destination/destination_4_6.jpg", false],
  ];
  const internationalRoutes = [
    ["Kathmandu to Delhi", "kathmandu-to-delhi", "Kathmandu", "Delhi", "KTM", "DEL", "Nepal Airlines / Air India", "1h 45m", "Daily", 220, "/assets/img/destination/destination_4_2.jpg", true],
    ["Kathmandu to Dubai", "kathmandu-to-dubai", "Kathmandu", "Dubai", "KTM", "DXB", "Flydubai / Emirates", "4h 30m", "Daily", 380, "/assets/img/bg/breadcumb-bg.jpg", true],
    ["Kathmandu to Doha", "kathmandu-to-doha", "Kathmandu", "Doha", "KTM", "DOH", "Qatar Airways", "4h 15m", "Daily", 420, "/assets/img/hero/Hero2.jpg", true],
    ["Kathmandu to Bangkok", "kathmandu-to-bangkok", "Kathmandu", "Bangkok", "KTM", "BKK", "Thai / Nepal Airlines", "3h 10m", "Daily", 310, "/assets/img/tour/tour_4_2.jpg", false],
    ["Kathmandu to Kuala Lumpur", "kathmandu-to-kuala-lumpur", "Kathmandu", "Kuala Lumpur", "KTM", "KUL", "AirAsia / Malindo", "4h 40m", "4x weekly", 290, "/assets/img/tour/tour_4_3.jpg", false],
    ["Kathmandu to Singapore", "kathmandu-to-singapore", "Kathmandu", "Singapore", "KTM", "SIN", "Singapore Airlines", "5h", "Daily", 450, "/assets/img/tour/tour_4_4.jpg", false],
  ];

  const makeRoute = ([title, slug, fromCity, toCity, fromAirport, toAirport, airline, flightDuration, frequency, priceFrom, imageUrl, isFeatured], ticketType, order) => ({
    title,
    slug,
    ticketType,
    fromCity,
    toCity,
    fromAirport,
    toAirport,
    airline,
    flightDuration,
    frequency,
    priceFrom,
    priceDisplay: `From $${priceFrom}`,
    shortDescription: `Book ${fromCity} to ${toCity} flights with competitive fares and local support.`,
    description: `<p>Secure your seat on the <strong>${title}</strong> route with Dream International. We compare fares across partner airlines and help with date changes, baggage, and group bookings.</p>`,
    imageUrl,
    imageAlt: title,
    highlights: ["Instant fare quote", "Date change assistance", "Group & trekker fares", "Airport transfer add-ons"],
    baggageInfo: "Standard 15–20 kg checked baggage on most sectors; exact allowance varies by airline and fare class.",
    bookingNotes: "<p>Fares are indicative and subject to availability. Passport required for international sectors. Lukla flights are weather-dependent.</p>",
    status: "PUBLISHED",
    isFeatured,
    order,
    publishedAt: now(),
  });

  await seedIfEmpty(
    prisma.flightRoute,
    [
      ...domesticRoutes.map((row, i) => makeRoute(row, "domestic", i)),
      ...internationalRoutes.map((row, i) => makeRoute(row, "international", i)),
    ]
  );

  // ---------- Homepage sections (page builder) ----------
  const sections = [
    {
      key: "hero",
      label: "Hero Slider",
      order: 0,
      data: {
        slides: [
          {
            image: "/assets/img/bg/hero_bg_7_1.jpg",
            subtitle: "Welcome to Dream International",
            title: "Discover the Himalayas of Nepal",
            text: "Trekking, cultural tours, and tailor-made journeys with trusted local experts.",
            primaryCta: { label: "Explore Tours", url: "/tour" },
            secondaryCta: { label: "Contact Us", url: "/contact" },
          },
          {
            image: "/assets/img/bg/breadcumb-bg.jpg",
            subtitle: "Adventure Awaits",
            title: "Custom Journeys Across Nepal",
            text: "From Everest Base Camp to Chitwan's jungles — we craft trips around you.",
            primaryCta: { label: "Plan My Trip", url: "/contact" },
            secondaryCta: { label: "View Destinations", url: "/destination" },
          },
        ],
      },
    },
    {
      key: "categories",
      label: "Tour Categories",
      order: 1,
      data: { subTitle: "Tour Categories", title: "Browse by Experience", bgImage: "/assets/img/bg/category_bg_1.png" },
    },
    { key: "featuredDestination", label: "Featured Destination", order: 2, data: { subTitle: "Featured Destination", title: "Where to Go" } },
    {
      key: "about",
      label: "About Section",
      order: 3,
      data: {
        subTitle: "About Dream International",
        title: "Your Trusted Travel Partner in Nepal",
        text: "We are a Nepal-based travel company specializing in trekking, cultural tours, and bespoke itineraries. Our experienced guides and personal service ensure a safe, memorable journey.",
        image: "/assets/img/normal/about_10_1.jpg",
        image2: "/assets/img/normal/lake.jpg",
        image3: "/assets/img/normal/boudha.jpg",
        featureOneTitle: "Custom Itineraries",
        featureOneText: "Tailor-made tours designed around your travel style, timeline, and comfort preference.",
        featureTwoTitle: "Licensed Local Guides",
        featureTwoText: "Explore with knowledgeable, safety-focused guides who know Nepal deeply.",
        ctaLabel: "Learn More",
        ctaUrl: "/about",
      },
    },
    {
      key: "featuredTours",
      label: "Featured Tours",
      order: 4,
      data: { subTitle: "Popular Packages", title: "Featured Tours", bgImage: "/assets/img/bg/tour_bg_1.jpg" },
    },
    { key: "gallery", label: "Gallery", order: 5, data: { subTitle: "Our Gallery", title: "Moments From the Trail" } },
    { key: "counters", label: "Stats / Counters", order: 6, data: { bgImage: "/assets/img/bg/cta_bg_2.jpg" } },
    { key: "team", label: "Team / Guides", order: 7, data: { subTitle: "Our Team", title: "Meet Your Guides" }, enabled: false },
    { key: "testimonials", label: "Testimonials", order: 8, data: { subTitle: "Testimonials", title: "What Travelers Say" } },
    { key: "brands", label: "Partner Brands", order: 9, data: { subTitle: "Our Partners", title: "Affiliated Partners" } },
    { key: "blog", label: "Blog Teaser", order: 10, data: { subTitle: "Our Blog", title: "News & Articles" } },
  ];
  for (const s of sections) {
    const { enabled = true, ...rest } = s;
    // eslint-disable-next-line no-await-in-loop
    await prisma.section.upsert({
      where: { page_key: { page: "home", key: rest.key } },
      update: {},
      create: { page: "home", ...rest, enabled },
    });
  }

  // Hide guides section on existing homepages.
  await prisma.section.updateMany({
    where: { page: "home", key: "team" },
    data: { enabled: false },
  });

  // ---------- About page content ----------
  await prisma.section.upsert({
    where: { page_key: { page: "about", key: "intro" } },
    update: {},
    create: {
      page: "about",
      key: "intro",
      label: "About Intro",
      order: 0,
      enabled: true,
      data: {
        subTitle: "About Us",
        title: "About Dream International Travel and Tours",
        text: "<p>Dream International Travel and Tours is a Kathmandu-based travel company offering trekking, cultural tours, jungle safaris, and custom journeys across Nepal.</p>",
        image: "/assets/img/normal/about_11_1.jpg",
      },
    },
  });

  // ---------- Ticketing page content ----------
  await prisma.section.upsert({
    where: { page_key: { page: "ticketing-domestic", key: "page" } },
    update: {},
    create: {
      page: "ticketing-domestic",
      key: "page",
      label: "Domestic Ticketing Page",
      order: 0,
      enabled: true,
      data: {
        subTitle: "Domestic Flights",
        title: "Nepal Domestic Air Tickets",
        intro: "Book flights across Nepal with competitive fares on major routes — Pokhara, Lukla, Bharatpur, and more.",
        heroImage: "/assets/img/hero/Hero2.jpg",
        trustBadges: ["Licensed Travel Agency", "Instant Confirmation", "24/7 Support"],
      },
    },
  });
  await prisma.section.upsert({
    where: { page_key: { page: "ticketing-international", key: "page" } },
    update: {},
    create: {
      page: "ticketing-international",
      key: "page",
      label: "International Ticketing Page",
      order: 0,
      enabled: true,
      data: {
        subTitle: "International Flights",
        title: "International Air Tickets from Nepal",
        intro: "Fly from Kathmandu to Delhi, Dubai, Doha, Bangkok, and other global hubs with trusted airline partners.",
        heroImage: "/assets/img/bg/breadcumb-bg.jpg",
        trustBadges: ["Best Fare Search", "Multi-airline Options", "Visa & Travel Support"],
      },
    },
  });

  // ---------- Vehicle rental categories ----------
  const vehicleCategories = [
    ["Cars", "cars", "fa-light fa-car-side"],
    ["Jeeps / SUVs", "jeeps-suvs", "fa-light fa-truck-monster"],
    ["Vans & Minibuses", "vans-minibuses", "fa-light fa-van-shuttle"],
    ["Buses & Coaches", "buses-coaches", "fa-light fa-bus"],
    ["Hire a Driver", "hire-a-driver", "fa-light fa-id-card"],
  ];
  const vehicleCategoryIds = {};
  for (let i = 0; i < vehicleCategories.length; i += 1) {
    const [vname, vslug, vicon] = vehicleCategories[i];
    // eslint-disable-next-line no-await-in-loop
    const row = await prisma.vehicleCategory.upsert({
      where: { slug: vslug },
      update: {},
      create: { name: vname, slug: vslug, icon: vicon, order: i, isVisible: true },
    });
    vehicleCategoryIds[vslug] = row.id;
  }

  // ---------- Vehicle rentals (popular models — client did not specify exact models) ----------
  const vehicleRentals = [
    {
      title: "Toyota Corolla (Sedan)",
      category: "cars",
      vehicleType: "car",
      brandModel: "Toyota Corolla",
      seatingCapacity: 4,
      transmission: "automatic",
      fuelType: "petrol",
      pricePerDay: 45,
      pricePerDayDriver: 65,
    },
    {
      title: "BYD Atto 3 (Electric)",
      category: "cars",
      vehicleType: "car",
      brandModel: "BYD Atto 3",
      seatingCapacity: 5,
      transmission: "automatic",
      fuelType: "electric",
      pricePerDay: 55,
      pricePerDayDriver: 75,
    },
    {
      title: "Suzuki Swift (Hatchback)",
      category: "cars",
      vehicleType: "car",
      brandModel: "Suzuki Swift",
      seatingCapacity: 4,
      transmission: "manual",
      fuelType: "petrol",
      pricePerDay: 35,
      pricePerDayDriver: 55,
    },
    {
      title: "Mahindra Scorpio",
      category: "jeeps-suvs",
      vehicleType: "jeep",
      brandModel: "Mahindra Scorpio",
      seatingCapacity: 7,
      transmission: "manual",
      fuelType: "diesel",
      pricePerDay: 70,
      pricePerDayDriver: 95,
    },
    {
      title: "Toyota Land Cruiser Prado",
      category: "jeeps-suvs",
      vehicleType: "jeep",
      brandModel: "Toyota Land Cruiser Prado",
      seatingCapacity: 7,
      transmission: "automatic",
      fuelType: "diesel",
      pricePerDay: 110,
      pricePerDayDriver: 140,
    },
    {
      title: "Hyundai Creta (Compact SUV)",
      category: "jeeps-suvs",
      vehicleType: "jeep",
      brandModel: "Hyundai Creta",
      seatingCapacity: 5,
      transmission: "automatic",
      fuelType: "petrol",
      pricePerDay: 60,
      pricePerDayDriver: 85,
    },
    {
      title: "Toyota Hiace Van (12-Seater)",
      category: "vans-minibuses",
      vehicleType: "van",
      brandModel: "Toyota Hiace",
      seatingCapacity: 12,
      transmission: "manual",
      fuelType: "diesel",
      pricePerDay: 120,
      pricePerDayDriver: 150,
    },
    {
      title: "Force Traveller (17-Seater)",
      category: "vans-minibuses",
      vehicleType: "van",
      brandModel: "Force Traveller",
      seatingCapacity: 17,
      transmission: "manual",
      fuelType: "diesel",
      pricePerDay: 150,
      pricePerDayDriver: 185,
    },
    {
      title: "32-Seater Tourist Coach",
      category: "buses-coaches",
      vehicleType: "bus",
      brandModel: "Tourist Coach",
      seatingCapacity: 32,
      transmission: "manual",
      fuelType: "diesel",
      driverOptions: "with-driver",
      pricePerDayDriver: 220,
    },
    {
      title: "40-Seater Deluxe Bus",
      category: "buses-coaches",
      vehicleType: "bus",
      brandModel: "Deluxe Bus",
      seatingCapacity: 40,
      transmission: "manual",
      fuelType: "diesel",
      driverOptions: "with-driver",
      pricePerDayDriver: 280,
    },
    {
      title: "Professional Driver — Hire Only",
      category: "hire-a-driver",
      vehicleType: "driver-only",
      driverOptions: "with-driver",
      shortDescription: "Bring your own vehicle — we provide an experienced, licensed local driver.",
      showPricing: true,
      pricePerDayDriver: 35,
    },
  ];
  await seedIfEmpty(
    prisma.vehicleRental,
    vehicleRentals.map((r, i) => ({
      title: r.title,
      slug: r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      categoryId: vehicleCategoryIds[r.category] || null,
      vehicleType: r.vehicleType,
      brandModel: r.brandModel || null,
      seatingCapacity: r.seatingCapacity || null,
      transmission: r.transmission || null,
      fuelType: r.fuelType || null,
      driverOptions: r.driverOptions || "both",
      showPricing: r.showPricing !== false,
      pricePerDay: r.pricePerDay || null,
      pricePerDayDriver: r.pricePerDayDriver || null,
      shortDescription: r.shortDescription || `${r.title} available for rental with Dream International — well-maintained and ready for your trip.`,
      description: `<p>${r.title} available for rental with Dream International. Contact us for availability, exact pricing, and pickup arrangements.</p>`,
      highlights: ["Well-maintained vehicle", "Flexible pickup & drop-off", "Local support throughout your rental"],
      status: "PUBLISHED",
      isFeatured: i < 4,
      order: i,
      publishedAt: now(),
    }))
  );

  await seedInternationalTours(prisma, now);

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
