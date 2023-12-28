/*
  import { PayloadAction, ErrorAction } from 'ducks/types';
 */
import { Action } from "redux";

export interface PayloadAction<TType, TPayload> extends Action<TType> {
  payload: TPayload;
}
