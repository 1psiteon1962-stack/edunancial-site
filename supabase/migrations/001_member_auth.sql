-- Migration 001: Production Member Authentication Schema
-- Run this against your Supabase project using the Supabase CLI or dashboard SQL editor.
-- Never rely on automatic schema creation in production.

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE member_role AS ENUM ('member', 'staff', 'administrator');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deactivated', 'pending_verification');
CREATE TYPE membership_tier AS ENUM ('free', 'basic', 'premium', 'enterprise', 'beta');
CREATE TYPE membership_status AS ENUM ('active', 'inactive', 'trial', 'cancelled', 'grace_period', 'expired');
CREATE TYPE beta_invitation_status AS ENUM ('approved', 'active', 'expired', 'revoked');

-- ============================================================
-- MEMBERS TABLE
-- ============================================================

CREATE TABLE members (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                   TEXT NOT NULL,
  email_normalized        TEXT NOT NULL,
  email_verified          BOOLEAN NOT NULL DEFAULT FALSE,
  first_name              TEXT NOT NULL,
  last_name               TEXT NOT NULL,
  password_hash           TEXT,                           -- NULL if using external provider
  external_provider       TEXT,                           -- e.g. 'google', 'github'
  external_provider_id    TEXT,
  country                 TEXT NOT NULL DEFAULT '',
  preferred_language      TEXT NOT NULL DEFAULT 'en',
  preferred_currency      TEXT NOT NULL DEFAULT 'USD',
  phone                   TEXT,
  biography               TEXT,
  role                    member_role NOT NULL DEFAULT 'member',
  account_status          account_status NOT NULL DEFAULT 'pending_verification',
  membership_tier         membership_tier NOT NULL DEFAULT 'free',
  membership_status       membership_status NOT NULL DEFAULT 'inactive',
  payment_provider        TEXT,
  payment_customer_id     TEXT,
  payment_subscription_id TEXT,
  joined_date             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at           TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT members_email_unique UNIQUE (email_normalized)
);

CREATE INDEX idx_members_email_normalized ON members (email_normalized);
CREATE INDEX idx_members_role ON members (role);
CREATE INDEX idx_members_account_status ON members (account_status);
CREATE INDEX idx_members_payment_customer ON members (payment_provider, payment_customer_id);

-- ============================================================
-- EMAIL VERIFICATION TOKENS
-- ============================================================

CREATE TABLE email_verification_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT email_verification_tokens_token_unique UNIQUE (token_hash)
);

CREATE INDEX idx_email_verification_member ON email_verification_tokens (member_id);

-- ============================================================
-- PASSWORD RESET TOKENS
-- ============================================================

CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT password_reset_tokens_token_unique UNIQUE (token_hash)
);

CREATE INDEX idx_password_reset_member ON password_reset_tokens (member_id);

-- ============================================================
-- SESSIONS (optional server-side session table for revocation)
-- Primary session data is in encrypted HttpOnly cookies (iron-session).
-- This table supports explicit session revocation and concurrent-session auditing.
-- ============================================================

CREATE TABLE member_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id      UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  session_token  TEXT NOT NULL,               -- opaque token stored in cookie
  ip_address     TEXT,
  user_agent     TEXT,
  expires_at     TIMESTAMPTZ NOT NULL,
  revoked_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT member_sessions_token_unique UNIQUE (session_token)
);

CREATE INDEX idx_member_sessions_member ON member_sessions (member_id);
CREATE INDEX idx_member_sessions_token ON member_sessions (session_token);

-- ============================================================
-- ASSESSMENTS
-- ============================================================

CREATE TABLE member_assessments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id         UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  assessment_type   TEXT NOT NULL DEFAULT 'financial-competency',
  completed         BOOLEAN NOT NULL DEFAULT FALSE,
  overall_score     NUMERIC(5,2),
  category_scores   JSONB NOT NULL DEFAULT '{}',
  responses         JSONB NOT NULL DEFAULT '{}',
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_member_assessments_member ON member_assessments (member_id);

-- ============================================================
-- MEMBER ACCESS (entitlements)
-- ============================================================

CREATE TABLE member_access (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  access_type     TEXT NOT NULL,     -- 'course', 'book', 'academy_level', 'certificate', 'beta', 'promo'
  resource_id     TEXT,              -- NULL = all resources of that type
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  revoked_at      TIMESTAMPTZ,
  metadata        JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_member_access_member ON member_access (member_id);
CREATE INDEX idx_member_access_type ON member_access (access_type);

-- ============================================================
-- BETA INVITATIONS
-- ============================================================

CREATE TABLE beta_invitations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tester_name            TEXT NOT NULL,
  approved_email         TEXT NOT NULL,
  approved_email_normalized TEXT NOT NULL,
  pass_number_hash       TEXT NOT NULL,
  pass_number_masked     TEXT NOT NULL,
  status                 beta_invitation_status NOT NULL DEFAULT 'approved',
  member_id              UUID REFERENCES members(id) ON DELETE SET NULL,
  redeemed_at            TIMESTAMPTZ,
  first_login_at         TIMESTAMPTZ,
  beta_starts_at         TIMESTAMPTZ,
  beta_expires_at        TIMESTAMPTZ,
  revoked_at             TIMESTAMPTZ,
  revoke_reason          TEXT,
  feedback_submitted_at  TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT beta_invitations_email_unique UNIQUE (approved_email_normalized)
);

CREATE INDEX idx_beta_invitations_email ON beta_invitations (approved_email_normalized);
CREATE INDEX idx_beta_invitations_status ON beta_invitations (status);

-- ============================================================
-- AUDIT EVENTS
-- ============================================================

CREATE TABLE audit_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event       TEXT NOT NULL,
  actor       TEXT NOT NULL DEFAULT 'system',
  member_id   UUID REFERENCES members(id) ON DELETE SET NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata    JSONB NOT NULL DEFAULT '{}'
  -- NO passwords, hashes, tokens, or secrets in metadata
);

CREATE INDEX idx_audit_events_member ON audit_events (member_id);
CREATE INDEX idx_audit_events_event ON audit_events (event);
CREATE INDEX idx_audit_events_timestamp ON audit_events (timestamp DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_assessments_updated_at
  BEFORE UPDATE ON member_assessments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_beta_invitations_updated_at
  BEFORE UPDATE ON beta_invitations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (Supabase)
-- All data access from the server uses the service_role key
-- which bypasses RLS. Enable RLS to prevent accidental direct
-- client-side access.
-- ============================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE beta_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- No client-side access policies: all access via service_role from server.
-- To allow a member to read their own data via the Supabase JS client,
-- add policies when/if needed.
