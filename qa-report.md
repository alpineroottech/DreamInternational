# QA Report — Dream International Travel & Tours
**Date**: 2026-07-20  
**Environment**: Local API `http://localhost:4000` (health OK); frontend not fully browser-tested in this pass  
**Coverage summary**: 42/42 routes inventoried; API spot-checked (health 200); code-path review on Activities mega menu, Ticketing, and enquiry form

## Executive summary

The site has solid CMS-driven architecture, but two high-impact public flows had clear defects: **Activities mega-menu items linked to tour URLs** (causing “Activity not found”), and **international ticketing still showed stock placeholder images** despite generated route art being available. Both are addressed in this change set. Additional template leftovers on the Activities sidebar (filters linking to `/blog`) remain a usability issue. Local API database connectivity to Neon was intermittently unstable during testing, limiting live endpoint verification.

**Recommendation**: Ship after verifying Activities mega-menu clicks and international ticketing tiles on staging/production with a live DB.

## Inventory verified

### Routes (42 total)
| Route | Status | Notes |
|-------|--------|-------|
| `/activities` | Code-reviewed + fix applied | Listing works via CMS |
| `/activities/:slug` | Code-reviewed + fix applied | Detail route exists |
| `/ticketing/domestic` | Code-reviewed | Uses CMS flight routes |
| `/ticketing/international` | Code-reviewed + fix applied | Generated route images forced |
| `/tour`, `/international-holidays`, `/vehicle-rentals` | Code-reviewed | Mega menus use correct slug paths |
| Demo routes (`/home-tour`, etc.) | Not removed | Legacy template pages still routable |

### API endpoints (sample)
| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/api/health` | ✅ 200 | Verified live |
| GET | `/api/public/activities` | ⚠️ Partial | DB connection errors observed intermittently |
| GET | `/api/public/flight-routes` | ⚠️ Not fully verified | Used by ticketing pages |
| POST | `/api/public/flight-inquiries` | Code-reviewed | Form payload matches backend fields |

## Findings

### Blockers
- **[Blocker] Header / Activities mega menu — activity links open wrong URL —** Click any activity in mega menu (e.g. Paragliding in Pokhara) → lands on tour URL or wrong path → “Activity not found”. **Expected**: `/activities/{slug}`. **Actual**: `market` was `undefined` for activities, so `itemDetailPath` never built activity URLs. **Fixed** by passing `market: 'activities'` and `isActivity: true`.

### Major
- **[Major] Activities / sidebar filters —** All “Activity Type”, “Duration”, and operator sidebar links point to `/blog` instead of filtering activities. **Repro**: Open `/activities`, click any sidebar filter. **Expected**: filter activities. **Actual**: navigates to blog.
- **[Major] Ticketing / international listings —** International route tiles showed generic stock photos from CMS `imageUrl`. **Expected**: generated route artwork. **Fixed** via `resolveRouteImage()` ignoring CMS images for international routes + seed/import no longer sets intl images.
- **[Major] Backend / Neon DB —** Server logs show `Connection terminated unexpectedly` on Prisma queries during local dev. **Impact**: intermittent API failures, empty CMS data, false “not found” states.

### Minor
- **[Minor] Activities listing URLs —** Cards used `/activities-details?slug=` while router also supports `/activities/:slug`. Inconsistent but functional. **Fixed** to canonical slug path.
- **[Minor] Ticketing enquiry form —** Departure/destination lists were too short for real quoting. **Expanded** with comprehensive domestic/international city lists + CMS route merge.

### Cosmetic
- **[Cosmetic] Activities sidebar —** Duplicate “Duration” widget headings and placeholder counts (10), (6), etc. from theme demo.

### Suggestions
- **[Suggestion] Add Playwright smoke test** for mega-menu activity link hrefs.
- **[Suggestion] Remove or noindex legacy demo home routes** (`/home-tour`, `/home-agency`, `/home-yacht`).
- **[Suggestion] Run `node server/scripts/clear-intl-route-images.js`** once on production DB to clear stored placeholder URLs.

## Coverage gaps
- Full browser pass at 375/768/1280/1920px not completed (no Playwright run in this session).
- Admin CMS flows not tested (no credentials provided).
- Form submissions not end-to-end verified due to DB instability.
- Payment/checkout flows are template-only — not in client scope.

## What was checked (evidence)
- Traced `HeaderOne` → `MegaMenu` → `itemDetailPath` and confirmed `market: undefined` bug for activities.
- Verified router has `/activities/:slug` and detail page loads slug from `useParams`.
- Reviewed `TicketingRouteCard`, `routeImage.js`, and international image override logic.
- Reviewed `FlightBookingForm` city list expansion and dynamic route merge.
- Ran inventory discovery script (42 routes).
- Hit `/api/health` → HTTP 200.
