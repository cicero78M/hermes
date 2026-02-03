-- PostgreSQL Schema for Hermes User Database
-- Version: 2.0.0
-- Description: Complete database schema for user management system

-- ============================================================================
-- TABLE: users
-- Description: Main table for storing user information
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255),
  unit_kerja VARCHAR(255),
  email VARCHAR(255),
  telepon VARCHAR(50),
  alamat TEXT,
  tanggal_lahir DATE,
  tanggal_masuk DATE,
  status VARCHAR(50) DEFAULT 'aktif',
  additional_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- Description: Indexes for optimizing query performance
-- ============================================================================

-- B-tree indexes for frequently searched columns
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_users_nama ON users(nama);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- GIN index for JSONB field (additional_data) for efficient JSON queries
CREATE INDEX IF NOT EXISTS idx_users_additional_data ON users USING GIN(additional_data);

-- ============================================================================
-- FUNCTIONS
-- Description: Database functions for triggers and utilities
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TRIGGERS
-- Description: Automatic triggers for data maintenance
-- ============================================================================

-- Trigger to update updated_at column on every UPDATE
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- Description: Table and column documentation
-- ============================================================================

COMMENT ON TABLE users IS 'Main user information table';
COMMENT ON COLUMN users.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN users.uuid IS 'Unique user identifier (UUID format), must be unique';
COMMENT ON COLUMN users.nama IS 'Full name of the user';
COMMENT ON COLUMN users.jabatan IS 'Job title/position';
COMMENT ON COLUMN users.unit_kerja IS 'Work unit/department';
COMMENT ON COLUMN users.email IS 'Email address';
COMMENT ON COLUMN users.telepon IS 'Phone number';
COMMENT ON COLUMN users.alamat IS 'Full address';
COMMENT ON COLUMN users.tanggal_lahir IS 'Date of birth';
COMMENT ON COLUMN users.tanggal_masuk IS 'Date joined/hired';
COMMENT ON COLUMN users.status IS 'Status (active/inactive)';
COMMENT ON COLUMN users.additional_data IS 'JSONB field for flexible key-value metadata (badge_number, access_level, skills, etc.)';
COMMENT ON COLUMN users.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN users.updated_at IS 'Record last update timestamp (auto-updated by trigger)';
