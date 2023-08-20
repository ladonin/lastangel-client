import { PayloadAction } from "ducks/types";
import { NOTIFYING } from "./constants";

export namespace NotifyingTypesSaga {
  export type MessageTypes = "error" | "success" | "warning";
  export type Message = { id: string; text: string; type: MessageTypes };
  export type MessagePayload = { text: string; type: MessageTypes };
  export type Messages = Message[];

  export interface State {
    messages: Messages[];
  }

  export type NotifyAction = PayloadAction<typeof NOTIFYING.NOTIFY, MessagePayload>;
}
