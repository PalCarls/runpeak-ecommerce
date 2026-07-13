import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { database } from '../database.js';

if (!database) throw new Error('DATABASE_URL no está configurada');

const migrationUrl = new URL('../migrations/001_initial.sql', import.meta.url);
const sql = await readFile(fileURLToPath(migrationUrl), 'utf8');

try {
  await database.query(sql);
  console.log('Migración 001_initial aplicada');
} finally {
  await database.end();
}
