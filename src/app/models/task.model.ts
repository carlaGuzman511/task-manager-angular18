export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  assignees?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskStats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}