import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-panel.component.html',
  styleUrls: ['./statistics-panel.component.scss']
})
export class StatisticsPanelComponent {
  private taskService = inject(TaskService);
  stats = this.taskService.stats;
}