import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, generateDeterministicPlan } from '../server';
import { PlanGenerationRequest } from '../src/types/event';

describe('Deterministic Fallback Planning & Fallback Behavior', () => {
  const validBirthdayEvent: PlanGenerationRequest = {
    name: "Rohan's 25th Milestone Birthday",
    eventType: 'birthday',
    eventDate: '2026-12-15',
    location: 'Emerald Banquet Gardens',
    guestCount: 60,
    totalBudget: 45000,
    currency: 'INR',
    themePreferences: 'Rustic Garden & Golden Ambient Lights',
    dietaryRequirements: 'Vegetarian snacks and customized mocktails',
    accessibilityRequirements: 'Wheelchair ramp to dining lawn',
    planningPriorities: 'Memorable guest ambiance, good music, on-time dinner',
  };

  describe('Deterministic Engine Unit Verification', () => {
    it('generates a complete plan for a valid birthday celebration', () => {
      const plan = generateDeterministicPlan(validBirthdayEvent);

      // Verify a plan is generated
      expect(plan).toBeDefined();
      expect(plan.eventOverview).toContain("Rohan's 25th Milestone Birthday");
      expect(plan.personalizedConcept).toBeDefined();
      expect(plan.source).toBe('demo');

      // Verify budget categories exist and have content
      expect(Array.isArray(plan.budgetCategories)).toBe(true);
      expect(plan.budgetCategories.length).toBeGreaterThanOrEqual(4);

      // Verify tasks exist and have content
      expect(Array.isArray(plan.tasks)).toBe(true);
      expect(plan.tasks.length).toBeGreaterThanOrEqual(4);
      expect(plan.tasks[0]).toHaveProperty('title');
      expect(plan.tasks[0]).toHaveProperty('dueDate');
      expect(plan.tasks[0]).toHaveProperty('priority');

      // Verify vendors exist and have content
      expect(Array.isArray(plan.vendors)).toBe(true);
      expect(plan.vendors.length).toBeGreaterThanOrEqual(4);
      expect(plan.vendors[0]).toHaveProperty('category');
      expect(plan.vendors[0]).toHaveProperty('description');

      // Verify ideas exist and have content
      expect(Array.isArray(plan.ideas)).toBe(true);
      expect(plan.ideas.length).toBeGreaterThanOrEqual(4);
      expect(plan.ideas[0]).toHaveProperty('title');
      expect(plan.ideas[0]).toHaveProperty('reasonWhyItFits');

      // Verify event-day schedule exists and has content
      expect(Array.isArray(plan.eventDaySchedule)).toBe(true);
      expect(plan.eventDaySchedule.length).toBeGreaterThanOrEqual(5);
      expect(plan.eventDaySchedule[0]).toHaveProperty('time');
      expect(plan.eventDaySchedule[0]).toHaveProperty('activity');

      // Verify practical tips exist and have content
      expect(Array.isArray(plan.practicalTips)).toBe(true);
      expect(plan.practicalTips.length).toBeGreaterThanOrEqual(3);
      expect(typeof plan.practicalTips[0]).toBe('string');
    });
  });

  describe('Fallback Endpoint Integration (POST /api/plan/generate)', () => {
    it('produces a deterministic/demo plan when Gemini is unavailable in the environment', async () => {
      const res = await request(app)
        .post('/api/plan/generate')
        .send(validBirthdayEvent);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.mode).toBe('demo');
      expect(res.body.plan).toBeDefined();

      const plan = res.body.plan;
      expect(plan.source).toBe('demo');
      expect(plan.budgetCategories.length).toBeGreaterThan(0);
      expect(plan.tasks.length).toBeGreaterThan(0);
      expect(plan.vendors.length).toBeGreaterThan(0);
      expect(plan.ideas.length).toBeGreaterThan(0);
      expect(plan.eventDaySchedule.length).toBeGreaterThan(0);
      expect(plan.practicalTips.length).toBeGreaterThan(0);
    });
  });
});
