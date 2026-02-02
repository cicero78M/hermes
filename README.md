# Hermes - Personnel Database Backend

Backend API untuk mengelola data personil dengan database SQLite.

## Fitur

- ✅ CRUD operations lengkap untuk data personil
- ✅ Database SQLite yang ringan dan portable
- ✅ RESTful API dengan Express.js
- ✅ Pencarian dan filter data personil
- ✅ Validasi data
- ✅ Sample data untuk testing

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
- `created_at` - Timestamp created
- `updated_at` - Timestamp updated

## Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd hermes
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Initialize database:
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
  "status": "aktif"
}
```

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
PORT=3000
NODE_ENV=development
DB_PATH=./database/personnel.db
```

## License

MIT