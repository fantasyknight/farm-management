import { SET_TASK_DATA } from './tasks.constants';

export type ITaskState = {
  tasks: ITasksData;
};

interface ISetTaskData {
  type: typeof SET_TASK_DATA;
  payload: ITasksData;
}

export type ITasksData = Array<ITaskData>;
export interface ITaskData {
  key?: number;
  id?: string;
  farm_id: number;
  line_id: number;
  title: string;
  content?: string;
  due_date: number;
  active?: number;
  assigned_to?: number;
  created_at?: string;
  creator_id?: number;
}

export type TasksTypes = ISetTaskData;
