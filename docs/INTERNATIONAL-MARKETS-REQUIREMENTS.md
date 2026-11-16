EDUNANCIAL — GLOBAL GEOLOCATION, LANGUAGE, CURRENCY, PRICING, AND PAYMENT REQUIREMENTS

TO: Claude — Edunancial Website Development
PROJECT: edunancial.com
PRIORITY: Critical — Required Before Public Launch
OBJECTIVE: Ensure that Edunancial functions as a genuinely international educational platform, automatically adapting to each visitor's country, language, currency, pricing market, and applicable payment requirements.

1. OVERALL REQUIREMENT

Edunancial is designed to serve people throughout the world, not simply Americans accessing an American website.

When someone visits edunancial.com, the website must identify their likely country and automatically configure the experience for that market.

The website must determine, to the extent technically possible:

1. The visitor's country.
2. The visitor's preferred language.
3. The appropriate regional language variation.
4. The country's primary currency.
5. The correct country-specific subscription prices.
6. The applicable taxes on digital educational subscriptions.
7. The available payment methods.
8. The appropriate checkout currency.
9. The correct monthly and annual subscription options.
10. Whether any country-specific legal or payment restrictions apply.

This must happen automatically wherever reliable information is available.

The visitor must also be able to override the automatic selections.

IMPORTANT: IP geolocation is an estimate. It must never be treated as definitive proof of residence, citizenship, or tax location.

2. COUNTRY DETECTION

When a visitor first accesses Edunancial, the website should determine the likely country using reliable server-side geolocation.

Preferred detection sequence:

1. Check whether the visitor already has a saved country preference.
2. If authenticated, check the country associated with the visitor's account.
3. Otherwise, use the country information provided by the hosting infrastructure or a reliable geolocation service.
4. Use browser language preferences as supporting information, not proof of country.
5. If detection fails, use a clearly identified default market and allow manual selection.

Use ISO 3166-1 alpha-2 country codes internally.

Examples:

- United States: US
- Canada: CA
- Dominican Republic: DO
- Puerto Rico: PR
- Brazil: BR
- Mexico: MX
- Spain: ES
- Portugal: PT
- Germany: DE
- France: FR
- Italy: IT
- United Kingdom: GB

Puerto Rico must be handled as a distinct geographic market where appropriate, even though it uses the U.S. dollar.

The detected country must be available throughout the application, including the pricing page, registration process, checkout, and customer account.

Do not rely exclusively on client-side JavaScript for country detection.

Do not assume that a VPN or proxy accurately identifies the customer's actual country.

3. AUTOMATIC LANGUAGE DETECTION

The website must distinguish between a visitor's geographic location and preferred language.

These are not necessarily the same.

For example:

- Someone in the United States may prefer Spanish.
- Someone in Canada may prefer French.
- Someone in Brazil may prefer English.
- Someone in the Dominican Republic may prefer Caribbean Spanish.
- Someone in Spain may prefer European Spanish.

Language selection should follow this priority:

1. Explicit language selection made by the visitor.
2. Language preference saved to the customer's account.
3. Previously saved language preference on the device.
4. Browser language preferences, if supported.
5. Default language associated with the detected country.
6. English fallback if the requested language is unavailable.

Supported language variants currently include:

- English — United States
- English — United Kingdom
- Spanish — Caribbean
- Spanish — Spain
- French — Canada
- French — France
- Portuguese — Brazil
- Portuguese — Portugal
- Italian
- German
- Dutch

Haitian Creole is not to be publicly activated until the curriculum is completed, reviewed, and expressly approved for release.

Use correct locale identifiers consistently.

Examples:

- en-US
- en-GB
- es-DO
- es-ES
- fr-CA
- fr-FR
- pt-BR
- pt-PT
- it-IT
- de-DE
- nl-NL

Caribbean Spanish may use a regional translation catalog internally, but the locale displayed to the browser should be a valid language-region identifier.

The entire website experience should use the selected language, including navigation, registration, pricing, checkout, customer support, and available lesson content.

Do not silently substitute incomplete or placeholder translations.

If a particular lesson is unavailable in the selected language, use an approved fallback and clearly disclose the fallback language.

4. COUNTRY AND LANGUAGE MUST OPERATE INDEPENDENTLY

Country, language, currency, and subscription price are four separate settings.

Changing one must not automatically change the others unless the user expressly requests it or the system needs to establish an initial default.

For example:

A customer physically located in the Dominican Republic may select English while continuing to see prices in Dominican pesos.

A customer in Canada may select French while continuing to see prices in Canadian dollars.

A customer in Spain may select English while continuing to see Spanish-market prices in euros.

A customer in Puerto Rico may select Caribbean Spanish while continuing to pay in U.S. dollars.

The website must never assume that selecting Spanish means selecting Spain or that selecting Portuguese means selecting Portugal.

This is particularly important because an earlier test from Santo Domingo incorrectly displayed European Spanish and euro pricing.

That problem must not recur.

5. AUTOMATIC CURRENCY DETECTION

Once the visitor's country is determined, the website must identify the appropriate local currency.

Examples:

Country or market| Default currency
United States| USD
Puerto Rico| USD
Dominican Republic| DOP
Canada| CAD
Mexico| MXN
Brazil| BRL
Colombia| COP
Argentina| ARS
Chile| CLP
Peru| PEN
United Kingdom| GBP
Spain| EUR
Portugal| EUR
France| EUR
Germany| EUR
Italy| EUR
Netherlands| EUR
United Arab Emirates| AED
India| INR
South Africa| ZAR
Nigeria| NGN
Ghana| GHS
Kenya| KES
Uganda| UGX

These mappings must be configurable rather than permanently hard-coded throughout the website.

If local-currency processing is not supported for a country, the website must use an approved settlement currency, such as USD, and clearly disclose the currency before payment.

Never display a local-currency price while charging a different currency without clear advance disclosure.

Currency formatting must follow local conventions, including currency symbols, decimal separators, and rounding.

6. COUNTRY-SPECIFIC SUBSCRIPTION PRICING

Edunancial must support different subscription prices for different countries.

This is a critical business requirement.

Simply converting U.S. prices using the current foreign exchange rate is not sufficient.

A subscription that is affordable in the United States may be prohibitively expensive in another country.

Edunancial must be able to establish country-specific pricing based on market conditions, purchasing power, affordability, competitive pricing, and commercial strategy.

Current U.S. reference prices are:

Membership| Monthly| Annual
Basic — Levels 1–2| $14.99| $119.99
Pro — Levels 1–4| $24.99| $199.99
Gold — Levels 1–5| $39.99| $299.99

These are U.S. reference prices, not mandatory worldwide prices.

The website must support an independent pricing table for each country.

Each country should have configurable:

- Country code.
- Currency code.
- Basic monthly price.
- Basic annual price.
- Pro monthly price.
- Pro annual price.
- Gold monthly price.
- Gold annual price.
- Effective date.
- Price version.
- Tax inclusion or exclusion rules.
- Payment processor price identifiers.
- Whether subscriptions are currently available in that market.

Example:

A customer in Brazil should receive Brazilian-market pricing in reais, not automatically the U.S. price converted into reais.

A customer in the Dominican Republic should receive Dominican-market pricing in pesos.

A customer in Germany should receive the approved German-market pricing in euros.

The exact prices for these countries must be approved by the business owner before publication.

Claude must not invent country-specific prices or independently determine discounts.

If an approved local price does not exist, use the explicitly configured fallback market price and clearly identify the actual charge currency.

7. PURCHASING POWER AND REGIONAL AFFORDABILITY

The pricing system must support regional affordability adjustments.

Potential inputs for business review include:

- Local purchasing power.
- Median or typical income.
- Cost of living.
- Comparable digital education subscriptions.
- Local payment processing costs.
- Applicable taxes.
- Currency volatility.
- Customer acquisition costs.
- Expected subscription retention.
- Market growth objectives.

However, these factors must inform an approved pricing schedule.

They must not cause uncontrolled real-time price changes for individual visitors.

Do not automatically change a customer's price based on inferred personal wealth, device type, neighborhood, or browsing behavior.

Pricing should be transparent and consistently applied to customers within the same approved market and subscription category.

8. PRICE DISPLAY REQUIREMENTS

Every subscription card must display:

1. Membership name.
2. Included education levels.
3. Monthly subscription price.
4. Annual subscription price.
5. Currency.
6. Billing frequency.
7. Applicable tax treatment.
8. Renewal terms.
9. Cancellation information.

All three plans must display both monthly and annual pricing.

The annual price must be shown as the actual annual amount charged.

Any claimed savings must be mathematically correct.

Example:

Basic membership in the United States:

Monthly: $14.99 per month.

Annual: $119.99 per year.

If savings are displayed, calculate them against twelve months of the current monthly price.

Do not use artificial urgency, fabricated discounts, or misleading savings claims.

9. PAYMENT PROCESSING AND MERCHANT SERVICES

The next major website integration is merchant services.

Claude must implement a secure payment system that supports international customers and recurring subscriptions.

The payment architecture must support:

- Monthly recurring subscriptions.
- Annual recurring subscriptions.
- Multiple currencies where supported.
- Country-specific prices.
- Secure card processing.
- Applicable alternative payment methods.
- Payment confirmations.
- Failed-payment handling.
- Subscription renewals.
- Cancellations.
- Refund processing.
- Upgrades and downgrades.
- Payment receipts.
- Tax records.
- Subscription status synchronization.

The final merchant processor must be confirmed before implementation.

Do not assume that every payment method or local currency is available through the selected processor.

The website must never collect or store raw credit card numbers or security codes in Edunancial's own database.

Use hosted payment fields or another appropriately compliant payment integration.

A successful payment must activate the correct membership.

A failed or canceled payment must not activate paid access.

10. LOCATION VERIFICATION DURING CHECKOUT

The website may initially determine a visitor's country through IP geolocation.

However, checkout must independently collect or confirm the information required for accurate billing, tax calculation, and payment processing.

Depending on the jurisdiction and merchant processor, this may include:

- Billing country.
- Billing address.
- Postal code.
- Customer tax identification information where applicable.
- Payment method country.
- Other evidence required by tax regulations.

If the billing country differs from the initially detected country, the website must determine whether the selected price, currency, or tax treatment needs to change.

Before completing payment, the customer must see the final amount and actual billing currency.

Any required price change must be disclosed before the customer authorizes payment.

Do not silently change the total after payment authorization.

11. INTERNATIONAL TAX CALCULATION

Edunancial must support applicable taxes on digital educational services.

Potential taxes include:

- U.S. state and local sales taxes.
- Canadian GST/HST and applicable provincial taxes.
- European value-added tax.
- United Kingdom VAT.
- Brazilian indirect taxes.
- Other country-specific taxes on digital services.

The system must not assume that every educational subscription is tax-exempt.

Taxability depends on the jurisdiction, product classification, customer circumstances, registration obligations, and applicable exemptions.

Requirements:

1. Identify the customer's relevant tax jurisdiction using appropriate evidence.
2. Determine whether Edunancial is registered or otherwise required to collect tax there.
3. Apply the correct tax treatment.
4. Distinguish tax-inclusive from tax-exclusive pricing.
5. Display the applicable tax before payment.
6. Record the tax charged.
7. Preserve the information required for reporting and compliance.

Tax calculation should be integrated with a suitable tax service or maintained through a properly controlled tax configuration.

Claude must not assume that collecting sales tax or VAT in every jurisdiction is legally appropriate without confirming registration and collection obligations.

12. CUSTOMER ACCOUNT SETTINGS

Every registered customer must have access to their relevant settings.

At minimum:

- Preferred language.
- Country of residence.
- Billing country.
- Display currency, where supported.
- Membership tier.
- Monthly or annual billing.
- Subscription renewal date.
- Current subscription price.
- Payment status.
- Payment history.
- Cancellation controls.

Customers must be able to change their preferred language without losing educational progress.

A change in country must not automatically alter an existing subscription contract.

Changes affecting currency, price, taxes, or billing terms must follow the merchant processor's capabilities and applicable legal requirements.

13. SAVE COUNTRY AND LANGUAGE PREFERENCES

Once a customer chooses a country or language, the website should remember that choice.

For anonymous visitors, use an appropriate preference cookie or equivalent permitted storage.

For registered customers, save preferences to their account.

A returning customer should not repeatedly be redirected to a different language merely because their IP address changes.

Example:

A customer registers in Brazil and selects Portuguese.

Later, the customer travels to the United States.

The website should continue displaying the customer's selected language unless they change it.

Their subscription currency and contractual price should not automatically change because of travel.

14. USER-VISIBLE COUNTRY, LANGUAGE, AND CURRENCY CONTROLS

The website must provide accessible controls for:

- Country or market.
- Language.
- Display currency, if supported.

These should be easy to locate on desktop and mobile.

The controls must clearly distinguish the country used for market pricing from the customer's preferred language.

Changing the displayed currency must not falsely imply that checkout supports that currency.

If currency conversion is shown only for reference, identify it as an estimate and display the actual billing currency.

15. MARKET-SPECIFIC MARKETING

The same country and language configuration should support international marketing.

Edunancial must be able to identify which markets are generating traffic, registrations, and paid subscriptions.

The marketing system should support:

- Country-specific landing pages.
- Language-specific landing pages.
- Country-specific subscription offers.
- Local currency pricing.
- Country-specific campaign links.
- Marketing attribution.
- Visitor-to-registration conversion.
- Registration-to-paid conversion.
- Subscription retention by market.
- Customer acquisition costs by country and language.

The initial marketing priority is:

Phase 1: United States and Canada.

Phase 2: Central America, South America, and the Caribbean.

Phase 3: Europe and the Middle East.

Phase 4: Africa and additional international markets.

Marketing phases do not necessarily mean customers outside those regions must be blocked.

Any geographic restrictions must be based on approved business, legal, technical, or payment-processing requirements.

The system must be designed for eventual global operation.

16. ADMINISTRATIVE CONTROL PANEL

Edunancial's administrative backend must allow the owner or authorized administrators to manage:

- Country availability.
- Language availability.
- Translation completion status.
- Country-specific prices.
- Monthly and annual plan prices.
- Currency support.
- Payment processor configuration.
- Tax configuration.
- Subscription activity.
- Revenue by country.
- Revenue by currency.
- Customer registrations by country.
- Conversion rates.
- Failed payments.
- Refunds.
- Subscription cancellations.
- Regional marketing performance.

Country pricing must be editable through an authorized administrative process without requiring a full website code deployment.

Pricing changes must be logged, versioned, and auditable.

Existing subscribers must not be moved to new prices without the required notices, consent where applicable, and correct subscription billing procedures.

17. COUNTRY DETECTION AND PRIVACY

Edunancial should collect only the location and billing information reasonably necessary to operate the service.

The website does not need to know a visitor's precise GPS location.

Country-level IP geolocation should generally be sufficient for initial localization.

Do not request device GPS permission merely to determine language, currency, or subscription pricing.

Any analytics, cookies, geolocation processing, and marketing tracking must comply with applicable privacy requirements.

Customer information must be handled securely.

18. REQUIRED TEST SCENARIOS

Claude must verify the following scenarios before launch.

Test A — United States

Visitor detected in California.

Expected:

- Country: United States.
- Default language: U.S. English, unless another preference exists.
- Currency: USD.
- Pricing: Approved U.S. membership prices.
- Checkout: Correct U.S. dollar amount and applicable tax treatment.

Test B — Dominican Republic

Visitor detected in Santo Domingo.

Expected:

- Country: Dominican Republic.
- Default language: Caribbean Spanish.
- Currency: DOP, if supported by the selected payment configuration.
- Pricing: Approved Dominican-market prices.
- No automatic European Spanish selection.
- No automatic euro pricing.
- Checkout clearly discloses the actual payment currency.

This test is mandatory because the earlier Dominican Republic test produced incorrect regional settings.

Test C — Canada

Visitor detected in Quebec.

Expected:

- Country: Canada.
- Default language: Canadian French, unless the visitor's preference indicates otherwise.
- Currency: CAD.
- Pricing: Approved Canadian-market prices.
- Correct applicable tax treatment.

Test D — Brazil

Visitor detected in São Paulo.

Expected:

- Country: Brazil.
- Default language: Brazilian Portuguese.
- Currency: BRL.
- Pricing: Approved Brazilian-market prices.
- Checkout consistent with available Brazilian payment methods.

Test E — Spain

Visitor detected in Madrid.

Expected:

- Country: Spain.
- Default language: European Spanish.
- Currency: EUR.
- Pricing: Approved Spanish-market prices.
- Appropriate VAT treatment.

Test F — Germany

Visitor detected in Berlin.

Expected:

- Country: Germany.
- Default language: German.
- Currency: EUR.
- Pricing: Approved German-market prices.
- Appropriate VAT treatment.

Test G — Puerto Rico

Visitor detected in San Juan.

Expected:

- Market: Puerto Rico.
- Default language: Caribbean Spanish, subject to browser or saved preferences.
- Currency: USD.
- Pricing: Approved Puerto Rico market pricing.
- Correct Puerto Rico-specific tax treatment where applicable.

Test H — Traveler

Registered Brazilian customer travels to the United States.

Expected:

- Existing language preference retained.
- Existing subscription billing terms retained.
- No automatic subscription price change.
- No unnecessary country redirection.

Test I — Language Override

Visitor located in the Dominican Republic manually selects English.

Expected:

- Website changes to English.
- Dominican Republic remains the selected market.
- Country pricing does not automatically change to U.S. pricing.

Test J — Failed Geolocation

Visitor's country cannot be determined.

Expected:

- Website remains functional.
- Clearly configured default market is used.
- Visitor can select their country.
- No incorrect claim that the visitor is located in the United States.

19. IMPLEMENTATION ARCHITECTURE

Claude must first inspect the existing Edunancial website, backend, hosting configuration, pricing logic, localization system, and current merchant-service preparations.

Reuse working infrastructure wherever possible.

Do not introduce unnecessary duplicate systems.

The implementation should include a central market configuration service or equivalent architecture.

The following must be independently represented:

- Detected country.
- Selected market.
- Preferred language.
- Display currency.
- Billing currency.
- Subscription plan.
- Subscription billing interval.
- Approved market price.
- Applicable tax treatment.
- Payment processor configuration.

Price calculations must be authoritative on the server.

Do not trust a price supplied by the browser during checkout.

All payment transactions must be validated against the approved price configuration.

Subscription activation must rely on verified payment processor events, not merely a browser redirect to a success page.

The system must prevent duplicate payment event processing and preserve accurate subscription records.

20. THE 72-HOUR LAUNCH COUNTDOWN

Edunancial must also support a 72-hour public launch countdown.

The countdown must:

1. Use one authoritative launch timestamp.
2. Display the correct remaining time regardless of the visitor's time zone.
3. Continue accurately after the browser is refreshed.
4. Support the website's available languages.
5. Work on mobile and desktop.
6. Be manageable through the administrative backend.
7. Avoid falsely suggesting that the website is open for paid enrollment before merchant services are operational.

The countdown should be activated only after authorization from the business owner.

Do not start the countdown automatically when the code is deployed.

The final 72-hour period should begin only when the website is ready for the intended public launch.

21. REQUIRED PRELAUNCH AUDIT

Before the website is declared launch-ready, Claude must provide a written report covering:

1. Current country-detection functionality.
2. Current language-selection functionality.
3. Current currency-selection functionality.
4. Current country-pricing functionality.
5. Current payment-processing functionality.
6. Current international tax functionality.
7. Current customer subscription management.
8. Current administrative controls.
9. Outstanding development requirements.
10. Results of all country-specific tests.

The report must distinguish between:

- Already implemented and verified.
- Implemented but not fully tested.
- Partially implemented.
- Not yet implemented.
- Blocked by a required business decision or third-party service.

Do not report a feature as completed merely because the code exists.

A feature is completed only when its intended behavior has been tested successfully.

22. FINAL DIRECTIVE

Edunancial must operate as an international platform from the customer's first visit through registration, payment, education, renewal, and account management.

A visitor in the Dominican Republic should experience a platform configured for the Dominican Republic.

A visitor in Brazil should experience a platform configured for Brazil.

A visitor in Canada should experience a platform configured for Canada.

The same principle applies to the United States, Europe, Africa, Asia, the Middle East, and other supported markets.

Country determines the initial market.

Language determines how information is presented.

Currency determines how prices are displayed and, when supported, charged.

Approved country-specific pricing determines the subscription cost.

Billing and tax information determines the final legally appropriate transaction.

These systems must work together without confusing one setting with another.

Claude is instructed to audit the existing implementation against these requirements, identify any gaps, and prepare the necessary code changes through the established GitHub and deployment workflow.

Preserve all existing curriculum, translations, membership tiers, user progress, and functioning backend features.

Do not introduce unapproved country-specific prices.

Do not activate merchant services without the required credentials and authorization.

Do not activate the 72-hour countdown without explicit approval.

The objective is a commercially operational, scalable, multilingual, multicurrency Edunancial website capable of serving customers internationally from the day of launch.