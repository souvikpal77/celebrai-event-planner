import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Sparkles,
  PieChart,
  CalendarCheck,
  Store,
  Lightbulb,
  Clock,
  Settings,
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatCurrency, calculateAllocated } from '../../utils/currency';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  events: EventPlan[];
  activeEvent: EventPlan | null;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreateModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'AI Event Plan', icon: Sparkles },
    { id: 'budget', label: 'Budget Allocation', icon: PieChart },
    { id: 'timeline', label: 'Planning Timeline', icon: CalendarCheck },
    { id: 'vendors', label: 'Vendor Checklist', icon: Store },
    { id: 'ideas', label: 'Personalized Ideas', icon: Lightbulb },
    { id: 'schedule', label: 'Event-Day Schedule', icon: Clock },
    { id: 'settings', label: 'Event Settings', icon: Settings },
  ];

  // Calculate quick stats
  const totalTasks = activeEvent?.generatedPlan?.tasks?.length || 0;
  const completedTasks =
    activeEvent?.generatedPlan?.tasks?.filter((t) => t.status === 'completed').length || 0;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalBudget = activeEvent?.totalBudget || 0;
  const currency = activeEvent?.currency || 'INR';
  const allocated = activeEvent?.generatedPlan?.budgetCategories
    ? calculateAllocated(activeEvent.generatedPlan.budgetCategories)
    : 0;

  return (
    <aside className="animate-fade-in w-64 bg-[#F8F5EE] border-r border-[#E8E2D9] flex flex-col shrink-0 min-h-[calc(100vh-4rem)] select-none">
      {/* Event Switcher Box */}
      <div className="p-4 border-b border-[#E8E2D9]" ref={dropdownRef}>
        <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-1.5">
          Current Celebration
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-white border border-[#D5CDC0] rounded-lg px-3 py-2 text-left flex items-center justify-between text-sm font-medium text-[#1F2421] hover:border-[#1B4332] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#1B4332] outline-none"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="truncate pr-2">
              <span className="block truncate font-semibold">
                {activeEvent?.name || 'Select an Event'}
              </span>
              <span className="block text-xs text-[#718096] capitalize">
                {activeEvent?.eventType || 'No event'} · {activeEvent?.guestCount || 0} guests
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#718096] shrink-0 transition-transform duration-200 ease-out ${
                dropdownOpen ? 'rotate-180 text-[#1B4332]' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute left-0 right-0 mt-1.5 bg-white border border-[#D5CDC0] rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto"
                role="listbox"
              >
                {events.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      onSelectEvent(ev.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col ${
                      ev.id === activeEvent?.id
                        ? 'bg-[#E8EFE9] text-[#1B4332] font-semibold'
                        : 'text-[#2D3748] hover:bg-[#F9F7F2]'
                    }`}
                    role="option"
                    aria-selected={ev.id === activeEvent?.id}
                  >
                    <span className="truncate font-medium">{ev.name}</span>
                    <span className="text-[11px] text-[#718096]">
                      {ev.eventType} · {formatCurrency(ev.totalBudget, ev.currency)}
                    </span>
                  </button>
                ))}

                <div className="border-t border-[#E8E2D9] mt-1 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenCreateModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#1B4332] font-semibold hover:bg-[#E8EFE9] flex items-center gap-2 transition-colors duration-150"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create New Event</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navigation Links with Subtle Transition Animations */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" aria-label="Sidebar Menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] active:scale-[0.99] ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-[#4A5568] hover:text-[#1F2421]'
              }`}
            >
              {/* Subtle sliding active background pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-tab-bg"
                  className="absolute inset-0 bg-[#1B4332] rounded-lg shadow-sm shadow-[#1B4332]/25"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 34,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Inactive hover background */}
              {!isActive && (
                <div className="absolute inset-0 rounded-lg bg-transparent group-hover:bg-[#EBE5DC]/80 transition-colors duration-200 pointer-events-none" />
              )}

              {/* Active accent vertical indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-tab-accent"
                  className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-[#52B788] rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 34,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Item Content (Icon & Label) */}
              <span className="relative z-10 flex items-center gap-3 w-full truncate pl-1">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 ${
                    isActive ? 'text-[#D8F3DC]' : 'text-[#718096] group-hover:text-[#1F2421]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Quick Summary Card in Sidebar */}
      {activeEvent && (
        <div className="p-4 m-3 bg-white rounded-xl border border-[#E8E2D9] text-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-[#718096]">
            <span>Task Progress</span>
            <span className="font-semibold tabular-nums text-[#1F2421]">
              {completedTasks}/{totalTasks} ({taskProgress}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${taskProgress}%` }}
            />
          </div>

          <div className="pt-2 border-t border-[#F0EBE3] flex justify-between items-center text-[#718096]">
            <span>Budget</span>
            <span className="font-semibold tabular-nums text-[#1F2421]">
              {formatCurrency(totalBudget, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="p-4 border-t border-[#E8E2D9] text-[11px] text-[#718096] flex items-center justify-between">
        <span>CelebrAI Planner</span>
        <span>Intelligent Planning</span>
      </div>
    </aside>
  );
};
