import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStats } from '../models/task.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasks = signal<Task[]>(this.initializeTasks());

  readonly todoTasks = computed(() => 
    this.tasks().filter(task => task.status === 'todo')
  );

  readonly inProgressTasks = computed(() => 
    this.tasks().filter(task => task.status === 'in-progress')
  );

  readonly reviewTasks = computed(() => 
    this.tasks().filter(task => task.status === 'review')
  );

  readonly doneTasks = computed(() => 
    this.tasks().filter(task => task.status === 'done')
  );

  readonly stats = computed((): TaskStats => {
    const allTasks = this.tasks();
    const now = new Date();
    
    return {
      total: allTasks.length,
      inProgress: allTasks.filter(task => task.status === 'in-progress').length,
      completed: allTasks.filter(task => task.status === 'done').length,
      overdue: allTasks.filter(task => 
        task.status !== 'done' && task.dueDate < now
      ).length
    };
  });

  readonly filteredTasks = computed(() => this.tasks());

  private searchTerm = signal<string>('');

  updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  loadTasks(): Observable<Task[]> {
    return of(this.tasks()).pipe(delay(500));
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  updateTaskStatus(taskId: string, newStatus: Task['status']): void {
    this.tasks.update(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    this.tasks.update(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }

  deleteTask(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initializeTasks(): Task[] {
    return [
      {
        id: '1',
        title: 'Design new landing page',
        description: 'Create mockups and prototypes for the new landing page design with modern UI/UX principles',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2024-12-14'),
        createdAt: new Date('2024-11-01'),
        assignees: ['JD', 'AS'],
        estimatedHours: 5,
        actualHours: 3
      },
      {
        id: '2',
        title: 'Team meeting preparation',
        description: 'Prepare slides and agenda for the weekly team sync',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2024-12-19'),
        createdAt: new Date('2024-11-02'),
        assignees: ['JD'],
        estimatedHours: 1
      },
      {
        id: '3',
        title: 'Database optimization',
        description: 'Optimize database queries and add proper indexing',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-12-13'),
        createdAt: new Date('2024-11-03'),
        assignees: ['TW'],
        estimatedHours: 9,
        actualHours: 1
      },
      {
        id: '4',
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-12-04'),
        createdAt: new Date('2024-11-04'),
        assignees: ['PM'],
        estimatedHours: 12,
        actualHours: 4
      },
      {
        id: '5',
        title: 'Update documentation',
        description: 'Review and update the API documentation with latest endpoints',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2024-12-17'),
        createdAt: new Date('2024-11-05'),
        assignees: ['MK'],
        estimatedHours: 2
      },
      {
        id: '6',
        title: 'Code review - Feature X',
        description: 'Review pull request for the new feature implementation',
        status: 'review',
        priority: 'high',
        dueDate: new Date('2024-12-09'),
        createdAt: new Date('2024-11-06'),
        assignees: ['JD'],
        estimatedHours: 8
      },
      {
        id: '7',
        title: 'Implement authentication',
        description: 'Set up JWT authentication and authorization for the API',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2024-12-11'),
        createdAt: new Date('2024-11-07'),
        assignees: ['RS', 'KL'],
        estimatedHours: 5,
        actualHours: 2
      },
      {
        id: '8',
        title: 'User testing session',
        description: 'Conduct user testing and gather feedback',
        status: 'done',
        priority: 'medium',
        dueDate: new Date('2024-12-02'),
        createdAt: new Date('2024-11-08'),
        assignees: ['AS'],
        estimatedHours: 6,
        actualHours: 2
      }
    ];
  }
}