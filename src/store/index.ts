import createSagaMiddleware from "redux-saga";
import { configureStore as configure } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import { rootReducer, rootSaga } from "ducks";

const { routerReducer, createReduxHistory, routerMiddleware } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

const sagaMiddleware = createSagaMiddleware();

export const store = configure({
  reducer: rootReducer(routerReducer),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sagaMiddleware, routerMiddleware]),
});

sagaMiddleware.run(rootSaga);

export const history = createReduxHistory(store);
