# Architecture Decisions (ADR-lite)

This document freezes key implementation decisions required before development starts.

## Decision Index

- `AD-001` Data model: Tour-Destination relation and category strategy
- `AD-002` Slug lifecycle and redirect policy
- `AD-003` SEO rendering strategy for high-value pages
- `AD-004` Authentication/session storage and security controls
- `AD-005` Admin audit logging and account recovery
- `AD-006` Operations baseline: monitoring, backup/restore, failure behavior
- `AD-007` Compliance baseline: consent, retention, and privacy operations

---

## AD-001 Data Model Freeze

### Decision
- Implement explicit many-to-many relation between `Tour` and `Destination`.
- Keep categories DB-driven using the existing `Category` table with `type` discriminator.
- Preserve role and status enums as explicit Prisma enums where already defined.

### Rationale
- PRD requires destination pages to show related tours; a normalized relation is required.
- DB-driven categories support future additions/reordering without code deploy.
- Enum usage for stable internal states keeps validation and access rules strict.

### Schema updates

- Add junction table model:
  - `TourDestination { tourId, destinationId, createdAt }`
  - Composite unique key on `(tourId, destinationId)`
- Add relation arrays:
  - `Tour.destinations TourDestination[]`
  - `Destination.tours TourDestination[]`
- Add index recommendations:
  - `Tour(status, categoryId, publishedAt)`
  - `Destination(status, updatedAt)`
  - `BlogPost(status, scheduledAt, publishedAt)`

### Constraints
- A published tour must have at least one destination assigned.
- Deleting a destination with linked published tours is blocked unless tours are reassigned or unpublished.
- Category slugs are unique per `type` namespace.

---

## AD-002 Slug and Redirect Policy

### Decision
- Slugs are unique within each entity table (`Tour`, `Destination`, `BlogPost`, `Category`).
- Slug changes are allowed in CMS but always generate permanent redirects from old path to new path.

### Rationale
- Editors need controlled correction ability.
- Redirect history preserves SEO equity and avoids broken inbound links.

### Implementation
- Create `Redirect` table:
  - `id`, `entityType`, `entityId`, `fromPath`, `toPath`, `statusCode`, `isActive`, `createdAt`
- On slug update:
  - previous canonical path inserted as active redirect (`301`)
  - redirect chain is flattened so old paths point directly to latest canonical path
- Public route middleware resolves redirects before 404 handling.

### Rules
- No redirect loops allowed (enforced at write time).
- Reserved paths cannot be used as slugs (`admin`, `api`, `sitemap.xml`, `robots.txt`).
- Slug format: lowercase, hyphen-separated ASCII, max 80 chars.

---

## AD-003 SEO Rendering Strategy

### Decision
- Use hybrid rendering:
  - CSR app for interactivity and CMS
  - Prerendered static HTML snapshots for SEO-critical public routes:
    - `/`
    - `/tours/:slug`
    - `/destinations/:slug`
    - `/blog/:slug`
- Keep Helmet-based runtime meta updates for non-prerendered routes and editor preview parity.

### Rationale
- Preserves existing React + Express architecture while improving crawl reliability and social card consistency.
- Lower implementation risk than full SSR migration at current project stage.

### Prerender policy
- Regenerate snapshots on publish/update/unpublish webhook events.
- Fallback regeneration nightly for safety.
- Prerender output stored with deployment artifacts and served by Express static layer.

### SEO rules
- Canonical is always the current slug URL.
- Paginated listings include canonical + rel prev/next.
- Non-canonical filter combinations on listing pages use self-canonical and remain indexable only for approved combinations.

---

## AD-004 Auth and Session Security

### Decision
- Use short-lived access JWT in `httpOnly`, `Secure`, `SameSite=Lax` cookie.
- Use rotating refresh token in `httpOnly`, `Secure`, `SameSite=Strict` cookie.
- Do not store auth tokens in `localStorage`.

### Rationale
- Reduces token theft risk from XSS compared with browser storage.
- Supports session continuity and explicit revocation.

### Session parameters
- Access token TTL: 15 minutes
- Refresh token TTL: 7 days
- Max concurrent sessions per admin: 5 (oldest revoked on exceed)
- Explicit logout revokes refresh token server-side.

### Required controls
- CSRF protection for state-changing requests (double-submit cookie or CSRF token header).
- Strong password policy:
  - minimum 12 chars
  - at least 1 uppercase, 1 lowercase, 1 number, 1 symbol
- Bcrypt cost factor: 12.
- Login rate limit: 5 attempts / 15 min / IP and soft lock per account after repeated failures.

---

## AD-005 Audit Logging and Account Recovery

### Decision
- Add immutable admin activity logging for all critical actions.
- Implement invite-based onboarding plus password reset flow with signed one-time tokens.

### Audit scope (minimum)
- Auth events: login success/failure, logout, token refresh, account lock/unlock.
- Content events: create/update/delete/publish/unpublish for tours, destinations, blog, reviews.
- Security events: role changes, user activation/deactivation, settings changes, failed authorization attempts.

### Audit record shape
- `AuditLog { id, actorUserId, action, entityType, entityId, beforeJson, afterJson, ip, userAgent, createdAt }`

### Recovery flow
- Invite token TTL: 48 hours
- Password reset token TTL: 30 minutes
- Token single-use enforced; all prior reset tokens invalidated on successful reset.

---

## AD-006 Operations and Failure Baseline

### Decision
- Adopt minimal production SRE baseline suitable for SMB launch.

### Monitoring
- Sentry for frontend and backend:
  - release tracking enabled
  - environment tags (`dev`, `staging`, `prod`)
  - alert channels to email + chat
- Healthcheck endpoint:
  - `/health/live` (process liveness)
  - `/health/ready` (DB and critical dependency readiness)

### Backup and recovery
- Database:
  - daily automated backup snapshots
  - point-in-time recovery enabled where provider supports it
- Targets:
  - `RPO <= 24h`
  - `RTO <= 4h`
- Quarterly restore drill in non-production.

### Failure mode requirements
- Email provider outage:
  - inquiry persists with `emailDeliveryStatus=FAILED`
  - admin dashboard shows retry queue
- Cloudinary outage:
  - uploads fail gracefully with retry option
  - existing images still served from cached/CDN URLs when available
- Prerender job failure:
  - previous snapshot remains active
  - incident logged and alert sent

---

## AD-007 Compliance and Privacy Baseline

### Decision
- Introduce lightweight consent and retention controls for inquiry PII.

### Form and consent requirements
- Inquiry forms must include:
  - privacy notice link
  - required checkbox confirming data processing consent
- Consent timestamp/version stored per inquiry.

### Retention and deletion
- Inquiry PII retention default: 24 months from creation.
- Auto-anonymization job runs monthly for expired records unless marked for legal/operational hold.
- Manual delete/anonymize tools available to super admin for valid requests.

### Cookie and analytics
- GA4 loads only after analytics consent in regions requiring consent.
- Essential cookies remain always enabled.

---

## Implementation Order (Mandatory)

1. Apply `AD-001` and `AD-002` before first production migration.
2. Apply `AD-004` and `AD-005` before enabling non-dev admin accounts.
3. Apply `AD-003` before SEO QA milestone.
4. Apply `AD-006` and `AD-007` before go-live checklist sign-off.

---

## Change Control

- Any change to these decisions requires:
  - impact note (scope, timeline, risk)
  - PRD section reference
  - sign-off by product owner and tech lead
