import { signal, computed } from '@angular/core';
import { Task, TaskStats } from '../models/task.model';

export interface TaskState {
  entities: { [id: number]: Task };
  ids: number[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  lastUpdated: Date | null;
}

export const initialTaskState: TaskState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  searchTerm: '',
  lastUpdated: null
};

const state = signal<TaskState>(initialTaskState);

export const taskState = {
  state,
  entities: computed(() => state().entities),
  ids: computed(() => state().ids),
  loading: computed(() => state().loading),
  error: computed(() => state().error),
  searchTerm: computed(() => state().searchTerm),
  lastUpdated: computed(() => state().lastUpdated),
  
  allTasks: computed(() => 
    state().ids.map(id => state().entities[id])
  ),
  
  todoTasks: computed((): Task[] => 
    taskState.allTasks().filter((task: Task) => task.status === 'todo')
  ),

  inProgressTasks: computed((): Task[] => 
    taskState.allTasks().filter((task: Task) => task.status === 'in-progress')
  ),
  
  reviewTasks: computed((): Task[] => 
    taskState.allTasks().filter((task: Task) => task.status === 'review')
  ),
  
  doneTasks: computed((): Task[] => 
    taskState.allTasks().filter((task: Task) => task.status === 'done')
  ),
  
  stats: computed((): TaskStats => {
    const tasks = taskState.allTasks();
    const now = new Date();
    
    return {
      total: tasks.length,
      inProgress: tasks.filter((task: Task) => task.status === 'in-progress').length,
      completed: tasks.filter((task: Task)  => task.status === 'done').length,
      overdue: tasks.filter((task: Task) =>
        task.status !== 'done' && new Date(task.dueDate) < now
      ).length
    };
  }),
  
  filteredTasks: computed((): Task[] => {
    const searchTerm = state().searchTerm;
    const tasks = taskState.allTasks();
    
    if (!searchTerm.trim()) {
      return tasks;
    }
    
    const term = searchTerm.toLowerCase();
    return tasks.filter((task: Task) =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.assignees?.some(assignee => assignee.toLowerCase().includes(term))
    );
  }),
  
  getTaskById: (id: number) => computed(() => state().entities[id]),
  
  updateState: (newState: TaskState) => {
    state.set(newState);
  }
};