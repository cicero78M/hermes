-- Migration: 004_add_telegram_id
-- Description: Add telegram_id field to users table for Telegram bot integration
-- Date: 2026-02-03
-- Author: System

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Add telegram_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(50) UNIQUE;

-- Create index for telegram_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Add comment for the new column
COMMENT ON COLUMN users.telegram_id IS 'Telegram user ID for bot integration';

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- To rollback this migration, run the following SQL:
-- DROP INDEX IF EXISTS idx_users_telegram_id;
-- ALTER TABLE users DROP COLUMN IF EXISTS telegram_id;
