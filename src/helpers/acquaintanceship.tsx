/*
  import { getAnotherImagesUrl } from 'helpers/acquaintanceship';
 */
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/acquaintanceship";

import { ValuesOf } from "types/common";

export const getAnotherImagesUrl = (
  data: TGetResponseItem,
  number: number,
  size?: ValuesOf<typeof SIZES_ANOTHER>
) =>
  `${process.env.OUTER_STORAGE_URL}media/acquaintanceship/another_${number}${
    size ? `_${size}` : ""
  }.jpeg${data.updated ? `?${data.updated}` : ""}`;

export const getVideoUrl = (data: TGetResponseItem, name: string) =>
  `${process.env.OUTER_STORAGE_URL}media/acquaintanceship/${name}${
    data.updated ? `?${data.updated}` : ""
  }`;
