# Acceptance Criteria and Definition of Done

This document operationalizes PRD v2.0 into testable requirements for P0 and P1 workflows.

## Scope and Conventions

- Priority labels:
  - `P0`: launch blockers
  - `P1`: high-value for launch quality, can ship with controlled fallback if needed
- Status values:
  - `Pass`: all criteria met
  - `Fail`: one or more criteria unmet
- Error handling baseline:
  - user-visible error message
  - no uncaught exceptions in browser console or server logs for expected invalid input

## P0 Workflows

## AC-001 Standard Inquiry Submission (`P0`)

### Given
- A public user opens a tour detail page or contact page.
- Inquiry form fields are visible and enabled.

### When
- User submits a valid inquiry payload.

### Then
- API returns success response in under 2 seconds (excluding third-party email latency).
- A new `Inquiry` record is created with:
  - `type=STANDARD`
  - `status=NEW`
  - submitted fields persisted accurately
- Confirmation email is queued/sent to user email.
- Notification email is queued/sent to admin contact email.
- UI shows success feedback and clears form (or keeps a read-only summary state).

### Negative criteria
- Invalid payload returns `400` with field-level validation errors.
- Rate-limited requests return `429` with retry guidance.
- Failed email send does not lose inquiry data; inquiry remains saved and failure is logged.

## AC-002 Custom Trip Wizard Submission (`P0`)

### Given
- User opens `/custom-trip`.
- Multi-step wizard state is persisted locally while filling.

### When
- User completes all required steps and submits valid data.

### Then
- API creates `Inquiry` with:
  - `type=CUSTOM_TRIP`
  - `customDetails` containing all step answers
  - `status=NEW`
- User receives confirmation message.
- Admin receives custom-trip notification with formatted details.
- User can refresh mid-flow without losing entered data until submission or manual reset.

### Negative criteria
- Attempt to submit with missing required fields blocks progression and shows inline errors.
- Server-side validation rejects unknown or malformed fields.

## AC-003 Admin Authentication and Access Control (`P0`)

### Given
- Admin route is requested by unauthenticated user.

### When
- User tries to access `/admin/*` except `/admin/login`.

### Then
- Frontend redirects to `/admin/login`.
- No privileged data is rendered before auth state is verified.

### API authorization criteria
- All admin-protected endpoints reject missing/invalid credentials with `401`.
- Authenticated user without role permission receives `403`.
- Permission matrix is enforced for `SUPER_ADMIN`, `ADMIN`, and `EDITOR`.

## AC-004 Tour Publish/Unpublish Flow (`P0`)

### Given
- Admin opens tour edit view with valid permissions.

### When
- Admin changes status (`DRAFT` <-> `PUBLISHED` or `ARCHIVED`) and saves.

### Then
- Update persists with `updatedAt` change.
- `publishedAt` is set on first publish and remains non-null thereafter.
- Public listing/detail endpoints only expose `PUBLISHED` tours by default.
- Unpublished tours are not visible on public pages or sitemap.

## AC-005 Media Upload to Cloudinary (`P0`)

### Given
- Authenticated admin opens media uploader.

### When
- Admin uploads a valid image file.

### Then
- File is uploaded via signed flow.
- Asset metadata is stored in `MediaAsset`.
- Returned URL is immediately reusable in CMS forms.
- Alt text is required before asset is considered publish-ready in content modules.

### Negative criteria
- Unsupported type or oversized file is rejected with explicit message.
- Failed Cloudinary upload does not create orphan DB records.

## AC-006 SEO Metadata Rendering (`P0`)

### Given
- Public page has entity-specific SEO fields configured.

### When
- Page is requested directly via route URL.

### Then
- Response includes correct:
  - `<title>`
  - meta description
  - canonical tag
  - OG/Twitter tags
- Fallback to global defaults occurs when page-specific values are absent.
- Only one `<h1>` exists in main content area.

## AC-007 Sitemap and Robots (`P0`)

### Given
- Published tours, destinations, and blog posts exist.

### When
- `GET /sitemap.xml` is called.

### Then
- Valid XML is returned with only published and canonical URLs.
- URLs reflect current slugs.
- Non-public/admin routes are excluded.

### robots criteria
- `GET /robots.txt` returns allow rules for public routes and disallow for `/admin` and private API surfaces.

## AC-008 Role-Based Endpoint Blocking (`P0`)

### Given
- An authenticated user with insufficient role permissions.

### When
- User calls a restricted endpoint (for example user management as non-super-admin).

### Then
- API returns `403`.
- No partial write occurs.
- Audit log captures denied attempt metadata (user, action, timestamp).

## P1 Workflows

## AC-009 Homepage Builder Controls (`P1`)

### Given
- Admin opens homepage builder.

### When
- Admin toggles section visibility and reorders sections.

### Then
- Configuration persists.
- Public homepage reflects changes without code deployment.
- Disabled sections are not rendered in HTML output.

## AC-010 Navigation Manager (`P1`)

### Given
- Admin edits primary nav, mega-menu, footer links, and social links.

### When
- Changes are saved.

### Then
- Navigation data persists and appears on public UI.
- Invalid URLs are rejected.
- Ordering is deterministic and stable.

## AC-011 Blog Scheduling (`P1`)

### Given
- Blog post has `status=SCHEDULED` and future `scheduledAt`.

### When
- Current time passes `scheduledAt`.

### Then
- Post becomes publicly visible as published without manual intervention.
- `publishedAt` is set at transition.
- Before scheduled time, post is not returned by public endpoints.

## AC-012 Review Visibility and Featuring (`P1`)

### Given
- Admin updates review `isVisible` and `isFeatured`.

### When
- Public pages request review data.

### Then
- Hidden reviews never appear publicly.
- Featured reviews appear in designated homepage/tour blocks.
- Aggregate rating calculations use visible reviews only.

## AC-013 Tour Filters and Sort (`P1`)

### Given
- Tour listing has multiple categories, durations, difficulties, and prices.

### When
- User applies filters and sort options.

### Then
- URL query reflects current state.
- Reloading preserves selected filters from URL.
- Result set matches filter criteria exactly.
- Empty state appears when no records match.

## AC-014 CMS Draft Autosave (`P1`)

### Given
- Admin is editing long-form content.

### When
- Browser refreshes or temporary network issue occurs before explicit save.

### Then
- Local draft is recoverable.
- Admin can restore or discard recovered draft.
- Recovery never overwrites newer server version without confirmation.

## Release Definition of Done (DoD)

A release candidate is considered done only when all items below are true:

1. All `P0` acceptance criteria pass in staging.
2. No critical/high security findings remain open.
3. Lighthouse mobile score >= 80 on key templates (Home, Tour Detail, Blog Detail).
4. Admin role permissions validated for all protected endpoints.
5. Sitemap, robots, canonical tags, and JSON-LD validated on representative pages.
6. Inquiry flows validated end-to-end including email success and email failure fallback behavior.
7. Backup restore drill completed at least once in non-production environment.
8. QA sign-off and business sign-off recorded.
