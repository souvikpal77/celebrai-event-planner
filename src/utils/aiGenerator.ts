import { PlanGenerationRequest, RegenerateIdeasRequest, GeneratedPlanData, CelebrationIdea } from '../types/event';

export interface PlanGenerationResult {
  plan: GeneratedPlanData;
  mode: 'gemini' | 'demo';
  warning?: string;
  notice?: string;
}

export async function generateCelebrationPlan(request: PlanGenerationRequest): Promise<PlanGenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000); // 50s timeout

  try {
    const response = await fetch('/api/plan/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'Failed to generate plan';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Server responded with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Plan generation took longer than expected. Please try again.');
    }
    throw error;
  }
}

export async function regeneratePersonalizedIdeas(
  request: RegenerateIdeasRequest
): Promise<{ ideas: CelebrationIdea[]; source: 'gemini' | 'demo' }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch('/api/plan/regenerate-ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to regenerate ideas');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Idea generation timed out. Please try again.');
    }
    throw error;
  }
}
