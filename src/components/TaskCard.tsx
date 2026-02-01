import { useState } from 'react';
import type { DragEvent } from 'react';
import {
  Check,
  Circle,
  Calendar,
  GripVertical,
  Trash2,
  Edit3,
  X,
  Save,
} from 'lucide-react';
import type { Todo, Priority } from '../types/todo';
import { formatDate, isPastDue } from '../utils/date';

interface TaskCardProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Todo>) => void;
  isDragOver: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export const TaskCard = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate({
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const isOverdue = todo.dueDate && isPastDue(todo.dueDate) && !todo.completed;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
        isDragOver
          ? 'border-primary-400 ring-2 ring-primary-200 dark:ring-primary-800'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${todo.completed ? 'opacity-60' : ''} hover:shadow-md cursor-grab active:cursor-grabbing`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 pt-0.5">
            <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              onClick={onToggle}
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.completed
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
              }`}
            >
              {todo.completed ? (
                <Check className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3 opacity-0" />
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="説明を追加..."
                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-primary-500 text-white text-sm hover:bg-primary-600"
                  >
                    <Save className="w-3 h-3" />
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    <X className="w-3 h-3" />
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-medium text-gray-900 dark:text-white ${
                      todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <span
                    className={`w-2 h-2 rounded-full ${priorityColors[todo.priority]}`}
                    title={`優先度: ${priorityLabels[todo.priority]}`}
                  />
                </div>

                {todo.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {todo.description}
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {todo.dueDate && (
                    <span
                      className={`flex items-center gap-1 text-xs ${
                        isOverdue
                          ? 'text-red-500'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDate(todo.dueDate)}
                      {isOverdue && ' (期限切れ)'}
                    </span>
                  )}

                  {todo.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {todo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="編集"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"
                aria-label="削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
