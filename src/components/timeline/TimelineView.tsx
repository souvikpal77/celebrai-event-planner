import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Pencil,
  Trash2,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { EventPlan, PlanningTask, PriorityLevel } from '../../types/event';

interface TimelineViewProps {
  event: EventPlan;
  onUpdateTasks: (tasks: PlanningTask[]) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ event, onUpdateTasks }) => {
  const tasks = event.generatedPlan?.tasks || [];

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: 'medium' as PriorityLevel,
    category: 'General',
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as PriorityLevel,
  });

  // Toggle task complete/reopen
  const toggleTaskStatus = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? ('pending' as const) : ('completed' as const),
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const startEdit = (t: PlanningTask) => {
    setEditingTaskId(t.id);
    setEditForm({
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority,
    });
  };

  const saveEdit = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          title: editForm.title.trim() || t.title,
          description: editForm.description.trim(),
          dueDate: editForm.dueDate || t.dueDate,
          priority: editForm.priority,
        };
      }
      return t;
    });
    onUpdateTasks(updated);
    setEditingTaskId(null);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    onUpdateTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    const newTask: PlanningTask = {
      id: `t-custom-${Date.now()}`,
      title: newTaskForm.title.trim(),
      description: newTaskForm.description.trim(),
      dueDate: newTaskForm.dueDate,
      priority: newTaskForm.priority,
      status: 'pending',
      category: newTaskForm.category.trim() || 'General',
    };

    onUpdateTasks([...tasks, newTask]);
    setIsAddingTask(false);
    setNewTaskForm({
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'medium',
      category: 'General',
    });
  };

  // Safe date helper handling past dates gracefully
  const formatDueNotice = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      if (isNaN(target.getTime())) return dateStr;

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);

      const diffDays = Math.round((target.getTime() - now.getTime()) / 86400000);

      if (diffDays < 0) {
        return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} past due`;
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${diffDays} days`;
      }
    } catch {
      return dateStr;
    }
  };

  // Sort tasks chronologically by dueDate
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Filter tasks
  const filteredTasks = sortedTasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = totalTasks - completedCount;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2421]">
            Planning Timeline
          </h1>
          <p className="text-xs text-[#718096]">
            Chronological milestones and actionable deadlines tailored to your celebration date ({event.eventDate}).
          </p>
        </div>

        <button
          onClick={() => setIsAddingTask(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] transition-colors shadow-sm focus-visible"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Progress & Overview Strip */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-[#718096]">Total Tasks</span>
            <div className="text-2xl font-bold text-[#1F2421] tabular-nums">{totalTasks}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#718096]">Completed</span>
            <div className="text-2xl font-bold text-[#2D6A4F] tabular-nums">
              {completedCount}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#718096]">Pending</span>
            <div className="text-2xl font-bold text-[#B7791F] tabular-nums">
              {pendingCount}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#F0EBE3]">
          <div className="flex justify-between text-xs text-[#718096]">
            <span>Completion Rate</span>
            <span className="font-semibold text-[#1F2421] tabular-nums">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#E8E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2D6A4F] rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Controls) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#F4EFEA] rounded-xl border border-[#E8E2D9] text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            All ({totalTasks})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'pending'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              statusFilter === 'completed'
                ? 'bg-white text-[#1B4332] shadow-sm font-semibold'
                : 'text-[#718096] hover:text-[#1F2421]'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#718096]">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-[#D5CDC0] rounded-lg text-[#1F2421] outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Add New Task Form (Collapsible) */}
      {isAddingTask && (
        <form
          onSubmit={handleAddTask}
          className="bg-white p-5 rounded-xl border border-[#1B4332] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F2421]">Add New Milestone / Task</h3>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-[#718096] hover:text-[#1F2421]"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Confirm acoustic speakers & playlist with venue"
              value={newTaskForm.title}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg focus:border-[#1B4332] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Description & Logistics
            </label>
            <textarea
              rows={2}
              placeholder="Specify requirements, contacts, or milestones..."
              value={newTaskForm.description}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg focus:border-[#1B4332] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Due Date</label>
              <input
                type="date"
                value={newTaskForm.dueDate}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Priority</label>
              <select
                value={newTaskForm.priority}
                onChange={(e) =>
                  setNewTaskForm({ ...newTaskForm, priority: e.target.value as PriorityLevel })
                }
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Venue, Catering"
                value={newTaskForm.category}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 text-xs text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm divide-y divide-[#E8E2D9] overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#718096]">
            No planning tasks match the selected filter.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isEditing = editingTaskId === t.id;
            const isCompleted = t.status === 'completed';
            const dueNotice = formatDueNotice(t.dueDate);
            const isPastDue = dueNotice.includes('past due');

            if (isEditing) {
              return (
                <div key={t.id} className="p-4 bg-[#F9F7F2] space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-[#1B4332] rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-[#D5CDC0] rounded-lg outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-[#D5CDC0] rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Priority
                      </label>
                      <select
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm({ ...editForm, priority: e.target.value as PriorityLevel })
                        }
                        className="w-full px-3 py-1.5 text-sm bg-white border border-[#D5CDC0] rounded-lg outline-none"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="px-3 py-1 text-xs text-[#4A5568] hover:bg-[#EBE5DC] rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="px-4 py-1 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
                    >
                      Save Task
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={t.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  isCompleted ? 'bg-[#FAF8F5]/80' : 'hover:bg-[#FDFBF7]'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="mt-0.5 text-[#718096] hover:text-[#1B4332] transition-colors focus-visible"
                    aria-label={isCompleted ? 'Mark task as incomplete' : 'Mark task as completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-[#718096]' : 'text-[#1F2421]'
                        }`}
                      >
                        {t.title}
                      </h3>
                      {/* Zero-Pill Unboxed Metadata */}
                      <span className="text-xs text-[#718096]">·</span>
                      <span
                        className={`text-xs font-semibold capitalize ${
                          t.priority === 'high'
                            ? 'text-[#C53030]'
                            : t.priority === 'medium'
                            ? 'text-[#B7791F]'
                            : 'text-[#4A5568]'
                        }`}
                      >
                        {t.priority} Priority
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed max-w-2xl ${
                        isCompleted ? 'text-[#A0AEC0]' : 'text-[#4A5568]'
                      }`}
                    >
                      {t.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] pt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#718096]" />
                      <span className="tabular-nums text-[#718096]">{t.dueDate}</span>
                      <span className="text-[#A0AEC0]">·</span>
                      <span
                        className={`tabular-nums font-medium ${
                          isPastDue && !isCompleted ? 'text-[#C53030]' : 'text-[#718096]'
                        }`}
                      >
                        {dueNotice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 self-center">
                  <button
                    onClick={() => startEdit(t)}
                    className="p-1.5 text-[#718096] hover:text-[#1B4332] hover:bg-[#E8EFE9] rounded-lg transition-colors focus-visible"
                    aria-label={`Edit task ${t.title}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 text-[#718096] hover:text-[#C53030] hover:bg-[#FFF5F5] rounded-lg transition-colors focus-visible"
                    aria-label={`Delete task ${t.title}`}
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
