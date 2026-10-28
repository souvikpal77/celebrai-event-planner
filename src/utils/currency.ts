import { BudgetCategory } from '../types/event';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

/**
 * Format currency with locale awareness (e.g. ₹25,000 or ₹1,50,000)
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  const safeAmount = isNaN(amount) ? 0 : Math.round(amount);
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  try {
    if (currency === 'INR') {
      return `${symbol}${safeAmount.toLocaleString('en-IN')}`;
    }
    return `${symbol}${safeAmount.toLocaleString('en-US')}`;
  } catch {
    return `${symbol}${safeAmount}`;
  }
}

/**
 * Calculate total allocated budget deterministically from categories
 */
export function calculateAllocated(categories: BudgetCategory[]): number {
  if (!Array.isArray(categories)) return 0;
  return categories.reduce((sum, item) => sum + (Number(item.estimatedAmount) || 0), 0);
}

/**
 * Calculate remaining budget
 */
export function calculateRemaining(totalBudget: number, allocated: number): number {
  return (Number(totalBudget) || 0) - allocated;
}

/**
 * Calculate percentage safely without division by zero
 */
export function calculatePercentage(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  const val = (part / total) * 100;
  return Math.min(Math.round(val * 10) / 10, 999);
}

/**
 * Check if the event budget is currently exceeded
 */
export function isOverBudget(totalBudget: number, allocated: number): boolean {
  return allocated > totalBudget;
}
