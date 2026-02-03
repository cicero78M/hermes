-- Migration: 002_sample_data
-- Description: Insert sample/seed data for testing and development
-- Date: 2026-02-02
-- Author: System

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Insert sample user data
INSERT INTO users (uuid, nama, jabatan, unit_kerja, email, telepon, status, pangkat, rayon, ig_uname, fb_uname, tt_uname, x_uname, yt_uname)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001', 
    'Budi Santoso', 
    'Kepala Bagian', 
    'IT Department', 
    'budi.santoso@hermes.id', 
    '081234567890', 
    'aktif',
    'Pengurus',
    'Rayon 1',
    'budisantoso',
    'budi.santoso',
    'budisantoso_official',
    'budisantoso',
    'budisantoso'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002', 
    'Siti Nurhaliza', 
    'Staff', 
    'HR Department', 
    'siti.nurhaliza@hermes.id', 
    '081234567891', 
    'aktif',
    'Anggota',
    'Rayon 2',
    'sitinurhaliza',
    'siti.nurhaliza',
    'sitinurhaliza_official',
    'sitinurhaliza',
    'sitinurhaliza'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003', 
    'Ahmad Dhani', 
    'Manager', 
    'Finance Department', 
    'ahmad.dhani@hermes.id', 
    '081234567892', 
    'aktif',
    'Ketua',
    'Rayon 1',
    'ahmaddhani',
    'ahmad.dhani',
    'ahmaddhani_official',
    'ahmaddhani',
    'ahmaddhani'
  )
ON CONFLICT (uuid) DO NOTHING;

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- To rollback this migration, run the following SQL:
-- DELETE FROM users WHERE uuid IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');
