# Hermes - User Database Backend

Backend API untuk mengelola data user dengan database PostgreSQL.

## Fitur

- ✅ CRUD operations lengkap untuk data user
- ✅ Database PostgreSQL
- ✅ RESTful API dengan Express.js
- ✅ Pencarian dan filter data user
- ✅ Validasi data
- ✅ Sample data untuk testing
- ✅ Support untuk social media usernames
- ✅ **Telegram Bot Integration** - Update data user melalui Telegram

## Struktur Database

Tabel `users` memiliki field-field berikut:

- `id` - Primary key (auto increment)
- `uuid` - Unique user identifier (unique, required)
- `nama` - Nama lengkap (required)
- `jabatan` - Jabatan/posisi
- `unit_kerja` - Unit kerja/departemen
- `email` - Email address
- `telepon` - Nomor telepon
- `status` - Status (aktif/non-aktif)
- `pangkat` - Pangkat/grade
- `rayon` - Rayon/region
- `ig_uname` - Instagram username
- `fb_uname` - Facebook username
- `tt_uname` - TikTok username
- `x_uname` - X (Twitter) username
- `yt_uname` - YouTube username
- `telegram_id` - Telegram user ID (for bot integration)
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

**Alternatif:** Anda juga bisa menggunakan file schema.sql atau migrations:
```bash
# Menggunakan schema.sql langsung
psql -U postgres -d hermes_db -f schema.sql

# Atau menggunakan migrations secara berurutan
psql -U postgres -d hermes_db -f migrations/001_initial_schema.sql
psql -U postgres -d hermes_db -f migrations/002_sample_data.sql
```

Lihat dokumentasi lengkap di [migrations/README.md](migrations/README.md)

## Database Schema & Migrations

Project ini menyediakan dua cara untuk setup database:

1. **schema.sql** - File schema lengkap yang berisi semua definisi table, index, trigger, dan function
2. **migrations/** - Folder berisi migration files yang terorganisir dan terversionisasi

Untuk informasi detail tentang migrations, lihat [migrations/README.md](migrations/README.md)

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

### 1. Get All Users
```
GET /api/users
```

### 2. Search Users
```
GET /api/users?query=nama
GET /api/users?status=aktif
```

### 3. Get User by ID
```
GET /api/users/:id
```

### 4. Create New User
```
POST /api/users
Content-Type: application/json

{
  "uuid": "550e8400-e29b-41d4-a716-446655440004",
  "nama": "John Doe",
  "jabatan": "Staff",
  "unit_kerja": "IT Department",
  "email": "john.doe@hermes.id",
  "telepon": "081234567893",
  "status": "aktif",
  "pangkat": "Pengurus",
  "rayon": "Rayon 1",
  "ig_uname": "johndoe",
  "fb_uname": "john.doe",
  "tt_uname": "johndoe_official",
  "x_uname": "johndoe",
  "yt_uname": "johndoe"
}
```

### 5. Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "uuid": "550e8400-e29b-41d4-a716-446655440004",
  "nama": "John Doe Updated",
  "jabatan": "Senior Staff",
  ...
}
```

### 6. Delete User
```
DELETE /api/users/:id
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
│   │   └── database.js         # Database configuration
│   ├── controllers/
│   │   └── userController.js   # User controller
│   ├── models/
│   │   └── user.js             # User model
│   ├── routes/
│   │   └── user.js             # API routes
│   ├── services/
│   │   └── telegramBot.js      # Telegram bot service
│   ├── database/
│   │   └── init.js             # Database initialization
│   └── index.js                # Main application entry
├── migrations/
│   ├── 001_initial_schema.sql     # Initial schema migration
│   ├── 002_sample_data.sql        # Sample data migration
│   ├── 004_add_telegram_id.sql    # Telegram ID field migration
│   └── README.md                  # Migration documentation
├── schema.sql                  # Complete database schema
├── .env.example                # Environment variables template
├── TELEGRAM_BOT.md             # Telegram bot documentation
├── package.json
└── README.md
```

## Environment Variables

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hermes_db
DB_USER=postgres
DB_PASSWORD=postgres

# Telegram Bot Configuration (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

**Note**: Untuk menggunakan Telegram Bot, dapatkan token dari @BotFather di Telegram. Lihat [TELEGRAM_BOT.md](TELEGRAM_BOT.md) untuk panduan lengkap.

## Telegram Bot Integration

Hermes menyediakan Telegram Bot untuk memudahkan user mengupdate data mereka melalui Telegram. Fitur ini optional dan dapat diaktifkan dengan mengkonfigurasi `TELEGRAM_BOT_TOKEN`.

### Quick Start Telegram Bot

1. Dapatkan token bot dari [@BotFather](https://t.me/BotFather) di Telegram
2. Tambahkan token ke file `.env`:
   ```
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
3. Jalankan migration untuk menambahkan field `telegram_id`:
   ```bash
   psql -U postgres -d hermes_db -f migrations/004_add_telegram_id.sql
   ```
4. Start aplikasi: `npm start`
5. Buka bot di Telegram dan gunakan `/start`

### Telegram Bot Features

- 🔗 Link akun Telegram dengan UUID (NRP)
- ✏️ Update nama, pangkat, telepon, social media usernames
- 📊 View data user
- 🤖 Command-based interface

Untuk dokumentasi lengkap, lihat [TELEGRAM_BOT.md](TELEGRAM_BOT.md).

## License

MIT