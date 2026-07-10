-- Community Platform: Core Tables
-- Migration: 20260710_000001_create_community_platform.sql

-- ============================================================
-- FORUM CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS community_categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  label        TEXT NOT NULL,
  description  TEXT,
  icon         TEXT,
  color        TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMMUNITY MEMBER PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          TEXT UNIQUE NOT NULL,
  display_name      TEXT NOT NULL,
  bio               TEXT,
  avatar_url        TEXT,
  reputation_points INTEGER NOT NULL DEFAULT 0,
  badge             TEXT NOT NULL DEFAULT 'newcomer'
                    CHECK (badge IN ('newcomer','contributor','trusted','expert','champion')),
  standing          TEXT NOT NULL DEFAULT 'good'
                    CHECK (standing IN ('good','warned','suspended','banned')),
  suspended_until   TIMESTAMPTZ,
  helpful_answers   INTEGER NOT NULL DEFAULT 0,
  thread_count      INTEGER NOT NULL DEFAULT 0,
  post_count        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DISCUSSIONS (threads)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_discussions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  category_id  UUID NOT NULL REFERENCES community_categories(id),
  author_id    UUID NOT NULL REFERENCES community_profiles(id),
  content      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'approved'
               CHECK (status IN ('pending','approved','removed','flagged')),
  is_pinned    BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  is_staff_pick BOOLEAN NOT NULL DEFAULT FALSE,
  views        INTEGER NOT NULL DEFAULT 0,
  likes        INTEGER NOT NULL DEFAULT 0,
  reply_count  INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discussions_category  ON community_discussions(category_id);
CREATE INDEX IF NOT EXISTS idx_discussions_author    ON community_discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_status    ON community_discussions(status);
CREATE INDEX IF NOT EXISTS idx_discussions_created   ON community_discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_likes     ON community_discussions(likes DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_discussions_fts
  ON community_discussions
  USING GIN (to_tsvector('english', title || ' ' || content));

-- ============================================================
-- DISCUSSION TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_discussion_tags (
  discussion_id UUID NOT NULL REFERENCES community_discussions(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES community_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (discussion_id, tag_id)
);

-- ============================================================
-- REPLIES (posts within a discussion)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_replies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id   UUID NOT NULL REFERENCES community_discussions(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES community_profiles(id),
  content         TEXT NOT NULL,
  quoted_reply_id UUID REFERENCES community_replies(id),
  is_helpful      BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'approved'
                  CHECK (status IN ('pending','approved','removed','flagged')),
  likes           INTEGER NOT NULL DEFAULT 0,
  report_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replies_discussion ON community_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_replies_author     ON community_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_status     ON community_replies(status);

-- ============================================================
-- LIKES (discussions and replies)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_likes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES community_profiles(id) ON DELETE CASCADE,
  target_type   TEXT NOT NULL CHECK (target_type IN ('discussion','reply')),
  target_id     UUID NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, target_type, target_id)
);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_bookmarks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES community_profiles(id) ON DELETE CASCADE,
  discussion_id UUID NOT NULL REFERENCES community_discussions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, discussion_id)
);

-- ============================================================
-- MODERATION REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id   UUID NOT NULL REFERENCES community_profiles(id),
  target_type   TEXT NOT NULL CHECK (target_type IN ('discussion','reply')),
  target_id     UUID NOT NULL,
  reason        TEXT NOT NULL
                CHECK (reason IN ('spam','harassment','misinformation','inappropriate','off-topic','other')),
  details       TEXT,
  status        TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open','resolved','dismissed')),
  resolved_by   UUID REFERENCES community_profiles(id),
  resolved_at   TIMESTAMPTZ,
  action_taken  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON community_reports(target_type, target_id);

-- ============================================================
-- MODERATION AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS community_audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     UUID REFERENCES community_profiles(id),
  action       TEXT NOT NULL,
  target_type  TEXT NOT NULL CHECK (target_type IN ('discussion','reply','user')),
  target_id    UUID NOT NULL,
  target_label TEXT,
  details      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON community_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor   ON community_audit_logs(actor_id);

-- ============================================================
-- REPUTATION EVENTS (for tracking point changes)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_reputation_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES community_profiles(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  points      INTEGER NOT NULL,
  target_type TEXT,
  target_id   UUID,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rep_events_user ON community_reputation_events(user_id);

-- ============================================================
-- SEED: Default forum categories
-- ============================================================
INSERT INTO community_categories (slug, label, description, icon, color, sort_order)
VALUES
  ('budgeting',       'Budgeting',                  'Strategies for managing income, expenses, and building emergency funds.',            '💰', 'green',   1),
  ('credit',          'Credit',                     'Credit scores, debt management, credit cards, and rebuilding credit.',             '💳', 'blue',    2),
  ('investing',       'Investing',                  'Stocks, ETFs, index funds, portfolio strategy, and market analysis.',              '📈', 'purple',  3),
  ('retirement',      'Retirement',                 '401(k), IRA, pension, Social Security, and retirement planning.',                  '🏖️', 'yellow', 4),
  ('taxes',           'Taxes',                      'Tax planning, deductions, filing strategies, and IRS guidance.',                   '📋', 'red',     5),
  ('insurance',       'Insurance',                  'Life, health, auto, home, and business insurance coverage.',                      '🛡️', 'teal',   6),
  ('entrepreneurship','Entrepreneurship',            'Starting a business, funding, scaling, and founder finance.',                    '🚀', 'orange',  7),
  ('real-estate',     'Real Estate',                'Property investing, mortgages, flipping, and rental income.',                     '🏘️', 'indigo', 8),
  ('fraud-prevention','Financial Fraud Prevention', 'Scam awareness, identity theft, phishing, and consumer protection.',              '🔒', 'rose',    9),
  ('general',         'General Financial Literacy', 'Open discussion on money, wealth mindset, and financial fundamentals.',           '📚', 'slate',  10)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

ALTER TABLE community_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_discussions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_tags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_discussion_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_bookmarks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_audit_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reputation_events ENABLE ROW LEVEL SECURITY;

-- Public read access for approved content
CREATE POLICY "Public can read categories"
  ON community_categories FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can read profiles"
  ON community_profiles FOR SELECT USING (TRUE);

CREATE POLICY "Public can read approved discussions"
  ON community_discussions FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can read tags"
  ON community_tags FOR SELECT USING (TRUE);

CREATE POLICY "Public can read discussion tags"
  ON community_discussion_tags FOR SELECT USING (TRUE);

CREATE POLICY "Public can read approved replies"
  ON community_replies FOR SELECT USING (status = 'approved');

-- Authenticated users can create content
CREATE POLICY "Auth users can create discussions"
  ON community_discussions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Auth users can update own discussions"
  ON community_discussions FOR UPDATE
  USING (auth.uid() = author_id AND status != 'removed');

CREATE POLICY "Auth users can create replies"
  ON community_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Auth users can update own replies"
  ON community_replies FOR UPDATE
  USING (auth.uid() = author_id AND status != 'removed');

CREATE POLICY "Auth users can manage own likes"
  ON community_likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Auth users can manage own bookmarks"
  ON community_bookmarks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Auth users can create reports"
  ON community_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Auth users can read own reports"
  ON community_reports FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Auth users can read own reputation events"
  ON community_reputation_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own profile"
  ON community_profiles FOR ALL USING (auth.uid() = id);
