# North America Route Inventory

**Branch:** `audit/north-america-launch-readiness`  
**Audit date:** 2026-07-16  
**Auditor:** Copilot Coding Agent

---

## Legend

| Field | Values |
|---|---|
| Auth | `none` / `client` (localStorage guard) / `server` (server-enforced) |
| Lang coverage | `en` / `es` / `fr-CA` / `fr-FR` / `bilingual` / `English only` |
| Mobile | ✅ responsive / ⚠️ partial / ❌ not verified |
| Desktop | ✅ / ⚠️ / ❌ |
| Launch status | 🟢 ready / 🟡 conditional / 🔴 blocker / ⚪ out of scope |

---

## Public / Marketing Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Homepage | none | bilingual (en/es) | ✅ | ✅ | none | none | 🟢 | |
| `/about` | About Edunancial | none | English only | ✅ | ✅ | none | none | 🟡 | No es/fr-CA/fr-FR translation |
| `/our-story` | Origin/mission narrative | none | English only | ✅ | ✅ | none | none | 🟡 | No es/fr translation |
| `/origin-story` | Origin story variant | none | English only | ✅ | ✅ | none | none | ⚪ | Duplicate of /our-story |
| `/mission` | Mission statement | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/vision` | Vision statement | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/values` | Company values | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/philosophy` | Educational philosophy | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/why-edunancial` | Value proposition | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/features` | Platform features | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/team` | Team page | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/testimonials` | Social proof | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/success-stories` | Member success stories | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/blog` | Blog listing | none | English only | ✅ | ✅ | none | none | 🟡 | No content |
| `/contact` | Contact page | none | bilingual (en/es) | ✅ | ✅ | none | none | 🟢 | |
| `/faq` | Frequently asked questions | none | bilingual (en/es) | ✅ | ✅ | none | none | 🟢 | |
| `/help` | Help centre | none | English only | ✅ | ✅ | none | none | 🟡 | Placeholder content |
| `/search` | Site search | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/start` | Getting started CTA | none | English only | ✅ | ✅ | none | none | 🟡 | |

---

## Membership and Pricing Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/membership` | Membership overview | none | bilingual (en/es) with fr-CA/fr-FR support | ✅ | ✅ | none | none | 🟢 | |
| `/pricing` | Pricing comparison | none | bilingual (en/es) with fr-CA/fr-FR support | ✅ | ✅ | none | none | 🟢 | |
| `/plans` | Plans variant page | none | English only | ✅ | ✅ | none | none | 🟡 | Duplicate of /pricing |
| `/membership-terms` | Membership terms | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR variant |
| `/sponsor` | Sponsorship page | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/scholarships` | Scholarship info | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/corporate` | Corporate plans | none | English only | ✅ | ✅ | none | none | 🟡 | |

---

## Checkout and Payment Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/membership/checkout` | Square checkout initiation | none | English only | ✅ | ✅ | `/api/square/checkout` | Square | 🟡 | Disabled until `SQUARE_VERIFIED_CHECKOUT_ENABLED=true`; CSP fixed in this branch |
| `/checkout` | Generic checkout page | none | English only | ✅ | ✅ | none | none | ⚪ | Appears to be a placeholder/duplicate |
| `/cart` | Cart page | none | English only | ✅ | ✅ | none | none | ⚪ | Not wired to payment |
| `/payment/success` | Post-payment success | none | English only | ✅ | ✅ | none | Square (webhook) | 🟡 | No i18n; no plan confirmation display |
| `/payment/cancel` | Payment cancelled | none | English only | ✅ | ✅ | none | Square | 🟢 | Fixed: now returns to /pricing (was /books) |

---

## Account and Dashboard Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/login` | Member login | none (client guard) | English only | ✅ | ✅ | none | none | 🟡 | Auth is client-side localStorage — documented defect (owned by Agent 2) |
| `/register` | Member registration | none (client guard) | English only | ✅ | ✅ | none | none | 🟡 | Auth is client-side localStorage |
| `/forgot-password` | Password reset | none | English only | ✅ | ✅ | none | none | 🟡 | Client-side only; no server reset flow |
| `/verify-email` | Email verification | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/dashboard` | Member dashboard | client | English only | ✅ | ✅ | none | none | 🟡 | Blocked in robots.txt; client auth only |
| `/account` | Account page | client | English only | ✅ | ✅ | none | none | 🟡 | Not blocked in robots.txt (fixed) |
| `/profile` | Public profile redirect | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/settings` | Account settings | client | English only | ✅ | ✅ | none | none | 🟡 | Not blocked in robots.txt (fixed) |
| `/member/billing` | Billing centre | client | English only | ✅ | ✅ | none | Square | 🟡 | Placeholder content; not blocked in robots.txt (fixed) |
| `/member/profile` | Member profile | client | English only | ✅ | ✅ | none | none | 🟡 | Fixed in robots.txt |
| `/member/settings` | Member settings | client | English only | ✅ | ✅ | none | none | 🟡 | Fixed in robots.txt |
| `/member/subscription` | Subscription management | client | English only | ✅ | ✅ | none | Square | 🟡 | Placeholder content |
| `/member/certificates` | Member certificates | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/member/downloads` | Member downloads | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/notifications` | Notifications | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/messages` | Messages | client | English only | ✅ | ✅ | none | none | 🟡 | |

---

## Course and Learning Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/courses` | Course catalogue | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/courses/red` | Real estate courses | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/courses/white` | Paper assets courses | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/courses/blue` | Business courses | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/courses/[courseId]` | Individual course | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/courses/[courseId]/lessons/[lessonId]` | Individual lesson | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/levels` | Curriculum levels | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/course-catalog` | Course catalogue listing | none | English only | ✅ | ✅ | none | none | 🟡 | Appears to duplicate /courses |
| `/course-progress` | Course progress tracker | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/continue-learning` | Resume learning | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/my-courses` | My enrolled courses | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/study-center` | Study centre | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/study/[pack]` | Study pack | client | English only | ✅ | ✅ | none | none | 🟡 | |

---

## Book Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/books` | Book catalogue | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/audio-books` | Audio books listing | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/audio-player` | Audio player | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/my-books` | My books | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/library` | Member library | client | English only | ✅ | ✅ | `/api/library/*` | none | 🟡 | |
| `/library/[id]` | Library item | client | English only | ✅ | ✅ | `/api/library/items/[id]` | none | 🟡 | |
| `/library/bookmarks` | Bookmarked items | client | English only | ✅ | ✅ | `/api/library/bookmarks` | none | 🟡 | |
| `/library/downloads` | Downloaded items | client | English only | ✅ | ✅ | `/api/library/downloads` | none | 🟡 | |
| `/library/favorites` | Favourited items | client | English only | ✅ | ✅ | `/api/library/favorites` | none | 🟡 | |
| `/library/progress` | Reading progress | client | English only | ✅ | ✅ | `/api/library/progress` | none | 🟡 | |

---

## Assessment Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/assessment` | Assessment landing | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/assessment/start` | Assessment entry | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/assessment/start/section-1` through `/section-6` | Assessment sections | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/assessment/results` | Assessment results | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/assessment/entrepreneur` | Entrepreneur assessment | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/competency` | Competency overview | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/exams` | Exams page | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/quizzes` | Quiz listing | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/quizzes/[quizId]` | Individual quiz | client | English only | ✅ | ✅ | none | none | 🟡 | |

---

## AI Coach Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/ai-coach` | AI Coach overview | none | bilingual (en/es) | ✅ | ✅ | none | none | 🟢 | |
| `/ai` | AI redirect/landing | none | English only | ✅ | ✅ | none | none | 🟡 | Possible duplicate of /ai-coach |
| `/coach` | Coach page | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/chat` | AI chat interface | client | English only | ✅ | ✅ | none | none | 🟡 | |

---

## Certificate Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/certificates` | Certificates listing | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/my-certificates` | My certificates | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/achievements` | Achievements | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/badges` | Badges | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/passport` | Learning passport | client | English only | ✅ | ✅ | none | none | 🟡 | |
| `/rewards` | Rewards page | client | English only | ✅ | ✅ | none | none | 🟡 | |

---

## Legal Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/privacy` | Privacy policy | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR; no es |
| `/terms` | Terms of service | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR; no es |
| `/refund` | Refund policy | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR; no es |
| `/cookies` | Cookie policy | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR; no es |
| `/disclaimer` | Disclaimers | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR; no es |
| `/membership-terms` | Membership terms | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR; no es |
| `/beta-terms` | Beta terms | none | English only | ✅ | ✅ | none | none | ⚪ | Beta-only |
| `/security` | Security page | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/trust-center` | Trust centre | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/contracts` | Contracts page | client | English only | ✅ | ✅ | `/api/contracts/accept` | none | 🟡 | |

---

## Accessibility Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/accessibility` | Accessibility statement | none | English only | ✅ | ✅ | none | none | 🟡 | No fr-CA/fr-FR |
| `/ada` | ADA accommodation info | none | English only | ✅ | ✅ | none | none | 🟡 | Partially overlaps /accessibility |

---

## Regional Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | API dep | Payment dep | Launch status | Known issue |
|---|---|---|---|---|---|---|---|---|---|
| `/north-america` | NA launch page | none | English only | ✅ | ✅ | none | none | 🟢 | |
| `/canada` | Canada regional page | none | en + fr-CA | ✅ | ✅ | none | none | 🟢 | |
| `/[region]` | Generic regional route | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/[region]/[section]` | Regional section | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/regions` | Regions listing | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/regions/[region]` | Region detail | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/regions/[region]/[track]/[level]` | Region track level | none | English only | ✅ | ✅ | none | none | 🟡 | |
| `/latin-america` | LATAM page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/caribbean` | Caribbean page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/europe` | Europe page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/western-europe` | W Europe page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/eastern-europe` | E Europe page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/east-africa` | E Africa page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/west-africa` | W Africa page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/southern-africa` | S Africa page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/middle-east` | Middle East page | none | English only | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/asia-pacific` | APAC hub | none | multi-locale | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/asia-pacific/[locale]` | APAC locale pages | none | multi-locale | ✅ | ✅ | none | none | ⚪ | Out of NA scope |
| `/global` | Global page | none | English only | ✅ | ✅ | none | none | ⚪ | |
| `/global-dashboard` | Global dashboard | client | English only | ✅ | ✅ | none | none | ⚪ | |
| `/global-expansion` | Global expansion | none | English only | ✅ | ✅ | none | none | ⚪ | |

---

## API Endpoints

| Route | Method | Purpose | Auth | Launch status | Known issue |
|---|---|---|---|---|---|
| `/api/health` | GET | Health check | none | 🟢 | |
| `/api/health/live` | GET | Liveness probe | none | 🟢 | |
| `/api/health/ready` | GET | Readiness probe | none | 🟢 | |
| `/api/square/checkout` | POST | Create Square payment link | none (rate-limited) | 🟡 | Requires `SQUARE_VERIFIED_CHECKOUT_ENABLED=true` and Square env vars |
| `/api/square/webhook` | POST | Receive Square webhook events | HMAC signature | 🟡 | Requires `SQUARE_VERIFIED_CHECKOUT_ENABLED=true` |
| `/api/kpi` | GET | KPI data | none | 🟡 | |
| `/api/kpi/track` | POST | Track KPI event | none | 🟡 | |
| `/api/admin/kpi/export` | GET | Admin KPI export | `ADMIN_METRICS_TOKEN` header | 🟡 | Middleware-protected |
| `/api/library/items` | GET | Library items | none | 🟡 | |
| `/api/library/items/[id]` | GET | Library item | none | 🟡 | |
| `/api/library/bookmarks` | GET/POST | Bookmarks | none | 🟡 | |
| `/api/library/downloads` | GET/POST | Downloads | none | 🟡 | |
| `/api/library/favorites` | GET/POST | Favourites | none | 🟡 | |
| `/api/library/progress` | GET/POST | Reading progress | none | 🟡 | |
| `/api/metrics` | POST | Metrics ingestion | none | 🟡 | |
| `/api/uptime` | GET | Uptime check | none | 🟢 | |
| `/api/cms/content` | GET/POST | CMS content | none | 🟡 | |
| `/api/cms/content/[lessonId]/localization` | GET/POST | Lesson localization | none | 🟡 | |
| `/api/cms/content/[lessonId]/versions` | GET/POST | Lesson versions | none | 🟡 | |
| `/api/cms/media` | GET/POST | CMS media | none | 🟡 | |
| `/api/contracts/accept` | POST | Accept contract | none | 🟡 | |

---

## Error and Special Pages

| Route | Purpose | Auth | Lang coverage | Mobile | Desktop | Launch status | Known issue |
|---|---|---|---|---|---|---|---|
| `/not-found` (404) | 404 error page | none | English only | ✅ | ✅ | 🟡 | No fr-CA/fr-FR/es translation |
| `/sitemap.xml` | XML sitemap | none | N/A | N/A | N/A | 🟡 | Lists language alternates for routes that don't exist as actual pages |
| `/robots.txt` | Robots instructions | none | N/A | N/A | N/A | 🟢 | Fixed: added /member, /account, /profile, /settings, /payment/success, /payment/cancel |

---

## Language-Specific Routes

| Route | Purpose | Lang | Launch status | Known issue |
|---|---|---|---|---|
| `/canada` | Canada hub (en/fr-CA) | en + fr-CA | 🟢 | fr-CA alternate `/fr-CA/canada` may not resolve |
| `/fr-CA/*` | fr-CA language alternates | fr-CA | 🔴 | These language-alternate URLs are listed in sitemap and Canada page metadata but no `src/app/fr-CA/` route group exists |
| `/en/*` | English language alternates | en | 🔴 | Listed in sitemap alternates but routes don't exist |

---

## Redirects

| Source | Destination | Status | Notes |
|---|---|---|---|
| `/* /index.html 200` | Netlify SPA rewrite | Active | Defined in `_redirects` |

---

## Summary Counts

| Category | Count |
|---|---|
| Public/marketing pages | 19 |
| Membership/pricing pages | 7 |
| Checkout/payment pages | 5 |
| Account/dashboard pages | 16 |
| Course/learning pages | 14 |
| Book pages | 10 |
| Assessment pages | 9 |
| AI coach pages | 4 |
| Certificate pages | 6 |
| Legal pages | 10 |
| Accessibility pages | 2 |
| Regional pages (NA scope) | 4 |
| Regional pages (out of scope) | 13 |
| API endpoints | 21 |
| Error/special pages | 3 |
| **Total pages** | **~171** |
| **Total API routes** | **21** |
