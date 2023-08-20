import { takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

import { NOTIFYING } from "./constants";

function* notifySaga() {}

export function* notifyingSaga(): SagaIterator {
  yield takeEvery(NOTIFYING.NOTIFY, notifySaga);
}
