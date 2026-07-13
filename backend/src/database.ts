import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const connectionString = process.env.DATABASE_URL;

export const database = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: Number(process.env.DATABASE_POOL_MAX) || 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    })
  : null;

if (database && process.env.VERCEL) {
  attachDatabasePool(database);
}

export async function checkDatabaseConnection() {
  if (!database) {
    throw new Error('DATABASE_URL no está configurada');
  }

  await database.query('SELECT 1');
}
