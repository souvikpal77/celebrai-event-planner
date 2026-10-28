import { describe, it, expect } from 'vitest';
import {
  calculateAllocated,
  calculateRemaining,
  calculatePercentage,
  isOverBudget,
  formatCurrency,
} from '../src/utils/currency';
import { BudgetCategory } from '../src/types/event';

describe('Core Deterministic Budget Calculations', () => {
  describe('calculateAllocated', () => {
    it('returns 0 for empty or invalid categories array', () => {
      expect(calculateAllocated([])).toBe(0);
      expect(calculateAllocated(null as unknown as BudgetCategory[])).toBe(0);
      expect(calculateAllocated(undefined as unknown as BudgetCategory[])).toBe(0);
    });

    it('sums category amounts deterministically', () => {
      const categories: BudgetCategory[] = [
        { id: '1', category: 'Catering', estimatedAmount: 15000, percentage: 50, explanation: '' },
        { id: '2', category: 'Venue', estimatedAmount: 10000, percentage: 33.3, explanation: '' },
        { id: '3', category: 'Decor', estimatedAmount: 5000, percentage: 16.7, explanation: '' },
      ];
      expect(calculateAllocated(categories)).toBe(30000);
    });

    it('gracefully handles missing or non-numeric amounts', () => {
      const categories = [
        { id: '1', category: 'Catering', estimatedAmount: 12000, percentage: 60, explanation: '' },
        { id: '2', category: 'Favors', estimatedAmount: (NaN as unknown as number), percentage: 0, explanation: '' },
        { id: '3', category: 'AV', estimatedAmount: ('8000' as unknown as number), percentage: 40, explanation: '' },
      ] as BudgetCategory[];

      expect(calculateAllocated(categories)).toBe(20000);
    });
  });

  describe('calculateRemaining', () => {
    it('returns positive remainder when total budget exceeds allocated amount', () => {
      expect(calculateRemaining(50000, 35000)).toBe(15000);
    });

    it('returns 0 when allocated amount exactly matches budget', () => {
      expect(calculateRemaining(40000, 40000)).toBe(0);
    });

    it('returns negative amount when allocated exceeds total budget', () => {
      expect(calculateRemaining(30000, 38000)).toBe(-8000);
    });

    it('handles zero or invalid budget inputs safely', () => {
      expect(calculateRemaining(0, 5000)).toBe(-5000);
      expect(calculateRemaining((NaN as unknown as number), 5000)).toBe(-5000);
    });
  });

  describe('calculatePercentage', () => {
    it('returns 0 when total is 0 or negative to prevent division by zero', () => {
      expect(calculatePercentage(100, 0)).toBe(0);
      expect(calculatePercentage(100, -500)).toBe(0);
    });

    it('calculates rounded percentage to one decimal place', () => {
      expect(calculatePercentage(1, 3)).toBe(33.3);
      expect(calculatePercentage(25000, 50000)).toBe(50);
      expect(calculatePercentage(10000, 30000)).toBe(33.3);
      expect(calculatePercentage(20000, 30000)).toBe(66.7);
    });

    it('caps unrealistic percentages to prevent layout breakage', () => {
      expect(calculatePercentage(100000, 50)).toBe(999);
    });
  });

  describe('isOverBudget', () => {
    it('returns false when allocated is within budget', () => {
      expect(isOverBudget(50000, 45000)).toBe(false);
      expect(isOverBudget(50000, 50000)).toBe(false);
    });

    it('returns true when allocated exceeds budget', () => {
      expect(isOverBudget(50000, 50001)).toBe(true);
      expect(isOverBudget(20000, 35000)).toBe(true);
    });
  });

  describe('formatCurrency', () => {
    it('formats INR with rupee symbol and Indian number format', () => {
      expect(formatCurrency(150000, 'INR')).toBe('₹1,50,000');
      expect(formatCurrency(25000, 'INR')).toBe('₹25,000');
    });

    it('formats USD and other currencies correctly', () => {
      expect(formatCurrency(2500, 'USD')).toBe('$2,500');
      expect(formatCurrency(1800, 'EUR')).toBe('€1,800');
      expect(formatCurrency(950, 'GBP')).toBe('£950');
    });

    it('handles zero and NaN safely', () => {
      expect(formatCurrency(0, 'INR')).toBe('₹0');
      expect(formatCurrency(NaN, 'INR')).toBe('₹0');
    });
  });
});
