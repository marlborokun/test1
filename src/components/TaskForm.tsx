import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Calendar, Flag, Tag, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Priority, TodoFormData } from '../types/todo';
import { getTodayString } from '../utils/date';

interface TaskFormProps {
  onSubmit: (data: TodoFormData) => void;
  allTags: string[];
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '高', color: 'text-red-500' },
  { value: 'medium', label: '中', color: 'text-yellow-500' },
  { value: 'low', label: '低', color: 'text-green-500' },
];

export const TaskForm = ({ onSubmit, allTags }: TaskFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      tags,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    setTagInput('');
    setIsExpanded(false);
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <Plus className="w-3 h-3 text-gray-400" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="新しいタスクを追加..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 pl-8">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明を追加..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none text-sm"
              rows={2}
            />

            <div className="flex flex-wrap gap-4">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-400" />
                <div className="flex gap-1">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        priority === option.value
                          ? `${option.color} bg-gray-100 dark:bg-gray-700`
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={getTodayString()}
                  className="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-gray-400 mt-1.5" />
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="タグを追加 (Enterで確定)"
                    className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {allTags
                      .filter((t) => !tags.includes(t))
                      .slice(0, 5)
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          #{tag}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setTitle('');
              setDescription('');
              setPriority('medium');
              setDueDate('');
              setTags([]);
            }}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-1.5 rounded-lg text-sm bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            追加
          </button>
        </div>
      )}
    </form>
  );
};
