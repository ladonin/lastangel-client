export type TGetResponseItem = {
  id: number;
  description: string;
  status: number;
  another_images: string;
  hide_album: boolean;
  video1: string;
  video2: string;
  video3: string;
  updated: number;
  created: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  hide_album: boolean;
  description: string;
  another_images: File[];
  another_images_for_delete?: number[];
  video1?: string;
  video2?: string;
  video3?: string;
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;
