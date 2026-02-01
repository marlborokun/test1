import type { Todo } from '../types/todo';
import { TaskCard } from './TaskCard';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onReorder: (dragId: string, dropId: string) => void;
}

export const TaskList = ({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  onReorder,
}: TaskListProps) => {
  const {
    dragOverId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(onReorder);

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
        <ClipboardList className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">タスクがありません</p>
        <p className="text-sm">新しいタスクを追加してみましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TaskCard
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onUpdate={(updates) => onUpdate(todo.id, updates)}
          isDragOver={dragOverId === todo.id}
          onDragStart={(e) => handleDragStart(e, todo.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, todo.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, todo.id)}
        />
      ))}
    </div>
  );
};
