export type TGetResponseItem = {
  another_images: string;
  updated: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  another_images: File[];
  another_images_for_delete?: number[];
};

export type TGetOutput = TGetResponseItem;
