export type TGetResponseItem = {
  id: number;
  fio: string;
  phone: string;
  email: string;
  text: string;
  is_new: number;
  created: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  fio: string;
  phone: string;
  email: string;
  text: string;
};

export type TGetListOutput = TGetResponseItem[];

export type TGetNewCountOutput = number;
export type TGetListRequest = {
  fio?: string;
  phone?: string;
  email?: string;
  offset?: number;
  limit?: number;
  order?: string;
};
