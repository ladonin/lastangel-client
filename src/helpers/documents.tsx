/*
  import { getAnotherImagesUrl } from 'helpers/documents';
 */
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/documents";

import { ValuesOf } from "types/common";

export const getAnotherImagesUrl = (
  data: TGetResponseItem,
  number: number,
  size?: ValuesOf<typeof SIZES_ANOTHER>
) =>
  `${process.env.OUTER_STORAGE_URL}media/documents/another_${number}${size ? `_${size}` : ""}.jpeg${
    data.updated ? `?${data.updated}` : ""
  }`;
