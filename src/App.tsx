import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlanOverviewView } from './components/plan/PlanOverviewView';
import { BudgetView } from './components/budget/BudgetView';
import { TimelineView } from './components/timeline/TimelineView';
import { VendorsView } from './components/vendors/VendorsView';
import { IdeasView } from './components/ideas/IdeasView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { EventSettingsView } from './components/settings/EventSettingsView';
import { CreateEventModal } from './components/planner/CreateEventModal';
import { LandingPage } from './components/landing/LandingPage';
import {
  EventPlan,
  PlanGenerationRequest,
  BudgetCategory,
  PlanningTask,
  VendorRequirement,
  CelebrationIdea,
  ScheduleItem,
} from './types/event';
import {
  getStoredEvents,
  saveStoredEvents,
  getActiveEventId,
  setActiveEventId,
  isDemoBannerDismissed as checkDemoBannerDismissed,
  setDemoBannerDismissed as persistDemoBannerDismissed,
  INITIAL_DEMO_EVENT,
} from './utils/storage';
import { generateCelebrationPlan, regeneratePersonalizedIdeas } from './utils/aiGenerator';
import { calculatePercentage } from './utils/currency';

export default function App() {
  const [events, setEvents] = useState<EventPlan[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegeneratingIdeas, setIsRegeneratingIdeas] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<PlanGenerationRequest | null>(null);

  const [demoBannerDismissed, setDemoBannerDismissedState] = useState<boolean>(false);

  // Initialize storage safely on mount
  useEffect(() => {
    const loadedEvents = getStoredEvents();
    const activeId = getActiveEventId();
    setEvents(loadedEvents);

    const exists = loadedEvents.some((e) => e.id === activeId);
    if (exists) {
      setActiveEventIdState(activeId);
    } else if (loadedEvents.length > 0) {
      setActiveEventIdState(loadedEvents[0].id);
      setActiveEventId(loadedEvents[0].id);
    }

    setDemoBannerDismissedState(checkDemoBannerDismissed());
  }, []);

  // Sync to localStorage whenever events change
  const updateEventsAndPersist = (updatedEvents: EventPlan[]) => {
    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || null;

  const handleSelectEvent = (id: string) => {
    setActiveEventIdState(id);
    setActiveEventId(id);
  };

  // Create new plan with Gemini
  const handleCreatePlan = async (request: PlanGenerationRequest) => {
    setIsLoading(true);
    setApiError(null);
    setLastRequest(request);

    try {
      const result = await generateCelebrationPlan(request);
      const newEvent: EventPlan = {
        id: `event-${Date.now()}`,
        name: request.name,
        eventType: request.eventType,
        eventDate: request.eventDate,
        location: request.location,
        guestCount: request.guestCount,
        totalBudget: request.totalBudget,
        currency: request.currency,
        themePreferences: request.themePreferences,
        dietaryRequirements: request.dietaryRequirements,
        accessibilityRequirements: request.accessibilityRequirements,
        specialRequirements: request.specialRequirements,
        planningPriorities: request.planningPriorities,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDemo: result.mode === 'demo',
        generatedPlan: result.plan,
      };

      const updated = [newEvent, ...events];
      updateEventsAndPersist(updated);
      handleSelectEvent(newEvent.id);
      setIsCreateModalOpen(false);
      setCurrentView('app');
      setActiveTab('plan');
    } catch (err: any) {
      console.error('Plan creation failed:', err);
      setApiError(err.message || 'We couldn’t generate your plan right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update budget categories
  const handleUpdateCategories = (categories: BudgetCategory[]) => {
    if (!activeEvent || !activeEvent.generatedPlan) return;
    const updatedPlan = {
      ...activeEvent.generatedPlan,
      budgetCategories: categories,
    };
    const updatedEvent: EventPlan = {
      ...activeEvent,
      generatedPlan: updatedPlan,
      updatedAt: new Date().toISOString(),
    };
    const updatedEvents = events.map((e) => (e.id === activeEvent.id ? updatedEvent : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Update total budget from budget view
  const handleUpdateTotalBudget = (newBudget: number) => {
    if (!activeEvent || !activeEvent.generatedPlan) return;
    const updatedCategories = activeEvent.generatedPlan.budgetCategories.map((cat) => ({
      ...cat,
      percentage: calculatePercentage(cat.estimatedAmount, newBudget),
    }));

    const updatedEvent: EventPlan = {
      ...activeEvent,
      totalBudget: newBudget,
      generatedPlan: {
        ...activeEvent.generatedPlan,
        budgetCategories: updatedCategories,
      },
      updatedAt: new Date().toISOString(),
    };
    const updatedEvents = events.map((e) => (e.id === activeEvent.id ? updatedEvent : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Update tasks
  const handleUpdateTasks = (tasks: PlanningTask[]) => {
    if (!activeEvent || !activeEvent.generatedPlan) return;
    const updatedEvent: EventPlan = {
      ...activeEvent,
      generatedPlan: {
        ...activeEvent.generatedPlan,
        tasks,
      },
      updatedAt: new Date().toISOString(),
    };
    const updatedEvents = events.map((e) => (e.id === activeEvent.id ? updatedEvent : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Update vendors
  const handleUpdateVendors = (vendors: VendorRequirement[]) => {
    if (!activeEvent || !activeEvent.generatedPlan) return;
    const updatedEvent: EventPlan = {
      ...activeEvent,
      generatedPlan: {
        ...activeEvent.generatedPlan,
        vendors,
      },
      updatedAt: new Date().toISOString(),
    };
    const updatedEvents = events.map((e) => (e.id === activeEvent.id ? updatedEvent : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Update ideas
  const handleUpdateIdeas = (ideas: CelebrationIdea[]) => {
    if (!activeEvent || !activeEvent.generatedPlan) return;
    const updatedEvent: EventPlan = {
      ...activeEvent,
      generatedPlan: {
        ...activeEvent.generatedPlan,
        ideas,
      },
      updatedAt: new Date().toISOString(),
    };
    const updatedEvents = events.map((e) => (e.id === activeEvent.id ? updatedEvent : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Regenerate ideas
  const handleRegenerateIdeas = async () => {
    if (!activeEvent) return;
    setIsRegeneratingIdeas(true);
    try {
      const res = await regeneratePersonalizedIdeas({
        eventType: activeEvent.eventType,
        guestCount: activeEvent.guestCount,
        totalBudget: activeEvent.totalBudget,
        currency: activeEvent.currency,
        location: activeEvent.location,
        themePreferences: activeEvent.themePreferences,
        dietaryRequirements: activeEvent.dietaryRequirements,
        accessibilityRequirements: activeEvent.accessibilityRequirements,
        planningPriorities: activeEvent.planningPriorities,
      });

      if (res.ideas && res.ideas.length > 0) {
        handleUpdateIdeas(res.ideas);
      }
    } catch (err) {
      console.error('Failed to regenerate ideas:', err);
    } finally {
      setIsRegeneratingIdeas(false);
    }
  };

  // Update event-day schedule
  const handleUpdateSchedule = (schedule: ScheduleItem[]) => {
    if (!activeEvent || !activeEvent.generatedPlan) return;
    const updatedEvent: EventPlan = {
      ...activeEvent,
      generatedPlan: {
        ...activeEvent.generatedPlan,
        eventDaySchedule: schedule,
      },
      updatedAt: new Date().toISOString(),
    };
    const updatedEvents = events.map((e) => (e.id === activeEvent.id ? updatedEvent : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Update entire event metadata from settings
  const handleUpdateEventMetadata = (updated: EventPlan) => {
    const updatedEvents = events.map((e) => (e.id === updated.id ? updated : e));
    updateEventsAndPersist(updatedEvents);
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    const remaining = events.filter((e) => e.id !== id);
    updateEventsAndPersist(remaining);
    if (remaining.length > 0) {
      handleSelectEvent(remaining[0].id);
    } else {
      setActiveEventIdState('');
    }
    setActiveTab('dashboard');
  };

  // Reset sample celebration data
  const handleResetDemoData = () => {
    const withoutDemo = events.filter((e) => e.id !== INITIAL_DEMO_EVENT.id);
    const restored = [INITIAL_DEMO_EVENT, ...withoutDemo];
    updateEventsAndPersist(restored);
    handleSelectEvent(INITIAL_DEMO_EVENT.id);
    persistDemoBannerDismissed(false);
    setDemoBannerDismissedState(false);
    setActiveTab('dashboard');
  };

  // Clear demo data
  const handleClearDemoData = () => {
    const nonDemo = events.filter((e) => !e.isDemo);
    updateEventsAndPersist(nonDemo);
    if (nonDemo.length > 0) {
      handleSelectEvent(nonDemo[0].id);
    } else {
      setActiveEventIdState('');
    }
  };

  const handleDismissDemoBanner = () => {
    persistDemoBannerDismissed(true);
    setDemoBannerDismissedState(true);
  };

  // If current view is landing page, show public landing experience
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onPlanEvent={() => {
            setApiError(null);
            setIsCreateModalOpen(true);
          }}
          onOpenExistingApp={() => {
            setCurrentView('app');
            setActiveTab('dashboard');
          }}
          hasActiveEvent={Boolean(activeEvent)}
          activeEvent={activeEvent}
        />

        {/* Create Event Modal accessible from landing page */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePlan}
          isLoading={isLoading}
          error={apiError}
          onRetry={lastRequest ? () => handleCreatePlan(lastRequest) : undefined}
        />
      </>
    );
  }

  // Application View: Dashboard, Budget, Timeline, Vendors, Ideas, Schedule, Settings
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1F2421]">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateModal={() => {
          setApiError(null);
          setIsCreateModalOpen(true);
        }}
        hasActiveEvent={Boolean(activeEvent)}
        activeEventName={activeEvent?.name}
        onReturnToLanding={() => setCurrentView('landing')}
      />

      {/* Main App Layout: Sidebar + Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            events={events}
            activeEvent={activeEvent}
            onSelectEvent={handleSelectEvent}
            onOpenCreateModal={() => {
              setApiError(null);
              setIsCreateModalOpen(true);
            }}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              event={activeEvent}
              onNavigateTab={setActiveTab}
              onOpenCreateModal={() => {
                setApiError(null);
                setIsCreateModalOpen(true);
              }}
              onClearDemoData={handleClearDemoData}
              isDemoBannerDismissed={demoBannerDismissed}
              onDismissDemoBanner={handleDismissDemoBanner}
            />
          )}

          {activeTab === 'plan' && activeEvent && (
            <PlanOverviewView event={activeEvent} onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'budget' && activeEvent && (
            <BudgetView
              event={activeEvent}
              onUpdateCategories={handleUpdateCategories}
              onUpdateTotalBudget={handleUpdateTotalBudget}
            />
          )}

          {activeTab === 'timeline' && activeEvent && (
            <TimelineView event={activeEvent} onUpdateTasks={handleUpdateTasks} />
          )}

          {activeTab === 'vendors' && activeEvent && (
            <VendorsView event={activeEvent} onUpdateVendors={handleUpdateVendors} />
          )}

          {activeTab === 'ideas' && activeEvent && (
            <IdeasView
              event={activeEvent}
              onUpdateIdeas={handleUpdateIdeas}
              onRegenerateIdeas={handleRegenerateIdeas}
              isRegenerating={isRegeneratingIdeas}
            />
          )}

          {activeTab === 'schedule' && activeEvent && (
            <ScheduleView event={activeEvent} onUpdateSchedule={handleUpdateSchedule} />
          )}

          {activeTab === 'settings' && activeEvent && (
            <EventSettingsView
              event={activeEvent}
              onUpdateEvent={handleUpdateEventMetadata}
              onDeleteEvent={handleDeleteEvent}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
        isLoading={isLoading}
        error={apiError}
        onRetry={lastRequest ? () => handleCreatePlan(lastRequest) : undefined}
      />
    </div>
  );
}
