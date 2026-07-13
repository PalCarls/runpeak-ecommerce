import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

const encode = (value: string | Buffer) => Buffer.from(value).toString('base64url');
const secret = () => process.env.AUTH_SECRET ?? 'runpeak-local-secret-change-me';

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, storedHash] = stored.split(':');
  if (!salt || !storedHash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(storedHash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function createToken(user: AuthUser) {
  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }));
  const signature = createHmac('sha256', secret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function readToken(value?: string): AuthUser | null {
  if (!value?.startsWith('Bearer ')) return null;
  const [header, payload, signature] = value.slice(7).split('.');
  if (!header || !payload || !signature) return null;
  const expected = createHmac('sha256', secret()).update(`${header}.${payload}`).digest();
  const received = Buffer.from(signature, 'base64url');
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AuthUser & { exp: number };
  if (!decoded.id || decoded.exp < Math.floor(Date.now() / 1000)) return null;
  return { id: decoded.id, email: decoded.email, role: decoded.role };
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  try {
    req.user = readToken(req.headers.authorization) ?? undefined;
  } catch {
    req.user = undefined;
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  optionalAuth(req, res, () => {
    if (!req.user) return res.status(401).json({ message: 'Debes iniciar sesión' });
    next();
  });
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Acceso solo para administradores' });
    next();
  });
}
