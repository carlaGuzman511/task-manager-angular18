import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { taskState } from './task.state';

import {
  TaskActions,
  LoadTasks,
  LoadTasksSuccess,
  LoadTasksFailure,
  CreateTask,
  UpdateTask,
  UpdateTaskStatus,
  DeleteTask,
  SearchTasks,
  SetLoading,
  SetError,
  ClearError,
  LoadFromStorage
} from './task.actions';

import { dispatch } from './task.reducer';

import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskFacade {
  private http = inject(HttpClient);

  readonly tasks = taskState.allTasks;
  readonly loading = taskState.loading;
  readonly error = taskState.error;
  readonly lastUpdated = taskState.lastUpdated;

  readonly todoTasks = taskState.todoTasks;
  readonly inProgressTasks = taskState.inProgressTasks;
  readonly reviewTasks = taskState.reviewTasks;
  readonly doneTasks = taskState.doneTasks;

  readonly stats = taskState.stats;

  readonly filteredTasks = taskState.filteredTasks;

  initializeApp(): Observable<Task[]> {
    this.loadFromStorage();

    if (this.tasks().length === 0) {
      return this.loadInitialTasks();
    }
    
    return of(this.tasks());
  }

  loadInitialTasks(): Observable<Task[]> {
  dispatch(new SetLoading({ loading: true }));
  dispatch(new ClearError());

  return this.http.get<{ tasks: Task[] }>('src/assets/data/tasks.json').pipe(
    delay(500),
    map(response => {
      const processedTasks = response.tasks.map(task => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }));

      dispatch(new LoadTasksSuccess({ tasks: processedTasks }));
      return processedTasks;
    }),
    catchError(error => {
      const errorMessage = 'Failed to load initial tasks';
      dispatch(new LoadTasksFailure({ error: errorMessage }));
      return of([]);
    })
    );
  }

  createTask(taskData: CreateTaskDto): void {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch(new CreateTask({ task: newTask }));
  }

  updateTask(id: number, updates: UpdateTaskDto): void {
    dispatch(new UpdateTask({ id, updates }));
  }

  updateTaskStatus(id: number, newStatus: Task['status']): void {
    dispatch(new UpdateTaskStatus({ id, newStatus }));
  }

  deleteTask(id: number): void {
    dispatch(new DeleteTask({ id }));
  }

  searchTasks(searchTerm: string): void {
    dispatch(new SearchTasks({ searchTerm }));
  }

  clearSearch(): void {
    dispatch(new SearchTasks({ searchTerm: '' }));
  }

  clearError(): void {
    dispatch(new ClearError());
  }

  setError(error: string): void {
    dispatch(new SetError({ error }));
  }

  loadFromStorage(): void {
    dispatch(new LoadFromStorage());
  }

  getTaskById(id: number): Task | undefined {
    return taskState.getTaskById(id)();
  }

  exportTasks(): string {
    return JSON.stringify(this.tasks(), null, 2);
  }

  importTasks(tasks: Task[]): void {
    dispatch(new LoadTasksSuccess({ tasks }));
  }

  getStateSnapshot() {
    return {
      tasks: this.tasks(),
      loading: this.loading(),
      error: this.error(),
      lastUpdated: this.lastUpdated(),
      stats: this.stats()
    };
  }

  private generateId(): number {
    const tasks = this.tasks();
    return tasks.length > 0 ? Math.max(...tasks.map((t: Task) => t.id)) + 1 : 1;
  }
}