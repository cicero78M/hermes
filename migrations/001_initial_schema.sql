-- Migration: 001_initial_schema
-- Description: Initial database schema for personnel management system
-- Date: 2026-02-02
-- Author: System

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Create personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id SERIAL PRIMARY KEY,
  nip VARCHAR(50) UNIQUE NOT NULL,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_personnel_nip ON personnel(nip);
CREATE INDEX IF NOT EXISTS idx_personnel_nama ON personnel(nama);
CREATE INDEX IF NOT EXISTS idx_personnel_status ON personnel(status);
CREATE INDEX IF NOT EXISTS idx_personnel_additional_data ON personnel USING GIN(additional_data);

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_personnel_updated_at ON personnel;

CREATE TRIGGER update_personnel_updated_at
  BEFORE UPDATE ON personnel
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add table comments
COMMENT ON TABLE personnel IS 'Main personnel/employee information table';
COMMENT ON COLUMN personnel.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN personnel.nip IS 'Nomor Induk Pegawai (Employee ID Number), must be unique';
COMMENT ON COLUMN personnel.nama IS 'Full name of the employee';
COMMENT ON COLUMN personnel.jabatan IS 'Job title/position';
COMMENT ON COLUMN personnel.unit_kerja IS 'Work unit/department';
COMMENT ON COLUMN personnel.email IS 'Email address';
COMMENT ON COLUMN personnel.telepon IS 'Phone number';
COMMENT ON COLUMN personnel.alamat IS 'Full address';
COMMENT ON COLUMN personnel.tanggal_lahir IS 'Date of birth';
COMMENT ON COLUMN personnel.tanggal_masuk IS 'Date joined/hired';
COMMENT ON COLUMN personnel.status IS 'Employment status (aktif/non-aktif)';
COMMENT ON COLUMN personnel.additional_data IS 'JSONB field for flexible key-value metadata';
COMMENT ON COLUMN personnel.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN personnel.updated_at IS 'Record last update timestamp (auto-updated by trigger)';

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- To rollback this migration, run the following SQL:
-- DROP TRIGGER IF EXISTS update_personnel_updated_at ON personnel;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS personnel CASCADE;
