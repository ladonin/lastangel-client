export type TGetResponseItem = {
  id: number;
  name: string;
  short_description: string;
  description: string;
  another_images: string;
  ismajor: boolean;
  hide_album: boolean;
  status: number;
  videoVk1: string;
  videoVk2: string;
  videoVk3: string;
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
  videoVk1?: string;
  videoVk2?: string;
  videoVk3?: string;
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;

export type TGetListRequest = {
  name?: string;
  excludeId?: number;
  excludeStatus?: number;
  offset?: number;
  limit?: number;
  ismajor?: boolean;
  order?: string;
};
