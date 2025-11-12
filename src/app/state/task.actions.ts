export enum TaskActionTypes {
  LOAD_TASKS = '[Task] Load Tasks',
  LOAD_TASKS_SUCCESS = '[Task] Load Tasks Success',
  LOAD_TASKS_FAILURE = '[Task] Load Tasks Failure',
  
  CREATE_TASK = '[Task] Create Task',
  UPDATE_TASK = '[Task] Update Task',
  UPDATE_TASK_STATUS = '[Task] Update Task Status',
  DELETE_TASK = '[Task] Delete Task',
  
  SEARCH_TASKS = '[Task] Search Tasks',
  FILTER_TASKS = '[Task] Filter Tasks',

  SET_LOADING = '[Task] Set Loading',
  SET_ERROR = '[Task] Set Error',
  CLEAR_ERROR = '[Task] Clear Error',
  
  SAVE_TO_STORAGE = '[Task] Save to Storage',
  LOAD_FROM_STORAGE = '[Task] Load from Storage'
}

export interface TaskAction {
  type: TaskActionTypes;
  payload?: any;
}

export class LoadTasks implements TaskAction {
  readonly type = TaskActionTypes.LOAD_TASKS;
}

export class LoadTasksSuccess implements TaskAction {
  readonly type = TaskActionTypes.LOAD_TASKS_SUCCESS;
  constructor(public payload: { tasks: any[] }) {}
}

export class LoadTasksFailure implements TaskAction {
  readonly type = TaskActionTypes.LOAD_TASKS_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class CreateTask implements TaskAction {
  readonly type = TaskActionTypes.CREATE_TASK;
  constructor(public payload: { task: any }) {}
}

export class UpdateTask implements TaskAction {
  readonly type = TaskActionTypes.UPDATE_TASK;
  constructor(public payload: { id: number; updates: any }) {}
}

export class UpdateTaskStatus implements TaskAction {
  readonly type = TaskActionTypes.UPDATE_TASK_STATUS;
  constructor(public payload: { id: number; newStatus: string }) {}
}

export class DeleteTask implements TaskAction {
  readonly type = TaskActionTypes.DELETE_TASK;
  constructor(public payload: { id: number }) {}
}

export class SearchTasks implements TaskAction {
  readonly type = TaskActionTypes.SEARCH_TASKS;
  constructor(public payload: { searchTerm: string }) {}
}

export class SetLoading implements TaskAction {
  readonly type = TaskActionTypes.SET_LOADING;
  constructor(public payload: { loading: boolean }) {}
}

export class SetError implements TaskAction {
  readonly type = TaskActionTypes.SET_ERROR;
  constructor(public payload: { error: string }) {}
}

export class ClearError implements TaskAction {
  readonly type = TaskActionTypes.CLEAR_ERROR;
}

export class SaveToStorage implements TaskAction {
  readonly type = TaskActionTypes.SAVE_TO_STORAGE;
}

export class LoadFromStorage implements TaskAction {
  readonly type = TaskActionTypes.LOAD_FROM_STORAGE;
}

export type TaskActions =
  | LoadTasks
  | LoadTasksSuccess
  | LoadTasksFailure
  | CreateTask
  | UpdateTask
  | UpdateTaskStatus
  | DeleteTask
  | SearchTasks
  | SetLoading
  | SetError
  | ClearError
  | SaveToStorage
  | LoadFromStorage;