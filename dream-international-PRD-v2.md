# Product Requirements Document (PRD)
## Dream International Travel and Tours — Website with Custom CMS

**Version:** 2.0  
**Date:** May 28, 2026  
**Status:** Draft — Pre-Development Planning  
**Prepared by:** Project Planning Phase

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Overview & Goals](#2-business-overview--goals)
3. [Target Audience](#3-target-audience)
4. [Competitive Landscape Analysis](#4-competitive-landscape-analysis)
5. [Technical Stack](#5-technical-stack)
6. [Site Architecture & Page Structure](#6-site-architecture--page-structure)
7. [Frontend Feature Requirements](#7-frontend-feature-requirements)
8. [Custom CMS Requirements](#8-custom-cms-requirements)
9. [Database Schema Overview](#9-database-schema-overview)
10. [Inquiry System](#10-inquiry-system)
11. [SEO Infrastructure](#11-seo-infrastructure)
12. [Performance & Infrastructure](#12-performance--infrastructure)
13. [Security Requirements](#13-security-requirements)
14. [Design System & UI Guidelines](#14-design-system--ui-guidelines)
15. [Content Requirements](#15-content-requirements)
16. [Integrations & Third-Party Services](#16-integrations--third-party-services)
17. [Development Phases & Milestones](#17-development-phases--milestones)
18. [Out of Scope](#18-out-of-scope)
19. [Open Questions & Decisions Required](#19-open-questions--decisions-required)

---

## 1. Executive Summary

**Dream International Travel and Tours** is a Nepal-based travel and tour company requiring a professionally built marketing website powered by a proprietary, custom-built CMS. The website will be built using **React** (Vite) for the frontend with an **Express.js** backend API, and a **custom admin panel** — built within the same application — for full content control by non-technical staff.

The design foundation is the purchased **Tourm React template** (`tourm-react.netlify.app`), which will be adapted, extended, and Nepal-contextualized. No off-the-shelf CMS (Sanity, Strapi, WordPress, etc.) will be used.

**Our scope is to deliver a working, well-structured website.** We build the technical infrastructure that makes the site SEO-friendly and self-manageable. Content creation, ongoing SEO work, and content marketing are the client's responsibility.

---

## 2. Business Overview & Goals

### 2.1 About the Business

- **Business Name:** Dream International Travel and Tours
- **Location:** Nepal (Kathmandu-based)
- **Category:** Inbound tour operator / destination management company
- **Service Area:** Nepal (primarily); potential future extension to Tibet and Bhutan
- **Credentials to display on site:** Nepal Tourism Board (NTB), TAAN (Trekking Agencies' Association of Nepal), NATTA (Nepal Association of Tour & Travel Agents)

### 2.2 Core Business Objectives

- Establish a professional, credible online presence that builds trust with international and domestic travelers
- Capture inquiries and custom trip requests directly through the website (reducing OTA dependency over time)
- Enable staff to independently manage all website content without developer assistance
- Present packages, destinations, and team credibility in a structured, visually compelling way

### 2.3 Key Website Goals

| Goal | Notes |
|---|---|
| Professional presentation | Modern, fast, mobile-first design that outperforms competitor WordPress sites on UX |
| Inquiry capture | Every page has a clear path to contact / send inquiry |
| CMS self-sufficiency | All content — tours, destinations, blog, reviews, images — manageable by admin staff |
| SEO-ready infrastructure | Correct HTML semantics, meta tags, structured data, sitemaps, clean URLs — content is client's job |
| Credibility signals | Certifications, team bios, TripAdvisor/Google review display, trust badges |

---

## 3. Target Audience

### 3.1 Primary Audiences

**International Adventure Travelers (Primary)**
- Age: 25–55
- Nationality: Western Europe, North America, Australia, Israel
- Motivation: Trekking (Everest, Annapurna, Langtang), mountaineering, adventure activities
- Behavior: Heavy online research, reads reviews, compares packages
- Device: ~60% mobile, ~40% desktop

**Cultural & Pilgrimage Tourists (Secondary)**
- Age: 35–65
- Nationality: India (dominant), Japan, Southeast Asia
- Motivation: Pashupatinath, Muktinath, Lumbini, Kathmandu Valley heritage
- Device: Mix of mobile and desktop

**Luxury & Family Travelers (Tertiary)**
- Age: 40–65
- Seeking: Helicopter tours, luxury lodges, comfort trekking, family itineraries

**Solo Female Travelers (Emerging Segment)**
- Safety reassurance, female guide options

### 3.2 Secondary Audiences

- B2B travel agents seeking a Nepal ground operator
- Corporate groups

---

## 4. Competitive Landscape Analysis

### 4.1 Key Competitors Studied

| Site | Strengths | Weaknesses |
|---|---|---|
| travelnepalholidays.com | Strong Nepal branding, solid package list | Dated design, slow |
| accessnepaltour.com | TripAdvisor awards prominent, good reviews | Heavy WordPress, slow load |
| nepalhikingteam.com | 30+ years credibility, strong FAQ | Dense content, poor UX |
| excitingnepal.com | TripAdvisor "Best of Best" badge | Design dated |
| adventurelandnepal.com | 5.0 Google rating visible | Generic layout |

### 4.2 Differentiation Opportunities

- Modern, fast, React-based build vs. slow WordPress competitors
- Structured day-by-day itinerary pages (better UX and naturally SEO-friendly)
- Clean, transparent pricing with "from" prices on all cards
- Custom trip inquiry wizard for tailor-made packages
- Prominent trust signals: certifications, review display, team profiles
- Mobile-first design — competitors are often broken or cramped on mobile

---

## 5. Technical Stack

### 5.1 Frontend

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 18 + Vite | Fast dev builds, HMR, compatible with Tourm template |
| Language | JavaScript (JSX) | Tourm template is JS; avoids migration overhead |
| Routing | React Router v6 | Client-side routing, nested routes for admin |
| Styling | Tailwind CSS + Tourm template CSS | Utility-first; template styles preserved and extended |
| State Management | React Context + useReducer | Lightweight; no external library needed |
| Forms | React Hook Form | Validation for inquiry/contact forms |
| Rich Text Display | `dangerouslySetInnerHTML` with sanitization (DOMPurify) | Render HTML from CMS rich text editor |
| Animations | Swiper.js, AOS (from Tourm template) | Hero sliders, scroll animations — reuse template |
| Maps | Leaflet.js | Trek route maps, destination maps (lightweight, free) |
| Images | Standard `<img>` with lazy loading (`loading="lazy"`) + Cloudinary URLs | Optimization via Cloudinary transformation URLs |
| SEO | React Helmet Async | Dynamic `<head>` meta tags per page |
| HTTP Client | Axios | API requests to backend |

### 5.2 Backend / API

| Layer | Technology | Rationale |
|---|---|---|
| Runtime | Node.js | JavaScript throughout full stack |
| Framework | Express.js | Lightweight, well-understood REST API framework |
| Language | JavaScript (CommonJS or ESM) | Consistent with frontend language choice |
| Database | PostgreSQL via **Neon** (serverless managed Postgres) | Serverless, generous free tier, branching for dev/prod |
| ORM | Prisma | Type-safe queries, schema migrations, Neon-compatible |
| Authentication | Custom JWT (jsonwebtoken) | Admin-only auth; no customer login |
| File Storage | Cloudinary | Image upload, transformation, CDN delivery |
| Email | Nodemailer + SMTP (or Resend) | Inquiry notification emails |
| Validation | Zod | API request body validation |

### 5.3 Admin Panel

The admin panel is **part of the same React application**, served under the `/admin` route. It is protected by JWT-based authentication. Non-admin users cannot access `/admin` routes — enforced both on the React Router level (redirect) and on every API endpoint (middleware token verification).

| Layer | Technology |
|---|---|
| Routing | React Router v6 nested routes under `/admin/*` |
| Admin UI | Client-provided admin template (e.g., Tabler, Metronic) OR custom Tailwind admin UI |
| Rich Text Editor | TipTap (headless, framework-agnostic) |
| Image Upload | Cloudinary Upload Widget or custom drag-and-drop → Cloudinary API |
| Charts (Dashboard) | Recharts — inquiry stats, tour views |

### 5.4 Hosting & DevOps

| Service | Platform |
|---|---|
| Frontend + Backend | Railway, Render, or Fly.io (full-stack Node hosting) |
| Database | Neon (serverless PostgreSQL) |
| Image CDN | Cloudinary |
| Domain & DNS | Cloudflare (DNS, CDN, caching, DDoS protection) |
| CI/CD | GitHub → auto-deploy on push to `main` |
| Environment Variables | Managed via hosting platform's env config |

> **Deployment model:** The Express backend serves the built React app as static files in production (`express.static` on the `dist/` folder). Single deployment, single server, admin routes are part of the same bundle but gated by auth.

---

## 6. Site Architecture & Page Structure

### 6.1 Public Website Routes

```
/ (Home)
│
├── /tours                          (All tours listing with filters)
│   ├── /tours/trekking             (Category listing — Trekking)
│   ├── /tours/cultural             (Category listing — Cultural)
│   ├── /tours/adventure            (Category listing — Adventure)
│   ├── /tours/wildlife             (Category listing — Wildlife)
│   ├── /tours/helicopter           (Category listing — Helicopter)
│   ├── /tours/pilgrimage           (Category listing — Pilgrimage)
│   ├── /tours/luxury               (Category listing — Luxury)
│   ├── /tours/honeymoon            (Category listing — Honeymoon)
│   ├── /tours/family               (Category listing — Family)
│   └── /tours/:slug                (Individual tour detail page — dynamic)
│
├── /destinations                   (All destinations listing)
│   └── /destinations/:slug         (Individual destination page — dynamic)
│
├── /plan-your-trip                 (Static info hub)
│   ├── /plan-your-trip/best-time-to-visit
│   ├── /plan-your-trip/visa-information
│   ├── /plan-your-trip/trekking-permits
│   └── /plan-your-trip/altitude-sickness
│
├── /blog                           (Blog listing)
│   ├── /blog/category/:category    (Category filter)
│   └── /blog/:slug                 (Individual post — dynamic)
│
├── /about                          (About the company)
├── /team                           (Team profiles)
├── /reviews                        (All reviews page)
├── /gallery                        (Photo gallery)
├── /contact                        (Contact + inquiry form)
├── /custom-trip                    (Tailor-made trip inquiry wizard)
│
├── /privacy-policy
└── /terms-and-conditions
```

### 6.2 Admin Panel Routes (protected, `/admin/*`)

```
/admin/login

/admin/dashboard

/admin/tours
├── /admin/tours/new
└── /admin/tours/:id/edit

/admin/destinations
├── /admin/destinations/new
└── /admin/destinations/:id/edit

/admin/blog
├── /admin/blog/new
└── /admin/blog/:id/edit

/admin/inquiries
└── /admin/inquiries/:id

/admin/reviews
└── /admin/reviews/new

/admin/media

/admin/homepage          (Homepage section builder)
/admin/navigation        (Nav and footer link manager)

/admin/settings
├── /admin/settings/general
├── /admin/settings/seo
├── /admin/settings/contact
└── /admin/settings/social

/admin/users             (Super Admin only)
```

### 6.3 API Routes (Express backend)

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/tours              (public — with filters: category, status=published)
GET    /api/tours/:slug        (public — single tour)
POST   /api/tours              (admin)
PUT    /api/tours/:id          (admin)
DELETE /api/tours/:id          (admin)

GET    /api/destinations        (public)
GET    /api/destinations/:slug  (public)
POST   /api/destinations        (admin)
PUT    /api/destinations/:id    (admin)
DELETE /api/destinations/:id   (admin)

GET    /api/blog                (public)
GET    /api/blog/:slug          (public)
POST   /api/blog                (admin)
PUT    /api/blog/:id            (admin)
DELETE /api/blog/:id           (admin)

GET    /api/categories          (public)

POST   /api/inquiries           (public — form submission)
GET    /api/inquiries           (admin)
GET    /api/inquiries/:id       (admin)
PUT    /api/inquiries/:id       (admin — update status/notes)

GET    /api/reviews             (public — featured=true for public; all for admin)
POST   /api/reviews             (admin)
PUT    /api/reviews/:id         (admin)
DELETE /api/reviews/:id        (admin)

POST   /api/media/upload        (admin — Cloudinary upload)
GET    /api/media               (admin)
DELETE /api/media/:id          (admin)

GET    /api/settings            (public — safe keys only)
PUT    /api/settings            (admin)
GET    /api/settings/all        (admin — all keys)

GET    /api/homepage            (public — homepage config)
PUT    /api/homepage            (admin)

GET    /api/navigation          (public)
PUT    /api/navigation          (admin)

GET    /api/users               (super admin)
POST   /api/users               (super admin)
PUT    /api/users/:id           (super admin)
DELETE /api/users/:id          (super admin)

GET    /api/sitemap             (generates XML sitemap — consumed by sitemap.xml route)
```

---

## 7. Frontend Feature Requirements

### 7.1 Homepage Sections

| # | Section | Description |
|---|---|---|
| 1 | Hero / Banner | Full-width image/video slider with headline, subheadline, and CTA buttons ("Browse Tours", "Plan Custom Trip"). Content managed via CMS. |
| 2 | Tour Category Grid | Icon-based grid of all categories (Trekking, Cultural, Adventure, Wildlife, Helicopter, Pilgrimage, Luxury, Honeymoon, Family). Each links to its category listing. |
| 3 | Featured Tours | Grid of CMS-selected featured tours. Each card: thumbnail, title, duration, difficulty, price-from, rating. |
| 4 | Destinations Showcase | Visual card grid for top destinations: Kathmandu, Pokhara, Everest Region, Chitwan, Annapurna Region. Links to destination pages. |
| 5 | Why Choose Us | Icon + short text blocks: Licensed & Certified, Experienced Guides, Customizable Itineraries, 24/7 Support. Content editable via CMS. |
| 6 | Stats Bar | Animated counters: Happy Travelers, Years of Experience, Destinations, Success Rate. Numbers editable via CMS. |
| 7 | Featured Testimonials | 3–4 review cards from featured reviews. Star ratings, reviewer name, country, trip name. |
| 8 | Latest Blog Posts | 3-column card grid of the 3 most recent published blog posts. |
| 9 | Certification/Partners Strip | Logo strip: NTB, TAAN, NATTA, TripAdvisor badge. Logos manageable via CMS. |
| 10 | Footer | Company info, quick links, category links, social media icons, copyright, registration number. |

All homepage sections can be individually enabled/disabled and reordered via the CMS Homepage Builder.

### 7.2 Tour Listing Page

- Grid of all published tours (or filtered by category)
- **Filter panel** (sidebar or top bar): Category, Duration range, Difficulty, Price range
- **Sort:** Featured, Price (Low→High / High→Low), Duration, Newest
- URL reflects active filters (`/tours?category=trekking&difficulty=moderate`) — shareable links
- Tour Card: thumbnail, category badge, title, duration, difficulty indicator, max altitude (if trekking), price-from, "View Details" CTA
- Pagination (or "Load More" button)
- Empty state message when no results match filters

### 7.3 Tour Detail Page (Critical — highest SEO value)

**Hero section:**
- Full-width hero image
- Tour title
- Breadcrumb: Home > Tours > [Category] > [Tour Name]
- Key stats strip: Duration | Difficulty | Max Altitude | Group Size | Price From

**Tab / Section layout (scrollspy navigation):**

1. **Overview** — Long description (rich text from CMS), highlights bullet list
2. **Itinerary** — Day-by-day accordion: Day number, title, description, start/end location, altitude, accommodation, meal plan (B/L/D)
3. **Includes / Excludes** — Two-column list (what's covered and what isn't)
4. **Map** — Leaflet.js map or static map image with route, key points labeled
5. **Gallery** — Lightbox-enabled photo grid (8+ photos per tour)
6. **Best Season** — Visual monthly calendar showing recommended vs possible months
7. **FAQs** — Accordion of Q&A items (FAQ schema markup applied)
8. **Reviews** — Filtered testimonials for this specific tour

**Sticky Sidebar (desktop) / Bottom Sheet (mobile):**
- Price-from display
- "Send Inquiry" button (opens inquiry modal with tour pre-filled)
- "Plan Custom Trip" link
- WhatsApp direct contact button
- Quick facts: Start/End point, accommodation type, group size range, min age

### 7.4 Destination Pages

- Hero image with destination name
- Overview description (rich text)
- Top things to do (list)
- Related tour packages (auto-pulled by destination tag)
- Getting there section
- Best time to visit
- Photo gallery

### 7.5 Plan Your Trip (Static Info Pages)

Static pages managed via CMS rich text editor. Pages:
- Best Time to Visit Nepal
- Visa Information
- Trekking Permits (TIMS, conservation area permits)
- Altitude Sickness Guide

### 7.6 Blog

- Listing page: cover image, title, excerpt, author, date, category tag, read time
- Category filter tabs
- Individual post: cover image, title, author, date, category, estimated read time, rich text body, related posts (same category)
- Social share buttons (Facebook, Twitter/X, WhatsApp, copy link)

### 7.7 Reviews Page

- Aggregate star rating display
- Review cards: reviewer name, flag icon (country), star rating, trip name, review text, date, source (TripAdvisor / Google / Direct)
- Filter by tour or star rating
- TripAdvisor widget embed (if client has active listing)

### 7.8 Gallery Page

- Masonry or grid photo gallery
- Filter tabs by category/destination
- Lightbox on click with swipe support
- All images managed via CMS media library + gallery module

### 7.9 Custom Trip Inquiry Wizard (`/custom-trip`)

Multi-step form (5 steps):
1. **Where?** — Destination(s) of interest (multi-select: Everest Region, Annapurna, Kathmandu, Pokhara, Chitwan, Langtang, Mustang, Custom)
2. **What?** — Activity types (Trekking, Cultural Tour, Wildlife Safari, Helicopter Tour, Adventure, Pilgrimage)
3. **When & Who?** — Preferred month, duration (in days), group size, adult/child split
4. **Style** — Comfort level (Basic/Teahouse, Standard, Comfort/Lodge, Luxury)
5. **Your Details** — Full name, email, phone (with country code), nationality, special requirements (free text)

On submission: record saved to Inquiries table (type: `custom_trip`), confirmation email to user, notification email to admin.

### 7.10 Contact Page

- Company contact info (phone, email, address, Google Map embed)
- Standard inquiry form: name, email, phone, message, optional tour of interest
- WhatsApp link
- Office hours

### 7.11 About & Team Pages

- Company story (rich text, CMS-managed)
- Why Choose Us section
- Certifications & registrations (NTB, TAAN, NATTA logos + registration numbers)
- Team grid: photo, name, title, short bio (all CMS-managed)

### 7.12 Global UI Elements

- **WhatsApp floating button** — always visible, bottom-right corner, links to WhatsApp with pre-filled message
- **Sticky header** — on scroll, compact logo + nav
- **Mega-menu** — Tours dropdown with category grid + featured tour card
- **Mobile nav** — full-screen hamburger menu
- **Breadcrumbs** — all interior pages
- **Back to top button**
- **404 page** — on-brand, links back to homepage and tours

---

## 8. Custom CMS Requirements

### 8.1 Principles

- Non-technical staff must be able to manage all website content without developer help
- All destructive actions (delete) require a confirmation prompt
- All forms auto-save drafts (localStorage fallback) to prevent data loss
- Feedback on every action: success toasts, error messages, loading states
- Mobile-accessible (tablet at minimum — admin may be used on iPad)

### 8.2 Module 1: Tour Management

**Tour List View:**
- Table: Title | Category | Duration | Price | Status | Last Updated | Actions
- Search by title, filter by category and status
- Quick status toggle (Draft ↔ Published)
- Duplicate tour action

**Tour Create/Edit — Tabs:**

**Basic Info Tab:**
- Title (plain text → auto-generates slug)
- Slug (editable, unique validation)
- Category (single select: Trekking, Cultural, Adventure, Wildlife, Helicopter, Pilgrimage, Luxury, Honeymoon, Family)
- Short description (150 char limit — used in tour cards)
- Full overview description (TipTap rich text editor)
- Highlights (repeatable plain text fields — bullet list on frontend)
- Status: Draft / Published / Archived
- Featured toggle (appears in homepage featured section)

**Pricing Tab:**
- Base price per person (USD)
- Optional pricing tiers table (Solo / 2 pax / 3–5 pax / 6–9 pax / 10+ pax)
- Price includes (repeatable text fields)
- Price excludes (repeatable text fields)

**Itinerary Tab:**
- Day-by-day builder (add/remove/reorder days via drag-and-drop)
- Each day entry: Day number (auto), Title, Description (textarea), Start location, End location, Altitude (m), Accommodation, Meals (B/L/D checkboxes), Distance (km), Walk time (hrs), Optional notes

**Trip Info Tab:**
- Duration: days, nights
- Maximum group size
- Minimum group size
- Difficulty: Easy / Moderate / Strenuous / Challenging (visual picker)
- Maximum altitude (m)
- Best months (multi-select — month checkboxes, visually styled)
- Start point, End point
- Accommodation type(s) (Tea house / Guesthouse / Hotel / Lodge / Camping)
- Transport details
- Minimum age
- Guide info / guide language

**Media Tab:**
- Featured image (Cloudinary upload widget)
- Gallery images (multi-upload, drag to reorder, delete individual)
- Map image upload (optional — static image of trekking route)
- Video URL (YouTube or Vimeo embed)

**FAQs Tab:**
- Add / edit / delete FAQ items (question + answer)
- Drag to reorder

**SEO Tab:**
- SEO title (character counter, 60 max)
- Meta description (character counter, 160 max)
- Open Graph image (separate from featured image — optional)
- Canonical URL (auto-set to `/tours/:slug`, overridable)
- Preview of how the page appears in Google search results (live preview snippet)

### 8.3 Module 2: Destination Management

Fields: Name, slug, short description, full description (rich text), hero image, gallery images, best time to visit (rich text or structured month selector), getting there (rich text), tips (rich text), status, SEO tab (same pattern as tours).

### 8.4 Module 3: Blog Management

- Title, slug, excerpt (160 chars), full body (TipTap rich text)
- Cover image
- Author (select from admin users)
- Category (select from blog categories)
- Tags (comma-separated)
- Status: Draft / Published / Scheduled
- Scheduled publish date/time
- SEO tab

### 8.5 Module 4: Inquiry Management

- Table: Name | Email | Type | Tour (if applicable) | Status | Date
- Filter by status, type (standard / custom_trip), date range
- Detail view: all submitted fields, internal admin notes, status dropdown
- Status: New → In Progress → Responded → Closed
- Admin notes field (internal, not shown to user)

### 8.6 Module 5: Review Management

- Add reviews manually (from TripAdvisor, Google, emails)
- Fields: Reviewer name, country, star rating (1–5), trip name (optional link to tour), review text, date, source (TripAdvisor / Google / Direct), reviewer photo (optional)
- Featured toggle — featured reviews appear on homepage and tour pages
- Hide/show toggle
- Delete

### 8.7 Module 6: Media Library

- Upload images (multi-file drag-and-drop → Cloudinary)
- View all uploaded assets in a grid
- Per-image: alt text (editable), Cloudinary URL (copy button), tags, delete
- Search by filename or tag
- Used-in reference (which tours/posts reference this image — Phase 2 enhancement)

### 8.8 Module 7: Homepage Builder

Visual manager for the homepage:
- Toggle each section on/off
- Reorder sections (drag-and-drop)
- **Hero:** edit headline, subheadline, CTA text + link, background image/video
- **Featured Tours:** select which tours to feature (searchable multi-select, max 8)
- **Why Choose Us:** edit each card's icon, title, description (up to 6 cards)
- **Stats:** edit each stat's number and label (up to 6 stats)
- **Certification Logos:** upload/remove partner/certification logos

### 8.9 Module 8: Navigation Manager

- Edit primary navigation links: label, URL, order, open-in-new-tab
- Edit mega-menu: which categories show, optional featured tour card in dropdown
- Edit footer columns: column title, links (label + URL) per column
- Edit social media links (Facebook, Instagram, TripAdvisor, YouTube, LinkedIn)

### 8.10 Module 9: Settings

**General Tab:** Site title, tagline, contact email, phone numbers (multiple), WhatsApp number, physical address, Google Maps embed URL, business registration number

**SEO Tab:** Default SEO title template (e.g., `%page_title% | Dream International Travel`), default meta description, default OG image, Google Analytics measurement ID, Google Search Console verification tag

**Social Tab:** All social media profile URLs

### 8.11 Module 10: User Management (Super Admin Only)

- Invite new admin users by email
- Roles: **Super Admin** (full access including users and settings) / **Admin** (tours, destinations, blog, inquiries, reviews, media) / **Editor** (tours and blog only, no inquiry/settings access)
- Edit name, role
- Deactivate (soft delete) users
- View last login date

### 8.12 CMS Dashboard (Overview Page)

- Recent inquiries count (last 7 days, last 30 days)
- New inquiries today (with quick link to inquiries list)
- Total published tours, destinations, blog posts
- Simple bar chart: inquiries per week (last 8 weeks)
- Quick-action buttons: New Tour, New Blog Post, View Inquiries

---

## 9. Database Schema Overview

### Tables (Prisma)

```prisma
model Tour {
  id                String           @id @default(cuid())
  slug              String           @unique
  title             String
  shortDescription  String
  description       String           // HTML from rich text editor
  highlights        String[]         // array of plain text bullet strings
  categoryId        String
  category          Category         @relation(fields: [categoryId], references: [id])
  status            TourStatus       @default(DRAFT) // DRAFT | PUBLISHED | ARCHIVED
  isFeatured        Boolean          @default(false)
  basePrice         Float
  pricingTiers      Json?            // [{label, minPax, maxPax, price}]
  priceIncludes     String[]
  priceExcludes     String[]
  durationDays      Int
  durationNights    Int
  difficulty        Difficulty       // EASY | MODERATE | STRENUOUS | CHALLENGING
  maxAltitude       Int?
  groupSizeMin      Int?
  groupSizeMax      Int?
  minAge            Int?
  startPoint        String?
  endPoint          String?
  accommodationTypes String[]
  bestMonths        Int[]            // 1-12
  featuredImageUrl  String?
  featuredImageAlt  String?
  galleryImages     Json?            // [{url, alt}]
  mapImageUrl       String?
  videoUrl          String?
  seoTitle          String?
  seoDescription    String?
  ogImageUrl        String?
  canonicalUrl      String?
  itineraryDays     ItineraryDay[]
  faqs              TourFAQ[]
  reviews           Review[]
  inquiries         Inquiry[]
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  publishedAt       DateTime?
}

model ItineraryDay {
  id             String   @id @default(cuid())
  tourId         String
  tour           Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  dayNumber      Int
  title          String
  description    String
  startLocation  String?
  endLocation    String?
  altitudeM      Int?
  accommodation  String?
  mealsIncluded  Json?    // {breakfast, lunch, dinner}
  distanceKm     Float?
  walkTimeHrs    Float?
  notes          String?
  order          Int
}

model TourFAQ {
  id       String @id @default(cuid())
  tourId   String
  tour     Tour   @relation(fields: [tourId], references: [id], onDelete: Cascade)
  question String
  answer   String
  order    Int
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  type        String   // 'tour' | 'blog'
  icon        String?
  description String?
  order       Int      @default(0)
  tours       Tour[]
}

model Destination {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  shortDescription String
  description     String   // HTML
  heroImageUrl    String?
  heroImageAlt    String?
  galleryImages   Json?
  bestTimeToVisit String?  // HTML
  gettingThere    String?  // HTML
  tips            String?  // HTML
  status          String   @default("DRAFT")
  seoTitle        String?
  seoDescription  String?
  ogImageUrl      String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model BlogPost {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  excerpt     String
  content     String    // HTML from rich text
  coverImageUrl String?
  coverImageAlt String?
  authorId    String
  author      AdminUser @relation(fields: [authorId], references: [id])
  categoryId  String?
  tags        String[]
  status      String    @default("DRAFT") // DRAFT | PUBLISHED | SCHEDULED
  scheduledAt DateTime?
  seoTitle    String?
  seoDescription String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?
}

model Inquiry {
  id            String      @id @default(cuid())
  type          InquiryType // STANDARD | CUSTOM_TRIP
  tourId        String?
  tour          Tour?       @relation(fields: [tourId], references: [id])
  name          String
  email         String
  phone         String?
  nationality   String?
  travelDates   String?
  groupSize     Int?
  customDetails Json?       // full custom trip wizard data
  message       String?
  status        String      @default("NEW") // NEW | IN_PROGRESS | RESPONDED | CLOSED
  assignedToId  String?
  internalNotes String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Review {
  id             String   @id @default(cuid())
  reviewerName   String
  reviewerCountry String?
  reviewerPhoto  String?
  tourId         String?
  tour           Tour?    @relation(fields: [tourId], references: [id])
  rating         Int      // 1-5
  reviewText     String
  source         String   // TRIPADVISOR | GOOGLE | DIRECT
  sourceUrl      String?
  isFeatured     Boolean  @default(false)
  isVisible      Boolean  @default(true)
  reviewDate     DateTime?
  createdAt      DateTime @default(now())
}

model MediaAsset {
  id            String   @id @default(cuid())
  cloudinaryId  String   @unique
  url           String
  fileName      String
  altText       String?
  caption       String?
  tags          String[]
  width         Int?
  height        Int?
  mimeType      String?
  createdAt     DateTime @default(now())
}

model AdminUser {
  id          String     @id @default(cuid())
  email       String     @unique
  passwordHash String
  name        String
  role        AdminRole  // SUPER_ADMIN | ADMIN | EDITOR
  isActive    Boolean    @default(true)
  lastLoginAt DateTime?
  createdAt   DateTime   @default(now())
  blogPosts   BlogPost[]
}

model Setting {
  key       String @id
  value     String
  type      String @default("string") // string | json | boolean | number
  updatedAt DateTime @updatedAt
}

enum TourStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum Difficulty {
  EASY
  MODERATE
  STRENUOUS
  CHALLENGING
}

enum InquiryType {
  STANDARD
  CUSTOM_TRIP
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  EDITOR
}
```

---

## 10. Inquiry System

### 10.1 Standard Inquiry Flow

```
User fills inquiry form (tour page sidebar or contact page)
  ↓
POST /api/inquiries — Zod validation
  ↓
Saved to Inquiries table (status: NEW)
  ↓
Nodemailer: confirmation email → user
Nodemailer: notification email → admin (contact email from Settings)
  ↓
Admin sees in CMS → updates status, adds internal notes
```

### 10.2 Custom Trip Inquiry Flow

```
User completes 5-step wizard at /custom-trip
  ↓
POST /api/inquiries (type: CUSTOM_TRIP, customDetails: JSON of all wizard answers)
  ↓
Saved to Inquiries table
  ↓
Confirmation email → user
Notification email → admin (with full wizard details formatted)
  ↓
Admin follows up by email or phone
```

### 10.3 Email Templates

| Template | Trigger | Recipient |
|---|---|---|
| Inquiry received | Standard inquiry submitted | User (confirmation) |
| New inquiry alert | Standard inquiry submitted | Admin |
| Custom trip received | Custom trip wizard submitted | User (confirmation) |
| New custom trip alert | Custom trip wizard submitted | Admin (formatted details) |

---

## 11. SEO Infrastructure

**Our responsibility:** Build the technical foundation so the site is indexable and SEO-friendly. Content strategy and keyword targeting are the client's responsibility.

### 11.1 Technical SEO — What We Build

- **React Helmet Async** on every page for dynamic `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags, Twitter Card tags
- **Per-page meta** driven by CMS SEO fields (with fallback to site-wide defaults from Settings)
- **XML Sitemap** — Express endpoint at `/sitemap.xml` dynamically queries DB and returns valid XML including all published tours, destinations, and blog posts
- **robots.txt** — served at `/robots.txt` (allow all public routes, disallow `/admin`, `/api`)
- **JSON-LD Structured Data** (inline `<script type="application/ld+json">`) on:
  - Tour pages: `TouristTrip` schema
  - Tour FAQ sections: `FAQPage` schema
  - All pages: `BreadcrumbList` schema
  - Homepage: `Organization` schema
  - Blog posts: `BlogPosting` schema
- **Semantic HTML** throughout: correct heading hierarchy (one `<h1>` per page), `<article>`, `<nav>`, `<main>`, `<section>` landmarks
- **Image alt text** enforced in media library (required field)
- **Clean URL structure** — slugs only, no query string IDs on public pages
- **Canonical URLs** auto-set per page
- **301 redirects** — handled in Express for any old URLs if needed

### 11.2 What We Do NOT Do

- Keyword research and targeting
- Content writing or rewriting for SEO
- Backlink strategy
- Google Search Console monitoring and ongoing optimization
- Blog content calendar
- Meta tags written for marketing copywriting purposes (we set the fields; they fill them)

---

## 12. Performance & Infrastructure

### 12.1 Performance Targets

| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to First Byte (TTFB) | < 600ms |
| Lighthouse Performance Score (Mobile) | ≥ 80 |

### 12.2 Performance Strategies

- Vite production build: code splitting per route, tree shaking, minification
- All images served via Cloudinary CDN with transformation URLs (auto-resize, auto-format WebP, quality optimization)
- `loading="lazy"` on all below-fold images
- Swiper/AOS from Tourm template — audit for bundle size; replace heavy deps with lightweight alternatives if needed
- Cloudflare in front of hosting — caches static assets, HTML for public routes
- Express response compression (`compression` middleware)
- React lazy + Suspense for admin panel code (admin JS not loaded for public visitors)

### 12.3 Infrastructure

- **Single server** hosts both the Express API and serves the React build (`dist/`) as static files
- **Environment separation:** Development (local + Neon dev branch), Production (hosting platform + Neon production branch)
- **Neon branching** used to keep dev DB isolated from production
- Automated deploy on push to `main` branch

---

## 13. Security Requirements

- All `/admin` React routes redirect to `/admin/login` if no valid JWT in localStorage
- All `/api/admin/*` and admin-only API routes verify JWT via middleware before any handler runs — no client-side-only protection
- Passwords hashed with bcrypt (min 12 rounds)
- JWT signed with strong secret, expiry of 8 hours, refresh token pattern optional
- Rate limiting on login endpoint (5 attempts per 15 minutes per IP — `express-rate-limit`)
- Rate limiting on public inquiry submission (10 per hour per IP)
- Zod validation on all POST/PUT API endpoints — reject unknown fields
- `helmet.js` middleware on Express — sets security headers (CSP, X-Frame-Options, etc.)
- CORS configured to allow only the frontend origin
- `express-mongo-sanitize`-equivalent for Postgres (not needed with Prisma parameterized queries — Prisma handles injection prevention)
- Cloudinary upload signed with server-side signature (no unsigned uploads)
- All secrets in environment variables — never in source code

---

## 14. Design System & UI Guidelines

### 14.1 Brand Direction

- **Primary Color:** To be confirmed with client. Suggested: Deep Himalayan Blue (`#1B4F8A`) or Forest Green (`#2E7D32`)
- **Accent Color:** Warm Amber/Gold (`#F59E0B`) — evokes Nepali culture, mountain sunrise
- **Neutrals:** Slate grays for body text, warm off-white backgrounds
- **Typography:** Inter or Plus Jakarta Sans (body), slightly heavier weight for headings
- **Photography:** High-quality landscape and adventure photography (mountains, temples, treks, wildlife, people)
- **Iconography:** Lucide React or Heroicons — consistent across categories and trip facts

### 14.2 Tourm Template Usage Strategy

The Tourm template provides the visual foundation. We will:
- **Reuse directly:** Hero slider, tour card layout, mega-menu structure, footer, animation system (AOS/Swiper)
- **Extend:** Tour detail page (add itinerary accordion, map, FAQ, sticky sidebar), custom trip wizard, admin panel
- **Replace:** Any placeholder content, dummy images, links — replaced with real CMS data
- **Add:** WhatsApp floating button, breadcrumbs, JSON-LD script injection, custom filter bar

### 14.3 Component Inventory (Key Components)

| Component | Source | Notes |
|---|---|---|
| HeroSlider | Tourm (Swiper.js) | CMS-driven images + text |
| TourCard | Tourm (adapted) | + ribbon badges |
| CategoryGrid | New | Icon + label + link |
| MegaMenu | Tourm (adapted) | CMS-driven links |
| ItineraryAccordion | New | Day-by-day, expandable |
| StickyBookingSidebar | New | Price + inquiry CTA |
| GalleryLightbox | New (yet to pick: Photoswipe / GLightbox) | Lazy loaded |
| ReviewCard | Tourm (adapted) | Star rating, country flag |
| CustomTripWizard | New | 5-step multi-page form |
| WhatsAppFAB | New | Floating action button |
| BreadcrumbTrail | New | Schema markup included |
| TipTapEditor | New (admin only) | Rich text, admin panel |
| MediaUploader | New (admin only) | Cloudinary integration |
| DragSortList | New (admin only) | Itinerary day reordering |

### 14.4 Responsive Breakpoints

- Mobile: 375px – 767px
- Tablet: 768px – 1023px
- Desktop: 1024px – 1439px
- Wide: 1440px+

---

## 15. Content Requirements

### 15.1 Initial Launch Content (Client Provides)

**Tours:** Minimum 15 tours at launch:
- Trekking: 6 (Everest Base Camp, Annapurna Circuit, Annapurna Base Camp, Langtang, Gokyo Lakes, Poon Hill)
- Cultural: 3 (Kathmandu Valley, Muktinath, Lumbini)
- Helicopter: 2 (EBC Helicopter, Annapurna Helicopter)
- Wildlife: 2 (Chitwan, Bardia)
- Adventure / Pilgrimage: 2

**Destinations:** 6 destination pages (Kathmandu, Pokhara, Chitwan, Everest Region, Annapurna Region, Langtang)  
**Reviews:** 8–10 reviews at launch  
**Team:** Minimum 3 team member profiles  
**Blog:** CMS ready at launch; initial posts optional  

### 15.2 Content Responsibility Split

| Content | Our Responsibility | Client Responsibility |
|---|---|---|
| CMS ready for all content | ✅ Build and configure | |
| SEO field structure | ✅ Build the fields | ✅ Fill in title, description |
| Tour descriptions & itineraries | | ✅ Provide text |
| Photography / images | | ✅ Provide (we use stock placeholders during dev) |
| Blog posts | | ✅ Write and publish via CMS |
| Reviews | | ✅ Add via CMS review module |

---

## 16. Integrations & Third-Party Services

| Service | Purpose | Priority |
|---|---|---|
| Cloudinary | Image upload, CDN, transformation | P0 — Required |
| Neon | Serverless PostgreSQL database | P0 — Required |
| Nodemailer + SMTP | Transactional emails (inquiry notifications) | P0 — Required |
| Google Analytics 4 | Traffic analytics — GA ID entered in CMS settings | P1 |
| Cloudflare | DNS, CDN, HTTPS, caching | P1 |
| Leaflet.js | Trek route maps on tour pages | P1 |
| TripAdvisor Widget | Review credibility embed | P2 — if client has listing |
| WhatsApp Business | Floating contact button | P1 |
| Google Maps (embed) | Contact page office location | P1 |
| Sentry | Frontend + backend error monitoring | P2 |

---

## 17. Development Phases & Milestones

### Phase 0 — Foundation (Week 1–2)

- Repository setup: Vite + React + Tailwind + React Router + ESLint + Prettier
- Express.js server setup + Prisma + Neon connection
- Neon database provisioned — dev branch and prod branch
- Prisma schema written + initial migration run
- JWT auth middleware implemented
- Cloudinary account configured
- Tourm template assets audited: identify which components to reuse, which to replace
- Design tokens defined in Tailwind config (brand colors, fonts)
- Environment configuration (dev `.env`, staging, prod)
- GitHub repo + CI/CD pipeline connected to hosting platform

### Phase 1 — Frontend Public Site (Weeks 3–7)

- Homepage — all 10 sections, connected to API
- Tour listing page + filter system
- Tour detail page — full layout with all tabs (overview, itinerary, includes/excludes, map, gallery, FAQ, reviews, sticky sidebar)
- Destination listing + individual destination pages
- Plan Your Trip static pages
- Blog listing + individual blog post pages
- About, Team, Reviews, Gallery, Contact pages
- Custom trip inquiry wizard (`/custom-trip`)
- Navigation: desktop mega-menu + mobile hamburger
- Footer
- WhatsApp floating button
- Breadcrumbs
- React Helmet Async meta tags (all routes)
- 404 page

### Phase 2 — Backend API (Weeks 4–7, parallel with Phase 1)

- All public API endpoints (tours, destinations, blog, categories, reviews, settings, navigation, homepage config)
- Inquiry submission endpoints (standard + custom trip)
- Nodemailer email sending (inquiry confirmation + admin notification)
- Admin auth endpoints (login, logout, me)
- All admin CRUD endpoints (tours, destinations, blog, reviews, media, settings)
- Zod validation on all endpoints
- Rate limiting + Helmet security headers
- Sitemap XML endpoint
- robots.txt endpoint
- JSON-LD generation helpers

### Phase 3 — CMS Admin Panel (Weeks 6–10)

- Admin login page + JWT storage + protected route wrapper
- Dashboard overview page
- Tour management (list, create, edit — all tabs)
- Destination management
- Blog management
- Inquiry management (list + detail + status update)
- Review management
- Media library (Cloudinary upload + grid view)
- Homepage builder
- Navigation manager
- Settings modules
- User management (Super Admin)
- TipTap rich text editor integration

### Phase 4 — Integration, Polish & Testing (Weeks 11–12)

- End-to-end flow testing: inquiry submission → email → CMS
- CMS publish flow: create tour → publish → appears on frontend
- Cross-browser testing (Chrome, Safari, Firefox, Edge — desktop and mobile)
- Mobile device testing (iPhone SE, iPhone 14, Samsung Galaxy S series)
- Lighthouse audit on 5 key pages — optimize to targets
- Security pass: verify all admin endpoints reject unauthenticated requests
- Error states and loading states on all data-fetching components
- Empty states (no tours, no blog posts, etc.)
- Image alt text on all template images

### Phase 5 — Content Entry & Launch (Weeks 13–14)

- Client enters initial content via CMS (with dev support for first tour)
- CMS training session with client staff
- DNS configuration (Cloudflare)
- Production environment variables set
- Final production deploy
- Google Analytics ID added in CMS settings
- Sitemap submitted to Google Search Console (client manages going forward)
- Go-live

---

## 18. Out of Scope

- Payment integration of any kind (no eSewa, Khalti, Stripe, etc.)
- Customer-facing login / customer portal
- Newsletter or email marketing
- Live chat or AI chatbot
- Mobile app (iOS / Android)
- Real-time hotel or flight booking
- OTA integration or channel manager
- Multilingual / translation (English only for V1)
- Affiliate or referral system
- B2B agent portal
- Comment system on blog
- Ongoing SEO, content writing, or keyword strategy

---

## 19. Open Questions & Decisions Required

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | Final brand colors and logo — needed before Phase 1 design work | Client | P0 |
| 2 | Admin panel template — which one is the client providing? (Tabler, Metronic, AdminLTE, other?) Determines admin UI approach | Client | P0 |
| 3 | Hosting platform preference — Railway, Render, Fly.io, or other? | Client + Dev | P0 |
| 4 | SMTP provider for emails — does client have a business email (e.g., info@dreamitnepal.com) + SMTP credentials? | Client | P0 |
| 5 | WhatsApp number — confirm the business WhatsApp number for the floating button | Client | P1 |
| 6 | Does client have an active TripAdvisor listing (required for TripAdvisor widget)? | Client | P1 |
| 7 | Fixed departure dates — are any tours sold on fixed group departure dates, or is everything custom/inquiry-based? | Client | P1 |
| 8 | Map approach — does client want Leaflet route maps drawn per tour, or static map images uploaded per tour? Drawn maps require GPS coordinates per tour | Client + Dev | P1 |
| 9 | Who enters the initial 15 tours into the CMS? Client team, or do we assist? | Client | P1 |
| 10 | Does client have photography assets ready? Or do we use Unsplash/stock for initial launch? | Client | P1 |
| 11 | Business domain name — confirmed and registered? | Client | P0 |

---

*End of PRD v2.0 — Dream International Travel and Tours*

*Agreed-upon scope: Working website with full custom CMS. SEO infrastructure built in; content and content marketing is client's domain. No payment integration. No newsletter. No live chat.*
