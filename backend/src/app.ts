import express, { type ErrorRequestHandler } from 'express';
import { checkDatabaseConnection } from './database.js';
import { api } from './routes.js';

export const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/health/db', async (_req, res) => {
  try {
    await checkDatabaseConnection();
    res.status(200).json({ status: 'OK', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({ status: 'ERROR', database: 'disconnected' });
  }
});

app.use('/api', api);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Unhandled request error:', error);
  res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
};

app.use(errorHandler);

export default app;
