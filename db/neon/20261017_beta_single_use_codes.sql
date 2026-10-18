-- Neon PostgreSQL: owner-generated single-use beta codes.
create table if not exists beta_invite_codes (
 id bigserial primary key,
 code_hash text not null unique,
 issued_at timestamptz not null default now(),
 redeemed_by text unique,
 redeemed_at timestamptz,
 expires_at timestamptz,
 revoked_at timestamptz,
 constraint beta_invite_redeemed_consistent check ((redeemed_by is null and redeemed_at is null and expires_at is null) or (redeemed_by is not null and redeemed_at is not null and expires_at is not null))
);
create index if not exists beta_invite_codes_expiry_idx on beta_invite_codes(expires_at) where redeemed_at is not null;
