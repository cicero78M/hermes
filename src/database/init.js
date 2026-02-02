const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/personnel.db');
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the personnel database.');
});

// Create personnel table
const createPersonnelTable = `
  CREATE TABLE IF NOT EXISTS personnel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create index for faster searches
const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_personnel_nip ON personnel(nip);
  CREATE INDEX IF NOT EXISTS idx_personnel_nama ON personnel(nama);
  CREATE INDEX IF NOT EXISTS idx_personnel_status ON personnel(status);
`;

db.serialize(() => {
  // Create tables
  db.run(createPersonnelTable, (err) => {
    if (err) {
      console.error('Error creating personnel table:', err.message);
    } else {
      console.log('Personnel table created successfully.');
    }
  });

  // Create indexes
  db.exec(createIndexes, (err) => {
    if (err) {
      console.error('Error creating indexes:', err.message);
    } else {
      console.log('Indexes created successfully.');
    }
  });

  // Insert sample data
  const insertSample = `
    INSERT OR IGNORE INTO personnel (nip, nama, jabatan, unit_kerja, email, telepon, status)
    VALUES 
      ('198001012010011001', 'Budi Santoso', 'Kepala Bagian', 'IT Department', 'budi.santoso@hermes.id', '081234567890', 'aktif'),
      ('198502152012022002', 'Siti Nurhaliza', 'Staff', 'HR Department', 'siti.nurhaliza@hermes.id', '081234567891', 'aktif'),
      ('199003202015031003', 'Ahmad Dhani', 'Manager', 'Finance Department', 'ahmad.dhani@hermes.id', '081234567892', 'aktif');
  `;

  db.exec(insertSample, (err) => {
    if (err) {
      console.error('Error inserting sample data:', err.message);
    } else {
      console.log('Sample data inserted successfully.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database initialization completed.');
  }
});
