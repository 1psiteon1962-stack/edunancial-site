# Regional Launch Process

1. Add country in authoritative `COUNTRY_CONFIG`.
2. Add supported languages and defaults in `REGION_CONFIG` and `LANGUAGE_CONFIG`.
3. Set translation completeness per domain.
4. Add approved pricing records (`PRICING_TABLE`) with status/version/effective dates.
5. Add provider capability and enablement status (`PAYMENT_PROVIDER_CAPABILITIES`).
6. Add legal entries with lifecycle status (`LEGAL_REGISTRY`).
7. Add content catalog rules (`CONTENT_CATALOG_RULES`).
8. Run validation:
   - `npm run typecheck`
   - `npm run lint`
   - `npm test`
   - `npm run international:test`
   - `npm run regionalization:test`
   - `npm run curriculum:test`
   - `npm run build`
9. Set region/language to `internal` for preview.
10. Promote to `beta` after QA/legal/payment approval.
11. Promote to `active` for public launch.
12. Roll back by setting `status: suspended` or `emergencyDisable: true`.
