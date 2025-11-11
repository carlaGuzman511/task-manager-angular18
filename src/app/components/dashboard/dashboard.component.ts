import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { StatisticsPanelComponent } from '../statistics-panel/statistics-panel.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    StatisticsPanelComponent,
    TaskCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private searchSubject = new Subject<string>();

  todoTasks = this.taskService.todoTasks;
  inProgressTasks = this.taskService.inProgressTasks;
  reviewTasks = this.taskService.reviewTasks;
  doneTasks = this.taskService.doneTasks;

  showAddTaskModal = signal(false);
  searchTerm = signal('');

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium', Validators.required],
    dueDate: ['', Validators.required],
    estimatedHours: [0],
    assignees: ['']
  });

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.taskService.updateSearchTerm(term);
    });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      this.taskService.updateTaskStatus(task.id, newStatus);
    }
  }

  onTaskStatusChange(taskId: string, newStatus: string): void {
    this.taskService.updateTaskStatus(taskId, newStatus as Task['status']);
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
      
      this.taskService.addTask({
        title: formValue.title!,
        description: formValue.description || '',
        status: 'todo',
        priority: formValue.priority as 'low' | 'medium' | 'high',
        dueDate: new Date(formValue.dueDate!),
        estimatedHours: formValue.estimatedHours ?? 0,
        assignees: formValue.assignees?.split(',').map(a => a.trim()) || []
      });

      this.closeAddTaskModal();
    }
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
}