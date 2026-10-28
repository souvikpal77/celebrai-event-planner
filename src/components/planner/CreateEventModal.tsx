import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, AlertCircle, Calendar, Users, Wallet, MapPin } from 'lucide-react';
import { EventType, PlanGenerationRequest } from '../../types/event';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanGenerationRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  onRetry,
}) => {
  const [formData, setFormData] = useState<PlanGenerationRequest>({
    name: '',
    eventType: 'birthday',
    eventDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    location: '',
    guestCount: 50,
    totalBudget: 25000,
    currency: 'INR',
    themePreferences: '',
    dietaryRequirements: '',
    accessibilityRequirements: '',
    specialRequirements: '',
    planningPriorities: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please provide an event name.';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Event name cannot exceed 100 characters.';
    }

    if (!formData.location.trim()) {
      errors.location = 'Please provide a city or venue location.';
    }

    if (!formData.guestCount || formData.guestCount < 1) {
      errors.guestCount = 'Guest count must be at least 1 person.';
    } else if (formData.guestCount > 25000) {
      errors.guestCount = 'Guest count exceeds maximum limit (25,000).';
    }

    if (!formData.totalBudget || formData.totalBudget <= 0) {
      errors.totalBudget = 'Please enter a valid budget amount greater than zero.';
    }

    if (!formData.eventDate) {
      errors.eventDate = 'Please select a valid event date.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const setSampleQuickTemplate = (type: EventType) => {
    if (type === 'birthday') {
      setFormData({
        name: 'Rahul’s 30th Rooftop Birthday',
        eventType: 'birthday',
        eventDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        location: 'Indiranagar, Bengaluru',
        guestCount: 50,
        totalBudget: 25000,
        currency: 'INR',
        themePreferences: 'Rustic sunset garden with fairy lights and live acoustic melodies',
        dietaryRequirements: '60% vegetarian, 40% non-veg, eggless birthday cake',
        accessibilityRequirements: 'Elevator access for older relatives',
        specialRequirements: 'Candid photographer, Polaroid guestbook corner',
        planningPriorities: 'Memorable guest experience, good food, strict adherence to budget',
      });
    } else if (type === 'wedding') {
      setFormData({
        name: 'Pooja & Karan’s Intimate Wedding & Sangeet',
        eventType: 'wedding',
        eventDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        location: 'Heritage Courtyard, Jaipur',
        guestCount: 120,
        totalBudget: 350000,
        currency: 'INR',
        themePreferences: 'Marigold & blush florals, royal Rajputana courtyard aesthetic',
        dietaryRequirements: 'North Indian & Rajasthani vegetarian delicacies, Jain food options',
        accessibilityRequirements: 'Ground-level seating for grandparents, ramp at mandap',
        specialRequirements: 'Live dhol, traditional folk singers, bridal drone photography',
        planningPriorities: 'Flawless guest hospitality, authentic cultural decor, punctuality',
      });
    } else if (type === 'community') {
      setFormData({
        name: 'Green Meadows Monsoon Cultural Fest',
        eventType: 'community',
        eventDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        location: 'Community Amphitheatre, Pune',
        guestCount: 200,
        totalBudget: 50000,
        currency: 'INR',
        themePreferences: 'Eco-friendly paper lanterns, rain-proof stage canopy, zero-waste decor',
        dietaryRequirements: 'Chai & samosa boxes, fruit juices, packaged drinking water',
        accessibilityRequirements: 'Wheelchair access ramp, wide seating rows',
        specialRequirements: 'High-clarity PA sound system, first aid booth, volunteer tags',
        planningPriorities: 'Broad family participation, smooth logistics, zero littering',
      });
    }
    setValidationErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#FDFBF7] rounded-2xl max-w-2xl w-full border border-[#D5CDC0] shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8EFE9] text-[#1B4332] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-[#1F2421]">
                Plan a New Celebration
              </h2>
              <p className="text-xs text-[#718096]">
                Gemini will craft a budget, timeline, vendor checklist, and personalized ideas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-[#718096] hover:text-[#1F2421] rounded-lg hover:bg-[#F2EDE4] transition-colors focus-visible"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Example Template Fillers */}
        <div className="px-6 py-2.5 bg-[#F9F7F2] border-b border-[#E8E2D9] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#718096] font-semibold shrink-0">Example Templates:</span>
          <button
            type="button"
            onClick={() => setSampleQuickTemplate('birthday')}
            className="px-2.5 py-1 bg-white border border-[#D5CDC0] rounded-md text-[#1B4332] hover:bg-[#E8EFE9] transition-colors font-medium whitespace-nowrap"
          >
            Birthday (50 guests, ₹25k)
          </button>
          <button
            type="button"
            onClick={() => setSampleQuickTemplate('wedding')}
            className="px-2.5 py-1 bg-white border border-[#D5CDC0] rounded-md text-[#1B4332] hover:bg-[#E8EFE9] transition-colors font-medium whitespace-nowrap"
          >
            Wedding (120 guests)
          </button>
          <button
            type="button"
            onClick={() => setSampleQuickTemplate('community')}
            className="px-2.5 py-1 bg-white border border-[#D5CDC0] rounded-md text-[#1B4332] hover:bg-[#E8EFE9] transition-colors font-medium whitespace-nowrap"
          >
            Community Fest (200 guests)
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mx-6 mt-4 p-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded-xl text-xs text-[#C53030] flex items-start justify-between gap-2"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="font-semibold underline hover:no-underline shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="p-12 text-center space-y-4" role="status" aria-live="polite">
            <Loader2 className="w-10 h-10 text-[#1B4332] animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1F2421]">
                Creating your personalized celebration plan...
              </h3>
              <p className="text-xs text-[#718096] max-w-sm mx-auto">
                Gemini is synthesizing budgets, chronological timeline milestones, vendor requirements, and curated ideas for {formData.guestCount} guests.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Event Name */}
            <div>
              <label htmlFor="event-name" className="block text-xs font-bold text-[#1F2421] mb-1">
                Event Name <span className="text-[#C53030]">*</span>
              </label>
              <input
                id="event-name"
                type="text"
                placeholder="e.g. Aanya’s 25th Birthday Celebration"
                value={formData.name}
                aria-invalid={Boolean(validationErrors.name)}
                aria-describedby={validationErrors.name ? 'event-name-error' : undefined}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
                }}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors ${
                  validationErrors.name ? 'border-[#C53030]' : 'border-[#D5CDC0]'
                }`}
              />
              {validationErrors.name && (
                <p id="event-name-error" className="text-xs text-[#C53030] mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Event Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-type" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Event Type <span className="text-[#C53030]">*</span>
                </label>
                <select
                  id="event-type"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
                >
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="community">Community Event</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other Celebration</option>
                </select>
              </div>

              <div>
                <label htmlFor="event-date" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Event Date <span className="text-[#C53030]">*</span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
                />
              </div>
            </div>

            {/* Location & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-location" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Location / City <span className="text-[#C53030]">*</span>
                </label>
                <input
                  id="event-location"
                  type="text"
                  placeholder="e.g. Indiranagar, Bengaluru"
                  value={formData.location}
                  aria-invalid={Boolean(validationErrors.location)}
                  aria-describedby={validationErrors.location ? 'event-location-error' : undefined}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (validationErrors.location) setValidationErrors({ ...validationErrors, location: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:border-[#1B4332] outline-none ${
                    validationErrors.location ? 'border-[#C53030]' : 'border-[#D5CDC0]'
                  }`}
                />
                {validationErrors.location && (
                  <p id="event-location-error" className="text-xs text-[#C53030] mt-1">{validationErrors.location}</p>
                )}
              </div>

              <div>
                <label htmlFor="guest-count" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Expected Guests <span className="text-[#C53030]">*</span>
                </label>
                <input
                  id="guest-count"
                  type="number"
                  min="1"
                  max="50000"
                  value={formData.guestCount}
                  aria-invalid={Boolean(validationErrors.guestCount)}
                  aria-describedby={validationErrors.guestCount ? 'guest-count-error' : undefined}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none tabular-nums"
                />
                {validationErrors.guestCount && (
                  <p id="guest-count-error" className="text-xs text-[#C53030] mt-1">{validationErrors.guestCount}</p>
                )}
              </div>
            </div>

            {/* Total Budget & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="total-budget" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Total Budget <span className="text-[#C53030]">*</span>
                </label>
                <input
                  id="total-budget"
                  type="number"
                  min="100"
                  step="500"
                  value={formData.totalBudget}
                  aria-invalid={Boolean(validationErrors.totalBudget)}
                  aria-describedby={validationErrors.totalBudget ? 'total-budget-error' : undefined}
                  onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none tabular-nums"
                />
                {validationErrors.totalBudget && (
                  <p id="total-budget-error" className="text-xs text-[#C53030] mt-1">{validationErrors.totalBudget}</p>
                )}
              </div>

              <div>
                <label htmlFor="currency" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Theme & Styling Preferences */}
            <div>
              <label htmlFor="theme-prefs" className="block text-xs font-bold text-[#1F2421] mb-1">
                Theme & Aesthetic Preferences
              </label>
              <input
                id="theme-prefs"
                type="text"
                placeholder="e.g. Warm botanical garden with fairy lights, golden champagne tones"
                value={formData.themePreferences}
                onChange={(e) => setFormData({ ...formData, themePreferences: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
              />
            </div>

            {/* Dietary & Accessibility Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dietary" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Dietary Requirements
                </label>
                <input
                  id="dietary"
                  type="text"
                  placeholder="e.g. 50% vegetarian, nut-free dessert, vegan snacks"
                  value={formData.dietaryRequirements}
                  onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
                />
              </div>

              <div>
                <label htmlFor="accessibility" className="block text-xs font-bold text-[#1F2421] mb-1">
                  Accessibility Requirements
                </label>
                <input
                  id="accessibility"
                  type="text"
                  placeholder="e.g. Wheelchair ramp, elevator, ground-floor seating"
                  value={formData.accessibilityRequirements}
                  onChange={(e) => setFormData({ ...formData, accessibilityRequirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
                />
              </div>
            </div>

            {/* Planning Priorities */}
            <div>
              <label htmlFor="priorities" className="block text-xs font-bold text-[#1F2421] mb-1">
                Planning Priorities
              </label>
              <input
                id="priorities"
                type="text"
                placeholder="e.g. Delicious food, intimate guest experience, sticking strictly to budget"
                value={formData.planningPriorities}
                onChange={(e) => setFormData({ ...formData, planningPriorities: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-semibold text-[#4A5568] hover:text-[#1F2421] hover:bg-[#F2EDE4] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] active:bg-[#143225] rounded-xl transition-colors shadow-sm flex items-center gap-2 focus-visible"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Event Plan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
