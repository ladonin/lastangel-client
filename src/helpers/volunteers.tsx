/*
  import { getVideoUrl, prepareStatus, getMainImageUrl } from 'helpers/volunteers';
  Вспомогательные функции для волонтеров
 */
import { SIZES_MAIN, SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/volunteers";
import { ValuesOf } from "types/common";

export const getMainImageUrl = (data: TGetResponseItem, size?: ValuesOf<typeof SIZES_MAIN>) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/volunteers/${data.id}/main${
        size ? `_${size}` : ""
      }.jpeg${data.updated ? `?${data.updated}` : ""}`
    : "";

export const getAnotherImagesUrl = (
  data: TGetResponseItem,
  number: number,
  size?: ValuesOf<typeof SIZES_ANOTHER>
) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/volunteers/${data.id}/another_${number}${
        size ? `_${size}` : ""
      }.jpeg${data.updated ? `?${data.updated}` : `?${data.created}`}`
    : "";

export const getVideoUrl = (data: TGetResponseItem, name: string) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/volunteers/${data.id}/${name}${
        data.updated ? `?${data.updated}` : `?${data.created}`
      }`
    : "";
