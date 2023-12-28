export type TGetResponseItem = {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  card: string;
  link_to_page: string;
  fullname: string;
  updated: number;
  created: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  firstname: string;
  middlename?: string;
  lastname: string;
  card: string;
  link_to_page: string;
  fullname: string;
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;

export type TGetListRequest = {};
