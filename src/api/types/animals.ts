import {
  ANIMALS_STATUS,
  ANIMALS_CATEGORY,
  ANIMALS_SEX,
  ANIMALS_GRAFTED,
  ANIMALS_STERILIZED,
  ANIMALS_KIND,
} from "constants/animals";
import { ValuesOf } from "types/common";

export type TGetResponseItem = {
  id: number;
  name: string;
  breed: string;
  video1: string;
  video2: string;
  video3: string;
  birthdate: number;
  short_description: string;
  description: string;
  sex: ValuesOf<typeof ANIMALS_SEX>;
  grafted: ValuesOf<typeof ANIMALS_GRAFTED>;
  sterilized: ValuesOf<typeof ANIMALS_STERILIZED>;
  kind: ValuesOf<typeof ANIMALS_KIND>;
  status: ValuesOf<typeof ANIMALS_STATUS>;
  is_published: 1 | 0;
  need_medicine: number | null;
  ismajor: number;
  main_image: number;
  another_images: string;
  collected?: number;
  created: number;
  updated: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  name: string;
  breed: string;
  video1?: File;
  video2?: File;
  video3?: File;
  short_description: string;
  description: string;
  birthdate?: number;
  sex: ValuesOf<typeof ANIMALS_SEX>;
  grafted: ValuesOf<typeof ANIMALS_GRAFTED>;
  sterilized: ValuesOf<typeof ANIMALS_STERILIZED>;
  category: ValuesOf<typeof ANIMALS_CATEGORY>;
  status: ValuesOf<typeof ANIMALS_STATUS>;
  ismajor?: number;
  main_image: Blob;
  another_images: File[];
  another_images_for_delete?: number[];
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;
export type TGetCountOutput = { at_shelter: number; at_home: number };
export type TGetListRequest = {
  category?: ValuesOf<typeof ANIMALS_CATEGORY>;
  status?: ValuesOf<typeof ANIMALS_STATUS>;
  withUnpublished?: 1 | 0;
  statusExclude?: ValuesOf<typeof ANIMALS_STATUS>[];
  order?: string;
  order_type?: string;
  offset?: number;
  limit?: number;
};
