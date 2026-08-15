# Square Production Setup

This document describes the exact external steps required to configure the
Edunancial Square payment integration for production use.

---

## Prerequisites

You must have:

- A Square developer account at https://developer.squareup.com
- A Square production application created (not sandbox)
- Access to your Netlify site settings

---

## Step 1: Square Developer Dashboard

1. Log in at https://developer.squareup.com
2. Open your production application (or create one).
3. Navigate to **Credentials** → **Production** tab.

### Variables to collect

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | Production Application ID |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Locations → select your production location → copy the Location ID |
| `SQUARE_ACCESS_TOKEN` | Production Access Token (keep this secret — never commit it) |

---

## Step 2: Webhook Configuration

The application automatically provisions and manages the webhook subscription
via the Square Webhooks API the first time a checkout is initiated after
deployment.

**Default webhook URL:** `https://edunancial.com/api/square/webhook`

To use a custom URL, set `SQUARE_WEBHOOK_NOTIFICATION_URL` in your environment.

### Signature Key

The webhook signature key is retrieved automatically from the Square API when
the subscription is created or updated. You do **not** need to set
`SQUARE_WEBHOOK_SIGNATURE_KEY` manually unless the automatic retrieval fails.

If you need to set it manually:
1. In the Square Developer Dashboard, open your app → **Webhooks**.
2. Find the subscription for `https://edunancial.com/api/square/webhook`.
3. Copy the **Signature Key**.
4. Set it as `SQUARE_WEBHOOK_SIGNATURE_KEY` in Netlify.

---

## Step 3: Netlify Environment Variables

1. Open your Netlify site dashboard.
2. Navigate to **Site configuration** → **Environment variables**.
3. Click **Add a variable** (or **Import from .env**).
4. Add each variable below. Never include the actual secret values in source code.

### Required variables

```
NEXT_PUBLIC_SQUARE_APPLICATION_ID   = <your production Application ID>
NEXT_PUBLIC_SQUARE_LOCATION_ID      = <your production Location ID>
NEXT_PUBLIC_SQUARE_ENVIRONMENT      = production
SQUARE_ACCESS_TOKEN                 = <your production Access Token>
SQUARE_WEBHOOK_NOTIFICATION_URL     = https://edunancial.com/api/square/webhook
```

### Optional variables

```
SQUARE_WEBHOOK_SIGNATURE_KEY        = <only if auto-retrieval fails>
```

> **Important:** `NEXT_PUBLIC_SQUARE_ENVIRONMENT` must be set to `production`.
> The application will not silently fall back to sandbox mode; setting an
> invalid or missing value will cause checkout to fail-closed (503).

---

## Step 4: Redeploy

After setting all environment variables:

1. In Netlify, navigate to **Deploys**.
2. Click **Trigger deploy** → **Deploy site**.
3. Wait for the deploy to complete.

---

## Step 5: Verification

After deploying, verify the integration:

1. Navigate to the membership checkout page on the live site.
2. Attempt to initiate a checkout for `square-payment-test-001` (the $1.00 test item).
3. Confirm you are redirected to a `checkout.squareup.com` or `square.link` URL.
4. Complete the test payment in Square's production environment.
5. Confirm the webhook is received and processed (check application logs).
6. Confirm the `square-payment-test-001` item does **not** grant any membership entitlement.

---

## Security Notes

- `SQUARE_ACCESS_TOKEN` is a server-only secret. It must never appear in:
  - Source code (committed to the repository)
  - Client-side JavaScript bundles (`NEXT_PUBLIC_*` variables)
  - API responses visible to end users
  - Application logs

- The `/payment/success` redirect page is **non-authoritative**. Navigating to
  it directly does not grant membership access. Only verified webhooks from
  Square trigger membership provisioning.

- The `square-payment-test-001` catalog item is hardcoded to never trigger
  membership fulfillment, regardless of payment state.

- Production mode (`NEXT_PUBLIC_SQUARE_ENVIRONMENT=production`) will not silently
  downgrade to sandbox. An invalid environment value causes immediate fail-closed
  behavior at checkout time.

---

## Removed Variables

`SQUARE_VERIFIED_CHECKOUT_ENABLED` has been removed from the platform.
Checkout readiness is now determined entirely by:
1. Runtime credential presence checks
2. Live Square API credential validation
3. Webhook subscription provisioning and signature key retrieval

Do not set `SQUARE_VERIFIED_CHECKOUT_ENABLED` — it has no effect.
