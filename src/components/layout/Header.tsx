import React from 'react';
import { Calendar, Plus, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateModal: () => void;
  hasActiveEvent: boolean;
  activeEventName?: string;
  onReturnToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateModal,
  hasActiveEvent,
  activeEventName,
  onReturnToLanding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'budget', label: 'Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'schedule', label: 'Event Day' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D9]">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none group"
            aria-label="CelebrAI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#2D6A4F] transition-colors">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1B4332] whitespace-nowrap shrink-0">
                CelebrAI
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A5568]"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 relative ${
                  isActive
                    ? 'text-[#1B4332] font-semibold'
                    : 'hover:text-[#1B4332]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Optional Public Landing Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="hidden sm:inline-flex text-xs font-semibold text-[#4A5568] hover:text-[#1B4332] px-2.5 py-1.5 rounded-lg hover:bg-[#F2EDE4] transition-colors whitespace-nowrap"
            >
              Public Site
            </button>
          )}

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1B4332] rounded-lg hover:bg-[#2D6A4F] active:bg-[#143225] transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible"
            aria-label="Plan a new event"
          >
            <Plus className="w-4 h-4" />
            <span>Plan an Event</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#4A5568] hover:text-[#1B4332] hover:bg-[#F2EDE4] transition-colors focus-visible"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2D9] bg-[#FDFBF7] px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                activeTab === link.id
                  ? 'bg-[#E8EFE9] text-[#1B4332] font-semibold'
                  : 'text-[#4A5568] hover:bg-[#F4EFEA]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {onReturnToLanding && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReturnToLanding();
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg font-medium text-[#718096] hover:bg-[#F4EFEA] hover:text-[#1B4332]"
            >
              ← Back to Public Site
            </button>
          )}
          {activeEventName && (
            <div className="pt-2 mt-2 border-t border-[#E8E2D9] text-xs text-[#718096] px-3">
              Active: <span className="font-medium text-[#1B4332]">{activeEventName}</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
