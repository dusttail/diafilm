import { combineEpics, ofType } from 'redux-observable';
import { debounceTime, Observable, tap } from 'rxjs';
import { LOGIN_VIA_GOOGLE } from './actions';

const addSessionEpic = (action$: Observable<any>) => action$.pipe(
  ofType(LOGIN_VIA_GOOGLE),
  debounceTime(500),
  tap((action) => {
    console.log(!!action);
  })
);

export const sessionEpics = combineEpics(addSessionEpic);
