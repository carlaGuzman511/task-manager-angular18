import { Injectable, inject } from '@angular/core';
import { TaskFacade } from '../state/task.facade';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskFacade = inject(TaskFacade);

  readonly tasks = this.taskFacade.tasks;
  readonly todoTasks = this.taskFacade.todoTasks;
  readonly inProgressTasks = this.taskFacade.inProgressTasks;
  readonly reviewTasks = this.taskFacade.reviewTasks;
  readonly doneTasks = this.taskFacade.doneTasks;
  readonly stats = this.taskFacade.stats;
  readonly loading = this.taskFacade.loading;
  readonly error = this.taskFacade.error;
  readonly lastUpdated = this.taskFacade.lastUpdated;
  readonly filteredTasks = this.taskFacade.filteredTasks;

  initializeApp(): Observable<Task[]> {
    return this.taskFacade.initializeApp();
  }

  createTask(taskData: CreateTaskDto): void {
    this.taskFacade.createTask(taskData);
  }

  updateTask(id: number, updates: UpdateTaskDto): void {
    this.taskFacade.updateTask(id, updates);
  }

  updateTaskStatus(id: number, newStatus: Task['status']): void {
    this.taskFacade.updateTaskStatus(id, newStatus);
  }

  deleteTask(id: number): void {
    this.taskFacade.deleteTask(id);
  }

  searchTasks(term: string): void {
    this.taskFacade.searchTasks(term);
  }

  clearSearch(): void {
    this.taskFacade.clearSearch();
  }

  getTaskById(id: number): Task | undefined {
    return this.taskFacade.getTaskById(id);
  }

  clearError(): void {
    this.taskFacade.clearError();
  }

  refreshTasks(): void {
    this.taskFacade.loadInitialTasks().subscribe();
  }

  exportTasks(): string {
    return this.taskFacade.exportTasks();
  }

  importTasks(tasks: Task[]): void {
    this.taskFacade.importTasks(tasks);
  }
}