import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Input Validation (POST /api/plan/generate)', () => {
  const validBasePayload = {
    name: 'Aarav Birthday Celebration',
    eventType: 'birthday',
    eventDate: '2026-11-20',
    totalBudget: 35000,
    guestCount: 50,
    currency: 'INR',
  };

  it('rejects requests with missing or empty event name with HTTP 400', async () => {
    const payloadWithoutName = { ...validBasePayload, name: '' };
    const res = await request(app)
      .post('/api/plan/generate')
      .send(payloadWithoutName);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/event name is required/i);
  });

  it('rejects requests with event name longer than 120 characters with HTTP 400', async () => {
    const longName = 'Grand Celebration Party '.repeat(10); // > 120 chars
    const payloadWithLongName = { ...validBasePayload, name: longName };
    const res = await request(app)
      .post('/api/plan/generate')
      .send(payloadWithLongName);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/under 120 characters/i);
  });

  it('rejects requests with invalid guest count (zero or negative) with HTTP 400', async () => {
    const resZero = await request(app)
      .post('/api/plan/generate')
      .send({ ...validBasePayload, guestCount: 0 });
    expect(resZero.status).toBe(400);
    expect(resZero.body.error).toMatch(/guest count/i);

    const resNegative = await request(app)
      .post('/api/plan/generate')
      .send({ ...validBasePayload, guestCount: -15 });
    expect(resNegative.status).toBe(400);
    expect(resNegative.body.error).toMatch(/guest count/i);
  });

  it('rejects requests with excessively high guest count (>50000) with HTTP 400', async () => {
    const res = await request(app)
      .post('/api/plan/generate')
      .send({ ...validBasePayload, guestCount: 99999 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/guest count/i);
  });

  it('rejects requests with invalid budget (below minimum threshold or negative) with HTTP 400', async () => {
    const resLow = await request(app)
      .post('/api/plan/generate')
      .send({ ...validBasePayload, totalBudget: 50 }); // min is 100
    expect(resLow.status).toBe(400);
    expect(resLow.body.error).toMatch(/budget/i);

    const resNegative = await request(app)
      .post('/api/plan/generate')
      .send({ ...validBasePayload, totalBudget: -5000 });
    expect(resNegative.status).toBe(400);
    expect(resNegative.body.error).toMatch(/budget/i);
  });

  it('rejects empty payload objects with HTTP 400', async () => {
    const res = await request(app)
      .post('/api/plan/generate')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
