import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Required for Supabase's self-signed certificate
  }
});

async function executeSql(query: string) {
  const client = await pool.connect();
  try {
    await client.query(query);
  } finally {
    client.release();
  }
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let currentStatement = '';
  let insideFunction = false;
  
  // Split by lines to handle each line properly
  const lines = sql.split('\n');
  
  for (const line of lines) {
    // Check if we're entering a function definition
    if (line.includes('CREATE') && line.includes('FUNCTION')) {
      insideFunction = true;
    }
    
    // Add the line to current statement
    currentStatement += line + '\n';
    
    // If we're inside a function, look for the end of the function definition
    if (insideFunction && line.trim().endsWith('$$;')) {
      insideFunction = false;
      statements.push(currentStatement.trim());
      currentStatement = '';
      continue;
    }
    
    // If we're not inside a function and line ends with semicolon, it's a complete statement
    if (!insideFunction && line.trim().endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements.filter(stmt => stmt.length > 0);
}

async function runMigrations() {
  try {
    console.log('Starting migrations...');

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // This ensures migrations run in order by filename

    // Run each migration file
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      // Split the migration file into individual statements
      const statements = splitSqlStatements(migration);

      // Execute each statement
      for (const statement of statements) {
        try {
          await executeSql(statement);
          console.log(`Successfully executed statement in ${file}`);
        } catch (error) {
          console.error(`Error executing statement: ${statement}`);
          console.error('Error details:', error);
          throw error;
        }
      }

      console.log(`Successfully executed migration: ${file}`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
