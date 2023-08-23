/*
  import { getAnotherImagesUrl } from 'helpers/stories';
 */
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/stories";

import { ValuesOf } from "types/common";

export const getAnotherImagesUrl = (data: TGetResponseItem, number: number, size?: ValuesOf<typeof SIZES_ANOTHER>) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/stories/${data.id}/another_${number}${size ? `_${size}` : ""}.jpeg${
        data.updated ? `?${data.updated}` : ""
      }`
    : "";

export const getVideoUrl = (data: TGetResponseItem, name: string) =>
  data.id ? `${process.env.OUTER_STORAGE_URL}media/stories/${data.id}/${name}${data.updated ? `?${data.updated}` : ""}` : "";
