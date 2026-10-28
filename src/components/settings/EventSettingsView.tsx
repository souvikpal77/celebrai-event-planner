import React, { useState } from 'react';
import {
  Settings,
  Download,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Calendar,
  Users,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatCurrency } from '../../utils/currency';

interface EventSettingsViewProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onDeleteEvent: (id: string) => void;
  onResetDemoData: () => void;
}

export const EventSettingsView: React.FC<EventSettingsViewProps> = ({
  event,
  onUpdateEvent,
  onDeleteEvent,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState({
    name: event.name,
    location: event.location,
    eventDate: event.eventDate,
    guestCount: event.guestCount,
    totalBudget: event.totalBudget,
    themePreferences: event.themePreferences || '',
    dietaryRequirements: event.dietaryRequirements || '',
    accessibilityRequirements: event.accessibilityRequirements || '',
    planningPriorities: event.planningPriorities || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EventPlan = {
      ...event,
      name: formData.name.trim() || event.name,
      location: formData.location.trim() || event.location,
      eventDate: formData.eventDate,
      guestCount: Math.max(1, Number(formData.guestCount) || 1),
      totalBudget: Math.max(1, Number(formData.totalBudget) || 1),
      themePreferences: formData.themePreferences.trim(),
      dietaryRequirements: formData.dietaryRequirements.trim(),
      accessibilityRequirements: formData.accessibilityRequirements.trim(),
      planningPriorities: formData.planningPriorities.trim(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateEvent(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyTextSummary = () => {
    const plan = event.generatedPlan;
    const summary = `CELEBRAI EVENT PLAN
=============================
Event: ${event.name}
Type: ${event.eventType.toUpperCase()}
Date: ${event.eventDate}
Location: ${event.location}
Guests: ${event.guestCount}
Total Budget: ${formatCurrency(event.totalBudget, event.currency)}

CONCEPT:
${plan?.personalizedConcept || 'N/A'}

BUDGET ALLOCATIONS:
${(plan?.budgetCategories || [])
  .map((c) => `- ${c.category}: ${formatCurrency(c.estimatedAmount, event.currency)} (${c.percentage}%)`)
  .join('\n')}

PLANNING MILESTONES:
${(plan?.tasks || []).map((t) => `- [${t.status === 'completed' ? 'X' : ' '}] ${t.title} (Due: ${t.dueDate})`).join('\n')}

VENDORS:
${(plan?.vendors || []).map((v) => `- ${v.category}: ${v.status.toUpperCase()} (${v.notes || 'No notes'})`).join('\n')}

PERSONALIZED IDEAS:
${(plan?.ideas || []).map((i) => `* ${i.title} (${i.category}): ${i.description}\n  Why it fits: ${i.reasonWhyItFits}`).join('\n\n')}
`;

    navigator.clipboard.writeText(summary);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2421]">
          Event Settings & Export
        </h1>
        <p className="text-xs text-[#718096]">
          Manage event parameters, export your plan, or restore sample data.
        </p>
      </div>

      {/* Export & Sharing Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F2421] flex items-center gap-2">
          <Download className="w-4 h-4 text-[#1B4332]" />
          <span>Export & Share Celebration Plan</span>
        </h2>
        <p className="text-xs text-[#718096] leading-relaxed">
          Export your complete plan including budgets, timeline milestones, vendor checklist, and personalized ideas for sharing with co-hosts, family, or vendors.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4EFEA] hover:bg-[#EBE5DC] text-[#1F2421] font-semibold text-xs rounded-lg transition-colors border border-[#D5CDC0]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Backup</span>
          </button>

          <button
            onClick={handleCopyTextSummary}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white font-semibold text-xs rounded-lg hover:bg-[#2D6A4F] transition-colors shadow-sm"
          >
            {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSuccess ? 'Plan Copied to Clipboard!' : 'Copy Formatted Text Summary'}</span>
          </button>
        </div>
      </div>

      {/* Edit Event Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
          <h2 className="text-base font-bold text-[#1F2421]">Edit Event Parameters</h2>
          {savedSuccess && (
            <span className="text-xs font-semibold text-[#2D6A4F] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved successfully!
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2421] mb-1">Event Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl focus:border-[#1B4332] outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">Date</label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">Guest Count</label>
            <input
              type="number"
              min="1"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl outline-none tabular-nums"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Total Budget ({event.currency})
            </label>
            <input
              type="number"
              min="100"
              step="500"
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl outline-none tabular-nums"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2421] mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">Theme & Style</label>
            <input
              type="text"
              value={formData.themePreferences}
              onChange={(e) => setFormData({ ...formData, themePreferences: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">Dietary Requirements</label>
            <input
              type="text"
              value={formData.dietaryRequirements}
              onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-xl outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-[#1B4332] text-white font-semibold text-xs rounded-xl hover:bg-[#2D6A4F] transition-colors shadow-sm"
          >
            Save Parameters
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-[#FFF5F5] p-6 rounded-2xl border border-[#FEB2B2] space-y-4">
        <h2 className="text-sm font-bold text-[#C53030] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Management Actions</span>
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div>
            <span className="text-xs font-bold text-[#1F2421] block">
              Load Sample Birthday Celebration
            </span>
            <span className="text-xs text-[#718096]">
              Restore the curated 50-guest, ₹25,000 Birthday Celebration sample plan.
            </span>
          </div>
          <button
            onClick={onResetDemoData}
            className="px-3.5 py-1.5 bg-white border border-[#D5CDC0] text-[#1B4332] hover:bg-[#F9F7F2] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Sample Event</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#FED7D7]">
          <div>
            <span className="text-xs font-bold text-[#C53030] block">
              Delete Current Event
            </span>
            <span className="text-xs text-[#718096]">
              Permanently remove this event and its associated budget and task records.
            </span>
          </div>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                onDeleteEvent(event.id);
              }
            }}
            className="px-3.5 py-1.5 bg-[#C53030] hover:bg-[#9B2C2C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
