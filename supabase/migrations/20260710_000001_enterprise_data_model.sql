-- =============================================================================
-- Edunancial Enterprise Data Model
-- Migration: 20260710_000001_enterprise_data_model
-- Description: Core enterprise data model covering all primary entities
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUMERATIONS
-- ---------------------------------------------------------------------------

create type public.member_status as enum (
  'active', 'inactive', 'suspended', 'pending_verification',
  'locked', 'archived', 'deleted'
);

create type public.membership_tier as enum (
  'free', 'starter', 'professional', 'enterprise', 'lifetime'
);

create type public.membership_status as enum (
  'active', 'cancelled', 'expired', 'paused', 'trial', 'pending'
);

create type public.content_status as enum (
  'draft', 'review', 'published', 'archived', 'deleted'
);

create type public.payment_status as enum (
  'pending', 'processing', 'completed', 'failed', 'refunded',
  'partially_refunded', 'disputed', 'cancelled'
);

create type public.payment_provider as enum (
  'stripe', 'square', 'paypal', 'bank_transfer', 'crypto', 'manual'
);

create type public.support_ticket_status as enum (
  'open', 'in_progress', 'pending_user', 'resolved', 'closed', 'escalated'
);

create type public.support_ticket_priority as enum (
  'low', 'medium', 'high', 'critical'
);

create type public.notification_type as enum (
  'email', 'sms', 'push', 'in_app', 'webhook'
);

create type public.notification_status as enum (
  'queued', 'sent', 'delivered', 'failed', 'bounced', 'read'
);

create type public.data_classification as enum (
  'public', 'internal', 'confidential', 'restricted', 'top_secret'
);

create type public.audit_action as enum (
  'create', 'read', 'update', 'delete', 'login', 'logout',
  'export', 'import', 'approve', 'reject', 'escalate', 'archive',
  'restore', 'access_denied', 'permission_change', 'config_change'
);

create type public.ai_interaction_type as enum (
  'chat', 'recommendation', 'prediction', 'summarization',
  'personalization', 'assessment', 'feedback', 'search'
);

create type public.lifecycle_state as enum (
  'active', 'archived', 'legal_hold', 'pending_deletion',
  'deleted', 'purged'
);

create type public.region_code as enum (
  'NA', 'LA', 'EU', 'APAC', 'MENA', 'SSA', 'CARIB'
);

-- ---------------------------------------------------------------------------
-- SCHEMA: MASTER DATA
-- ---------------------------------------------------------------------------

-- Members (core identity entity)
create table if not exists public.members (
  id                    uuid primary key default uuid_generate_v4(),
  external_id           text unique,                          -- SSO / external IdP reference
  email                 text unique not null,
  email_verified        boolean not null default false,
  phone                 text,
  phone_verified        boolean not null default false,
  first_name            text not null,
  last_name             text not null,
  display_name          text,
  avatar_url            text,
  date_of_birth         date,
  gender                text,
  preferred_language    text not null default 'en',
  timezone              text not null default 'UTC',
  country_code          text,                                 -- ISO 3166-1 alpha-2
  region                public.region_code,
  status                public.member_status not null default 'pending_verification',
  data_classification   public.data_classification not null default 'confidential',
  lifecycle_state       public.lifecycle_state not null default 'active',
  gdpr_consent          boolean not null default false,
  gdpr_consent_at       timestamptz,
  marketing_consent     boolean not null default false,
  marketing_consent_at  timestamptz,
  privacy_version       text,                                 -- Policy version accepted
  onboarding_completed  boolean not null default false,
  assessment_completed  boolean not null default false,
  referral_code         text unique,
  referred_by           uuid references public.members(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz,
  created_by            uuid,
  updated_by            uuid,
  metadata              jsonb not null default '{}'::jsonb,
  -- Data lineage
  source_system         text not null default 'web',
  data_version          integer not null default 1
);

-- Memberships
create table if not exists public.memberships (
  id                  uuid primary key default uuid_generate_v4(),
  member_id           uuid not null references public.members(id) on delete cascade,
  tier                public.membership_tier not null default 'free',
  status              public.membership_status not null default 'pending',
  started_at          timestamptz not null default now(),
  expires_at          timestamptz,
  cancelled_at        timestamptz,
  cancellation_reason text,
  trial_ends_at       timestamptz,
  auto_renew          boolean not null default true,
  payment_method_id   text,
  price_paid          numeric(12,4),
  currency            text not null default 'USD',
  billing_cycle       text,                                   -- monthly, annual, lifetime
  region              public.region_code,
  promotional_code    text,
  discount_percent    numeric(5,2),
  lifecycle_state     public.lifecycle_state not null default 'active',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  metadata            jsonb not null default '{}'::jsonb,
  data_version        integer not null default 1
);

-- Administrative Users
create table if not exists public.admin_users (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid references public.members(id) on delete set null,
  email             text unique not null,
  first_name        text not null,
  last_name         text not null,
  role              text not null,                            -- super_admin, admin, moderator, support, analyst
  permissions       jsonb not null default '[]'::jsonb,
  region_scope      text[],                                   -- Regions this admin can manage
  is_active         boolean not null default true,
  mfa_enabled       boolean not null default false,
  last_login_at     timestamptz,
  password_changed_at timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references public.admin_users(id) on delete set null,
  metadata          jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- SCHEMA: CONTENT
-- ---------------------------------------------------------------------------

-- Courses
create table if not exists public.courses (
  id                uuid primary key default uuid_generate_v4(),
  slug              text unique not null,
  title             text not null,
  subtitle          text,
  description       text,
  thumbnail_url     text,
  trailer_url       text,
  instructor_id     uuid references public.members(id) on delete set null,
  category          text,
  subcategory       text,
  tags              text[],
  difficulty_level  text,                                     -- beginner, intermediate, advanced
  estimated_hours   numeric(6,2),
  language          text not null default 'en',
  region_availability text[],
  status            public.content_status not null default 'draft',
  is_free           boolean not null default false,
  price             numeric(12,4),
  currency          text not null default 'USD',
  enrollment_count  integer not null default 0,
  rating_average    numeric(3,2),
  rating_count      integer not null default 0,
  data_classification public.data_classification not null default 'public',
  lifecycle_state   public.lifecycle_state not null default 'active',
  published_at      timestamptz,
  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid,
  metadata          jsonb not null default '{}'::jsonb,
  seo_title         text,
  seo_description   text,
  data_version      integer not null default 1
);

-- Lessons
create table if not exists public.lessons (
  id                uuid primary key default uuid_generate_v4(),
  course_id         uuid not null references public.courses(id) on delete cascade,
  slug              text not null,
  title             text not null,
  description       text,
  content_type      text not null,                            -- video, text, quiz, interactive, live
  video_url         text,
  video_duration_s  integer,
  content_body      text,
  sort_order        integer not null default 0,
  is_free_preview   boolean not null default false,
  is_required       boolean not null default true,
  status            public.content_status not null default 'draft',
  data_classification public.data_classification not null default 'public',
  lifecycle_state   public.lifecycle_state not null default 'active',
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  metadata          jsonb not null default '{}'::jsonb,
  data_version      integer not null default 1,
  unique (course_id, slug)
);

-- ---------------------------------------------------------------------------
-- SCHEMA: LEARNING PROGRESS
-- ---------------------------------------------------------------------------

-- Course Enrollments
create table if not exists public.course_enrollments (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid not null references public.members(id) on delete cascade,
  course_id         uuid not null references public.courses(id) on delete cascade,
  enrolled_at       timestamptz not null default now(),
  completed_at      timestamptz,
  last_accessed_at  timestamptz,
  progress_percent  numeric(5,2) not null default 0,
  completed_lessons integer not null default 0,
  total_lessons     integer not null default 0,
  time_spent_s      integer not null default 0,
  certificate_earned boolean not null default false,
  status            text not null default 'enrolled',         -- enrolled, in_progress, completed, dropped
  lifecycle_state   public.lifecycle_state not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb,
  unique (member_id, course_id)
);

-- Lesson Progress
create table if not exists public.lesson_progress (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid not null references public.members(id) on delete cascade,
  lesson_id         uuid not null references public.lessons(id) on delete cascade,
  course_id         uuid not null references public.courses(id) on delete cascade,
  status            text not null default 'not_started',      -- not_started, in_progress, completed, skipped
  progress_percent  numeric(5,2) not null default 0,
  video_position_s  integer,
  completed_at      timestamptz,
  last_accessed_at  timestamptz,
  attempts          integer not null default 0,
  time_spent_s      integer not null default 0,
  notes             text,
  lifecycle_state   public.lifecycle_state not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb,
  unique (member_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- SCHEMA: CERTIFICATES
-- ---------------------------------------------------------------------------

create table if not exists public.certificates (
  id                  uuid primary key default uuid_generate_v4(),
  certificate_number  text unique not null,
  member_id           uuid not null references public.members(id) on delete cascade,
  course_id           uuid not null references public.courses(id) on delete cascade,
  enrollment_id       uuid references public.course_enrollments(id) on delete set null,
  student_name        text not null,
  course_name         text not null,
  issued_at           timestamptz not null default now(),
  expires_at          timestamptz,
  revoked_at          timestamptz,
  revocation_reason   text,
  verification_hash   text unique not null,
  template_version    text not null default '1.0',
  data_classification public.data_classification not null default 'confidential',
  lifecycle_state     public.lifecycle_state not null default 'active',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  metadata            jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- SCHEMA: FINANCIAL CALCULATORS
-- ---------------------------------------------------------------------------

create table if not exists public.calculator_sessions (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid references public.members(id) on delete set null,
  session_token     text unique not null,
  calculator_type   text not null,                            -- budget, loan, investment, retirement, etc.
  input_data        jsonb not null default '{}'::jsonb,       -- Encrypted at rest
  result_data       jsonb not null default '{}'::jsonb,       -- Encrypted at rest
  is_saved          boolean not null default false,
  save_name         text,
  region            public.region_code,
  currency          text not null default 'USD',
  data_classification public.data_classification not null default 'confidential',
  lifecycle_state   public.lifecycle_state not null default 'active',
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  expires_at        timestamptz,
  metadata          jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- SCHEMA: PAYMENTS
-- ---------------------------------------------------------------------------

create table if not exists public.payment_methods (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid not null references public.members(id) on delete cascade,
  provider          public.payment_provider not null,
  provider_method_id text not null,                           -- Token from payment gateway
  type              text not null,                            -- card, bank_account, wallet
  last_four         text,
  brand             text,
  exp_month         integer,
  exp_year          integer,
  is_default        boolean not null default false,
  billing_address   jsonb,
  region            public.region_code,
  currency          text not null default 'USD',
  data_classification public.data_classification not null default 'restricted',
  lifecycle_state   public.lifecycle_state not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

create table if not exists public.payments (
  id                    uuid primary key default uuid_generate_v4(),
  member_id             uuid not null references public.members(id) on delete restrict,
  membership_id         uuid references public.memberships(id) on delete set null,
  payment_method_id     uuid references public.payment_methods(id) on delete set null,
  provider              public.payment_provider not null,
  provider_transaction_id text unique,
  amount                numeric(12,4) not null,
  currency              text not null default 'USD',
  exchange_rate         numeric(10,6),
  base_currency_amount  numeric(12,4),
  status                public.payment_status not null default 'pending',
  description           text,
  line_items            jsonb not null default '[]'::jsonb,
  tax_amount            numeric(12,4),
  discount_amount       numeric(12,4),
  refunded_amount       numeric(12,4) not null default 0,
  failure_code          text,
  failure_message       text,
  region                public.region_code,
  ip_hash               text,
  data_classification   public.data_classification not null default 'restricted',
  lifecycle_state       public.lifecycle_state not null default 'active',
  processed_at          timestamptz,
  refunded_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  metadata              jsonb not null default '{}'::jsonb,
  data_version          integer not null default 1
);

-- ---------------------------------------------------------------------------
-- SCHEMA: SUPPORT
-- ---------------------------------------------------------------------------

create table if not exists public.support_tickets (
  id                uuid primary key default uuid_generate_v4(),
  ticket_number     text unique not null,
  member_id         uuid references public.members(id) on delete set null,
  assigned_to       uuid references public.admin_users(id) on delete set null,
  subject           text not null,
  description       text not null,
  category          text,
  subcategory       text,
  status            public.support_ticket_status not null default 'open',
  priority          public.support_ticket_priority not null default 'medium',
  channel           text not null default 'web',              -- web, email, chat, phone
  region            public.region_code,
  escalated_at      timestamptz,
  resolved_at       timestamptz,
  closed_at         timestamptz,
  first_response_at timestamptz,
  satisfaction_score integer,                                  -- 1-5
  tags              text[],
  data_classification public.data_classification not null default 'confidential',
  lifecycle_state   public.lifecycle_state not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

create table if not exists public.support_ticket_messages (
  id                uuid primary key default uuid_generate_v4(),
  ticket_id         uuid not null references public.support_tickets(id) on delete cascade,
  author_id         uuid,
  author_type       text not null,                            -- member, admin, system
  body              text not null,
  is_internal       boolean not null default false,
  attachments       jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- SCHEMA: BLOG / CONTENT
-- ---------------------------------------------------------------------------

create table if not exists public.blog_articles (
  id                uuid primary key default uuid_generate_v4(),
  slug              text unique not null,
  title             text not null,
  subtitle          text,
  body              text,
  excerpt           text,
  author_id         uuid references public.members(id) on delete set null,
  category          text,
  tags              text[],
  cover_image_url   text,
  status            public.content_status not null default 'draft',
  is_featured       boolean not null default false,
  read_time_minutes integer,
  view_count        integer not null default 0,
  region_targets    text[],
  language          text not null default 'en',
  seo_title         text,
  seo_description   text,
  canonical_url     text,
  data_classification public.data_classification not null default 'public',
  lifecycle_state   public.lifecycle_state not null default 'active',
  published_at      timestamptz,
  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  metadata          jsonb not null default '{}'::jsonb,
  data_version      integer not null default 1
);

-- ---------------------------------------------------------------------------
-- SCHEMA: NOTIFICATIONS
-- ---------------------------------------------------------------------------

create table if not exists public.notification_templates (
  id                uuid primary key default uuid_generate_v4(),
  name              text unique not null,
  type              public.notification_type not null,
  subject           text,
  body_template     text not null,
  variables         text[],
  region_variants   jsonb not null default '{}'::jsonb,
  language          text not null default 'en',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

create table if not exists public.notifications (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid not null references public.members(id) on delete cascade,
  template_id       uuid references public.notification_templates(id) on delete set null,
  type              public.notification_type not null,
  channel           text not null,
  subject           text,
  body              text not null,
  status            public.notification_status not null default 'queued',
  scheduled_at      timestamptz,
  sent_at           timestamptz,
  delivered_at      timestamptz,
  read_at           timestamptz,
  failed_at         timestamptz,
  failure_reason    text,
  retry_count       integer not null default 0,
  region            public.region_code,
  data_classification public.data_classification not null default 'confidential',
  lifecycle_state   public.lifecycle_state not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- SCHEMA: AUDIT LOGS (Immutable)
-- ---------------------------------------------------------------------------

create table if not exists public.audit_logs (
  id                  bigserial primary key,
  event_id            uuid unique not null default uuid_generate_v4(),
  action              public.audit_action not null,
  actor_id            uuid,
  actor_type          text not null,                          -- member, admin, system, api
  actor_email         text,
  actor_ip_hash       text,
  actor_user_agent    text,
  entity_type         text not null,
  entity_id           text not null,
  entity_version_before jsonb,
  entity_version_after  jsonb,
  description         text,
  outcome             text not null default 'success',        -- success, failure, partial
  risk_level          text not null default 'low',            -- low, medium, high, critical
  region              public.region_code,
  site_id             text,
  session_id          text,
  request_id          text,
  data_classification public.data_classification not null default 'restricted',
  retention_until     timestamptz,                            -- Legal hold / retention override
  created_at          timestamptz not null default now(),
  metadata            jsonb not null default '{}'::jsonb
);

-- Audit logs must never be updated or deleted by application code.
-- Enforce immutability via policy.
create or replace rule no_update_audit_logs as
  on update to public.audit_logs do instead nothing;

create or replace rule no_delete_audit_logs as
  on delete to public.audit_logs do instead nothing;

-- ---------------------------------------------------------------------------
-- SCHEMA: AI INTERACTIONS
-- ---------------------------------------------------------------------------

create table if not exists public.ai_interactions (
  id                  uuid primary key default uuid_generate_v4(),
  member_id           uuid references public.members(id) on delete set null,
  session_id          uuid not null,
  interaction_type    public.ai_interaction_type not null,
  model_id            text not null,
  model_version       text,
  prompt_tokens       integer,
  completion_tokens   integer,
  total_tokens        integer,
  input_hash          text,                                   -- Hash of input (no raw PII stored)
  output_hash         text,
  response_time_ms    integer,
  feedback_score      integer,                                -- -1, 0, 1
  feedback_text       text,
  was_helpful         boolean,
  error_code          text,
  region              public.region_code,
  data_classification public.data_classification not null default 'confidential',
  lifecycle_state     public.lifecycle_state not null default 'active',
  created_at          timestamptz not null default now(),
  expires_at          timestamptz,                            -- Retention policy
  metadata            jsonb not null default '{}'::jsonb,
  -- AI safety/compliance fields
  content_policy_check boolean not null default true,
  pii_detected        boolean not null default false,
  pii_redacted        boolean not null default false
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

-- Members
create index if not exists idx_members_email on public.members (lower(email));
create index if not exists idx_members_status on public.members (status, lifecycle_state);
create index if not exists idx_members_region on public.members (region, country_code);
create index if not exists idx_members_created_at on public.members (created_at desc);
create index if not exists idx_members_referral_code on public.members (referral_code);

-- Memberships
create index if not exists idx_memberships_member on public.memberships (member_id, status);
create index if not exists idx_memberships_expires on public.memberships (expires_at);
create index if not exists idx_memberships_tier on public.memberships (tier, status);

-- Courses
create index if not exists idx_courses_slug on public.courses (slug);
create index if not exists idx_courses_status on public.courses (status, lifecycle_state);
create index if not exists idx_courses_category on public.courses (category, subcategory);
create index if not exists idx_courses_published on public.courses (published_at desc) where status = 'published';

-- Lessons
create index if not exists idx_lessons_course on public.lessons (course_id, sort_order);

-- Enrollments
create index if not exists idx_enrollments_member on public.course_enrollments (member_id);
create index if not exists idx_enrollments_course on public.course_enrollments (course_id);
create index if not exists idx_enrollments_status on public.course_enrollments (status);

-- Lesson Progress
create index if not exists idx_lesson_progress_member on public.lesson_progress (member_id, course_id);
create index if not exists idx_lesson_progress_lesson on public.lesson_progress (lesson_id);

-- Payments
create index if not exists idx_payments_member on public.payments (member_id, status);
create index if not exists idx_payments_provider on public.payments (provider, provider_transaction_id);
create index if not exists idx_payments_created on public.payments (created_at desc);
create index if not exists idx_payments_status on public.payments (status);

-- Support Tickets
create index if not exists idx_tickets_member on public.support_tickets (member_id, status);
create index if not exists idx_tickets_assigned on public.support_tickets (assigned_to, status);
create index if not exists idx_tickets_priority on public.support_tickets (priority, status);
create index if not exists idx_tickets_created on public.support_tickets (created_at desc);

-- Blog Articles
create index if not exists idx_blog_slug on public.blog_articles (slug);
create index if not exists idx_blog_status on public.blog_articles (status, published_at desc);
create index if not exists idx_blog_category on public.blog_articles (category);

-- Notifications
create index if not exists idx_notifications_member on public.notifications (member_id, status);
create index if not exists idx_notifications_scheduled on public.notifications (scheduled_at) where status = 'queued';

-- Audit Logs
create index if not exists idx_audit_actor on public.audit_logs (actor_id, actor_type);
create index if not exists idx_audit_entity on public.audit_logs (entity_type, entity_id);
create index if not exists idx_audit_created on public.audit_logs (created_at desc);
create index if not exists idx_audit_action on public.audit_logs (action, risk_level);
create index if not exists idx_audit_region on public.audit_logs (region, created_at desc);

-- AI Interactions
create index if not exists idx_ai_member on public.ai_interactions (member_id, interaction_type);
create index if not exists idx_ai_session on public.ai_interactions (session_id);
create index if not exists idx_ai_created on public.ai_interactions (created_at desc);
create index if not exists idx_ai_model on public.ai_interactions (model_id, model_version);

-- Certificates
create index if not exists idx_certificates_member on public.certificates (member_id);
create index if not exists idx_certificates_course on public.certificates (course_id);
create index if not exists idx_certificates_hash on public.certificates (verification_hash);

-- Calculator Sessions
create index if not exists idx_calculator_member on public.calculator_sessions (member_id, calculator_type);

-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGER FUNCTION
-- ---------------------------------------------------------------------------

create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply trigger to mutable tables
create trigger trg_members_updated_at
  before update on public.members
  for each row execute function public.update_updated_at();

create trigger trg_memberships_updated_at
  before update on public.memberships
  for each row execute function public.update_updated_at();

create trigger trg_courses_updated_at
  before update on public.courses
  for each row execute function public.update_updated_at();

create trigger trg_lessons_updated_at
  before update on public.lessons
  for each row execute function public.update_updated_at();

create trigger trg_enrollments_updated_at
  before update on public.course_enrollments
  for each row execute function public.update_updated_at();

create trigger trg_lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.update_updated_at();

create trigger trg_payments_updated_at
  before update on public.payments
  for each row execute function public.update_updated_at();

create trigger trg_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.update_updated_at();

create trigger trg_blog_updated_at
  before update on public.blog_articles
  for each row execute function public.update_updated_at();

create trigger trg_notifications_updated_at
  before update on public.notifications
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------------
-- DATA VERSION INCREMENT TRIGGER
-- ---------------------------------------------------------------------------

create or replace function public.increment_data_version()
returns trigger language plpgsql as $$
begin
  new.data_version = old.data_version + 1;
  return new;
end;
$$;

create trigger trg_members_version
  before update on public.members
  for each row execute function public.increment_data_version();

create trigger trg_memberships_version
  before update on public.memberships
  for each row execute function public.increment_data_version();

create trigger trg_payments_version
  before update on public.payments
  for each row execute function public.increment_data_version();
