import type { FilterType } from '../types/todo';
import { Calendar, CalendarDays, CheckCircle2, List, Tag, X } from 'lucide-react';

interface FilterBarProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  allTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const filterOptions: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'すべて', icon: <List className="w-4 h-4" /> },
  { value: 'today', label: '今日', icon: <Calendar className="w-4 h-4" /> },
  { value: 'week', label: '今週', icon: <CalendarDays className="w-4 h-4" /> },
  { value: 'completed', label: '完了', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export const FilterBar = ({
  filter,
  setFilter,
  allTags,
  selectedTag,
  setSelectedTag,
}: FilterBarProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-2 mb-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                #{tag}
                {selectedTag === tag && <X className="w-3 h-3" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
