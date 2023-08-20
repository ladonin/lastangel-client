import {
  DONATIONS_TYPES
} from "constants/donations";
import { ValuesOf } from "types/common";

export type TGetResponseItem = {
  id: number;
  donator_firstname: string;
  donator_middlename: string;
  donator_lastname: string;
  donator_card: string;
  sum: number;
  target_id: number;
  target_name?: string;
  type: ValuesOf<typeof DONATIONS_TYPES>;
  updated: number;
  created: number;
  donator_fullname?: string;
  donator_id?: string;
  donator_outer_link?: string;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  donator_firstname: string;
  donator_middlename?: string;
  donator_lastname?: string;
  donator_card?: string;
  sum: number;
  target_id: number;
  type: ValuesOf<typeof DONATIONS_TYPES>;
};


export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;

export type TGetListRequest = {
  card?: string;
  name?: string;
  order?: string;
  order_type?: string;
  offset?: number;
  limit?: number;
};
export type TGetTargetListRequest = {
  type: number;
  target_id: number;
};
