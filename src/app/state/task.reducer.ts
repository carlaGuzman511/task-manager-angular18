import { TaskState, initialTaskState, taskState } from './task.state';
import { TaskActions, TaskActionTypes } from './task.actions';
import { Task } from '../models/task.model';

export function taskReducer(
  state: TaskState = initialTaskState,
  action: TaskActions
): TaskState {
  switch (action.type) {
    case TaskActionTypes.LOAD_TASKS:
      return {
        ...state,
        loading: true,
        error: null
      };

    case TaskActionTypes.LOAD_TASKS_SUCCESS:
      const tasks = action.payload.tasks;
      const entities = tasks.reduce((acc: { [id: number]: Task }, task: Task) => {
        acc[task.id] = task;
        return acc;
      }, {});
      
      return {
        ...state,
        entities,
        ids: tasks.map((task: Task) => task.id),
        loading: false,
        error: null,
        lastUpdated: new Date()
      };

    case TaskActionTypes.LOAD_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case TaskActionTypes.CREATE_TASK:
      const newTask = action.payload.task;
      return {
        ...state,
        entities: {
          ...state.entities,
          [newTask.id]: newTask
        },
        ids: [...state.ids, newTask.id],
        lastUpdated: new Date()
      };

    case TaskActionTypes.UPDATE_TASK:
      const { id, updates } = action.payload;
      const existingTask = state.entities[id];
      
      if (!existingTask) {
        return state;
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: {
            ...existingTask,
            ...updates,
            updatedAt: new Date()
          }
        },
        lastUpdated: new Date()
      };

    case TaskActionTypes.UPDATE_TASK_STATUS:
      const taskToUpdate = state.entities[action.payload.id];
      
      if (!taskToUpdate) {
        return state;
      }

      const updatedTask: Task = {
        ...taskToUpdate,
        status: action.payload.newStatus as Task['status'], 
        updatedAt: new Date()
      };

      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: updatedTask 
        },
        lastUpdated: new Date()
      };

    case TaskActionTypes.DELETE_TASK:
      const { [action.payload.id]: removed, ...remainingEntities } = state.entities;
      
      return {
        ...state,
        entities: remainingEntities,
        ids: state.ids.filter(taskId => taskId !== action.payload.id),
        lastUpdated: new Date()
      };

    case TaskActionTypes.SEARCH_TASKS:
      return {
        ...state,
        searchTerm: action.payload.searchTerm
      };

    case TaskActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };

    case TaskActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };

    case TaskActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case TaskActionTypes.LOAD_FROM_STORAGE:
      try {
        const stored = localStorage.getItem('task-manager-state');
        if (stored) {
          const parsedState = JSON.parse(stored);
          const processedState = {
            ...parsedState,
            entities: Object.keys(parsedState.entities).reduce((acc: any, key) => {
              const task = parsedState.entities[key];
              acc[key] = {
                ...task,
                dueDate: new Date(task.dueDate),
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt)
              };
              return acc;
            }, {}),
            lastUpdated: parsedState.lastUpdated ? new Date(parsedState.lastUpdated) : null
          };
          return processedState;
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
      }
      return state;

    default:
      return state;
  }
}

export function dispatch(action: TaskActions): void {
  const currentState = taskState.state();
  const newState = taskReducer(currentState, action);
  taskState.updateState(newState);

  if (shouldSaveToStorage(action)) {
    saveStateToStorage(newState);
  }
}

function shouldSaveToStorage(action: TaskActions): boolean {
  const persistActions = [
    TaskActionTypes.CREATE_TASK,
    TaskActionTypes.UPDATE_TASK,
    TaskActionTypes.UPDATE_TASK_STATUS,
    TaskActionTypes.DELETE_TASK,
    TaskActionTypes.LOAD_TASKS_SUCCESS
  ];
  
  return persistActions.includes(action.type);
}

function saveStateToStorage(state: TaskState): void {
  try {
    localStorage.setItem('task-manager-state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to storage:', error);
  }
}