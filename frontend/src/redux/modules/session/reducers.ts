import { ActionReducer } from '@/redux/action.type';
import { LOGIN_VIA_GOOGLE, SAVE_SESSION, SAVE_SESSION_SUCCESS } from './actions';

type Session = {
  accessToken: string;
  refreshToken: string;
};

const initialState: Session = {
  accessToken: '',
  refreshToken: '',
};

export function session(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case SAVE_SESSION_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.session.accessToken,
        refreshToken: action.payload.session.refreshToken
      };
    default: return state;
  }
}

export const setSession = (session: Session) => ({ type: SAVE_SESSION, payload: { session }, loading: true });
export const loginViaGoogleIntoTheServer = (token: string) => ({ type: LOGIN_VIA_GOOGLE, payload: { token }, loading: true });
