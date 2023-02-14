import { combineEpics } from 'redux-observable';
import { filter, map, Observable } from 'rxjs';
import { IDLE, LOADING } from './actions';

const setLoadingStateEpic = (action$: Observable<any>) => action$.pipe(
  filter(action => action.loading === true),
  map(() => ({ type: LOADING })),
);

const setIdleStateEpic = (action$: Observable<any>) => action$.pipe(
  filter(action => action.loading === false),
  map(() => ({ type: IDLE }))
);

export const appEpics = combineEpics(setLoadingStateEpic, setIdleStateEpic);
