import type { Todo } from '../types/todo';

const STORAGE_KEY = 'rich-todo-app-data';
const THEME_KEY = 'rich-todo-app-theme';

export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const loadTodos = (): Todo[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveTheme = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
};

export const loadTheme = (): boolean => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme) {
    return theme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
