import { describe, it, expect } from 'vitest';
import { generateDeterministicPlan } from '../server';
import { PlanGenerationRequest, EventType } from '../src/types/event';

describe('Budget Integrity Tests', () => {
  const eventTypes: EventType[] = [
    'birthday',
    'wedding',
    'community',
    'anniversary',
    'other',
  ];

  it('ensures budget category percentages add up to exactly 100% across all event types', () => {
    eventTypes.forEach((eventType) => {
      const plan = generateDeterministicPlan({
        name: `Test ${eventType} celebration`,
        eventType,
        eventDate: '2026-12-01',
        location: 'Celebration Venue',
        totalBudget: 50000,
        guestCount: 75,
        currency: 'INR',
      });

      const totalPercentage = plan.budgetCategories.reduce(
        (sum, cat) => sum + cat.percentage,
        0
      );

      expect(
        totalPercentage,
        `Expected ${eventType} budget percentages to equal 100%, got ${totalPercentage}`
      ).toBe(100);
    });
  });

  it('ensures generated budget amounts are consistent with the requested total budget (50,000 INR)', () => {
    const requestedBudget = 50000;
    const plan = generateDeterministicPlan({
      name: 'Birthday Party',
      eventType: 'birthday',
      eventDate: '2026-11-15',
      location: 'Party Lounge',
      totalBudget: requestedBudget,
      guestCount: 50,
      currency: 'INR',
    });

    const allocatedSum = plan.budgetCategories.reduce(
      (sum, cat) => sum + cat.estimatedAmount,
      0
    );

    // Amounts are rounded to integer, so sum should equal requestedBudget within +/- 1 unit
    expect(Math.abs(allocatedSum - requestedBudget)).toBeLessThanOrEqual(1);

    plan.budgetCategories.forEach((cat) => {
      expect(cat.estimatedAmount).toBeGreaterThan(0);
      expect(cat.percentage).toBeGreaterThan(0);
      expect(cat.percentage).toBeLessThanOrEqual(100);
    });
  });

  it('ensures generated budget amounts scale correctly for a larger budget (150,000 INR)', () => {
    const requestedBudget = 150000;
    const plan = generateDeterministicPlan({
      name: 'Grand Wedding Reception',
      eventType: 'wedding',
      eventDate: '2026-12-25',
      location: 'Grand Ballroom',
      totalBudget: requestedBudget,
      guestCount: 250,
      currency: 'INR',
    });

    const allocatedSum = plan.budgetCategories.reduce(
      (sum, cat) => sum + cat.estimatedAmount,
      0
    );

    expect(Math.abs(allocatedSum - requestedBudget)).toBeLessThanOrEqual(1);
  });
});
