-- Migration: 003_modify_user_schema
-- Description: Modify users table - remove fields and add social media fields
-- Date: 2026-02-03
-- Author: System

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Remove old indexes related to additional_data
DROP INDEX IF EXISTS idx_users_additional_data;

-- Drop columns
ALTER TABLE users DROP COLUMN IF EXISTS alamat;
ALTER TABLE users DROP COLUMN IF EXISTS tanggal_lahir;
ALTER TABLE users DROP COLUMN IF EXISTS tanggal_masuk;
ALTER TABLE users DROP COLUMN IF EXISTS additional_data;

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS pangkat VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS rayon VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ig_uname VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS fb_uname VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tt_uname VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_uname VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS yt_uname VARCHAR(255);

-- Add comments for new columns
COMMENT ON COLUMN users.pangkat IS 'Rank/grade';
COMMENT ON COLUMN users.rayon IS 'Rayon/region';
COMMENT ON COLUMN users.ig_uname IS 'Instagram username';
COMMENT ON COLUMN users.fb_uname IS 'Facebook username';
COMMENT ON COLUMN users.tt_uname IS 'TikTok username';
COMMENT ON COLUMN users.x_uname IS 'X (Twitter) username';
COMMENT ON COLUMN users.yt_uname IS 'YouTube username';

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- To rollback this migration, run the following SQL:
-- ALTER TABLE users DROP COLUMN IF EXISTS pangkat;
-- ALTER TABLE users DROP COLUMN IF EXISTS rayon;
-- ALTER TABLE users DROP COLUMN IF EXISTS ig_uname;
-- ALTER TABLE users DROP COLUMN IF EXISTS fb_uname;
-- ALTER TABLE users DROP COLUMN IF EXISTS tt_uname;
-- ALTER TABLE users DROP COLUMN IF EXISTS x_uname;
-- ALTER TABLE users DROP COLUMN IF EXISTS yt_uname;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS alamat TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS tanggal_lahir DATE;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS tanggal_masuk DATE;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS additional_data JSONB DEFAULT '{}';
-- CREATE INDEX IF NOT EXISTS idx_users_additional_data ON users USING GIN(additional_data);
