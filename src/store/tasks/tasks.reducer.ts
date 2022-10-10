import { ITaskState, TasksTypes } from './tasks.type';
import { SET_TASK_DATA } from './tasks.constants';

const initialState: ITaskState = {
  tasks: [],
};

const utilsReducer = (state = initialState, action: TasksTypes): ITaskState => {
  switch (action.type) {
    case SET_TASK_DATA:
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

export default utilsReducer;
