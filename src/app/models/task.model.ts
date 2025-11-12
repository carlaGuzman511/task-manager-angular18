export interface Task {
  id: number
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
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

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignees?: string[];
  estimatedHours?: number | null;
  actualHours?: number | null;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  assignees: string[];
  estimatedHours?: number;
  actualHours?: number;
}
