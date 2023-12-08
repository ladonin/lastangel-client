export type TGetResponseItem = {
  id: number;
  fio: string;
  video1: string;
  video2: string;
  video3: string;
  birthdate: number;
  short_description: string;
  description: string;
  vk_link: string;
  ok_link: string;
  inst_link: string;
  phone: string;
  is_published: 1 | 0;
  main_image: number;
  another_images: string;
  created: number;
  updated: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  fio: string;
  video1?: File;
  video2?: File;
  video3?: File;
  birthdate?: number;
  short_description: string;
  description: string;
  vk_link: string;
  ok_link: string;
  inst_link: string;
  phone: string;
  is_published: number;
  main_image: { cropped: Blob; original: Blob };
  another_images: File[];
  another_images_for_delete?: number[];
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;

export type TGetListRequest = {
  withUnpublished?: 1 | 0;
  order?: string;
  orderComplex?: string;
  order_type?: string;
  offset?: number;
  limit?: number;
};
