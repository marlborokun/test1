import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Todo, TodoFormData, FilterType } from '../types/todo';
import { saveTodos, loadTodos } from '../utils/storage';
import { isToday, isThisWeek } from '../utils/date';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadTodos();
    setTodos(loaded);
  }, []);

  useEffect(() => {
    if (todos.length > 0 || loadTodos().length > 0) {
      saveTodos(todos);
    }
  }, [todos]);

  const addTodo = useCallback((data: TodoFormData) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || undefined,
      completed: false,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      order: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const reorderTodos = useCallback((dragId: string, dropId: string) => {
    setTodos((prev) => {
      const dragIndex = prev.findIndex((t) => t.id === dragId);
      const dropIndex = prev.findIndex((t) => t.id === dropId);
      if (dragIndex === -1 || dropIndex === -1) return prev;

      const newTodos = [...prev];
      const [dragged] = newTodos.splice(dragIndex, 1);
      newTodos.splice(dropIndex, 0, dragged);

      return newTodos.map((todo, index) => ({ ...todo, order: index }));
    });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    todos.forEach((todo) => todo.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Filter by type
        switch (filter) {
          case 'today':
            return todo.dueDate && isToday(todo.dueDate) && !todo.completed;
          case 'week':
            return todo.dueDate && isThisWeek(todo.dueDate) && !todo.completed;
          case 'completed':
            return todo.completed;
          default:
            return true;
        }
      })
      .filter((todo) => {
        // Filter by search query
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      })
      .filter((todo) => {
        // Filter by tag
        if (!selectedTag) return true;
        return todo.tags.includes(selectedTag);
      })
      .sort((a, b) => {
        // Sort by completion, then by order
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return a.order - b.order;
      });
  }, [todos, filter, searchQuery, selectedTag]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const today = todos.filter((t) => t.dueDate && isToday(t.dueDate) && !t.completed).length;
    const highPriority = todos.filter((t) => t.priority === 'high' && !t.completed).length;
    return { total, completed, today, highPriority };
  }, [todos]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    allTags,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    reorderTodos,
  };
};
