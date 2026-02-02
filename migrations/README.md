# Database Migrations

This folder contains database migration scripts for the Hermes personnel management system.

## Overview

Migrations are SQL scripts that allow you to version control your database schema changes. Each migration file represents a specific change to the database structure.

## Migration Files

Migrations are numbered sequentially and should be applied in order:

1. **001_initial_schema.sql** - Creates the initial database schema including:
   - `personnel` table with all columns
   - Indexes for performance optimization
   - Triggers for automatic timestamp updates
   - Table and column documentation

2. **002_sample_data.sql** - Inserts sample/seed data for testing and development

## Running Migrations

### Using psql Command Line

To apply all migrations in order:

```bash
# Connect to your database
psql -U postgres -d hermes_db

# Apply migrations one by one
\i migrations/001_initial_schema.sql
\i migrations/002_sample_data.sql
```

### Using psql with File Execution

```bash
# Apply a single migration
psql -U postgres -d hermes_db -f migrations/001_initial_schema.sql

# Apply all migrations
for file in migrations/*.sql; do
  psql -U postgres -d hermes_db -f "$file"
done
```

### Using Node.js Initialization Script

The project includes an initialization script that applies the schema automatically:

```bash
npm run init-db
```

This script runs `src/database/init.js` which creates the schema and inserts sample data.

## Migration Naming Convention

Migration files follow this naming pattern:
```
NNN_descriptive_name.sql
```

Where:
- `NNN` is a zero-padded sequential number (001, 002, 003, etc.)
- `descriptive_name` briefly describes what the migration does
- Uses underscores for spaces

Examples:
- `001_initial_schema.sql`
- `002_sample_data.sql`
- `003_add_department_table.sql`
- `004_add_user_authentication.sql`

## Creating New Migrations

When adding new migrations:

1. Create a new file with the next sequential number
2. Include both UP (apply) and DOWN (rollback) sections
3. Document what the migration does in comments
4. Test the migration on a development database first

Example template:

```sql
-- Migration: 003_your_migration_name
-- Description: Brief description of what this migration does
-- Date: YYYY-MM-DD
-- Author: Your Name

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Your SQL changes here

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- SQL to undo the changes (as comments)
-- DROP TABLE IF EXISTS new_table;
```

## Database Schema

The current schema includes:

### Tables

#### personnel
Main table for storing employee/personnel information.

**Columns:**
- `id` - SERIAL PRIMARY KEY
- `nip` - VARCHAR(50) UNIQUE NOT NULL (Employee ID)
- `nama` - VARCHAR(255) NOT NULL (Full name)
- `jabatan` - VARCHAR(255) (Job title)
- `unit_kerja` - VARCHAR(255) (Department)
- `email` - VARCHAR(255)
- `telepon` - VARCHAR(50) (Phone number)
- `alamat` - TEXT (Address)
- `tanggal_lahir` - DATE (Date of birth)
- `tanggal_masuk` - DATE (Date joined)
- `status` - VARCHAR(50) DEFAULT 'aktif' (Status: aktif/non-aktif)
- `additional_data` - JSONB DEFAULT '{}' (Flexible key-value metadata)
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**Indexes:**
- `idx_personnel_nip` - B-tree index on nip
- `idx_personnel_nama` - B-tree index on nama
- `idx_personnel_status` - B-tree index on status
- `idx_personnel_additional_data` - GIN index on additional_data (for JSONB queries)

**Triggers:**
- `update_personnel_updated_at` - Automatically updates `updated_at` column on UPDATE

### Functions

- `update_updated_at_column()` - Trigger function to update the updated_at timestamp

## Rollback Instructions

To rollback a migration, use the SQL commands provided in the DOWN section of each migration file.

**Warning:** Rolling back migrations may result in data loss. Always backup your database before performing rollbacks.

## Best Practices

1. **Always backup** your database before running migrations in production
2. **Test migrations** in a development environment first
3. **Never modify** existing migration files that have been applied
4. **Always include** rollback instructions in the DOWN section
5. **Document** your changes clearly in migration comments
6. **Keep migrations atomic** - each migration should do one thing well
7. **Run migrations in order** - never skip migrations

## Troubleshooting

### Migration fails with "relation already exists"
The migration includes `IF NOT EXISTS` clauses, so this shouldn't happen. If it does, the schema may already be partially applied.

### Need to rerun a migration
If you need to rerun a migration, first run the DOWN section to undo the changes, then run the UP section again.

### Check current schema
```bash
# List all tables
psql -U postgres -d hermes_db -c "\dt"

# Describe personnel table
psql -U postgres -d hermes_db -c "\d personnel"

# View indexes
psql -U postgres -d hermes_db -c "\di"
```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Database Migration Best Practices](https://www.postgresql.org/docs/current/ddl-basics.html)
