-- Migration: 002_sample_data
-- Description: Insert sample/seed data for testing and development
-- Date: 2026-02-02
-- Author: System

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Insert sample user data
INSERT INTO users (uuid, nama, jabatan, unit_kerja, email, telepon, status, additional_data)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001', 
    'Budi Santoso', 
    'Kepala Bagian', 
    'IT Department', 
    'budi.santoso@hermes.id', 
    '081234567890', 
    'aktif',
    '{"badge_number": "B001", "department_code": "IT01", "access_level": 3}'::jsonb
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002', 
    'Siti Nurhaliza', 
    'Staff', 
    'HR Department', 
    'siti.nurhaliza@hermes.id', 
    '081234567891', 
    'aktif',
    '{"badge_number": "B002", "department_code": "HR01", "access_level": 2}'::jsonb
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003', 
    'Ahmad Dhani', 
    'Manager', 
    'Finance Department', 
    'ahmad.dhani@hermes.id', 
    '081234567892', 
    'aktif',
    '{"badge_number": "B003", "department_code": "FIN01", "access_level": 4}'::jsonb
  )
ON CONFLICT (uuid) DO NOTHING;

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- To rollback this migration, run the following SQL:
-- DELETE FROM users WHERE uuid IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');
