import { EventPlan, GeneratedPlanData } from '../types/event';

const STORAGE_KEY_EVENTS = 'celebrai_events_v1';
const STORAGE_KEY_ACTIVE_ID = 'celebrai_active_event_id';
const STORAGE_KEY_DISMISSED_DEMO = 'celebrai_demo_banner_dismissed';

export const INITIAL_DEMO_EVENT: EventPlan = {
  id: 'demo-birthday-celebration-50',
  name: 'Aanya’s 25th Sunset Terrace Birthday',
  eventType: 'birthday',
  eventDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  location: 'Skyline Terrace Garden, Indiranagar, Bengaluru',
  guestCount: 50,
  totalBudget: 25000,
  currency: 'INR',
  themePreferences: 'Warm Botanical Garden & Fairy Lights with subtle gold and sage tones',
  dietaryRequirements: 'Vegetarian and vegan friendly appetizers, nut-free dessert options',
  accessibilityRequirements: 'Elevator access to terrace, wheelchair-accessible restrooms',
  planningPriorities: 'Memorable guest experience, good food & interactive dessert, sticking to budget',
  specialRequirements: 'Candid photography, acoustic music playlist, digital invite RSVPs',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDemo: true,
  generatedPlan: {
    eventOverview: 'CelebrAI Plan for "Aanya’s 25th Sunset Terrace Birthday": An intimate, atmospheric 50-guest celebration budgeted thoughtfully at ₹25,000 with interactive dining, acoustic lounge music, and botanical decor.',
    personalizedConcept: 'A glowing sunset-to-starlight celebration embracing warm fairy lights, natural potted foliage, artisanal finger-foods, and personal polaroid keepsake moments without budget extravagance.',
    budgetCategories: [
      {
        id: 'b-1',
        category: 'Food, Beverages & Custom Cake',
        estimatedAmount: 10000,
        percentage: 40,
        explanation: 'Artisanal finger buffet snacks, mocktails, spiced coolers, and a 2kg artisanal pistachio-rose birthday cake for 50 guests.',
      },
      {
        id: 'b-2',
        category: 'Terrace Venue Reservation',
        estimatedAmount: 6250,
        percentage: 25,
        explanation: 'Private 5-hour evening slot booking fee at the community rooftop clubhouse with skyline views.',
      },
      {
        id: 'b-3',
        category: 'Botanical Decor & Fairy Lights',
        estimatedAmount: 3750,
        percentage: 15,
        explanation: 'Warm micro-LED light canopy, potted palms, rustic photo backdrop, and recycled paper lanterns.',
      },
      {
        id: 'b-4',
        category: 'Sound Equipment & Games Host',
        estimatedAmount: 3000,
        percentage: 12,
        explanation: 'High-clarity portable Bluetooth PA speaker, wireless mics, and trivia game prizes.',
      },
      {
        id: 'b-5',
        category: 'Digital Invites & Souvenirs',
        estimatedAmount: 2000,
        percentage: 8,
        explanation: 'Animated digital RSVP cards and succulent plant favors with personalized thank-you tags for guests.',
      },
    ],
    tasks: [
      {
        id: 't-1',
        title: 'Confirm terrace venue booking and power outlet checklist',
        description: 'Verify sound limit restrictions (10 PM cutoff) and elevator accessibility for elderly guests.',
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        priority: 'high',
        status: 'completed',
        category: 'Venue',
      },
      {
        id: 't-2',
        title: 'Finalize finger-food menu with caterer',
        description: 'Ensure 60% vegetarian, 40% non-veg split with distinct vegan dip labels.',
        dueDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        priority: 'high',
        status: 'pending',
        category: 'Catering',
      },
      {
        id: 't-3',
        title: 'Distribute digital WhatsApp invites with location map pin',
        description: 'Collect dietary restrictions and confirmed headcounts by day 10.',
        dueDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        category: 'Invitations',
      },
      {
        id: 't-4',
        title: 'Arrange Polaroid instant camera and 50 film sheets',
        description: 'Set up guestbook album table with metallic pens and adhesive corners.',
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        category: 'Activities',
      },
      {
        id: 't-5',
        title: 'Curate 4-hour sunset-to-starlight acoustic Spotify playlist',
        description: 'Warm indie acoustic, neo-soul, and celebratory feel-good tracks for background dining.',
        dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
        priority: 'low',
        status: 'pending',
        category: 'Entertainment',
      },
    ],
    vendors: [
      {
        id: 'v-1',
        category: 'Venue & Banquet Space',
        description: 'Skyline Terrace Garden, 50-guest private lawn & covered canopy with elevator access.',
        status: 'booked',
        estimatedCost: 6250,
        notes: 'Deposit paid. Key handover scheduled for 3:00 PM on event day.',
      },
      {
        id: 'v-2',
        category: 'Catering & Custom Bakery',
        description: 'Gourmet street-food buffet + 2kg floral buttercream celebration cake.',
        status: 'shortlisted',
        estimatedCost: 10000,
        notes: 'Tasting scheduled Thursday. Awaiting final invoice for 50 plates.',
      },
      {
        id: 'v-3',
        category: 'Decor & Lighting Specialist',
        description: 'Warm string lights installation and potted botanical planters backdrop.',
        status: 'contacted',
        estimatedCost: 3750,
        notes: 'Requested setup arrival at 3:30 PM with zero single-use plastic.',
      },
      {
        id: 'v-4',
        category: 'Candid Event Photographer',
        description: '3-hour documentary golden-hour & party coverage with delivery of 100 edited photos.',
        status: 'to_contact',
        estimatedCost: 2500,
        notes: 'Reviewing freelance student photographer portfolios on Instagram.',
      },
    ],
    ideas: [
      {
        id: 'i-1',
        category: 'theme',
        title: 'Golden Hour Botanical Terrace',
        description: 'Earthy terracottas, brass lanterns, eucalyptus greenery runners, and warm glowing bulb garlands.',
        reasonWhyItFits: 'Maximizes the open-air Bengaluru sunset atmosphere at minimal styling expense for ₹25,000.',
      },
      {
        id: 'i-2',
        category: 'food',
        title: 'Interactive DIY Mini Taco & Chaat Station',
        description: 'A vibrant live counter where guests customize their own crispy sev puri, mini tacos, and savory crisps.',
        reasonWhyItFits: 'Fun, highly social, and inherently accommodates both vegetarian and vegan diets affordably.',
      },
      {
        id: 'i-3',
        category: 'guest_experience',
        title: 'Potted Succulent “Grow With Love” Favors',
        description: 'Each of the 50 guests takes home a miniature terracotta potted succulent with a handwritten thank-you tag.',
        reasonWhyItFits: 'Eco-conscious, long-lasting keepsake that costs under ₹40 per guest and doubles as table decor.',
      },
      {
        id: 'i-4',
        category: 'activities',
        title: 'Golden Memories Polaroid Guestbook',
        description: 'Friends take instant snaps, write heartfelt one-sentence wishes, and clip them to fairy light cables.',
        reasonWhyItFits: 'Captures candid, unfiltered joy while creating a timeless keepsake album the host keeps forever.',
      },
    ],
    eventDaySchedule: [
      { id: 's-1', time: '03:30 PM', activity: 'Venue Access & Decor Setup', description: 'Lights strung, table runners placed, photo wall prepared.' },
      { id: 's-2', time: '04:30 PM', activity: 'Catering & Cake Delivery', description: 'Chillers stocked with mocktails; dessert table styled.' },
      { id: 's-3', time: '05:00 PM', activity: 'Golden Hour Guest Arrival', description: 'Welcome coolers served; guests take Polaroid snaps at sunset.' },
      { id: 's-4', time: '06:30 PM', activity: 'Cake Cutting & Birthday Toast', description: 'Group gathering around centerpiece table with heartfelt speeches.' },
      { id: 's-5', time: '07:00 PM', activity: 'Chaat Station & Dinner Service', description: 'Hot buffet served with acoustic background melodies.' },
      { id: 's-6', time: '08:30 PM', activity: 'Interactive Trivia & Starlight Dancing', description: 'Fun lighthearted quiz about the birthday host and open dance floor.' },
      { id: 's-7', time: '09:45 PM', activity: 'Favors & Warm Farewells', description: 'Succulent plant gifts given to guests; venue pack-down.' },
    ],
    practicalTips: [
      'Have a designated phone holder take video of the cake cutting so your family can be fully present in the moment.',
      'Check the outdoor weather forecast 48 hours prior and have two roll-out canopy umbrellas on standby.',
      'Set out a small basket in the restroom with breath mints, safety pins, and hand lotion for thoughtful guest hospitality.',
    ],
    generatedAt: new Date().toISOString(),
    source: 'gemini',
  },
};

/**
 * Safe local storage reader
 */
export function getStoredEvents(): EventPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) {
      // First visit: initialize with demo event
      const initial = [INITIAL_DEMO_EVENT];
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, INITIAL_DEMO_EVENT.id);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [INITIAL_DEMO_EVENT];
  } catch (err) {
    console.warn('Could not read from localStorage, using memory fallback:', err);
    return [INITIAL_DEMO_EVENT];
  }
}

/**
 * Safe local storage saver
 */
export function saveStoredEvents(events: EventPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

/**
 * Get active event ID
 */
export function getActiveEventId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || INITIAL_DEMO_EVENT.id;
  } catch {
    return INITIAL_DEMO_EVENT.id;
  }
}

/**
 * Set active event ID
 */
export function setActiveEventId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (err) {
    console.warn('Could not set active event ID in localStorage:', err);
  }
}

/**
 * Check if demo banner is dismissed
 */
export function isDemoBannerDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_DISMISSED_DEMO) === 'true';
  } catch {
    return false;
  }
}

export function setDemoBannerDismissed(dismissed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_DISMISSED_DEMO, dismissed ? 'true' : 'false');
  } catch (err) {
    console.warn('Could not update demo banner status:', err);
  }
}
