# Edunancial Launch Checklist

Production-readiness checklist for the North American site launch.

---

## ✅ Completed

- [x] Project scaffold: Next.js 15, TypeScript, Tailwind CSS
- [x] Root layout with full SEO metadata (title templates, description, keywords)
- [x] Open Graph and Twitter Card metadata
- [x] JSON-LD Organization schema on every page
- [x] Google Site Verification via env variable
- [x] Canonical URLs set on key pages
- [x] Robots.txt — admin/api/dashboard blocked from indexing
- [x] Sitemap.xml — key public pages included
- [x] Homepage hero with clear value proposition
- [x] Trust strip (no financial advice, privacy, US & Canada)
- [x] Sticky Navbar with desktop navigation
- [x] Mobile hamburger menu with accessible toggle
- [x] Footer with organized link groups
- [x] 404 page — styled, accessible, branded
- [x] Loading page — styled, accessible, with ARIA live region
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Trust Center page
- [x] Contact page
- [x] FAQ page
- [x] North America landing page
- [x] `.env.example` documenting required environment variables

---

## 🔄 In Progress

- [ ] Membership page — pricing tiers with North America focus
- [ ] Courses catalog — RED / WHITE / BLUE categorization
- [ ] Financial Competency Assessment flow
- [ ] Financial Passport page

---

## 📋 Pre-Launch Requirements

### Performance
- [ ] Lighthouse score ≥ 90 on homepage (Performance, Accessibility, Best Practices, SEO)
- [ ] Images optimized with `next/image` where applicable
- [ ] Core Web Vitals passing on Netlify preview

### Accessibility
- [ ] All interactive elements have accessible labels
- [ ] Color contrast meets WCAG AA throughout
- [ ] Keyboard navigation works across all pages
- [ ] Skip-to-content link added to layout

### Security & Privacy
- [ ] `.env` secrets not committed (verify with secret scanning)
- [ ] Privacy Policy covers US and Canadian law (CCPA, PIPEDA)
- [ ] Cookie banner functional
- [ ] Data Processing Agreement published
- [ ] No financial advice language — all educational disclaimers in place

### Infrastructure
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set in Netlify environment
- [ ] `NEXT_PUBLIC_SITE_URL` set in Netlify environment
- [ ] Custom domain `www.edunancial.com` verified in Netlify
- [ ] SSL certificate active
- [ ] Netlify redirect rules in `_redirects` validated
- [ ] Headers in `_headers` reviewed

### Content
- [ ] OG image (`/og-image.png`, 1200×630) created and deployed
- [ ] Logo (`/logo.png`) created and deployed
- [ ] Favicon set
- [ ] All placeholder copy replaced with final content

### Testing
- [ ] Cross-browser smoke test (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsive test (iOS Safari, Android Chrome)
- [ ] All nav links resolve without 404
- [ ] Membership checkout flow end-to-end tested

---

## 🚀 Go-Live Steps

1. Merge final PR to `main`
2. Confirm Netlify build passes
3. Verify custom domain and SSL
4. Submit sitemap to Google Search Console
5. Confirm GA4 / analytics tag is active
6. Announce launch via email list

