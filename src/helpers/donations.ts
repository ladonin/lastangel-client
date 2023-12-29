/*
  import { prepareType } from 'helpers/donations';
  Вспомогательные функции для донатов
 */
import { DONATIONS_TYPES } from "constants/donations";
import { TItem as TDonationItem } from "api/types/donations";

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

export const isAnonym = (item: TDonationItem) =>
  !(
    item.donator_fullname ||
    item.donator_firstname ||
    item.donator_middlename ||
    item.donator_lastname
  );

export const getDonatorName = (item: TDonationItem) =>
  (
    item.donator_fullname ||
    `${item.donator_firstname} ${item.donator_middlename} ${item.donator_lastname}`
  ).toUpperCase();
