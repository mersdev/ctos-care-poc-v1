import pkg from 'pg';
const { Pool } = pkg;
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration for Supabase PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '6543'),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connection
  }
});

// Function to run migrations
export async function runMigrations() {
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // This ensures migrations run in order by filename

    // Run each migration file
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(migration);
    }

    // Commit the transaction
    await client.query('COMMIT');
    console.log('All migrations completed successfully');
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to Supabase PostgreSQL database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
}

// Export the pool for use in other files
export default pool;
