import { combineReducers, Reducer } from "redux";
import { all } from "redux-saga/effects";
import { RouterState } from "redux-first-history";

import { notifyingSaga } from "./notifying/sagas";
import { notifying } from "./notifying/reducer";

import { NotifyingTypesSaga } from "./notifying/types";

// import { MetricsTypes } from './metrics/types';

export const rootReducer = (routerReducer: Reducer<RouterState>) =>
  combineReducers({
    notifying,
    router: routerReducer,
  });

export type RootState = {
  notifying: NotifyingTypesSaga.State;
  router: RouterState;
};

export function* rootSaga() {
  yield all([notifyingSaga()]);
}
