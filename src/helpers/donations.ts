/*
  import { prepareType } from 'helpers/donations';
 */
import { DONATIONS_TYPES } from "../constants/donations";

export const prepareType = (code: number) => {
  if (code === DONATIONS_TYPES.PET) {
    return "Содержание питомца";
  }
  if (code === DONATIONS_TYPES.COLLECTION) {
    return "На сбор";
  }
  if (code === DONATIONS_TYPES.COMMON) {
    return "На общие нужды приюта";
  }
  return "";
};
