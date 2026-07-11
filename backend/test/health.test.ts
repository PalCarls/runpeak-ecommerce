import { describe, expect, it } from 'vitest';

import { app } from '../src/app.js';

describe('GET /api/health', () => {
  it('returns OK status', async () => {
    const server = app.listen(0);
    try {
      const address = server.address();

      if (!address || typeof address === 'string') {
        throw new Error('No se pudo obtener un puerto de prueba');
      }

      const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ status: 'OK' });
    } finally {
      server.close();
    }
  });
});
