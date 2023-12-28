/* import createSagaMiddleware from "redux-saga";
//import { routerMiddleware } from "connected-react-router";
import { configureStore as configure } from "@reduxjs/toolkit";
import { rootReducer, rootSaga } from "ducks";
//import { history } from "routing/history";

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configure({
    reducer: rootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        sagaMiddleware,
        //routerMiddleware(history),
      ]),
  });

  sagaMiddleware.run(rootSaga);
  return store;
}; */
