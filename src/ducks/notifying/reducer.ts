import { NotifyingTypesSaga } from "./types";
import { NOTIFYING } from "./constants";

const initialState: NotifyingTypesSaga.State = {
  messages: [],
};

export const notifying = (state: NotifyingTypesSaga.State = initialState, action: NotifyingTypesSaga.NotifyAction) => {
  switch (action.type) {
    case NOTIFYING.NOTIFY:
      const { text, type } = action.payload;

      return {
        ...state,
        messages: [...state.messages, { text, type }],
      };
    default:
      return state;
  }
};
