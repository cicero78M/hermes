# Hermes - Personnel Database Backend

Backend API untuk mengelola data personil dengan database PostgreSQL.

## Fitur

- ✅ CRUD operations lengkap untuk data personil
- ✅ Database PostgreSQL dengan support untuk key-value metadata
- ✅ RESTful API dengan Express.js
- ✅ Pencarian dan filter data personil
- ✅ Validasi data
- ✅ Sample data untuk testing
- ✅ JSONB field untuk menyimpan metadata fleksibel (key-value pairs)

## Struktur Database

Tabel `personnel` memiliki field-field berikut:

- `id` - Primary key (auto increment)
- `nip` - Nomor Induk Pegawai (unique, required)
- `nama` - Nama lengkap (required)
- `jabatan` - Jabatan/posisi
- `unit_kerja` - Unit kerja/departemen
- `email` - Email address
- `telepon` - Nomor telepon
- `alamat` - Alamat lengkap
- `tanggal_lahir` - Tanggal lahir
- `tanggal_masuk` - Tanggal masuk kerja
- `status` - Status (aktif/non-aktif)
- `additional_data` - JSONB field untuk metadata key-value (badge_number, access_level, skills, dll)
- `created_at` - Timestamp created
- `updated_at` - Timestamp updated (auto-update dengan trigger)

## Instalasi

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)

### Langkah-langkah

1. Clone repository:
```bash
git clone <repository-url>
cd hermes
```

2. Install dependencies:
```bash
npm install
```

3. Setup PostgreSQL:
```bash
# Buat database baru
sudo -u postgres psql
CREATE DATABASE hermes_db;
\q
```

4. Setup environment variables:
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi PostgreSQL Anda
```

5. Initialize database:
```bash
npm run init-db
```

## Menjalankan Aplikasi

### Development mode (dengan auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### 1. Get All Personnel
```
GET /api/personnel
```

### 2. Search Personnel
```
GET /api/personnel?query=nama
GET /api/personnel?status=aktif
```

### 3. Get Personnel by ID
```
GET /api/personnel/:id
```

### 4. Create New Personnel
```
POST /api/personnel
Content-Type: application/json

{
  "nip": "198001012010011004",
  "nama": "John Doe",
  "jabatan": "Staff",
  "unit_kerja": "IT Department",
  "email": "john.doe@hermes.id",
  "telepon": "081234567893",
  "alamat": "Jakarta",
  "tanggal_lahir": "1980-01-01",
  "tanggal_masuk": "2010-01-01",
  "status": "aktif",
  "additional_data": {
    "badge_number": "B005",
    "department_code": "IT03",
    "access_level": 2,
    "skills": ["Python", "JavaScript"],
    "certifications": ["AWS Certified"]
  }
}
```

**Note**: Field `additional_data` adalah JSONB yang dapat menyimpan key-value pairs apa saja sesuai kebutuhan.

### 5. Update Personnel
```
PUT /api/personnel/:id
Content-Type: application/json

{
  "nip": "198001012010011004",
  "nama": "John Doe Updated",
  "jabatan": "Senior Staff",
  ...
}
```

### 6. Delete Personnel
```
DELETE /api/personnel/:id
```

## Key-Value Metadata (additional_data)

Field `additional_data` menggunakan tipe JSONB PostgreSQL yang memungkinkan penyimpanan metadata fleksibel dalam format key-value. Anda dapat menyimpan informasi tambahan apa saja yang diperlukan untuk setiap personnel.

### Contoh Penggunaan:

**Menyimpan data custom:**
```json
{
  "additional_data": {
    "badge_number": "B001",
    "department_code": "IT01",
    "access_level": 3,
    "skills": ["JavaScript", "Python", "PostgreSQL"],
    "certifications": ["AWS", "Azure"],
    "emergency_contact": {
      "name": "Jane Doe",
      "phone": "081234567890"
    }
  }
}
```

**Keuntungan JSONB:**
- Tidak perlu mengubah schema database untuk menambah field baru
- Mendukung indexing untuk pencarian cepat
- Dapat menyimpan nested objects dan arrays
- Fleksibel untuk berbagai use case

**Query berdasarkan key-value:**
Model sudah dilengkapi dengan method `searchByAdditionalData()` dan `updateAdditionalDataKey()` untuk manipulasi data key-value.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "..."
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "..."
}
```

## Testing

Untuk menjalankan tests:
```bash
npm test
```

## Struktur Project

```
hermes/
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/
│   │   └── personnelController.js
│   ├── models/
│   │   └── personnel.js      # Personnel model
│   ├── routes/
│   │   └── personnel.js      # API routes
│   ├── database/
│   │   └── init.js           # Database initialization
│   └── index.js              # Main application entry
├── database/
│   └── personnel.db          # SQLite database file
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

## Environment Variables

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hermes_db
DB_USER=postgres
DB_PASSWORD=postgres
```

## License

MIT