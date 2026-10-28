import React from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  Wallet,
  MapPin,
  CheckCircle2,
  PieChart,
  Store,
  Lightbulb,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatCurrency, calculateAllocated } from '../../utils/currency';

interface PlanOverviewViewProps {
  event: EventPlan;
  onNavigateTab: (tab: string) => void;
}

export const PlanOverviewView: React.FC<PlanOverviewViewProps> = ({ event, onNavigateTab }) => {
  const plan = event.generatedPlan;
  const categories = plan?.budgetCategories || [];
  const tasks = plan?.tasks || [];
  const vendors = plan?.vendors || [];
  const ideas = plan?.ideas || [];
  const schedule = plan?.eventDaySchedule || [];

  const allocated = calculateAllocated(categories);
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const bookedVendors = vendors.filter((v) => v.status === 'booked').length;

  const showcaseImage =
    event.eventType === 'wedding'
      ? '/src/assets/images/celebration_wedding_decor_1793158856460.jpg'
      : event.eventType === 'community'
      ? '/src/assets/images/celebration_community_festival_1793158856415.jpg'
      : '/src/assets/images/celebration_hero_ambiance_1793158855836.jpg';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Intelligence Blueprint</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2421]">
          {event.name}
        </h1>
        {/* Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#718096] mt-2">
          <span className="capitalize">{event.eventType}</span>
          <span aria-hidden="true">·</span>
          <span>{event.location}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{event.guestCount} Guests</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{formatCurrency(event.totalBudget, event.currency)} Total Budget</span>
        </div>
      </div>

      {/* Hero Concept Card with Photography */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 items-stretch">
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#1B4332] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
              <span>Personalized Creative Concept</span>
            </h2>
            <p className="text-sm text-[#2D3748] leading-relaxed font-medium">
              {plan?.personalizedConcept || 'Every celebration curated with taste, practical logistics, and cost discipline.'}
            </p>
            <p className="text-xs text-[#718096] leading-relaxed">
              {plan?.eventOverview}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#4A5568]">
            <span className="px-2.5 py-1 bg-[#F4EFEA] rounded-lg">
              Theme: {event.themePreferences || 'Contemporary Elegance'}
            </span>
            <span className="px-2.5 py-1 bg-[#F4EFEA] rounded-lg">
              Dietary: {event.dietaryRequirements || 'Inclusive dining'}
            </span>
          </div>
        </div>

        <div className="md:col-span-5 relative min-h-[200px] md:min-h-full">
          <img
            src={showcaseImage}
            alt="Event Atmosphere Showcase"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 4 Pillars Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget */}
        <div
          onClick={() => onNavigateTab('budget')}
          className="bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#1B4332] transition-colors cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-[#1B4332]" />
            <ArrowRight className="w-4 h-4 text-[#718096] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2421]">Budget Allocation</h3>
          <div className="text-lg font-bold text-[#1F2421] tabular-nums mt-1">
            {formatCurrency(allocated, event.currency)}
          </div>
          <p className="text-[11px] text-[#718096] mt-0.5">
            Across {categories.length} categories
          </p>
        </div>

        {/* Timeline */}
        <div
          onClick={() => onNavigateTab('timeline')}
          className="bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#1B4332] transition-colors cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-[#1B4332]" />
            <ArrowRight className="w-4 h-4 text-[#718096] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2421]">Planning Tasks</h3>
          <div className="text-lg font-bold text-[#1F2421] tabular-nums mt-1">
            {completedTasks}/{tasks.length} Done
          </div>
          <p className="text-[11px] text-[#718096] mt-0.5">
            Chronological milestones
          </p>
        </div>

        {/* Vendors */}
        <div
          onClick={() => onNavigateTab('vendors')}
          className="bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#1B4332] transition-colors cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <Store className="w-5 h-5 text-[#1B4332]" />
            <ArrowRight className="w-4 h-4 text-[#718096] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2421]">Vendor Checklist</h3>
          <div className="text-lg font-bold text-[#1F2421] tabular-nums mt-1">
            {bookedVendors}/{vendors.length} Booked
          </div>
          <p className="text-[11px] text-[#718096] mt-0.5">
            Catering, decor, venue & AV
          </p>
        </div>

        {/* Ideas */}
        <div
          onClick={() => onNavigateTab('ideas')}
          className="bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#1B4332] transition-colors cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <Lightbulb className="w-5 h-5 text-[#1B4332]" />
            <ArrowRight className="w-4 h-4 text-[#718096] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2421]">Personalized Ideas</h3>
          <div className="text-lg font-bold text-[#1F2421] tabular-nums mt-1">
            {ideas.length} Concepts
          </div>
          <p className="text-[11px] text-[#718096] mt-0.5">
            Grounded in your preferences
          </p>
        </div>
      </div>

      {/* Practical Tips */}
      {plan?.practicalTips && plan.practicalTips.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#1F2421] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
            <span>Host Practical Guidelines</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#4A5568]">
            {plan.practicalTips.map((tip, idx) => (
              <div key={idx} className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9] space-y-1">
                <span className="font-bold text-[#1B4332]">Recommendation {idx + 1}</span>
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
