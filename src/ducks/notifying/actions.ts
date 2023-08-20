/*
  import { NotifyingActions } from 'ducks/notifying/actions';
*/

import { NOTIFYING } from "./constants";
import { NotifyingTypesSaga } from "./types";

export namespace NotifyingActions {
  export const notify = (payload: NotifyingTypesSaga.MessagePayload): NotifyingTypesSaga.NotifyAction => ({
    type: NOTIFYING.NOTIFY,
    payload,
  });
}
