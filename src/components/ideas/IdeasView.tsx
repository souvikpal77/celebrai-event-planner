import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  Check,
  Tag,
  Palette,
  UtensilsCrossed,
  Music,
  Camera,
  HeartHandshake,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { EventPlan, CelebrationIdea, IdeaCategory } from '../../types/event';

interface IdeasViewProps {
  event: EventPlan;
  onUpdateIdeas: (ideas: CelebrationIdea[]) => void;
  onRegenerateIdeas: () => Promise<void>;
  isRegenerating: boolean;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  event,
  onUpdateIdeas,
  onRegenerateIdeas,
  isRegenerating,
}) => {
  const ideas = event.generatedPlan?.ideas || [];
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  const categories = [
    { id: 'all', label: 'All Ideas' },
    { id: 'theme', label: 'Theme & Style' },
    { id: 'decor', label: 'Decor & Lighting' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'activities', label: 'Activities & Games' },
    { id: 'guest_experience', label: 'Guest Experience' },
    { id: 'photography', label: 'Photography' },
    { id: 'invitations', label: 'Invitations' },
  ];

  const filteredIdeas = ideas.filter((idea) => {
    if (selectedCategory === 'all') return true;
    return idea.category === selectedCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'theme':
        return Palette;
      case 'decor':
        return Sparkles;
      case 'food':
        return UtensilsCrossed;
      case 'entertainment':
        return Music;
      case 'activities':
        return HeartHandshake;
      case 'photography':
        return Camera;
      case 'guest_experience':
      case 'invitations':
        return Gift;
      default:
        return Lightbulb;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2421]">
            Personalized Celebration Ideas
          </h1>
          <p className="text-xs text-[#718096]">
            AI-curated ideas grounded in your guest count ({event.guestCount}), budget ({event.currency} {event.totalBudget.toLocaleString()}), and preferences.
          </p>
        </div>

        <button
          onClick={onRegenerateIdeas}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] disabled:opacity-50 transition-colors shadow-sm focus-visible"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Generating Fresh Ideas...' : 'Regenerate Ideas'}</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#1B4332] text-white font-semibold shadow-sm'
                : 'bg-white border border-[#E8E2D9] text-[#718096] hover:text-[#1F2421] hover:border-[#1B4332]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-2 bg-white p-8 rounded-2xl border border-[#E8E2D9] text-center text-sm text-[#718096]">
            No celebration ideas found in this category. Click &quot;Regenerate Ideas&quot; above to explore fresh concepts.
          </div>
        ) : (
          filteredIdeas.map((idea) => {
            const Icon = getCategoryIcon(idea.category);

            return (
              <div
                key={idea.id}
                className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#1B4332] transition-colors"
              >
                <div className="space-y-2.5">
                  {/* Category unboxed text metadata */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] capitalize">
                    <Icon className="w-4 h-4" />
                    <span>{idea.category.replace('_', ' ')}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#1F2421] leading-snug">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* Grounded "Why It Fits" Box */}
                <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E8E2D9] text-xs text-[#2D3748] space-y-1">
                  <div className="font-bold text-[#1B4332] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Why it fits your celebration:</span>
                  </div>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {idea.reasonWhyItFits}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
