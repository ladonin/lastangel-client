/*
  import { getAnotherImagesUrl } from 'helpers/clinicPhotos';
 */
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/clinicPhotos";

import { ValuesOf } from "types/common";

export const getAnotherImagesUrl = (
  data: TGetResponseItem,
  number: number,
  size?: ValuesOf<typeof SIZES_ANOTHER>
) =>
  `${process.env.OUTER_STORAGE_URL}media/clinicPhotos/another_${number}${
    size ? `_${size}` : ""
  }.jpeg${data.updated ? `?${data.updated}` : ""}`;
