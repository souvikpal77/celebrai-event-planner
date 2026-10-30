import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Info,
  DollarSign,
  FileText,
} from 'lucide-react';
import { EventPlan, VendorRequirement, VendorStatus } from '../../types/event';
import { formatCurrency } from '../../utils/currency';

interface VendorsViewProps {
  event: EventPlan;
  onUpdateVendors: (vendors: VendorRequirement[]) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({ event, onUpdateVendors }) => {
  const vendors = event.generatedPlan?.vendors || [];
  const currency = event.currency;

  const [statusFilter, setStatusFilter] = useState<'all' | VendorStatus>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorForm, setNewVendorForm] = useState({
    category: '',
    description: '',
    status: 'to_contact' as VendorStatus,
    estimatedCost: 0,
    notes: '',
  });

  const changeVendorStatus = (id: string, newStatus: VendorStatus) => {
    const updated = vendors.map((v) => {
      if (v.id === id) {
        return { ...v, status: newStatus };
      }
      return v;
    });
    onUpdateVendors(updated);
  };

  const startEditNotes = (v: VendorRequirement) => {
    setEditingNotesId(v.id);
    setNoteText(v.notes);
  };

  const saveNotes = (id: string) => {
    const updated = vendors.map((v) => {
      if (v.id === id) {
        return { ...v, notes: noteText.trim() };
      }
      return v;
    });
    onUpdateVendors(updated);
    setEditingNotesId(null);
  };

  const deleteVendor = (id: string) => {
    const updated = vendors.filter((v) => v.id !== id);
    onUpdateVendors(updated);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorForm.category.trim()) return;

    const newVendor: VendorRequirement = {
      id: `v-custom-${Date.now()}`,
      category: newVendorForm.category.trim(),
      description: newVendorForm.description.trim() || 'Vendor requirement for event',
      status: newVendorForm.status,
      estimatedCost: newVendorForm.estimatedCost > 0 ? newVendorForm.estimatedCost : undefined,
      notes: newVendorForm.notes.trim() || 'Initial checklist notes added by host.',
    };

    onUpdateVendors([...vendors, newVendor]);
    setIsAddingVendor(false);
    setNewVendorForm({
      category: '',
      description: '',
      status: 'to_contact',
      estimatedCost: 0,
      notes: '',
    });
  };

  const filteredVendors = vendors.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    return true;
  });

  const bookedCount = vendors.filter((v) => v.status === 'booked').length;
  const shortlistedCount = vendors.filter((v) => v.status === 'shortlisted').length;
  const contactedCount = vendors.filter((v) => v.status === 'contacted').length;
  const toContactCount = vendors.filter((v) => v.status === 'to_contact').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2421]">
            Vendor Checklist
          </h1>
          <p className="text-xs text-[#718096]">
            Coordinate venues, catering, photography, decor, and entertainment requirements for {event.name}.
          </p>
        </div>

        <button
          onClick={() => setIsAddingVendor(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] transition-colors shadow-sm focus-visible"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor Requirement</span>
        </button>
      </div>

      {/* Mandatory Planning Status Disclaimer */}
      <div className="bg-[#F8F5EE] border border-[#E8E2D9] rounded-xl p-4 flex items-start gap-3 text-xs text-[#4A5568]">
        <Info className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1F2421]">Planning Assistant Note:</span> Vendor statuses and records reflect your personal organization checklist only. CelebrAI does not hold contracts, guarantee prices, or initiate bookings on your behalf.
        </div>
      </div>

      {/* Vendor Status Pipeline Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter('to_contact')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'to_contact'
              ? 'bg-[#E8EFE9] border-[#1B4332] shadow-sm'
              : 'bg-white border-[#E8E2D9] hover:border-[#1B4332]'
          }`}
        >
          <span className="text-xs text-[#718096] block">To Contact</span>
          <span className="text-xl font-bold text-[#1F2421] tabular-nums">{toContactCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('contacted')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'contacted'
              ? 'bg-[#E8EFE9] border-[#1B4332] shadow-sm'
              : 'bg-white border-[#E8E2D9] hover:border-[#1B4332]'
          }`}
        >
          <span className="text-xs text-[#718096] block">Contacted</span>
          <span className="text-xl font-bold text-[#B7791F] tabular-nums">{contactedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('shortlisted')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'shortlisted'
              ? 'bg-[#E8EFE9] border-[#1B4332] shadow-sm'
              : 'bg-white border-[#E8E2D9] hover:border-[#1B4332]'
          }`}
        >
          <span className="text-xs text-[#718096] block">Shortlisted</span>
          <span className="text-xl font-bold text-[#2D6A4F] tabular-nums">{shortlistedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('booked')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'booked'
              ? 'bg-[#E8EFE9] border-[#1B4332] shadow-sm'
              : 'bg-white border-[#E8E2D9] hover:border-[#1B4332]'
          }`}
        >
          <span className="text-xs text-[#718096] block">Confirmed / Booked</span>
          <span className="text-xl font-bold text-[#1B4332] tabular-nums">{bookedCount}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#F4EFEA] rounded-xl border border-[#E8E2D9] text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            All Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setStatusFilter('to_contact')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'to_contact'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            To Contact
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'contacted'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setStatusFilter('shortlisted')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'shortlisted'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            Shortlisted
          </button>
          <button
            onClick={() => setStatusFilter('booked')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'booked'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            Booked
          </button>
        </div>
      </div>

      {/* Add Vendor Form (Collapsible) */}
      {isAddingVendor && (
        <form
          onSubmit={handleAddVendor}
          className="bg-white p-5 rounded-xl border border-[#1B4332] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F2421]">Add Vendor Requirement</h3>
            <button
              type="button"
              onClick={() => setIsAddingVendor(false)}
              className="text-xs text-[#718096] hover:text-[#1F2421]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="new-vendor-category" className="block text-xs font-semibold text-[#1F2421] mb-1">
                Vendor Category
              </label>
              <input
                id="new-vendor-category"
                type="text"
                placeholder="e.g. Traditional Dhol Players or Floral Mandap Artist"
                value={newVendorForm.category}
                onChange={(e) =>
                  setNewVendorForm({ ...newVendorForm, category: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg focus:border-[#1B4332] outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="new-vendor-cost" className="block text-xs font-semibold text-[#1F2421] mb-1">
                Estimated Cost ({currency})
              </label>
              <input
                id="new-vendor-cost"
                type="number"
                min="0"
                step="500"
                value={newVendorForm.estimatedCost}
                onChange={(e) =>
                  setNewVendorForm({ ...newVendorForm, estimatedCost: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none tabular-nums"
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-vendor-desc" className="block text-xs font-semibold text-[#1F2421] mb-1">
              Description / Requirement Details
            </label>
            <input
              id="new-vendor-desc"
              type="text"
              placeholder="e.g. 2 musicians for 2 hours during guest arrival"
              value={newVendorForm.description}
              onChange={(e) =>
                setNewVendorForm({ ...newVendorForm, description: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
            />
          </div>

          <div>
            <label htmlFor="new-vendor-notes" className="block text-xs font-semibold text-[#1F2421] mb-1">
              Initial Notes / Contacts
            </label>
            <textarea
              id="new-vendor-notes"
              rows={2}
              placeholder="e.g. Spoke with Rahul (+91 98765 43210), awaiting sample video clip"
              value={newVendorForm.notes}
              onChange={(e) => setNewVendorForm({ ...newVendorForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingVendor(false)}
              className="px-3 py-1.5 text-xs text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
            >
              Add Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendor Cards List */}
      <div className="space-y-4">
        {filteredVendors.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] text-center text-sm text-[#718096]">
            No vendor requirements match the selected filter.
          </div>
        ) : (
          filteredVendors.map((v) => {
            const isEditingNotes = editingNotesId === v.id;

            return (
              <div
                key={v.id}
                className="bg-white rounded-xl border border-[#E8E2D9] p-5 shadow-sm space-y-4 hover:border-[#D5CDC0] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1F2421]">{v.category}</h3>
                      {v.estimatedCost && (
                        <span className="text-xs font-semibold text-[#1B4332] tabular-nums">
                          · {formatCurrency(v.estimatedCost, currency)} est.
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4A5568] leading-relaxed max-w-2xl">
                      {v.description}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <label htmlFor={`vendor-status-${v.id}`} className="text-xs text-[#718096] hidden sm:inline">Status:</label>
                    <select
                      id={`vendor-status-${v.id}`}
                      aria-label={`Status for ${v.category}`}
                      value={v.status}
                      onChange={(e) => changeVendorStatus(v.id, e.target.value as VendorStatus)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border outline-none cursor-pointer transition-colors ${
                        v.status === 'booked'
                          ? 'bg-[#E8EFE9] text-[#1B4332] border-[#2D6A4F]'
                          : v.status === 'shortlisted'
                          ? 'bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]'
                          : v.status === 'contacted'
                          ? 'bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]'
                          : 'bg-[#F9F7F2] text-[#4A5568] border-[#D5CDC0]'
                      }`}
                    >
                      <option value="to_contact">To Contact</option>
                      <option value="contacted">Contacted</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="booked">Booked / Confirmed</option>
                    </select>

                    <button
                      onClick={() => deleteVendor(v.id)}
                      className="p-1.5 text-[#718096] hover:text-[#C53030] hover:bg-[#FFF5F5] rounded-lg transition-colors focus-visible"
                      aria-label={`Remove vendor ${v.category}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes Section with Inline Edit */}
                <div className="pt-3 border-t border-[#F0EBE3]">
                  {isEditingNotes ? (
                    <div className="space-y-2">
                      <label htmlFor={`vendor-notes-${v.id}`} className="sr-only">
                        Notes for {v.category}
                      </label>
                      <textarea
                        id={`vendor-notes-${v.id}`}
                        aria-label={`Notes for ${v.category}`}
                        rows={2}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-[#FDFBF7] border border-[#1B4332] rounded-lg outline-none"
                        placeholder="Add notes on quotes, phone calls, availability, agreements..."
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 text-xs text-[#718096] hover:bg-[#EBE5DC] rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveNotes(v.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-md"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="text-[#4A5568] flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#718096] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#1F2421]">Notes: </strong>
                          {v.notes || 'No notes added yet.'}
                        </span>
                      </div>
                      <button
                        onClick={() => startEditNotes(v)}
                        className="text-xs text-[#1B4332] hover:underline font-semibold shrink-0"
                      >
                        Edit Notes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
