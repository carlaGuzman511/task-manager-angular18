import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, CdkDrag],
  templateUrl: 'task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() statusChange = new EventEmitter<string>();
  @Output() taskClick = new EventEmitter<Task>();

  get isOverdue(): boolean {
    return new Date() > this.task.dueDate && this.task.status !== 'done';
  }

  get formattedDueDate(): string {
    const now = new Date();
    const dueDate = this.task.dueDate;
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    
    return `in ${diffDays} days`;
  }

  onStatusToggle(): void {
    const newStatus = this.task.status === 'done' ? 'todo' : 'done';
    this.statusChange.emit(newStatus);
  }

  onTaskClick(): void {
    this.taskClick.emit(this.task);
  }
}