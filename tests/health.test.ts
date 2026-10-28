import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Health Endpoint (GET /api/health)', () => {
  it('returns HTTP 200 and status "ok"', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.status).toBe('ok');
  });

  it('includes an ISO timestamp in the health response', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });
});
