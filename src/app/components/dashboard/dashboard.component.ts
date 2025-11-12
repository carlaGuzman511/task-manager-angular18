import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { StatisticsPanelComponent } from '../statistics-panel/statistics-panel.component';
import { TaskCardComponent } from '../task-card/task-card.component';
// import { HealthStatusComponent } from '../health-status/health-status.component';
import { Task } from '../../models/task.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    StatisticsPanelComponent,
    TaskCardComponent,
    // HealthStatusComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  todoTasks = this.taskService.todoTasks;
  inProgressTasks = this.taskService.inProgressTasks;
  reviewTasks = this.taskService.reviewTasks;
  doneTasks = this.taskService.doneTasks;
  stats = this.taskService.stats;
  isLoading = this.taskService.loading;
  errorState = this.taskService.error;
  lastUpdated = this.taskService.lastUpdated;
  filteredTasks = this.taskService.filteredTasks;

  showAddTaskModal = signal(false);
  isSearching = signal(false);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['medium', Validators.required],
    dueDate: ['', Validators.required],
    estimatedHours: [0, [Validators.min(0)]],
    assignees: ['']
  });

  ngOnInit(): void {
    this.initializeApp();

    const searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.isSearching.set(!!term);
      this.taskService.searchTasks(term);
    });

    this.subscriptions.push(searchSubscription);
  }

  initializeApp(): void {
    this.taskService.initializeApp().subscribe({
      next: (tasks) => {
        console.log('App initialized with', tasks.length, 'tasks');
      },
      error: (error) => {
        console.error('Error initializing app:', error);
      }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      
      this.taskService.updateTaskStatus(task.id, newStatus);
    }
  }

  onTaskStatusChange(taskId: number, newStatus: string): void {
    this.taskService.updateTaskStatus(taskId, newStatus as Task['status']);
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  openAddTaskModal(): void {
    this.showAddTaskModal.set(true);
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal.set(false);
    this.taskForm.reset({
      priority: 'medium',
      estimatedHours: 0
    });
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const estimatedHours = formValue.estimatedHours && formValue.estimatedHours > 0 
      ? formValue.estimatedHours 
      : undefined;
      const taskData = {
        title: formValue.title!,
        description: formValue.description || '',
        status: 'todo' as const,
        priority: formValue.priority as 'low' | 'medium' | 'high',
        dueDate: new Date(formValue.dueDate!),
        assignees: formValue.assignees?.split(',').map(a => a.trim()).filter(a => a) || [],
        estimatedHours: estimatedHours,
      };

      this.taskService.createTask(taskData);
      this.closeAddTaskModal();
    }
  }

  dismissError(): void {
    this.taskService.clearError();
  }

  refreshData(): void {
    this.taskService.refreshTasks();
  }

  exportData(): void {
    const data = this.taskService.exportTasks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private getStatusFromContainerId(containerId: string): Task['status'] {
    switch (containerId) {
      case 'todo-list': return 'todo';
      case 'in-progress-list': return 'in-progress';
      case 'review-list': return 'review';
      case 'done-list': return 'done';
      default: return 'todo';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.searchSubject.complete();
  }
}