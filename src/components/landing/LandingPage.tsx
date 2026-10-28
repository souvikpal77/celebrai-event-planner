import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  PieChart,
  CalendarCheck,
  Store,
  Lightbulb,
  CheckCircle2,
  Users,
  Wallet,
  Clock,
  Heart,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  PlayCircle,
} from 'lucide-react';
import { EventPlan } from '../../types/event';

interface LandingPageProps {
  onPlanEvent: () => void;
  onOpenExistingApp: () => void;
  hasActiveEvent: boolean;
  activeEvent: EventPlan | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlanEvent,
  onOpenExistingApp,
  hasActiveEvent,
  activeEvent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F2421] flex flex-col selection:bg-[#2D6A4F] selection:text-white">
      {/* 1. Public Landing Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1B4332] whitespace-nowrap">
              CelebrAI
            </span>
          </div>

          {/* Navigation Links (Visible on desktop/large screens to prevent right-edge clipping) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#4A5568]">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#1B4332] transition-colors whitespace-nowrap"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#1B4332] transition-colors whitespace-nowrap"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('why-celebrai')}
              className="hover:text-[#1B4332] transition-colors whitespace-nowrap"
            >
              Why CelebrAI
            </button>
            <button
              onClick={() => scrollToSection('supported-events')}
              className="hover:text-[#1B4332] transition-colors whitespace-nowrap"
            >
              Supported Celebrations
            </button>
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {hasActiveEvent && (
              <button
                onClick={onOpenExistingApp}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1B4332] bg-[#E8EFE9] hover:bg-[#D8E4DA] rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Open My Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onPlanEvent}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] active:bg-[#143225] rounded-xl transition-colors shadow-sm whitespace-nowrap focus-visible"
            >
              <Sparkles className="w-4 h-4 text-[#A3E4D7]" />
              <span>Plan My Event</span>
            </button>

            {/* Mobile Menu Toggle (shows on mobile and tablet) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4A5568] hover:text-[#1B4332] rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E2D9] bg-[#FDFBF7] px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('why-celebrai')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Why CelebrAI
            </button>
            <button
              onClick={() => scrollToSection('supported-events')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Supported Celebrations
            </button>
            {hasActiveEvent && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenExistingApp();
                }}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-[#1B4332] bg-[#E8EFE9] rounded-lg"
              >
                Open My Planner ({activeEvent?.name})
              </button>
            )}
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8EFE9] text-[#1B4332] rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>AI-Powered Event Planning Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F2421] leading-[1.12]">
              Every celebration, <br />
              <span className="text-[#1B4332]">thoughtfully planned.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A5568] max-w-xl leading-relaxed">
              Meet CelebrAI — your AI-powered celebration planner for weddings, birthdays, and community events. Turn your ideas, budget, guest count, and preferences into a personalized event plan.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onPlanEvent}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] active:bg-[#143225] rounded-xl transition-all shadow-md focus-visible group"
              >
                <span>Plan My Event</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#1F2421] bg-white hover:bg-[#F2EDE4] border border-[#D5CDC0] rounded-xl transition-colors focus-visible"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#718096] border-t border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>Deterministic Budget Math</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>Chronological Deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>Zero AI Jargon</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Atmosphere */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#D5CDC0] bg-[#1B4332]">
              <img
                src="/src/assets/images/celebration_hero_ambiance_1793158855836.jpg"
                alt="Atmospheric celebration dinner gathering with fairy lights"
                referrerPolicy="no-referrer"
                className="w-full h-[420px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Floating Highlight Card 1: Budget */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-white/40">
                <div className="flex items-center justify-between text-xs text-[#718096] mb-1">
                  <span className="font-semibold text-[#1B4332] flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    Budget Allocation
                  </span>
                  <span className="tabular-nums font-semibold text-[#2D6A4F]">100% Allocated</span>
                </div>
                <div className="text-base font-bold text-[#1F2421] tabular-nums">
                  ₹25,000 Total Planned
                </div>
                <div className="text-[11px] text-[#718096] mt-0.5">
                  Optimized for 50 guests across 5 categories
                </div>
              </div>

              {/* Floating Highlight Card 2: Timeline */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-white/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#1F2421]">
                    Aanya’s 25th Sunset Terrace Birthday
                  </div>
                  <div className="text-[11px] text-[#718096]">
                    Botanical garden theme · 5 milestones on track
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-[#E8EFE9] text-[#1B4332] font-bold text-xs rounded-lg tabular-nums shrink-0">
                  Ready in 14d
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F8F5EE] border-y border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
              Planning Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2421]">
              From idea to celebration.
            </h2>
            <p className="text-sm text-[#4A5568]">
              Three clear steps to transform high-level expectations into a structured, realistic event blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4 hover:border-[#1B4332] transition-colors">
              <div className="text-3xl font-extrabold text-[#1B4332] tabular-nums font-mono">
                01
              </div>
              <h3 className="text-lg font-bold text-[#1F2421] tracking-tight">
                TELL US YOUR VISION
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Enter your event type, date, location, guest count, budget and preferences.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4 hover:border-[#1B4332] transition-colors">
              <div className="text-3xl font-extrabold text-[#1B4332] tabular-nums font-mono">
                02
              </div>
              <h3 className="text-lg font-bold text-[#1F2421] tracking-tight">
                LET AI BUILD YOUR PLAN
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Gemini creates a personalized event strategy based on your celebration.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4 hover:border-[#1B4332] transition-colors">
              <div className="text-3xl font-extrabold text-[#1B4332] tabular-nums font-mono">
                03
              </div>
              <h3 className="text-lg font-bold text-[#1F2421] tracking-tight">
                PLAN WITH CONFIDENCE
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Manage your budget, timeline, vendors and ideas in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features (4-Card Section) */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            PLAN EVERY DETAIL BEAUTIFULLY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2421]">
            Everything you need to plan beautifully.
          </h2>
          <p className="text-sm text-[#4A5568]">
            From your first idea to the final celebration, everything you need to bring your event together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3 hover:border-[#2D6A4F] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center font-bold">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1F2421] uppercase tracking-wider text-xs text-[#1B4332]">
              SMART BUDGET
            </h3>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              Understand where your money goes and adjust your spending as your plans evolve.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3 hover:border-[#2D6A4F] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1F2421] uppercase tracking-wider text-xs text-[#1B4332]">
              AI TIMELINE
            </h3>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              Turn your event date into a practical preparation plan with tasks and deadlines.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3 hover:border-[#2D6A4F] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1F2421] uppercase tracking-wider text-xs text-[#1B4332]">
              VENDOR CHECKLIST
            </h3>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              Keep venues, catering, photography, decoration, entertainment and other vendors organized.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3 hover:border-[#2D6A4F] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1F2421] uppercase tracking-wider text-xs text-[#1B4332]">
              PERSONALIZED IDEAS
            </h3>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              Discover themes, décor, food, entertainment and guest experiences tailored to your celebration.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Supported Celebrations Section */}
      <section id="supported-events" className="py-20 bg-[#F8F5EE] border-t border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
              Diverse Celebrations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2421]">
              Supported Celebrations
            </h2>
            <p className="text-sm text-[#4A5568]">
              Whether gathering 20 close friends or 500 community members, CelebrAI scales seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Weddings */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#1B4332] transition-colors group">
              <div className="h-40 overflow-hidden">
                <img
                  src="/src/assets/images/celebration_wedding_decor_1793158856460.jpg"
                  alt="Weddings"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-base text-[#1F2421]">Weddings</h3>
                <p className="text-xs text-[#718096]">
                  Receptions, Sangeet, mandap decor, and bridal catering.
                </p>
              </div>
            </div>

            {/* Birthdays */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#1B4332] transition-colors group">
              <div className="h-40 overflow-hidden">
                <img
                  src="/src/assets/images/celebration_hero_ambiance_1793158855836.jpg"
                  alt="Birthdays"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-base text-[#1F2421]">Birthdays</h3>
                <p className="text-xs text-[#718096]">
                  Milestone years, themed parties, games, and dessert bars.
                </p>
              </div>
            </div>

            {/* Community Events */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#1B4332] transition-colors group">
              <div className="h-40 overflow-hidden">
                <img
                  src="/src/assets/images/celebration_community_festival_1793158856415.jpg"
                  alt="Community Events"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-base text-[#1F2421]">Community Events</h3>
                <p className="text-xs text-[#718096]">
                  Cultural festivals, open-air food stalls, and public permits.
                </p>
              </div>
            </div>

            {/* Anniversaries */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-sm flex flex-col justify-between hover:border-[#1B4332] transition-colors">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1F2421]">Anniversaries</h3>
                <p className="text-xs text-[#718096] leading-relaxed">
                  Silver & golden jubilees, intimate dinner banquets, and toast speeches.
                </p>
              </div>
              <span className="text-[11px] text-[#2D6A4F] font-semibold mt-4">
                Milestone memories
              </span>
            </div>

            {/* Other Celebrations */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-sm flex flex-col justify-between hover:border-[#1B4332] transition-colors">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1F2421]">Other Celebrations</h3>
                <p className="text-xs text-[#718096] leading-relaxed">
                  Baby showers, graduations, family reunions, and housewarmings.
                </p>
              </div>
              <span className="text-[11px] text-[#2D6A4F] font-semibold mt-4">
                Fully customized
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI Value Section */}
      <section id="why-celebrai" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
              Generative AI Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2421]">
              Your celebration. Your details. Your plan.
            </h2>
            <p className="text-base text-[#4A5568] leading-relaxed">
              CelebrAI is an intelligent celebration planning assistant, not simply a generic chatbot. Gemini synthesizes your complete event parameters into an interconnected, practical roadmap:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Event Type</span>
              <span className="text-[#718096]">Wedding, birthday, or community gathering</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Guest Count</span>
              <span className="text-[#718096]">Scalable portions, seating, and headcount</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Target Budget</span>
              <span className="text-[#718096]">Strict percentage allocations in INR (₹)</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Location / Venue</span>
              <span className="text-[#718096]">Local atmosphere and site logistics</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Theme & Aesthetic</span>
              <span className="text-[#718096]">Botanical, royal, rustic, or modern minimal</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Dietary Preferences</span>
              <span className="text-[#718096]">Vegetarian, vegan, nut-free, and Jain menus</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Accessibility Needs</span>
              <span className="text-[#718096]">Wheelchair ramps, elevators, sensory zones</span>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D9]">
              <span className="font-bold text-[#1B4332] block mb-1">Host Priorities</span>
              <span className="text-[#718096]">Culinary focus, photography, or party energy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="bg-[#1B4332] text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-[#2D6A4F] space-y-6">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-[#A3E4D7]">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Your celebration starts with an idea.
          </h2>

          <p className="text-base text-[#D8E4DA] max-w-xl mx-auto leading-relaxed">
            Let CelebrAI turn that idea into a thoughtful, practical plan.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onPlanEvent}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-[#1B4332] bg-white hover:bg-[#F2EDE4] rounded-xl transition-all shadow-md focus-visible"
            >
              <span>Plan My Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {hasActiveEvent && (
              <button
                onClick={onOpenExistingApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#2D6A4F] hover:bg-[#3B8A67] rounded-xl transition-colors"
              >
                <span>Continue Active Event</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 8. Landing Footer */}
      <footer className="border-t border-[#E8E2D9] py-8 px-4 sm:px-6 lg:px-8 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718096]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#1B4332] text-white flex items-center justify-center text-[10px] font-bold">
              C
            </div>
            <span className="font-bold text-[#1F2421]">CelebrAI</span>
            <span>· Every celebration, thoughtfully planned.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>CelebrAI Event Planning Assistant</span>
            <span>Intelligent Celebration Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
