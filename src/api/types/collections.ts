import { ValuesOf } from "types/common";
import { COLLECTIONS_STATUS } from "constants/collections";
import { ANIMALS_CATEGORY, ANIMALS_STATUS } from "../../constants/animals";

export type TGetResponseItem = {
  id: number;
  name: string;
  type: number;
  status: ValuesOf<typeof COLLECTIONS_STATUS>;
  animal_id: number;
  is_corrupted: number;
  short_description: string;
  description: string;
  ismajor: number;
  main_image: number;
  another_images: string;
  video1: string;
  video2: string;
  video3: string;
  target_sum: string;
  last_spending: string;
  spent: string;
  collected: string | null;
  animal_name?: string;
  updated: number;
  created: number;
};

export type TItem = TGetResponseItem;

export type TCommonDataRequest = {
  name: string;
  type: string;
  status: ValuesOf<typeof COLLECTIONS_STATUS>;
  animal_id?: number;
  short_description: string;
  description: string;
  ismajor?: number;
  main_image: { cropped: Blob; original: Blob };
  another_images: File[];
  another_images_for_delete?: number[];
  video1?: string;
  video2?: string;
  video3?: string;
  target_sum: number;
  current_spending: number;
};

export type TGetListOutput = TGetResponseItem[];
export type TGetOutput = TGetResponseItem;

export type TGetListRequest = {
  status?: ValuesOf<typeof COLLECTIONS_STATUS>;
  offset?: number;
  limit?: number;
  statusExclude?: number;
  with_corrupted?: number;
  order?: string;
  order_type?: string;
  withClosedCollections?: boolean;
  orderComplex?: string;
};
