-- Migration: 002_sample_data
-- Description: Insert sample/seed data for testing and development
-- Date: 2026-02-02
-- Author: System

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Insert sample personnel data
INSERT INTO personnel (nip, nama, jabatan, unit_kerja, email, telepon, status, additional_data)
VALUES 
  (
    '198001012010011001', 
    'Budi Santoso', 
    'Kepala Bagian', 
    'IT Department', 
    'budi.santoso@hermes.id', 
    '081234567890', 
    'aktif',
    '{"badge_number": "B001", "department_code": "IT01", "access_level": 3}'::jsonb
  ),
  (
    '198502152012022002', 
    'Siti Nurhaliza', 
    'Staff', 
    'HR Department', 
    'siti.nurhaliza@hermes.id', 
    '081234567891', 
    'aktif',
    '{"badge_number": "B002", "department_code": "HR01", "access_level": 2}'::jsonb
  ),
  (
    '199003202015031003', 
    'Ahmad Dhani', 
    'Manager', 
    'Finance Department', 
    'ahmad.dhani@hermes.id', 
    '081234567892', 
    'aktif',
    '{"badge_number": "B003", "department_code": "FIN01", "access_level": 4}'::jsonb
  )
ON CONFLICT (nip) DO NOTHING;

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- To rollback this migration, run the following SQL:
-- DELETE FROM personnel WHERE nip IN ('198001012010011001', '198502152012022002', '199003202015031003');
