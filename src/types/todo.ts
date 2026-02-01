export type Priority = 'high' | 'medium' | 'low';

export type FilterType = 'all' | 'today' | 'week' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  order: number;
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  tags: string[];
}
