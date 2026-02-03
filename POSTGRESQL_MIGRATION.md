# PostgreSQL Migration Guide

## Overview

Backend Hermes telah berhasil dimigrasikan dari SQLite ke PostgreSQL dengan penambahan fitur key-value metadata menggunakan JSONB.

## Perubahan Utama

### 1. Database Engine
- **Sebelumnya**: SQLite3
- **Sekarang**: PostgreSQL 12+

### 2. Dependencies
```bash
# Dihapus
npm uninstall sqlite3

# Ditambahkan
npm install pg
```

### 3. Schema Changes

#### Tabel Users - Perubahan Field

**Field Baru:**
- `additional_data` - JSONB field untuk menyimpan metadata key-value

**Perubahan Field:**
- `nip` → `uuid` - Changed from NIP to UUID identifier

**Perubahan Tipe Data:**
- `id`: INTEGER AUTOINCREMENT → SERIAL PRIMARY KEY
- All fields tetap sama kecuali syntax PostgreSQL

**Index Baru:**
- GIN index pada `additional_data` untuk pencarian JSONB yang efisien

### 4. Configuration Changes

#### Environment Variables (.env)
```bash
# SQLite (Old)
DB_PATH=./database/personnel.db

# PostgreSQL (New)
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hermes_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 5. SQL Syntax Changes

#### Parameter Placeholders
```javascript
// SQLite (Old)
'SELECT * FROM personnel WHERE id = ?'

// PostgreSQL (New)
'SELECT * FROM users WHERE id = $1'
```

#### LIKE Queries
```javascript
// SQLite (Old)
'SELECT * FROM personnel WHERE nama LIKE ?'

// PostgreSQL (New)
'SELECT * FROM users WHERE nama ILIKE $1'  // Case-insensitive
```

#### Returning Values
```javascript
// PostgreSQL requires RETURNING clause
INSERT INTO users (...) VALUES (...) RETURNING id
```

## Fitur Baru: Key-Value Metadata

### JSONB Field (additional_data)

Field `additional_data` memungkinkan penyimpanan metadata fleksibel tanpa perlu mengubah schema database.

#### Contoh Penggunaan:

**1. Create dengan metadata:**
```javascript
{
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "nama": "John Doe",
  ...
  "additional_data": {
    "badge_number": "B001",
    "access_level": 3,
    "skills": ["JavaScript", "PostgreSQL"],
    "certifications": ["AWS", "Azure"]
  }
}
```

**2. Query berdasarkan key-value:**
```javascript
// Cari user dengan access_level = 3
User.searchByAdditionalData('access_level', 3)
```

**3. Update key tertentu:**
```javascript
// Update hanya access_level tanpa mengubah data lain
User.updateAdditionalDataKey(1, 'access_level', 4)
```

### Keuntungan JSONB:

1. **Fleksibilitas**: Tambah field baru tanpa ALTER TABLE
2. **Performance**: GIN index untuk pencarian cepat
3. **Struktur**: Mendukung nested objects dan arrays
4. **Validasi**: PostgreSQL memvalidasi JSON structure

## Migration Steps untuk Production

### 1. Backup Data SQLite (Jika ada)
```bash
# Export data dari SQLite
sqlite3 database/personnel.db .dump > backup.sql
```

### 2. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo service postgresql start
```

### 3. Create Database
```bash
sudo -u postgres psql
CREATE DATABASE hermes_db;
CREATE USER hermes_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hermes_db TO hermes_user;
\q
```

### 4. Update Configuration
```bash
cp .env.example .env
# Edit .env dengan database credentials
```

### 5. Initialize Database
```bash
npm run init-db
```

### 6. Migrate Data (Optional)
Jika memiliki data dari SQLite, export dan import ke PostgreSQL:

```bash
# Export dari SQLite (tanpa schema)
sqlite3 -csv personnel.db "SELECT * FROM personnel;" > personnel_data.csv

# Import ke PostgreSQL
psql -U postgres -d hermes_db -c "\COPY users(uuid, nama, jabatan, unit_kerja, email, telepon, alamat, tanggal_lahir, tanggal_masuk, status, additional_data) FROM 'personnel_data.csv' WITH CSV HEADER;"
```

## Testing

Semua endpoint telah ditest dan berfungsi dengan PostgreSQL:

```bash
# Start server
npm start

# Test endpoints
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"uuid":"550e8400-e29b-41d4-a716-446655440001","nama":"Test","additional_data":{"key":"value"}}'
```

## Performance Improvements

### Connection Pooling
PostgreSQL menggunakan connection pooling untuk performa yang lebih baik:
- Max 20 connections
- Idle timeout: 30s
- Connection timeout: 2s

### Indexing
- B-tree indexes untuk UUID, nama, status
- GIN index untuk JSONB field
- Auto-vacuum untuk maintenance

## Security

✅ **CodeQL Scan**: 0 vulnerabilities found
✅ **npm audit**: 0 vulnerabilities in production dependencies
✅ **SQL Injection Protection**: Parameterized queries
✅ **Prepared Statements**: Otomatis dengan pg driver

## Known Issues & Solutions

### Issue: Connection Pool Exhaustion
**Solution**: Pastikan selalu release client setelah query selesai (sudah implemented)

### Issue: JSONB Query Performance
**Solution**: Gunakan GIN index (sudah implemented)

### Issue: Password in .env
**Solution**: Use environment-specific .env files dan jangan commit ke git

## Rollback Plan

Jika perlu rollback ke SQLite:

1. Install sqlite3: `npm install sqlite3`
2. Restore `src/config/database.js` dari commit sebelumnya
3. Restore `src/database/init.js` dari commit sebelumnya
4. Restore `src/models/personnel.js` (parameter placeholders)
5. Update `.env` dengan `DB_PATH`

## Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi maintainer.

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
