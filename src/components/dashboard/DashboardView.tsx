import React from 'react';
import {
  Calendar,
  Users,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  PieChart,
  Store,
  Lightbulb,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatCurrency, calculateAllocated, calculateRemaining, isOverBudget } from '../../utils/currency';

interface DashboardViewProps {
  event: EventPlan | null;
  onNavigateTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onClearDemoData: () => void;
  isDemoBannerDismissed: boolean;
  onDismissDemoBanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  event,
  onNavigateTab,
  onOpenCreateModal,
  onClearDemoData,
  isDemoBannerDismissed,
  onDismissDemoBanner,
}) => {
  if (!event) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-[#E8EFE9] text-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2421] mb-3">
          Welcome to CelebrAI
        </h1>
        <p className="text-base text-[#4A5568] max-w-xl mx-auto mb-8">
          Every celebration, thoughtfully planned. Organize weddings, birthdays, and community events with AI-crafted budgets, structured timelines, vendor checklists, and personalized ideas.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4332] text-white font-semibold rounded-xl hover:bg-[#2D6A4F] transition-all shadow-md focus-visible"
        >
          <span>Plan Your First Event</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const plan = event.generatedPlan;
  const categories = plan?.budgetCategories || [];
  const tasks = plan?.tasks || [];
  const vendors = plan?.vendors || [];
  const ideas = plan?.ideas || [];

  const totalBudget = event.totalBudget;
  const currency = event.currency;
  const allocated = calculateAllocated(categories);
  const remaining = calculateRemaining(totalBudget, allocated);
  const overBudget = isOverBudget(totalBudget, allocated);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;
  const progressPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const bookedVendors = vendors.filter((v) => v.status === 'booked').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Sample Preview Notice Banner (if active event is sample/demo) */}
      {event.isDemo && !isDemoBannerDismissed && (
        <div className="bg-[#FFF9EB] border border-[#F3DEB0] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-[#744210]">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#B7791F] shrink-0" />
            <div>
              <span className="font-semibold">SAMPLE CELEBRATION PREVIEW:</span> Exploring a pre-configured 50-guest Birthday Celebration (₹25,000 budget). You can customize any budget, task, or vendor, or create your own event.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={onDismissDemoBanner}
              className="px-3 py-1 text-xs font-semibold text-[#744210] hover:bg-[#FBE9BE] rounded-lg transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={onClearDemoData}
              className="px-3 py-1 text-xs font-semibold text-[#C53030] hover:bg-[#FED7D7] rounded-lg transition-colors"
            >
              Clear Sample
            </button>
          </div>
        </div>
      )}

      {/* Hero Celebration Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#1B4332] text-white shadow-sm border border-[#2D6A4F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[220px]">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            {/* Unboxed Metadata Line with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3E4D7] font-medium tracking-wide">
              <span className="capitalize">{event.eventType} Celebration</span>
              <span aria-hidden="true">·</span>
              <span>{event.location}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{event.guestCount} Guests</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatCurrency(event.totalBudget, event.currency)} Budget</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {event.name}
            </h1>

            <p className="text-sm text-[#E2ECE9] line-clamp-2 max-w-xl">
              {plan?.personalizedConcept || 'Every detail curated with care, practical logistics, and budget discipline.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('budget')}
                className="px-4 py-2 bg-white text-[#1B4332] font-semibold text-xs rounded-lg hover:bg-[#F2EDE4] transition-colors focus-visible"
              >
                Review Budget
              </button>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="px-4 py-2 bg-[#2D6A4F] text-white font-semibold text-xs rounded-lg hover:bg-[#3B8A67] transition-colors focus-visible"
              >
                View Timeline
              </button>
              <button
                onClick={() => onNavigateTab('ideas')}
                className="px-4 py-2 bg-transparent border border-[#52B788] text-white font-medium text-xs rounded-lg hover:bg-[#2D6A4F]/60 transition-colors focus-visible"
              >
                Personalized Ideas
              </button>
            </div>
          </div>

          {/* Hero Photography Container */}
          <div className="lg:col-span-5 relative min-h-[180px] lg:min-h-full">
            <img
              src="/src/assets/images/celebration_hero_ambiance_1793158855836.jpg"
              alt="Celebration Ambiance"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1B4332] via-[#1B4332]/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* 4 KPI Metrics Strip (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#718096] mb-1 text-xs">
            <span>Total Budget</span>
            <Wallet className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2421] tabular-nums">
            {formatCurrency(totalBudget, currency)}
          </div>
          <div className="text-xs text-[#718096] mt-1">
            Planned for {event.guestCount} guests
          </div>
        </div>

        {/* Allocated Budget */}
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#718096] mb-1 text-xs">
            <span>Allocated</span>
            <PieChart className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className={`text-2xl font-bold tabular-nums ${overBudget ? 'text-[#C53030]' : 'text-[#1F2421]'}`}>
            {formatCurrency(allocated, currency)}
          </div>
          <div className="text-xs text-[#718096] mt-1 flex items-center gap-1">
            {overBudget ? (
              <span className="text-[#C53030] font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Exceeds budget
              </span>
            ) : (
              <span>Across {categories.length} expense categories</span>
            )}
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#718096] mb-1 text-xs">
            <span>Remaining Balance</span>
            <Clock className="w-4 h-4 text-[#718096]" />
          </div>
          <div className={`text-2xl font-bold tabular-nums ${remaining < 0 ? 'text-[#C53030]' : 'text-[#2D6A4F]'}`}>
            {formatCurrency(remaining, currency)}
          </div>
          <div className="text-xs text-[#718096] mt-1">
            {remaining >= 0 ? 'Available for contingencies' : 'Over allocated'}
          </div>
        </div>

        {/* Task Progress */}
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#718096] mb-1 text-xs">
            <span>Task Progress</span>
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2421] tabular-nums">
            {completedTasks}/{tasks.length}
          </div>
          <div className="text-xs text-[#718096] mt-1">
            {progressPct}% completed ({pendingTasks} pending)
          </div>
        </div>
      </div>

      {/* Essential Planning Pillars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F2421]">Core Planning Pillars</h2>
            <p className="text-xs text-[#718096]">
              Every module dynamically calculates and responds to your celebration requirements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Budgets */}
          <div
            onClick={() => onNavigateTab('budget')}
            className="group bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#2D6A4F] transition-all cursor-pointer shadow-sm hover:shadow"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigateTab('budget')}
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center mb-3 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2421] text-sm group-hover:text-[#1B4332] transition-colors mb-1">
              Budget Management
            </h3>
            <p className="text-xs text-[#718096] mb-3 leading-relaxed">
              Real-time arithmetic calculations, category breakdown, and overbudget warnings.
            </p>
            <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1">
              <span>View Allocations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2: Timelines */}
          <div
            onClick={() => onNavigateTab('timeline')}
            className="group bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#2D6A4F] transition-all cursor-pointer shadow-sm hover:shadow"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigateTab('timeline')}
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center mb-3 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2421] text-sm group-hover:text-[#1B4332] transition-colors mb-1">
              Planning Timeline
            </h3>
            <p className="text-xs text-[#718096] mb-3 leading-relaxed">
              Chronological milestones adapted to your event date with priority tagging.
            </p>
            <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1">
              <span>Track Tasks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3: Vendors */}
          <div
            onClick={() => onNavigateTab('vendors')}
            className="group bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#2D6A4F] transition-all cursor-pointer shadow-sm hover:shadow"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigateTab('vendors')}
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center mb-3 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2421] text-sm group-hover:text-[#1B4332] transition-colors mb-1">
              Vendor Checklist
            </h3>
            <p className="text-xs text-[#718096] mb-3 leading-relaxed">
              Track venue, catering, decor, and photography statuses with personal notes.
            </p>
            <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1">
              <span>Manage Vendors ({bookedVendors} booked)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 4: Ideas */}
          <div
            onClick={() => onNavigateTab('ideas')}
            className="group bg-white p-5 rounded-xl border border-[#E8E2D9] hover:border-[#2D6A4F] transition-all cursor-pointer shadow-sm hover:shadow"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigateTab('ideas')}
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center mb-3 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2421] text-sm group-hover:text-[#1B4332] transition-colors mb-1">
              Personalized Ideas
            </h3>
            <p className="text-xs text-[#718096] mb-3 leading-relaxed">
              Curated concepts for theme, food, activities, and keepsakes with reason why each fits.
            </p>
            <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1">
              <span>Explore Ideas ({ideas.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Practical Tips Callout */}
      {plan?.practicalTips && plan.practicalTips.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#1F2421] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
            <span>Practical Recommendations for the Host</span>
          </h3>
          <ul className="space-y-2 text-xs text-[#4A5568]">
            {plan.practicalTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] shrink-0">{idx + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
