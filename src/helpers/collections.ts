/*
  import { prepareType, getMainImageUrl, getAnotherImagesUrl } from 'helpers/collections';
    Вспомогательные функции для сборов
 */
import { SIZES_MAIN, SIZES_ANOTHER } from "constants/photos";
import { COLLECTIONS_STATUS, COLLECTIONS_TYPE } from "constants/collections";
import { TGetResponseItem } from "api/types/collections";
import { ValuesOf } from "types/common";

export const prepareType = (code: number) => {
  if (code === COLLECTIONS_TYPE.MEDICINE) {
    return "Нужна медпомощь";
  }
  if (code === COLLECTIONS_TYPE.BUY_FOR_PET) {
    return "Покупка для питомца";
  }
  if (code === COLLECTIONS_TYPE.BUILD) {
    return "Постройка";
  }
  if (code === COLLECTIONS_TYPE.COMMON) {
    return "Общие нужды";
  }
  if (code === COLLECTIONS_TYPE.CREDIT) {
    return "Погасить долг приюта";
  }
  return "";
};

export const prepareStatus = (code: number) => {
  if (code === COLLECTIONS_STATUS.PUBLISHED) {
    return "Опубликован";
  }
  if (code === COLLECTIONS_STATUS.NON_PUBLISHED) {
    return "Не опубликован";
  }
  if (code === COLLECTIONS_STATUS.CLOSED) {
    return "Закрыт";
  }
  return "";
};
export const getMainImageUrl = (data: TGetResponseItem, size?: ValuesOf<typeof SIZES_MAIN>) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/collections/${data.id}/main${
        size ? `_${size}` : ""
      }.jpeg${data.updated ? `?${data.updated}` : ""}`
    : "";

export const getAnotherImagesUrl = (
  data: TGetResponseItem,
  number: number,
  size?: ValuesOf<typeof SIZES_ANOTHER>
) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/collections/${data.id}/another_${number}${
        size ? `_${size}` : ""
      }.jpeg${data.updated ? `?${data.updated}` : `?${data.created}`}`
    : "";

export const getVideoUrl = (data: TGetResponseItem, name: string) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/collections/${data.id}/${name}${
        data.updated ? `?${data.updated}` : `?${data.created}`
      }`
    : "";
