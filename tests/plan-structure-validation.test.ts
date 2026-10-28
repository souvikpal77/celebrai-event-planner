import { describe, it, expect } from 'vitest';
import { generateDeterministicPlan } from '../server';
import { EventType, PlanGenerationRequest } from '../src/types/event';

describe('Event Plan Structure Validation (Offline / Deterministic)', () => {
  const allEventTypes: EventType[] = ['birthday', 'wedding', 'community', 'anniversary', 'other'];

  it.each(allEventTypes)(
    'validates that generated plan structure for "%s" conforms strictly to schema',
    (eventType) => {
      const request: PlanGenerationRequest = {
        name: `Celebration for ${eventType}`,
        eventType,
        eventDate: '2026-11-30',
        location: 'Heritage Banquet Hall',
        guestCount: 80,
        totalBudget: 60000,
        currency: 'INR',
        themePreferences: 'Elegant and contemporary',
        dietaryRequirements: 'Vegetarian and vegan options',
        accessibilityRequirements: 'Wheelchair accessible entrance',
        planningPriorities: 'Seamless guest experience',
      };

      const plan = generateDeterministicPlan(request);

      // Top-level structure validation
      expect(typeof plan.eventOverview).toBe('string');
      expect(plan.eventOverview.length).toBeGreaterThan(10);

      expect(typeof plan.personalizedConcept).toBe('string');
      expect(plan.personalizedConcept.length).toBeGreaterThan(10);

      expect(plan.source).toBe('demo');
      expect(new Date(plan.generatedAt).toISOString()).toBe(plan.generatedAt);

      // Budget categories structure
      expect(Array.isArray(plan.budgetCategories)).toBe(true);
      expect(plan.budgetCategories.length).toBeGreaterThanOrEqual(4);
      plan.budgetCategories.forEach((cat) => {
        expect(cat).toHaveProperty('id');
        expect(typeof cat.id).toBe('string');
        expect(typeof cat.category).toBe('string');
        expect(cat.category.length).toBeGreaterThan(0);
        expect(typeof cat.estimatedAmount).toBe('number');
        expect(cat.estimatedAmount).toBeGreaterThan(0);
        expect(typeof cat.percentage).toBe('number');
        expect(cat.percentage).toBeGreaterThan(0);
        expect(typeof cat.explanation).toBe('string');
      });

      // Tasks structure
      expect(Array.isArray(plan.tasks)).toBe(true);
      expect(plan.tasks.length).toBeGreaterThanOrEqual(4);
      plan.tasks.forEach((task) => {
        expect(typeof task.id).toBe('string');
        expect(typeof task.title).toBe('string');
        expect(task.title.length).toBeGreaterThan(0);
        expect(typeof task.description).toBe('string');
        expect(typeof task.dueDate).toBe('string');
        expect(['high', 'medium', 'low']).toContain(task.priority);
        expect(task.status).toBe('pending');
      });

      // Vendors structure
      expect(Array.isArray(plan.vendors)).toBe(true);
      expect(plan.vendors.length).toBeGreaterThanOrEqual(4);
      plan.vendors.forEach((vendor) => {
        expect(typeof vendor.id).toBe('string');
        expect(typeof vendor.category).toBe('string');
        expect(typeof vendor.description).toBe('string');
        expect(['to_contact', 'contacted', 'shortlisted', 'booked']).toContain(vendor.status);
        expect(typeof vendor.notes).toBe('string');
      });

      // Ideas structure
      expect(Array.isArray(plan.ideas)).toBe(true);
      expect(plan.ideas.length).toBeGreaterThanOrEqual(4);
      const validCategories = [
        'theme',
        'decor',
        'food',
        'entertainment',
        'activities',
        'guest_experience',
        'invitations',
        'photography',
      ];
      plan.ideas.forEach((idea) => {
        expect(typeof idea.id).toBe('string');
        expect(typeof idea.title).toBe('string');
        expect(idea.title.length).toBeGreaterThan(0);
        expect(typeof idea.description).toBe('string');
        expect(validCategories).toContain(idea.category);
        expect(typeof idea.reasonWhyItFits).toBe('string');
      });

      // Event-day schedule structure
      expect(Array.isArray(plan.eventDaySchedule)).toBe(true);
      expect(plan.eventDaySchedule.length).toBeGreaterThanOrEqual(5);
      plan.eventDaySchedule.forEach((item) => {
        expect(typeof item.id).toBe('string');
        expect(typeof item.time).toBe('string');
        expect(typeof item.activity).toBe('string');
        expect(typeof item.description).toBe('string');
      });

      // Practical tips structure
      expect(Array.isArray(plan.practicalTips)).toBe(true);
      expect(plan.practicalTips.length).toBeGreaterThanOrEqual(3);
      plan.practicalTips.forEach((tip) => {
        expect(typeof tip).toBe('string');
        expect(tip.length).toBeGreaterThan(5);
      });
    }
  );
});
