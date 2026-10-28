import React, { useState } from 'react';
import { Clock, Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { EventPlan, ScheduleItem } from '../../types/event';

interface ScheduleViewProps {
  event: EventPlan;
  onUpdateSchedule: (schedule: ScheduleItem[]) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ event, onUpdateSchedule }) => {
  const schedule = event.generatedPlan?.eventDaySchedule || [];

  const [isAdding, setIsAdding] = useState(false);
  const [newSlot, setNewSlot] = useState({
    time: '12:00 PM',
    activity: '',
    description: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSlot, setEditSlot] = useState({
    time: '',
    activity: '',
    description: '',
  });

  const toggleComplete = (id: string) => {
    const updated = schedule.map((s) => {
      if (s.id === id) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });
    onUpdateSchedule(updated);
  };

  const startEdit = (s: ScheduleItem) => {
    setEditingId(s.id);
    setEditSlot({
      time: s.time,
      activity: s.activity,
      description: s.description,
    });
  };

  const saveEdit = (id: string) => {
    const updated = schedule.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          time: editSlot.time.trim() || s.time,
          activity: editSlot.activity.trim() || s.activity,
          description: editSlot.description.trim(),
        };
      }
      return s;
    });
    onUpdateSchedule(updated);
    setEditingId(null);
  };

  const deleteSlot = (id: string) => {
    const updated = schedule.filter((s) => s.id !== id);
    onUpdateSchedule(updated);
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.activity.trim()) return;

    const newItem: ScheduleItem = {
      id: `s-custom-${Date.now()}`,
      time: newSlot.time.trim(),
      activity: newSlot.activity.trim(),
      description: newSlot.description.trim(),
      completed: false,
    };

    onUpdateSchedule([...schedule, newItem]);
    setIsAdding(false);
    setNewSlot({ time: '12:00 PM', activity: '', description: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2421]">
            Event-Day Schedule
          </h1>
          <p className="text-xs text-[#718096]">
            Step-by-step itinerary from load-in and guest arrival to dining, speeches, and farewell.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] transition-colors shadow-sm focus-visible"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Slot</span>
        </button>
      </div>

      {/* Add Slot Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSlot}
          className="bg-white p-5 rounded-xl border border-[#1B4332] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F2421]">Add Itinerary Item</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#718096] hover:text-[#1F2421]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Time</label>
              <input
                type="text"
                placeholder="e.g. 05:30 PM"
                value={newSlot.time}
                onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Activity</label>
              <input
                type="text"
                placeholder="e.g. Guest Welcome & Appetizers"
                value={newSlot.activity}
                onChange={(e) => setNewSlot({ ...newSlot, activity: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">Details & Logistics</label>
            <input
              type="text"
              placeholder="e.g. Acoustic guitar background, mocktail punch served at entrance"
              value={newSlot.description}
              onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Schedule Timeline */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm divide-y divide-[#E8E2D9] overflow-hidden">
        {schedule.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#718096]">
            No schedule entries yet. Add your first day-of milestone above.
          </div>
        ) : (
          schedule.map((item, idx) => {
            const isEditing = editingId === item.id;
            const isCompleted = Boolean(item.completed);

            if (isEditing) {
              return (
                <div key={item.id} className="p-4 bg-[#F9F7F2] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">Time</label>
                      <input
                        type="text"
                        value={editSlot.time}
                        onChange={(e) => setEditSlot({ ...editSlot, time: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-[#1B4332] rounded-lg outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">Activity</label>
                      <input
                        type="text"
                        value={editSlot.activity}
                        onChange={(e) => setEditSlot({ ...editSlot, activity: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-[#1B4332] rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2421] mb-1">Description</label>
                    <input
                      type="text"
                      value={editSlot.description}
                      onChange={(e) => setEditSlot({ ...editSlot, description: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-[#D5CDC0] rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs text-[#4A5568] hover:bg-[#EBE5DC] rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="px-4 py-1 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
                    >
                      Save Item
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  isCompleted ? 'bg-[#FAF8F5]/80' : 'hover:bg-[#FDFBF7]'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="mt-1 text-[#718096] hover:text-[#1B4332] transition-colors focus-visible"
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1B4332] tabular-nums whitespace-nowrap bg-[#E8EFE9] px-2 py-0.5 rounded-md">
                        {item.time}
                      </span>
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-[#718096]' : 'text-[#1F2421]'
                        }`}
                      >
                        {item.activity}
                      </h3>
                    </div>

                    <p
                      className={`text-xs leading-relaxed max-w-2xl ${
                        isCompleted ? 'text-[#A0AEC0]' : 'text-[#4A5568]'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-center">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 text-[#718096] hover:text-[#1B4332] hover:bg-[#E8EFE9] rounded-lg transition-colors focus-visible"
                    aria-label={`Edit ${item.activity}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSlot(item.id)}
                    className="p-1.5 text-[#718096] hover:text-[#C53030] hover:bg-[#FFF5F5] rounded-lg transition-colors focus-visible"
                    aria-label={`Delete ${item.activity}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
