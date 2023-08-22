/*
  import { getVideoUrl, prepareGraft, prepareSex, 
  prepareStatus, prepareSterilized, prepareCategory, getMainImageUrl } from 'helpers/animals';
 */
import React from "react";
import { ANIMALS_STERILIZED, ANIMALS_CATEGORY, ANIMALS_GRAFTED, ANIMALS_SEX, ANIMALS_STATUS } from "constants/animals";
import { SIZES_MAIN, SIZES_ANOTHER } from "constants/photos";
import { getCountWord, getTimestamp } from "helpers/common";
import { TGetResponseItem } from "api/types/animals";

import { ValuesOf } from "types/common";

export const prepareStatusCode = (code: number, need_medicine: number | null) => {
  if (need_medicine !== null && need_medicine > 0) {
    return ANIMALS_STATUS.NEED_MEDICINE;
  }
  return code;
};
export const prepareStatus = (code: number, need_medicine: number | null, sex?: number) => {
  if (need_medicine !== null && need_medicine > 0) {
    return "Нужна медпомощь";
  }
  if (code === ANIMALS_STATUS.MEMBERS) {
    return "Здоровый житель приюта";
  }
  // if (code === ANIMALS_STATUS.NEED_MEDICINE) {
  //   return "Нужна медпомощь";
  // }
  if (code === ANIMALS_STATUS.INVALID) {
    return "Инвалид";
  }
  if (code === ANIMALS_STATUS.SPINAL) {
    return "Инвалид-спинальник";
  }
  if (code === ANIMALS_STATUS.AT_HOME) {
    if (sex === ANIMALS_SEX.FEMALE) {
      return "Обрела дом";
    }
    return "Обрел дом";
  }
  if (code === ANIMALS_STATUS.DIED) {
    if (sex === ANIMALS_SEX.FEMALE) {
      return "Ушла по радуге";
    }
    return "Ушел по радуге";
  }
  return "";
};

export const prepareGraft = (code: number, sex: number) => {
  if (sex === ANIMALS_SEX.MALE && code === ANIMALS_GRAFTED.GRAFTED) {
    return "привит";
  }
  if (sex === ANIMALS_SEX.FEMALE && code === ANIMALS_GRAFTED.GRAFTED) {
    return "привита";
  }
  if (sex === ANIMALS_SEX.MALE && code === ANIMALS_GRAFTED.NON_GRAFTED) {
    return "не привит";
  }
  if (sex === ANIMALS_SEX.FEMALE && code === ANIMALS_GRAFTED.NON_GRAFTED) {
    return "не привита";
  }
  return "";
};

export const prepareSterilized = (code: number, sex: number) => {
  if (sex === ANIMALS_SEX.MALE && code === ANIMALS_STERILIZED.STERILIZED) {
    return "кастрирован";
  }
  if (sex === ANIMALS_SEX.FEMALE && code === ANIMALS_STERILIZED.STERILIZED) {
    return "стерилизована";
  }
  if (sex === ANIMALS_SEX.MALE && code === ANIMALS_STERILIZED.NON_STERILIZED) {
    return "не кастрирован";
  }
  if (sex === ANIMALS_SEX.FEMALE && code === ANIMALS_STERILIZED.NON_STERILIZED) {
    return "не стерилизована";
  }
  return "";
};

export const prepareSex = (sex: number) => {
  if (sex === ANIMALS_SEX.MALE) {
    return "мальчик";
  }
  if (sex === ANIMALS_SEX.FEMALE) {
    return "девочка";
  }
  return "";
};

export const prepareCategory = (code: number, sex: number) => {
  if (code === ANIMALS_CATEGORY.PUPPY) {
    return "щенок";
  }
  if (code === ANIMALS_CATEGORY.DOG) {
    return "взрослая собака";
  }
  if (code === ANIMALS_CATEGORY.KITTEN) {
    return "котенок";
  }
  if (code === ANIMALS_CATEGORY.CAT) {
    if (sex === ANIMALS_SEX.MALE) {
      return "взрослый кот";
    }
    if (sex === ANIMALS_SEX.FEMALE) {
      return "взрослая кошка";
    }
  }
  return "";
};

export const prepareAge = (bdate: number) => {
  const birthDate = Number(bdate);
  if (!birthDate) return <span className="loc--undefined">точный возраст неизвестен</span>;
  const now = getTimestamp(new Date()) / 1000;
  const difference = now - birthDate;
  let months = Math.round(difference / (3600 * 24 * 30.4375));

  if (months < 1) {
    const days = Math.round(difference / (3600 * 24));

    if (days > 0) {
      return `${days} ${getCountWord("день", "дня", "дней")(days)}`;
    }
    return "новорожденный";
  }

  if (months < 12) {
    return `${months} ${getCountWord("месяц", "месяца", "месяцев")(months)}`;
  }
  const years = Math.round(months / 12);

  months %= 12;
  return `${years} ${getCountWord("год", "года", "лет")(years)} ${months} ${getCountWord("месяц", "месяца", "месяцев")(months)}`;
};

export const getMainImageUrl = (data: TGetResponseItem, size: ValuesOf<typeof SIZES_MAIN> = SIZES_MAIN.SQUARE) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/pets/${data.id}/main${size ? `_${size}` : ""}.jpeg${
        data.updated ? `?${data.updated}` : ""
      }`
    : "";

export const getAnotherImagesUrl = (data: TGetResponseItem, number: number, size?: ValuesOf<typeof SIZES_ANOTHER>) =>
  data.id
    ? `${process.env.OUTER_STORAGE_URL}media/pets/${data.id}/another_${number}${size ? `_${size}` : ""}.jpeg${
        data.updated ? `?${data.updated}` : ""
      }`
    : "";

export const getVideoUrl = (data: TGetResponseItem, name: string) =>
  data.id ? `${process.env.OUTER_STORAGE_URL}media/pets/${data.id}/${name}${data.updated ? `?${data.updated}` : ""}` : "";
