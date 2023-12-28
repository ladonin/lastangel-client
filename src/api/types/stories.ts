export type TGetResponseItem = {
  id: number;
  name: string;
  short_description: string;
  description: string;
  mobile_description: string;
  another_images: string;
  ismajor: number;
  hide_album: number;
  use_mobile_description: number;
  status: number;
  video1: string;
  video2: string;
  video3: string;
  updated: number;
  created: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  name: string;
  ismajor: boolean;
  hide_album: boolean;
  short_description: string;
  description: string;
  another_images: File[];
  another_images_for_delete?: number[];
  video1?: string;
  video2?: string;
  video3?: string;
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;

export type TGetListRequest = {
  title?: string;
  excludeId?: number;
  excludeStatus?: number;
  offset?: number;
  limit?: number;
  ismajor?: boolean;
  order?: string;
  orderComplex?: string;
};
