import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { PlanGenerationRequest, RegenerateIdeasRequest, GeneratedPlanData } from './src/types/event';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Strict body parsing limits to mitigate DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini AI Client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(aiClient),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Deterministic fallback generator for celebrations if Gemini API is temporarily unavailable
 * or running in offline/demo mode.
 */
function generateDeterministicPlan(params: PlanGenerationRequest): GeneratedPlanData {
  const budget = params.totalBudget || 25000;
  const guestCount = params.guestCount || 50;
  const curr = params.currency || 'INR';

  // Realistic budget allocation breakdown based on event type
  let breakdown: Array<{ category: string; pct: number; explanation: string }> = [];

  if (params.eventType === 'wedding') {
    breakdown = [
      { category: 'Venue & Staging', pct: 30, explanation: 'Ceremony & reception hall rental and staging' },
      { category: 'Catering & Beverages', pct: 35, explanation: `Multi-course celebratory banquet for ${guestCount} guests` },
      { category: 'Decor & Florals', pct: 15, explanation: 'Custom floral arrangements, lighting, and stage setup' },
      { category: 'Photography & Video', pct: 10, explanation: 'Full-day documentary coverage and bridal album' },
      { category: 'Music & Entertainment', pct: 6, explanation: 'DJ, sound engineer, and live traditional performers' },
      { category: 'Stationery & Favors', pct: 4, explanation: 'Save-the-dates, menus, and curated return gifts' },
    ];
  } else if (params.eventType === 'birthday') {
    breakdown = [
      { category: 'Food & Refreshments', pct: 40, explanation: `Buffet snacks, beverages, and custom themed cake for ${guestCount} attendees` },
      { category: 'Venue / Space Booking', pct: 25, explanation: 'Party venue or community hall booking deposit' },
      { category: 'Decor & Lighting', pct: 15, explanation: 'Backdrop, eco-friendly balloons, string lights, and photo corner' },
      { category: 'Entertainment & Games', pct: 12, explanation: 'Live game host/anchor, sound equipment, and party prizes' },
      { category: 'Return Favors & Invites', pct: 8, explanation: 'Digital invitations and personalized souvenir gift bags' },
    ];
  } else if (params.eventType === 'community') {
    breakdown = [
      { category: 'Venue & Sanitation', pct: 25, explanation: 'Permits, open ground rental, clean-up crews, and portable facilities' },
      { category: 'Community Food / Refreshments', pct: 35, explanation: `Wholesome meal or snack boxes for ${guestCount} community members` },
      { category: 'Sound, Stage & AV', pct: 20, explanation: 'PA system, microphones, podium, and canopy tents' },
      { category: 'Signage & Promotion', pct: 10, explanation: 'Banners, directional posters, and digital community flyers' },
      { category: 'Logistics & Safety', pct: 10, explanation: 'First-aid kit station, volunteer badges, and drinking water tankers' },
    ];
  } else {
    breakdown = [
      { category: 'Catering & Dining', pct: 38, explanation: `Specially curated cuisine and beverages for ${guestCount} guests` },
      { category: 'Venue Rental', pct: 28, explanation: 'Intimate banquet room or outdoor terrace setup' },
      { category: 'Decor & Flowers', pct: 16, explanation: 'Atmospheric candle lighting, centerpieces, and backdrop' },
      { category: 'Photography & Memory Book', pct: 10, explanation: 'Candid event photographer and commemorative guestbook' },
      { category: 'Keepsakes & Miscellaneous', pct: 8, explanation: 'Curated tokens of appreciation and contingency buffer' },
    ];
  }

  const budgetCategories = breakdown.map((item, idx) => {
    const amount = Math.round((budget * item.pct) / 100);
    return {
      id: `b-${idx + 1}`,
      category: item.category,
      estimatedAmount: amount,
      percentage: item.pct,
      explanation: item.explanation,
    };
  });

  // Calculate timeline relative to event date
  const parsedTime = params.eventDate ? new Date(params.eventDate).getTime() : NaN;
  const eventDateObj = !isNaN(parsedTime) ? new Date(parsedTime) : new Date(Date.now() + 30 * 86400000);
  const now = new Date();
  const daysDiff = Math.max(1, Math.round((eventDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const tasks = [
    {
      id: 't-1',
      title: 'Finalize and secure venue contract',
      description: `Confirm capacity for ${guestCount} guests and check accessibility requirements in ${params.location || 'the area'}.`,
      dueDate: new Date(Date.now() + Math.min(daysDiff * 0.2, 7) * 86400000).toISOString().split('T')[0],
      priority: 'high' as const,
      status: 'pending' as const,
      category: 'Venue',
    },
    {
      id: 't-2',
      title: 'Finalize catering menu & dietary preferences',
      description: `Accommodate ${params.dietaryRequirements || 'all standard guest dietary requests'} with caterer.`,
      dueDate: new Date(Date.now() + Math.min(daysDiff * 0.4, 14) * 86400000).toISOString().split('T')[0],
      priority: 'high' as const,
      status: 'pending' as const,
      category: 'Food',
    },
    {
      id: 't-3',
      title: 'Send out digital invitations & RSVP tracker',
      description: `Send invitations to ${guestCount} expected guests with location details and RSVP deadline.`,
      dueDate: new Date(Date.now() + Math.min(daysDiff * 0.5, 20) * 86400000).toISOString().split('T')[0],
      priority: 'medium' as const,
      status: 'pending' as const,
      category: 'Invitations',
    },
    {
      id: 't-4',
      title: 'Book photographer and sound/AV equipment',
      description: 'Review portfolio, agree on key milestone shots, and check sound system test schedule.',
      dueDate: new Date(Date.now() + Math.min(daysDiff * 0.7, 28) * 86400000).toISOString().split('T')[0],
      priority: 'medium' as const,
      status: 'pending' as const,
      category: 'Media',
    },
    {
      id: 't-5',
      title: 'Conduct day-before final vendor walk-through',
      description: 'Confirm arrival timings, power access, parking arrangements, and emergency contacts.',
      dueDate: new Date(eventDateObj.getTime() - 86400000).toISOString().split('T')[0],
      priority: 'high' as const,
      status: 'pending' as const,
      category: 'Operations',
    },
  ];

  const vendors = [
    {
      id: 'v-1',
      category: 'Venue & Banquet Management',
      description: `Space reservation fitting ${guestCount} guests with power backup and parking in ${params.location || 'designated city'}.`,
      status: 'shortlisted' as const,
      estimatedCost: budgetCategories[0]?.estimatedAmount || Math.round(budget * 0.3),
      notes: 'Check air-conditioning and wheelchair access as specified.',
    },
    {
      id: 'v-2',
      category: 'Catering & Beverage Services',
      description: `Full course dining and beverages handling ${params.dietaryRequirements || 'standard and vegetarian dishes'}.`,
      status: 'to_contact' as const,
      estimatedCost: budgetCategories[1]?.estimatedAmount || Math.round(budget * 0.35),
      notes: 'Request live food counter or tasting session before confirmation.',
    },
    {
      id: 'v-3',
      category: 'Decor & Atmospheric Styling',
      description: `Theme setup aligning with ${params.themePreferences || 'refined modern aesthetic'} and floral accents.`,
      status: 'to_contact' as const,
      estimatedCost: budgetCategories[2]?.estimatedAmount || Math.round(budget * 0.15),
      notes: 'Request mood board and reusable/eco-friendly materials.',
    },
    {
      id: 'v-4',
      category: 'Photography & Candid Video',
      description: 'High-resolution milestone coverage, digital highlights album, and family group portraits.',
      status: 'to_contact' as const,
      estimatedCost: budgetCategories[3]?.estimatedAmount || Math.round(budget * 0.1),
      notes: 'Verify delivery turnaround within 7-10 business days.',
    },
  ];

  const ideas = [
    {
      id: 'i-1',
      category: 'theme' as const,
      title: 'Warm Botanical Garden & Lantern Aesthetic',
      description: 'Subtle sage greens, warm champagne tones, earthen terracotta pots, and warm fairy light strings.',
      reasonWhyItFits: `Complements your budget of ${curr} ${budget.toLocaleString()} while creating a luxurious yet welcoming ambiance for ${guestCount} guests.`,
    },
    {
      id: 'i-2',
      category: 'food' as const,
      title: 'Interactive Grazing Station & Specialty Dessert Table',
      description: 'Artisanal finger foods, seasonal fruits, customized mocktails, and an interactive dessert bar.',
      reasonWhyItFits: `Encourages guests to mingle effortlessly while accommodating dietary preferences (${params.dietaryRequirements || 'all guests'}).`,
    },
    {
      id: 'i-3',
      category: 'activities' as const,
      title: 'Audio Guestbook & Polaroid Memory Wall',
      description: 'Guests snap instant Polaroid photos, peg them to a rustic timber board, and leave voice notes on a vintage phone.',
      reasonWhyItFits: 'Provides a deeply personal, low-cost keepsake that keeps guests delighted without needing expensive staged games.',
    },
    {
      id: 'i-4',
      category: 'entertainment' as const,
      title: 'Curated Acoustic Trio & Interactive Trivia',
      description: 'Gentle acoustic melodies during dinner followed by a lighthearted personalized quiz honoring the guest(s) of honor.',
      reasonWhyItFits: 'Keeps energy engaging and heartfelt without overwhelming conversation volumes.',
    },
  ];

  const eventDaySchedule = [
    { id: 's-1', time: '11:00 AM', activity: 'Vendor Load-in & Venue Setup', description: 'Decorators and AV team arrive for sound check and stage decor.' },
    { id: 's-2', time: '01:00 PM', activity: 'Catering Setup & Food Warming', description: 'Caterer sets up buffet counters and beverage chillers.' },
    { id: 's-3', time: '02:30 PM', activity: 'Host Arrival & Final Walkthrough', description: 'Review lighting, ambient music playlist, and photo zone.' },
    { id: 's-4', time: '03:30 PM', activity: 'Guest Welcome & Welcome Drinks', description: 'Guests arrive, check in, and enjoy appetizers and photo wall.' },
    { id: 's-5', time: '05:00 PM', activity: 'Main Ceremony & Celebration Speeches', description: 'Key milestone activity, cake cutting, or community speech.' },
    { id: 's-6', time: '06:30 PM', activity: 'Dinner Banquet Service', description: 'Full meal service with background live acoustic music.' },
    { id: 's-7', time: '08:30 PM', activity: 'Wrap-up & Return Gift Distribution', description: 'Farewell to guests and vendor pack-down.' },
  ];

  const practicalTips = [
    'Appoint one trusted friend or family co-host to handle vendor questions on the day so you can fully enjoy your event.',
    'Keep an offline digital copy of all vendor phone numbers, venue gate codes, and emergency contacts on your phone.',
    'Pack an emergency event kit: safety pins, fabric tape, phone power bank, mints, and wet wipes.',
  ];

  return {
    eventOverview: `CelebrAI Plan for "${params.name}": A thoughtfully organized ${params.eventType} celebration for ${guestCount} guests in ${params.location || 'your preferred venue'}, budgeted at ${curr} ${budget.toLocaleString()}.`,
    personalizedConcept: `An intimate and memorable experience tailored around ${params.themePreferences || 'contemporary celebratory elegance'}, emphasizing hospitality, vibrant connection, and smooth execution.`,
    budgetCategories,
    tasks,
    vendors,
    ideas,
    eventDaySchedule,
    practicalTips,
    generatedAt: new Date().toISOString(),
    source: 'demo',
  };
}

// POST /api/plan/generate
app.post('/api/plan/generate', async (req: Request, res: Response) => {
  try {
    const body: PlanGenerationRequest = req.body;

    // Validate incoming payload
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be an object' });
      return;
    }

    const name = String(body.name || '').trim();
    if (!name || name.length > 120) {
      res.status(400).json({ error: 'Event name is required and must be under 120 characters' });
      return;
    }

    const guestCount = Number(body.guestCount);
    if (!guestCount || guestCount < 1 || guestCount > 50000) {
      res.status(400).json({ error: 'Guest count must be between 1 and 50,000' });
      return;
    }

    const totalBudget = Number(body.totalBudget);
    if (!totalBudget || totalBudget < 100 || totalBudget > 1000000000) {
      res.status(400).json({ error: 'Total budget must be a positive amount' });
      return;
    }

    const eventType = body.eventType || 'birthday';
    const currency = body.currency || 'INR';
    const eventDate = String(body.eventDate || '');

    // If Gemini client is not configured, gracefully return deterministic plan marked as demo
    if (!aiClient) {
      const plan = generateDeterministicPlan(body);
      res.json({
        plan,
        mode: 'demo',
        notice: 'Generated using CelebrAI local planning engine.',
      });
      return;
    }

    // Prepare Prompt for Gemini 3.8 Flash
    const prompt = `You are CelebrAI, an expert celebration and event planning assistant.
Analyze these event requirements and generate a comprehensive, highly realistic, practical event plan:

EVENT SPECIFICATIONS:
- Event Name: ${name}
- Event Type: ${eventType}
- Event Date: ${eventDate}
- Location: ${body.location || 'Local venue'}
- Expected Guests: ${guestCount}
- Total Budget: ${currency} ${totalBudget}
- Theme / Styling Preferences: ${body.themePreferences || 'Not specified'}
- Dietary Needs: ${body.dietaryRequirements || 'Standard catering with vegetarian options'}
- Accessibility Needs: ${body.accessibilityRequirements || 'None specified'}
- Planning Priorities: ${body.planningPriorities || 'Memorable guest experience, good food, sticking to budget'}
- Special Requirements: ${body.specialRequirements || 'None'}

REQUIREMENTS:
1. Provide a realistic budget breakdown across 4 to 6 categories. The sum of category percentages must equal 100%, and estimated amounts must add up to ${totalBudget}.
2. Provide 4 to 6 actionable planning timeline tasks leading up to the event date.
3. Provide 4 to 6 vendor requirements with realistic estimated costs.
4. Provide 4 to 6 creative, personalized celebration ideas specifically tailored to this ${eventType} for ${guestCount} guests, explaining why each fits.
5. Provide a chronological event-day schedule from setup to wrap-up.
6. Provide 3 practical tips for the host.

Label all financial costs as estimated costs. Return structured JSON conforming strictly to the schema.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are CelebrAI, a world-class celebration and event planning assistant. Always output structured, realistic, and budget-conscious planning data in valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eventOverview: { type: Type.STRING, description: 'Executive summary of the event plan' },
            personalizedConcept: { type: Type.STRING, description: 'Creative overarching concept statement' },
            budgetCategories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  estimatedAmount: { type: Type.NUMBER },
                  percentage: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                },
                required: ['category', 'estimatedAmount', 'percentage', 'explanation'],
              },
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  dueDate: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'high, medium, or low' },
                  category: { type: Type.STRING },
                },
                required: ['title', 'description', 'dueDate', 'priority'],
              },
            },
            vendors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  notes: { type: Type.STRING },
                },
                required: ['category', 'description', 'notes'],
              },
            },
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'theme, decor, food, entertainment, activities, guest_experience, invitations, or photography' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reasonWhyItFits: { type: Type.STRING },
                },
                required: ['category', 'title', 'description', 'reasonWhyItFits'],
              },
            },
            eventDaySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['time', 'activity', 'description'],
              },
            },
            practicalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'eventOverview',
            'personalizedConcept',
            'budgetCategories',
            'tasks',
            'vendors',
            'ideas',
            'eventDaySchedule',
            'practicalTips',
          ],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Gemini model returned empty response');
    }

    const parsed = JSON.parse(text);

    // Validate and sanitize parsed AI response
    const sanitizedCategories = (parsed.budgetCategories || []).map((cat: any, idx: number) => ({
      id: `b-${idx + 1}-${Date.now()}`,
      category: String(cat.category || 'Expense Category').trim(),
      estimatedAmount: Math.max(0, Number(cat.estimatedAmount) || 0),
      percentage: Math.max(0, Math.min(100, Number(cat.percentage) || 0)),
      explanation: String(cat.explanation || '').trim(),
    }));

    const sanitizedTasks = (parsed.tasks || []).map((t: any, idx: number) => ({
      id: `t-${idx + 1}-${Date.now()}`,
      title: String(t.title || 'Task').trim(),
      description: String(t.description || '').trim(),
      dueDate: String(t.dueDate || eventDate || new Date().toISOString().split('T')[0]),
      priority: (['high', 'medium', 'low'].includes(String(t.priority).toLowerCase())
        ? String(t.priority).toLowerCase()
        : 'medium') as 'high' | 'medium' | 'low',
      status: 'pending' as const,
      category: String(t.category || 'General').trim(),
    }));

    const sanitizedVendors = (parsed.vendors || []).map((v: any, idx: number) => ({
      id: `v-${idx + 1}-${Date.now()}`,
      category: String(v.category || 'Vendor').trim(),
      description: String(v.description || '').trim(),
      status: 'to_contact' as const,
      estimatedCost: v.estimatedCost ? Math.max(0, Number(v.estimatedCost)) : undefined,
      notes: String(v.notes || '').trim(),
    }));

    const sanitizedIdeas = (parsed.ideas || []).map((i: any, idx: number) => ({
      id: `i-${idx + 1}-${Date.now()}`,
      category: (['theme', 'decor', 'food', 'entertainment', 'activities', 'guest_experience', 'invitations', 'photography'].includes(
        String(i.category).toLowerCase()
      )
        ? String(i.category).toLowerCase()
        : 'theme') as any,
      title: String(i.title || 'Creative Idea').trim(),
      description: String(i.description || '').trim(),
      reasonWhyItFits: String(i.reasonWhyItFits || '').trim(),
    }));

    const sanitizedSchedule = (parsed.eventDaySchedule || []).map((s: any, idx: number) => ({
      id: `s-${idx + 1}-${Date.now()}`,
      time: String(s.time || '12:00 PM').trim(),
      activity: String(s.activity || 'Activity').trim(),
      description: String(s.description || '').trim(),
      completed: false,
    }));

    const generatedPlan: GeneratedPlanData = {
      eventOverview: String(parsed.eventOverview || '').trim(),
      personalizedConcept: String(parsed.personalizedConcept || '').trim(),
      budgetCategories: sanitizedCategories,
      tasks: sanitizedTasks,
      vendors: sanitizedVendors,
      ideas: sanitizedIdeas,
      eventDaySchedule: sanitizedSchedule,
      practicalTips: Array.isArray(parsed.practicalTips) ? parsed.practicalTips.map(String) : [],
      generatedAt: new Date().toISOString(),
      source: 'gemini',
    };

    res.json({ plan: generatedPlan, mode: 'gemini' });
  } catch (error: any) {
    console.error('Error generating celebration plan with Gemini:', error);
    // If Gemini fails (e.g. rate limit, quota, network), fallback cleanly to deterministic generator
    try {
      const fallbackPlan = generateDeterministicPlan(req.body);
      res.json({
        plan: fallbackPlan,
        mode: 'demo',
        warning: 'Generated using CelebrAI local planning engine.',
      });
    } catch {
      res.status(500).json({
        error: "We couldn't generate your plan right now. Please check your inputs and try again.",
      });
    }
  }
});

// POST /api/plan/regenerate-ideas
app.post('/api/plan/regenerate-ideas', async (req: Request, res: Response) => {
  try {
    const body: RegenerateIdeasRequest = req.body;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    if (!aiClient) {
      // Deterministic fresh ideas
      const freshIdeas = [
        {
          id: `i-fresh-1-${Date.now()}`,
          category: 'decor' as const,
          title: 'Cascading Fairy Light Ceiling & Foliage Arches',
          description: 'Suspended warm micro-LED nets with eucalyptus and local seasonal greenery over the main dining or dance floor.',
          reasonWhyItFits: `Creates an unforgettable high-end atmosphere for ${body.guestCount || 50} guests while staying well within standard decor allocations.`,
        },
        {
          id: 'i-fresh-2-' + Date.now(),
          category: 'food' as const,
          title: 'Bespoke Signature Mocktail & Chai Bar',
          description: 'Live beverage station serving two themed signature drinks alongside spiced saffron masala chai.',
          reasonWhyItFits: `Honors dietary and cultural preferences (${body.dietaryRequirements || 'inclusive'}) with personalized flair.`,
        },
        {
          id: 'i-fresh-3-' + Date.now(),
          category: 'guest_experience' as const,
          title: 'Live Handwritten Calligraphy Name Badges / Favors',
          description: 'A local calligrapher crafts personalized wax-sealed cards or bookmarks for each guest upon entry.',
          reasonWhyItFits: 'A high-touch keepsake that makes every attendee feel honored and valued.',
        },
        {
          id: 'i-fresh-4-' + Date.now(),
          category: 'photography' as const,
          title: '360 Slow-Motion Video Podium',
          description: 'A raised circular platform with a revolving camera arm capturing joyful celebratory moments for social sharing.',
          reasonWhyItFits: 'Modern and vibrant, generating immediate fun and viral memories for attendees.',
        },
      ];
      res.json({ ideas: freshIdeas, source: 'demo' });
      return;
    }

    const prompt = `You are CelebrAI. Generate 4 to 6 fresh, distinct, creative celebration ideas for an upcoming ${body.eventType || 'celebration'}.
Context:
- Expected Guests: ${body.guestCount || 50}
- Total Budget: ${body.currency || 'INR'} ${body.totalBudget || 25000}
- Location: ${body.location || 'Local venue'}
- Theme: ${body.themePreferences || 'Refined celebratory'}
- Dietary: ${body.dietaryRequirements || 'Standard'}
- Priorities: ${body.planningPriorities || 'Fun and memorable'}

Provide innovative ideas across theme, decor, food, entertainment, activities, guest_experience, invitations, or photography. Explain why each fits.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reasonWhyItFits: { type: Type.STRING },
                },
                required: ['category', 'title', 'description', 'reasonWhyItFits'],
              },
            },
          },
          required: ['ideas'],
        },
      },
    });

    const text = response.text?.trim();
    const parsed = text ? JSON.parse(text) : { ideas: [] };
    const rawIdeas = Array.isArray(parsed.ideas) ? parsed.ideas : [];

    const sanitizedIdeas = rawIdeas.map((item: any, idx: number) => ({
      id: `i-regen-${idx + 1}-${Date.now()}`,
      category: (['theme', 'decor', 'food', 'entertainment', 'activities', 'guest_experience', 'invitations', 'photography'].includes(
        String(item.category).toLowerCase()
      )
        ? String(item.category).toLowerCase()
        : 'theme') as any,
      title: String(item.title || 'Creative Idea').trim(),
      description: String(item.description || '').trim(),
      reasonWhyItFits: String(item.reasonWhyItFits || '').trim(),
    }));

    res.json({ ideas: sanitizedIdeas, source: 'gemini' });
  } catch (error) {
    console.error('Error regenerating ideas:', error);
    // Robust fallback to high-quality curated celebration ideas
    const freshIdeas = [
      {
        id: `i-fresh-1-${Date.now()}`,
        category: 'decor' as const,
        title: 'Cascading Fairy Light Canopy & Foliage Arches',
        description: 'Suspended warm micro-LED nets with eucalyptus and local seasonal greenery over the main dining or dance floor.',
        reasonWhyItFits: `Creates an unforgettable high-end atmosphere for ${req.body?.guestCount || 50} guests while staying well within standard decor allocations.`,
      },
      {
        id: 'i-fresh-2-' + Date.now(),
        category: 'food' as const,
        title: 'Bespoke Signature Mocktail & Chai Lounge',
        description: 'Live beverage station serving two themed signature drinks alongside spiced saffron masala chai.',
        reasonWhyItFits: `Honors dietary and cultural preferences (${req.body?.dietaryRequirements || 'inclusive'}) with personalized flair.`,
      },
      {
        id: 'i-fresh-3-' + Date.now(),
        category: 'guest_experience' as const,
        title: 'Live Handwritten Calligraphy Name Badges & Favors',
        description: 'A local calligrapher crafts personalized wax-sealed cards or bookmarks for each guest upon entry.',
        reasonWhyItFits: 'A high-touch keepsake that makes every attendee feel honored and valued.',
      },
      {
        id: 'i-fresh-4-' + Date.now(),
        category: 'photography' as const,
        title: '360 Slow-Motion Video Podium',
        description: 'A raised circular platform with a revolving camera arm capturing joyful celebratory moments for social sharing.',
        reasonWhyItFits: 'Modern and vibrant, generating immediate fun and viral memories for attendees.',
      },
    ];
    res.json({ ideas: freshIdeas, source: 'demo' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';

    // When HMR is disabled, intercept /@vite/client requests at the Express level
    // to guarantee an inert stub with zero WebSocket connections is returned.
    if (isHmrDisabled) {
      const stubClient = `// Inactive Vite client stub (DISABLE_HMR=true)
export function createHotContext() {
  return { accept: () => {}, prune: () => {}, dispose: () => {}, decline: () => {}, invalidate: () => {}, on: () => {}, off: () => {}, send: () => {}, data: {} };
}
export function updateStyle(id, content) {
  let style = document.querySelector(\`style[data-vite-dev-id="\${id}"]\`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
  }
  style.textContent = content;
}
export function removeStyle(id) {
  const style = document.querySelector(\`style[data-vite-dev-id="\${id}"]\`);
  if (style) style.remove();
}
export class ErrorOverlay extends (typeof HTMLElement !== 'undefined' ? HTMLElement : class {}) {}
if (typeof customElements !== 'undefined' && !customElements.get('vite-error-overlay')) {
  try { customElements.define('vite-error-overlay', ErrorOverlay); } catch {}
}
export function injectQuery(url) { return url; }
`;
      app.get(['/@vite/client', '/@vite/client.mjs'], (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.send(stubClient);
      });
    }

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: !isHmrDisabled,
        ws: isHmrDisabled ? (false as const) : undefined,
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CelebrAI server running on http://0.0.0.0:${PORT} (env: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
