import { IFarmState, FarmsTypes } from './farms.type';
import {
  SET_FARMS_DATA,
  SET_LINE_DATA,
  SET_ID_DELETE_ITEM,
  ON_FEEDBACK,
  HIDE_MESSAGE,
} from './farms.constants';

const initialState: IFarmState = {
  farmsData: [],
  lineData: undefined,
  deleteItem: {
    id: undefined,
    type: undefined,
    isRedirect: undefined,
    lineId: undefined,
  },
  allFeedback: [],
};

const farmsReducer = (state = initialState, action: FarmsTypes): IFarmState => {
  switch (action.type) {
    case SET_FARMS_DATA: {
      return { ...state, farmsData: action.payload };
    }
    case SET_LINE_DATA: {
      return { ...state, lineData: action.payload };
    }
    case SET_ID_DELETE_ITEM: {
      return { ...state, deleteItem: action.payload };
    }
    case ON_FEEDBACK: {
      return { ...state, allFeedback: [...state.allFeedback, action.payload] };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        allFeedback: state.allFeedback.filter(
          feedback => feedback.id !== action.payload,
        ),
      };
    }
    default:
      return state;
  }
};

export default farmsReducer;
