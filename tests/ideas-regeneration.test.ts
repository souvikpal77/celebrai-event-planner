import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { RegenerateIdeasRequest } from '../src/types/event';

describe('Ideas Regeneration Suite (POST /api/plan/regenerate-ideas)', () => {
  const sampleRequest: RegenerateIdeasRequest = {
    eventType: 'birthday',
    location: 'Garden Courtyard',
    guestCount: 45,
    totalBudget: 35000,
    currency: 'INR',
    themePreferences: 'Lanterns and Acoustic Harmony',
    dietaryRequirements: 'Vegetarian and gluten-free',
  };

  it('returns HTTP 200 with structured celebration ideas in demo/offline mode', async () => {
    const res = await request(app)
      .post('/api/plan/regenerate-ideas')
      .send(sampleRequest);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.ideas)).toBe(true);
    expect(res.body.ideas.length).toBeGreaterThanOrEqual(4);
    expect(res.body.source).toBe('demo');

    // Verify idea structure and required properties
    for (const idea of res.body.ideas) {
      expect(idea).toHaveProperty('id');
      expect(idea).toHaveProperty('category');
      expect(idea).toHaveProperty('title');
      expect(idea).toHaveProperty('description');
      expect(idea).toHaveProperty('reasonWhyItFits');
      expect(typeof idea.title).toBe('string');
      expect(idea.title.trim().length).toBeGreaterThan(0);
      expect(typeof idea.description).toBe('string');
      expect(idea.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('rejects invalid or non-object payload with HTTP 400', async () => {
    const res = await request(app)
      .post('/api/plan/regenerate-ideas')
      .set('Content-Type', 'application/json')
      .send('not-a-json-object');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('adapts ideas based on the provided guest count and dietary requirements', async () => {
    const customReq: RegenerateIdeasRequest = {
      eventType: 'wedding',
      location: 'Seaside Pavilion',
      guestCount: 150,
      totalBudget: 90000,
      currency: 'INR',
      themePreferences: 'Coastal Elegance',
      dietaryRequirements: 'Vegan only',
    };

    const res = await request(app)
      .post('/api/plan/regenerate-ideas')
      .send(customReq);

    expect(res.status).toBe(200);
    expect(res.body.ideas).toBeDefined();

    // Check that reasons or descriptions incorporate event context
    const reasons = res.body.ideas.map((i: { reasonWhyItFits: string }) => i.reasonWhyItFits).join(' ');
    expect(reasons).toMatch(/150|Vegan only/i);
  });
});
