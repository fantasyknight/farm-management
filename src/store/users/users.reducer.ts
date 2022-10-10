import { UsersState, UsersTypes } from './users.type';
import {
  GET_USERS,
  GET_USER,
  EDIT_USER,
  ADD_USER,
  GET_MESSAGE,
  DELETE_MESSAGE,
  DELETE_USER,
  DEACTIVATE_USER,
  ACTIVATE_USER,
  INITIAL_USER,
} from './users.constants';

const initialState: UsersState = {
  users: [],
  message: {
    isError: false,
    message: '',
  },
};

const usersReducer = (state: UsersState = initialState, action: UsersTypes) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: [...action.payload],
      };
    case GET_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case EDIT_USER:
      return {
        ...state,
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case DELETE_USER:
      return {
        ...state,
        users: [...state.users.filter(user => user.id !== action.payload.id)],
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case DEACTIVATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          /* eslint eqeqeq: 1 */
          user.id == action.payload.id
            ? { ...user, status: 'deactivated' }
            : { ...user },
        ),
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case ACTIVATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.id !== action.payload.id
            ? { ...user }
            : { ...user, status: 'active' },
        ),
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case ADD_USER:
      return {
        ...state,
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case GET_MESSAGE:
      return {
        ...state,
        message: {
          ...action.payload,
        },
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        message: {
          ...initialState.message,
        },
      };
    case INITIAL_USER:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default usersReducer;
