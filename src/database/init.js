const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hermes_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to PostgreSQL database.');
    
    // Create users table with JSONB for key-value metadata
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(50) UNIQUE NOT NULL,
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
    `;
    
    await client.query(createUsersTable);
    console.log('Users table created successfully.');
    
    // Create indexes for faster searches
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
      CREATE INDEX IF NOT EXISTS idx_users_nama ON users(nama);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
      CREATE INDEX IF NOT EXISTS idx_users_additional_data ON users USING GIN(additional_data);
    `;
    
    await client.query(createIndexes);
    console.log('Indexes created successfully.');
    
    // Create trigger for updating updated_at timestamp
    const createTrigger = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;
    
    await client.query(createTrigger);
    console.log('Trigger created successfully.');
    
    // Check if sample data exists
    const checkData = await client.query('SELECT COUNT(*) FROM users');
    const count = parseInt(checkData.rows[0].count);
    
    if (count === 0) {
      // Insert sample data with key-value additional_data
      const insertSample = `
        INSERT INTO users (uuid, nama, jabatan, unit_kerja, email, telepon, status, additional_data)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8),
          ($9, $10, $11, $12, $13, $14, $15, $16),
          ($17, $18, $19, $20, $21, $22, $23, $24)
      `;
      
      await client.query(insertSample, [
        '550e8400-e29b-41d4-a716-446655440001', 'Budi Santoso', 'Kepala Bagian', 'IT Department', 
        'budi.santoso@hermes.id', '081234567890', 'aktif', 
        JSON.stringify({ badge_number: 'B001', department_code: 'IT01', access_level: 3 }),
        
        '550e8400-e29b-41d4-a716-446655440002', 'Siti Nurhaliza', 'Staff', 'HR Department', 
        'siti.nurhaliza@hermes.id', '081234567891', 'aktif',
        JSON.stringify({ badge_number: 'B002', department_code: 'HR01', access_level: 2 }),
        
        '550e8400-e29b-41d4-a716-446655440003', 'Ahmad Dhani', 'Manager', 'Finance Department', 
        'ahmad.dhani@hermes.id', '081234567892', 'aktif',
        JSON.stringify({ badge_number: 'B003', department_code: 'FIN01', access_level: 4 })
      ]);
      
      console.log('Sample data inserted successfully.');
    } else {
      console.log('Sample data already exists. Skipping insertion.');
    }
    
    console.log('Database initialization completed successfully.');
    
  } catch (err) {
    console.error('Error during database initialization:', err.message);
    throw err;
  } finally {
    client.release();
    // Close pool only for initialization script
    await pool.end();
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log('Database setup complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
