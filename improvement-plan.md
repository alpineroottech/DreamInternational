# Improvement Plan — Dream International Travel & Tours

## Prioritization key
- **P0**: Blockers / security / data loss — fix before release
- **P1**: Major UX or functional bugs — fix this sprint
- **P2**: Minor issues — schedule
- **P3**: Cosmetic / suggestions — backlog

## P0 — Immediate
| # | Finding | Fix approach | Effort | Owner suggestion |
|---|---------|--------------|--------|------------------|
| 1 | Activities mega menu 404 | Pass `market: 'activities'` + `isActivity` flag; build `/activities/:slug` links | Done | Frontend |
| 2 | Neon DB connection drops | Verify `DATABASE_URL`, pool settings, Neon project sleep/wake; add retry in dev | 2–4h | Backend |

## P1 — This sprint
| # | Finding | Fix approach | Effort | Owner suggestion |
|---|---------|--------------|--------|------------------|
| 3 | Activities sidebar links to `/blog` | Remove demo sidebar or wire real activity filters | 3–5h | Frontend |
| 4 | International route placeholder images | Force generated SVG art; run DB clear script on prod | Done (code) + 15m deploy | Full-stack |
| 5 | Limited ticketing city lists | Expanded `ticketingCities.js` + CMS merge | Done | Frontend |
| 6 | Flight inquiry E2E untested | Manual test + optional API contract test | 1–2h | QA |

## P2 — Backlog
| # | Finding | Fix approach | Effort | Owner suggestion |
|---|---------|--------------|--------|------------------|
| 7 | Inconsistent activity URLs | Standardize on `/activities/:slug` everywhere | Done | Frontend |
| 8 | Demo home routes still public | Redirect to `/` or remove routes | 1h | Frontend |
| 9 | Activities sidebar placeholder counts | Remove or compute from CMS | 2h | Frontend |

## P3 — Nice to have
| # | Finding | Fix approach | Effort | Owner suggestion |
|---|---------|--------------|--------|------------------|
| 10 | More emoji coverage in route art | Expand `CITY_EMOJI` map | 1h | Frontend |
| 11 | Bulk flight route import | CSV/JSON importer for admin | 1–2 days | Backend |

## Recommended regression tests
1. **Mega menu activities**: For each published activity, assert mega-menu link href equals `/activities/{slug}`.
2. **Activity detail**: GET `/api/public/activities/{slug}` returns 200 for published slug.
3. **International ticketing image**: Assert card `img[src]` starts with `data:image/svg+xml` when `ticketType=international`.
4. **Flight enquiry cities**: Domestic form includes `Lukla`, `Ramechhap`; international form includes `Dubai`, `London`, `Sydney`.

## Suggested tooling
- Playwright smoke suite for header mega menus + ticketing enquiry form
- API contract tests for `/public/flight-inquiries` validation (empty body → 4xx)
- Optional visual regression on ticketing route cards
