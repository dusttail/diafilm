import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { appEpics } from './app/epics';
import { app } from './app/reducers';
import { sessionEpics } from './session/epics';
import { session } from './session/reducers';

export const rootEpic = combineEpics(
  appEpics,
  sessionEpics,
);

export const rootReducer = combineReducers({
  app,
  session,
});
