import { spawn } from 'child_process';
import path from 'path';

export async function runMigrations() {
  return new Promise((resolve, reject) => {
    const dbUrl = process.env.DATABASE_URL || 
      `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    const migrate = spawn('node-pg-migrate', ['up'], {
      env: {
        ...process.env,
        DATABASE_URL: dbUrl,
      },
      cwd: path.join(__dirname, '../../'),
    });

    migrate.stdout.on('data', (data) => {
      console.log(`Migration: ${data}`);
    });

    migrate.stderr.on('data', (data) => {
      console.error(`Migration error: ${data}`);
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        console.log('Database migrations completed successfully');
        resolve(true);
      } else {
        reject(new Error(`Migration process exited with code ${code}`));
      }
    });
  });
}
