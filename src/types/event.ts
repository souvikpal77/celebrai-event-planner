export type EventType = 'wedding' | 'birthday' | 'community' | 'anniversary' | 'other';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'completed';

export type VendorStatus = 'to_contact' | 'contacted' | 'shortlisted' | 'booked';

export type IdeaCategory =
  | 'theme'
  | 'decor'
  | 'food'
  | 'entertainment'
  | 'activities'
  | 'guest_experience'
  | 'invitations'
  | 'photography';

export interface BudgetCategory {
  id: string;
  category: string;
  estimatedAmount: number;
  percentage: number;
  explanation: string;
}

export interface PlanningTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: PriorityLevel;
  status: TaskStatus;
  category?: string;
}

export interface VendorRequirement {
  id: string;
  category: string;
  description: string;
  status: VendorStatus;
  estimatedCost?: number;
  notes: string;
}

export interface CelebrationIdea {
  id: string;
  category: IdeaCategory;
  title: string;
  description: string;
  reasonWhyItFits: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  description: string;
  completed?: boolean;
}

export interface GeneratedPlanData {
  eventOverview: string;
  personalizedConcept: string;
  budgetCategories: BudgetCategory[];
  tasks: PlanningTask[];
  vendors: VendorRequirement[];
  ideas: CelebrationIdea[];
  eventDaySchedule: ScheduleItem[];
  practicalTips: string[];
  generatedAt: string;
  source: 'gemini' | 'demo';
}

export interface EventPlan {
  id: string;
  name: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  themePreferences?: string;
  dietaryRequirements?: string;
  accessibilityRequirements?: string;
  specialRequirements?: string;
  planningPriorities?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  generatedPlan?: GeneratedPlanData;
}

export interface PlanGenerationRequest {
  name: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  themePreferences?: string;
  dietaryRequirements?: string;
  accessibilityRequirements?: string;
  specialRequirements?: string;
  planningPriorities?: string;
}

export interface RegenerateIdeasRequest {
  eventType: EventType;
  guestCount: number;
  totalBudget: number;
  currency: string;
  location: string;
  themePreferences?: string;
  dietaryRequirements?: string;
  accessibilityRequirements?: string;
  planningPriorities?: string;
  existingIdeasCount?: number;
}
