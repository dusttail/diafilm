import { ActionReducer } from '@/redux/action.type';
import { IDLE, LOADING } from './actions';

const initialState = {
  state: IDLE,
};

export function app(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case IDLE:
      return { ...state, state: IDLE };
    case LOADING:
      return { ...state, state: LOADING };
    default: return state;
  }
}
