import React, { useState } from 'react';
import {
  Wallet,
  PieChart as PieChartIcon,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { EventPlan, BudgetCategory } from '../../types/event';
import {
  formatCurrency,
  calculateAllocated,
  calculateRemaining,
  calculatePercentage,
  isOverBudget,
} from '../../utils/currency';

const DONUT_COLORS = [
  '#1B4332', // Deep forest green
  '#2D6A4F', // Emerald green
  '#B7791F', // Warm brass / amber
  '#40916C', // Mid green
  '#D97706', // Warm ochre
  '#52796F', // Sage
  '#2B6CB0', // Sapphire blue
  '#9B2C2C', // Terracotta wine
  '#718096', // Slate gray
];

interface BudgetViewProps {
  event: EventPlan;
  onUpdateCategories: (categories: BudgetCategory[]) => void;
  onUpdateTotalBudget: (newBudget: number) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  event,
  onUpdateCategories,
  onUpdateTotalBudget,
}) => {
  const plan = event.generatedPlan;
  const categories = plan?.budgetCategories || [];
  const currency = event.currency;
  const totalBudget = event.totalBudget;

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ category: string; amount: number; explanation: string }>({
    category: '',
    amount: 0,
    explanation: '',
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    category: '',
    amount: 1000,
    explanation: '',
  });

  const [isEditingTotalBudget, setIsEditingTotalBudget] = useState(false);
  const [newTotalBudgetInput, setNewTotalBudgetInput] = useState(totalBudget);

  // Immediate deterministic recalculation
  const allocated = calculateAllocated(categories);
  const remaining = calculateRemaining(totalBudget, allocated);
  const percentageAllocated = calculatePercentage(allocated, totalBudget);
  const overBudget = isOverBudget(totalBudget, allocated);

  // Recharts Donut data mapping
  const chartData = categories.map((cat, idx) => ({
    name: cat.category,
    value: Math.max(0, cat.estimatedAmount),
    percentage: cat.percentage,
    color: DONUT_COLORS[idx % DONUT_COLORS.length],
  }));

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1F2421] text-white px-3 py-2 rounded-lg shadow-xl text-xs border border-[#333] space-y-0.5 pointer-events-none">
          <div className="font-semibold text-white">{data.name}</div>
          <div className="text-[#D5CDC0] tabular-nums">
            {formatCurrency(data.value, currency)} · {data.percentage}% of budget
          </div>
        </div>
      );
    }
    return null;
  };

  const startEditing = (cat: BudgetCategory) => {
    setEditingCategoryId(cat.id);
    setEditForm({
      category: cat.category,
      amount: cat.estimatedAmount,
      explanation: cat.explanation,
    });
  };

  const saveEdit = (id: string) => {
    const updated = categories.map((cat) => {
      if (cat.id === id) {
        const safeAmount = Math.max(0, Number(editForm.amount) || 0);
        const newPct = calculatePercentage(safeAmount, totalBudget);
        return {
          ...cat,
          category: editForm.category.trim() || cat.category,
          estimatedAmount: safeAmount,
          percentage: newPct,
          explanation: editForm.explanation.trim(),
        };
      }
      return cat;
    });
    onUpdateCategories(updated);
    setEditingCategoryId(null);
  };

  const deleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert('Your plan requires at least one budget category.');
      return;
    }
    const updated = categories.filter((c) => c.id !== id);
    onUpdateCategories(updated);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryForm.category.trim()) return;

    const safeAmount = Math.max(0, Number(newCategoryForm.amount) || 0);
    const newPct = calculatePercentage(safeAmount, totalBudget);

    const newCat: BudgetCategory = {
      id: `b-custom-${Date.now()}`,
      category: newCategoryForm.category.trim(),
      estimatedAmount: safeAmount,
      percentage: newPct,
      explanation: newCategoryForm.explanation.trim() || 'Custom added expense category.',
    };

    onUpdateCategories([...categories, newCat]);
    setIsAddingNew(false);
    setNewCategoryForm({ category: '', amount: 1000, explanation: '' });
  };

  const saveTotalBudgetEdit = () => {
    const val = Number(newTotalBudgetInput);
    if (val > 0) {
      onUpdateTotalBudget(val);
      setIsEditingTotalBudget(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2421]">
            Budget Allocation
          </h1>
          <p className="text-xs text-[#718096]">
            Deterministic financial allocations, cost tracking, and real-time expense calculations for {event.name}.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] transition-colors shadow-sm focus-visible"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Category</span>
        </button>
      </div>

      {/* Overbudget Warning Callout */}
      {overBudget && (
        <div className="bg-[#FFF5F5] border border-[#FEB2B2] rounded-xl p-4 text-[#C53030] flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Budget Exceeded:</span> Total allocated expenses (
            {formatCurrency(allocated, currency)}) exceed your designated event budget of{' '}
            {formatCurrency(totalBudget, currency)} by{' '}
            <span className="font-bold underline">
              {formatCurrency(allocated - totalBudget, currency)}
            </span>
            . Adjust category amounts below or increase your total budget.
          </div>
        </div>
      )}

      {/* Top Financial Dashboard Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Budget Column */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Budget
              </span>
              {!isEditingTotalBudget ? (
                <button
                  onClick={() => {
                    setNewTotalBudgetInput(totalBudget);
                    setIsEditingTotalBudget(true);
                  }}
                  className="text-xs text-[#1B4332] font-semibold hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              ) : (
                <button
                  onClick={saveTotalBudgetEdit}
                  className="text-xs text-[#2D6A4F] font-bold hover:underline"
                >
                  Save
                </button>
              )}
            </div>

            {isEditingTotalBudget ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  step="500"
                  value={newTotalBudgetInput}
                  onChange={(e) => setNewTotalBudgetInput(Number(e.target.value))}
                  className="w-36 px-2 py-1 text-base font-bold bg-[#FDFBF7] border border-[#1B4332] rounded-lg tabular-nums"
                />
              </div>
            ) : (
              <div className="text-3xl font-extrabold text-[#1F2421] tabular-nums">
                {formatCurrency(totalBudget, currency)}
              </div>
            )}
            <p className="text-xs text-[#718096]">Allocated across {categories.length} categories</p>
          </div>

          {/* Allocated Amount */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">
              Total Allocated
            </span>
            <div
              className={`text-3xl font-extrabold tabular-nums ${
                overBudget ? 'text-[#C53030]' : 'text-[#1F2421]'
              }`}
            >
              {formatCurrency(allocated, currency)}
            </div>
            <p className="text-xs text-[#718096]">
              {percentageAllocated}% of total budget utilized
            </p>
          </div>

          {/* Remaining Balance */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">
              Remaining Balance
            </span>
            <div
              className={`text-3xl font-extrabold tabular-nums ${
                remaining < 0 ? 'text-[#C53030]' : 'text-[#2D6A4F]'
              }`}
            >
              {formatCurrency(remaining, currency)}
            </div>
            <p className="text-xs text-[#718096]">
              {remaining >= 0 ? 'Uncommitted buffer' : 'Exceeded allocation'}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#718096]">
            <span>Budget Allocation Progress</span>
            <span className="font-semibold tabular-nums text-[#1F2421]">
              {percentageAllocated}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overBudget ? 'bg-[#DC2626]' : 'bg-[#2D6A4F]'
              }`}
              style={{ width: `${Math.min(percentageAllocated, 100)}%` }}
            />
          </div>
        </div>

        {/* Disclaimer label */}
        <div className="flex items-center gap-2 text-xs text-[#718096] pt-1 border-t border-[#F0EBE3]">
          <Info className="w-3.5 h-3.5 text-[#B7791F] shrink-0" />
          <span>
            <strong className="text-[#1F2421]">Estimated cost:</strong> CelebrAI provides thoughtful planning approximations. Actual vendor quotes and receipts should be confirmed during final contracts.
          </span>
        </div>
      </div>

      {/* Category Distribution Donut Chart Card */}
      {categories.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE3] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1F2421] flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#1B4332]" />
                Budget Category Distribution
              </h2>
              <p className="text-xs text-[#718096]">
                Interactive visual distribution of estimated amounts across budget categories.
              </p>
            </div>
            <div className="text-xs text-[#718096]">
              Total Allocated:{' '}
              <span className="font-bold text-[#1F2421] tabular-nums">
                {formatCurrency(allocated, currency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Donut Chart with Centered Metric */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[260px]">
              <div className="w-full h-64 min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsTooltip content={renderCustomTooltip} />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={98}
                      paddingAngle={3}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-semibold text-[#718096] uppercase tracking-wider">
                  Allocated
                </span>
                <span className="text-lg font-extrabold text-[#1F2421] tabular-nums">
                  {formatCurrency(allocated, currency)}
                </span>
                <span className="text-[11px] text-[#718096] tabular-nums">
                  {percentageAllocated}% of budget
                </span>
              </div>
            </div>

            {/* Distribution Legend Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#F0EBE3] hover:border-[#D5CDC0] hover:bg-[#FDFBF7] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-[#1F2421] truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#1F2421] tabular-nums block">
                      {formatCurrency(item.value, currency)}
                    </span>
                    <span className="text-[11px] text-[#718096] tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Category Form (Collapsible) */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNewCategory}
          className="bg-white p-5 rounded-xl border border-[#1B4332] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F2421]">Add Custom Expense Category</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-[#718096] hover:text-[#1F2421]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Traditional Music / Dhol Players"
                value={newCategoryForm.category}
                onChange={(e) =>
                  setNewCategoryForm({ ...newCategoryForm, category: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg focus:border-[#1B4332] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Estimated Amount ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={newCategoryForm.amount}
                onChange={(e) =>
                  setNewCategoryForm({ ...newCategoryForm, amount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg focus:border-[#1B4332] outline-none tabular-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. 2 live performers for 2 hours during evening welcoming"
              value={newCategoryForm.explanation}
              onChange={(e) =>
                setNewCategoryForm({ ...newCategoryForm, explanation: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-[#FDFBF7] border border-[#D5CDC0] rounded-lg focus:border-[#1B4332] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs text-[#4A5568] hover:bg-[#F2EDE4] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      {/* Category Breakdown Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E8E2D9] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2421]">
            Detailed Expense Breakdown ({categories.length} categories)
          </h2>
          <span className="text-xs text-[#718096]">Click edit on any row to adjust amounts</span>
        </div>

        <div className="divide-y divide-[#E8E2D9]">
          {categories.map((cat) => {
            const isEditing = editingCategoryId === cat.id;
            const pct = calculatePercentage(cat.estimatedAmount, totalBudget);

            if (isEditing) {
              return (
                <div key={cat.id} className="p-4 bg-[#F9F7F2] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-[#1B4332] rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Estimated Amount ({currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 text-sm bg-white border border-[#1B4332] rounded-lg outline-none tabular-nums"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                      Explanation
                    </label>
                    <input
                      type="text"
                      value={editForm.explanation}
                      onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-[#D5CDC0] rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="px-3 py-1 text-xs text-[#4A5568] hover:bg-[#EBE5DC] rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(cat.id)}
                      className="px-4 py-1 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FDFBF7] transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm text-[#1F2421]">{cat.category}</h3>
                    {/* Unboxed percentage metadata */}
                    <span className="text-xs text-[#718096] tabular-nums font-medium">
                      {pct}% of budget
                    </span>
                  </div>
                  <p className="text-xs text-[#718096] leading-relaxed max-w-2xl">
                    {cat.explanation || 'Planned allocation based on event requirements.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-bold text-[#1F2421] tabular-nums">
                      {formatCurrency(cat.estimatedAmount, currency)}
                    </div>
                    <div className="text-[11px] text-[#718096]">Estimated cost</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditing(cat)}
                      className="p-1.5 text-[#718096] hover:text-[#1B4332] hover:bg-[#E8EFE9] rounded-lg transition-colors focus-visible"
                      aria-label={`Edit ${cat.category}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-[#718096] hover:text-[#C53030] hover:bg-[#FFF5F5] rounded-lg transition-colors focus-visible"
                      aria-label={`Delete ${cat.category}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
