/**
 * Applies one-time CMS content updates:
 * - Clears flight and activity pricing (enquiry-only site)
 * - Distributes Buddha/Yeti airline images on domestic routes
 * - Adds icons to counters and services missing them
 * - Publishes travel blog posts
 *
 * Usage: node scripts/apply-content-updates.js
 */
import "dotenv/config";
import prisma from "../src/lib/prisma.js";
import { buildBlogPosts } from "../prisma/content/cms-content-blogs.js";

const BUDDHA_FILE = "1784549888812-buddha-air.jpg";
const YETI_FILE = "1784549888827-yeti-air.jpg";

const COUNTER_ICONS = {
  "Years of Experience": "fa-light fa-award",
  "Happy Travelers": "fa-light fa-users",
  "Tour Packages": "fa-light fa-map",
  "Expert Guides": "fa-light fa-person-hiking",
};

const SERVICE_ICONS = [
  ["custom-itinerary-planning", "feature_1_1.svg"],
  ["licensed-tour-guides", "feature_1_2.svg"],
  ["airport-transport", "feature_1_3.svg"],
  ["hotel-lodge-booking", "feature_1_4.svg"],
  ["trekking-permits-tims", "tour_icon_1.svg"],
  ["24-7-travel-support", "tour_icon_2.svg"],
];

async function findMediaUrl(fileFragment) {
  const asset = await prisma.mediaAsset.findFirst({
    where: {
      OR: [
        { fileName: { contains: fileFragment } },
        { url: { contains: fileFragment } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  if (asset?.url) return asset.url;
  return `/uploads/${fileFragment}`;
}

function distributeDomesticImages(routes, buddhaUrl, yetiUrl) {
  const total = routes.length;
  const buddhaCount = Math.max(1, Math.round(total * 0.44));
  const yetiCount = Math.max(1, Math.round(total * 0.33));
  const assignments = [];

  for (let i = 0; i < total; i += 1) {
    if (i < buddhaCount) assignments.push(buddhaUrl);
    else if (i < buddhaCount + yetiCount) assignments.push(yetiUrl);
    else assignments.push(null);
  }

  // Shuffle deterministically by slug so distribution looks natural across the grid
  const keyed = routes.map((route, index) => ({
    route,
    sort: [...route.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + index,
    image: assignments[index],
  }));
  keyed.sort((a, b) => a.sort - b.sort);
  return keyed;
}

async function clearPricing() {
  const flights = await prisma.flightRoute.updateMany({
    data: { priceFrom: null, priceDisplay: null },
  });
  const activities = await prisma.activity.updateMany({
    data: { price: null },
  });
  console.log(`Cleared pricing on ${flights.count} flight route(s) and ${activities.count} activit(ies).`);
}

async function assignDomesticImages() {
  const buddhaUrl = await findMediaUrl(BUDDHA_FILE);
  const yetiUrl = await findMediaUrl(YETI_FILE);
  console.log(`Using Buddha Air image: ${buddhaUrl}`);
  console.log(`Using Yeti Air image: ${yetiUrl}`);

  const routes = await prisma.flightRoute.findMany({
    where: { ticketType: "domestic" },
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  const plan = distributeDomesticImages(routes, buddhaUrl, yetiUrl);
  let buddha = 0;
  let yeti = 0;
  let blank = 0;

  for (const { route, image } of plan) {
    await prisma.flightRoute.update({
      where: { id: route.id },
      data: {
        cardImageUrl: image,
        imageUrl: image,
        cardImageAlt: image?.includes("buddha") ? "Buddha Air aircraft" : image?.includes("yeti") ? "Yeti Airlines aircraft" : null,
        imageAlt: image ? `${route.title} — airline` : null,
      },
    });
    if (!image) blank += 1;
    else if (image.includes("buddha")) buddha += 1;
    else if (image.includes("yeti")) yeti += 1;
  }

  console.log(`Domestic route images — Buddha: ${buddha}, Yeti: ${yeti}, blank: ${blank} (of ${routes.length}).`);
}

async function assignIcons() {
  const counters = await prisma.counter.findMany();
  for (const counter of counters) {
    const icon = COUNTER_ICONS[counter.label] || counter.icon || "fa-light fa-star";
    if (counter.icon !== icon) {
      await prisma.counter.update({ where: { id: counter.id }, data: { icon } });
    }
  }
  console.log(`Updated icons on ${counters.length} counter(s).`);

  for (const [slug, iconFile] of SERVICE_ICONS) {
    const iconUrl = `/assets/img/icon/${iconFile}`;
    await prisma.service.updateMany({
      where: { slug, OR: [{ iconUrl: null }, { iconUrl: "" }] },
      data: { iconUrl },
    });
  }

  const vehicleIconDefaults = {
    cars: "fa-light fa-car-side",
    "jeeps-suvs": "fa-light fa-truck-monster",
    "vans-minibuses": "fa-light fa-van-shuttle",
    "buses-coaches": "fa-light fa-bus",
    "hire-a-driver": "fa-light fa-id-card",
  };
  for (const [slug, icon] of Object.entries(vehicleIconDefaults)) {
    await prisma.vehicleCategory.updateMany({
      where: { slug, OR: [{ icon: null }, { icon: "" }] },
      data: { icon },
    });
  }
  console.log("Ensured service and vehicle category icons are set.");
}

async function publishBlogs() {
  const posts = buildBlogPosts();
  let created = 0;
  let updated = 0;

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      await prisma.blogPost.update({
        where: { slug: post.slug },
        data: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          coverImageUrl: post.coverImageUrl,
          coverImageAlt: post.title,
          status: "PUBLISHED",
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        },
      });
      updated += 1;
    } else {
      await prisma.blogPost.create({
        data: {
          ...post,
          coverImageAlt: post.title,
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        },
      });
      created += 1;
    }
  }

  console.log(`Blog posts — created ${created}, updated ${updated} (all published).`);
}

async function main() {
  console.log("Dream International — applying CMS content updates\n");
  await clearPricing();
  await assignDomesticImages();
  await assignIcons();
  await publishBlogs();
  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
