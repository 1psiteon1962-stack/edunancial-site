# Edunancial U.S.–Canada Tax Compliance Engine

This subsystem implements the architectural boundary defined by the authoritative U.S. & Canada Tax Compliance Architecture brief.

## Non-negotiable separation

1. **Jurisdiction / place-of-supply resolver** — determines candidate taxing jurisdictions from sufficient customer-location evidence.
2. **Nexus engine** — determines physical/economic nexus, registration/collection implications, threshold utilization, and projected crossing dates.
3. **Taxability engine** — determines whether the specific Edunancial product/service is taxable for the customer and transaction.
4. **Rate engine** — returns one or more effective-dated tax components; checkout must not hard-code rates.
5. **Compliance engine** — registration, filings, liabilities, remittances, confirmations, reconciliation, alerts, and audit linkage.
6. **Orchestrator** — checkout-facing boundary. Checkout consumes a decision; it does not contain tax-law logic.

## Production safety

- No static percentage is a production tax rule.
- Unknown/unverified taxability or incomplete rate lookup produces `manual-review-required`, never a silent zero-tax assumption.
- Rules are effective-dated and retain authoritative source references and verification status.
- Transactions retain the rule IDs used so historical calculations can be reconstructed.
- Marketplace-facilitated sales are separately represented to prevent double collection.
- Canadian federal GST/HST and QST/PST/RST obligations are independent compliance regimes.
- CAD statutory-threshold calculations must retain immutable currency-conversion evidence when source transactions are in another currency.
- Registration/account numbers and government credentials must be stored encrypted server-side and never exposed to ordinary clients.

## Product classifications

`EDU-BOOK-PHYSICAL`, `EDU-EBOOK-DIGITAL`, `EDU-COURSE-RECORDED`, `EDU-COURSE-LIVE`, `EDU-MEMBERSHIP`, `EDU-SUBSCRIPTION`, `EDU-SAAS-TOOL`, `EDU-DIGITAL-DOWNLOAD`, `EDU-CONSULTING`, `EDU-MERCH-APPAREL`, `EDU-MERCH-GENERAL`.

## Rule ingestion

Production rules must be verified primarily against authoritative government sources and stored as versioned records. The engine intentionally ships without guessed tax percentages or stale static internet tables. A future rule-ingestion/admin workflow must validate source authority, effective dates, jurisdiction, product classification, and approval before a rule can become `verified`.

## Threshold alerts

- <70%: below-70
- 70–79.99%: informational
- 80–89.99%: review
- 90–94.99%: prepare-registration
- 95–99.99%: compliance-escalation
- >=100%: trigger-review

Reaching 100% does not itself instruct checkout to collect. The effective rule and registration/collection-start requirements control that decision.

## Accounting boundary

Tax collected is a liability, not revenue. The compliance/accounting implementation must maintain separate payable balances for U.S. sales tax, GST, HST, QST, PST, RST and future regimes, and must distinguish collected-not-remitted, remitted, and due/unpaid balances.

## Expansion

Jurisdiction IDs are hierarchical and intentionally extensible beyond U.S./Canada. Adding another country must add rules/resolvers/compliance records rather than require checkout redesign.
