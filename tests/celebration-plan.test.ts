import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculatePercentage } from '../src/utils/currency';
import { generateCelebrationPlan } from '../src/utils/aiGenerator';
import { generateDeterministicPlan } from '../server';
import { PlanGenerationRequest } from '../src/types/event';

describe('Unit Tests: calculatePercentage (src/utils/currency.ts)', () => {
  it('calculates straightforward percentages accurately', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(100, 100)).toBe(100);
    expect(calculatePercentage(0, 100)).toBe(0);
  });

  it('rounds floating-point percentage values to one decimal place', () => {
    expect(calculatePercentage(1, 3)).toBe(33.3);
    expect(calculatePercentage(2, 3)).toBe(66.7);
    expect(calculatePercentage(15, 75)).toBe(20);
    expect(calculatePercentage(7, 30)).toBe(23.3);
  });

  it('safely handles division by zero and returns 0 without crashing', () => {
    expect(calculatePercentage(500, 0)).toBe(0);
    expect(calculatePercentage(0, 0)).toBe(0);
    expect(calculatePercentage(100, -10)).toBe(0);
    expect(calculatePercentage(100, -0.001)).toBe(0);
  });

  it('caps excessively high percentage values at 999 to protect layout rendering', () => {
    expect(calculatePercentage(100000, 10)).toBe(999);
  });
});

describe('Unit Tests: generateCelebrationPlan deterministic logic (src/utils/aiGenerator.ts)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const sampleRequest: PlanGenerationRequest = {
    name: "Aanya's 18th Birthday Celebration",
    eventType: 'birthday',
    eventDate: '2026-11-20',
    location: 'Skyline Terrace Lounge',
    guestCount: 50,
    totalBudget: 40000,
    currency: 'INR',
    themePreferences: 'Bohemian Garden with Pastel Lights',
    dietaryRequirements: 'Vegetarian and gluten-free dessert options',
    accessibilityRequirements: 'Elevator access to terrace',
    planningPriorities: 'Memorable photo corners and acoustic music',
  };

  it('returns a complete deterministic plan in demo mode without calling Gemini API', async () => {
    const deterministicPlan = generateDeterministicPlan(sampleRequest);
    const mockApiResponse = {
      plan: deterministicPlan,
      mode: 'demo' as const,
      notice: 'Generated using CelebrAI local planning engine.',
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
    global.fetch = fetchSpy;

    const result = await generateCelebrationPlan(sampleRequest);

    // Verify fetch was directed to internal relative API route, never Gemini API
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe('/api/plan/generate');
    expect(calledUrl).not.toContain('generativelanguage.googleapis.com');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.headers['Content-Type']).toBe('application/json');

    // Verify payload serialization
    const parsedBody = JSON.parse(calledOptions.body);
    expect(parsedBody.name).toBe("Aanya's 18th Birthday Celebration");
    expect(parsedBody.eventType).toBe('birthday');
    expect(parsedBody.totalBudget).toBe(40000);

    // Verify returned deterministic plan structure
    expect(result.mode).toBe('demo');
    expect(result.plan).toBeDefined();
    expect(result.plan.source).toBe('demo');
    expect(result.plan.budgetCategories.length).toBeGreaterThanOrEqual(4);
    expect(result.plan.tasks.length).toBeGreaterThanOrEqual(4);
    expect(result.plan.vendors.length).toBeGreaterThanOrEqual(4);
    expect(result.plan.ideas.length).toBeGreaterThanOrEqual(4);
    expect(result.plan.eventDaySchedule.length).toBeGreaterThanOrEqual(5);
    expect(result.plan.practicalTips.length).toBeGreaterThanOrEqual(3);
  });

  it('properly propagates server validation errors when input is invalid', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Event name is required and must be under 120 characters' }),
    });

    await expect(
      generateCelebrationPlan({ ...sampleRequest, name: '' })
    ).rejects.toThrow('Event name is required and must be under 120 characters');
  });

  it('handles network failure gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    await expect(generateCelebrationPlan(sampleRequest)).rejects.toThrow(
      'Network connection failed'
    );
  });
});
