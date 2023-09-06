/*
  import { getVideoUrl, prepareGraft, prepareSex, 
  prepareStatus, prepareSterilized, getMainImageUrl } from 'helpers/animals';
 */
import React from "react";
import {
  ANIMALS_STERILIZED,
  ANIMALS_CATEGORY,
  ANIMALS_GRAFTED,
  ANIMALS_SEX,
  ANIMALS_STATUS,
  KIND_OPTIONS,
  ANIMALS_KIND,
  PUPPY_MAXTIMESTAMP,
  MIDDLEDOG_LITTLE_MAXTIMESTAMP,
  MIDDLEDOG_MEDIUM_MAXTIMESTAMP,
  MIDDLEDOG_BIG_MAXTIMESTAMP,
  KITTEN_MAXTIMESTAMP,
  MIDDLECAT_MAXTIMESTAMP,
} from "constants/animals";
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

export const transformCategoryToParams = (category?: ValuesOf<typeof ANIMALS_CATEGORY>) => {
  let kind: ValuesOf<typeof ANIMALS_KIND>[] | undefined;
  let minbirthdate: number[] | undefined;
  let maxbirthdate: number[] | undefined;
  const getTimestamp = (interval: number) => Math.round(new Date().getTime() / 1000) - interval;

  if (category === ANIMALS_CATEGORY.PUPPY) {
    kind = [ANIMALS_KIND.LITTLE_DOG, ANIMALS_KIND.MEDIUM_DOG, ANIMALS_KIND.BIG_DOG];
    minbirthdate = [getTimestamp(PUPPY_MAXTIMESTAMP), getTimestamp(PUPPY_MAXTIMESTAMP), getTimestamp(PUPPY_MAXTIMESTAMP)];
    maxbirthdate = [getTimestamp(0), getTimestamp(0), getTimestamp(0)];
  } else if (category === ANIMALS_CATEGORY.DOG) {
    kind = [ANIMALS_KIND.LITTLE_DOG, ANIMALS_KIND.MEDIUM_DOG, ANIMALS_KIND.BIG_DOG];
    minbirthdate = [
      getTimestamp(MIDDLEDOG_LITTLE_MAXTIMESTAMP),
      getTimestamp(MIDDLEDOG_MEDIUM_MAXTIMESTAMP),
      getTimestamp(MIDDLEDOG_BIG_MAXTIMESTAMP),
    ];
    maxbirthdate = [
      getTimestamp(PUPPY_MAXTIMESTAMP + 1),
      getTimestamp(PUPPY_MAXTIMESTAMP + 1),
      getTimestamp(PUPPY_MAXTIMESTAMP + 1),
    ];
  } else if (category === ANIMALS_CATEGORY.OLD_DOG) {
    kind = [ANIMALS_KIND.LITTLE_DOG, ANIMALS_KIND.MEDIUM_DOG, ANIMALS_KIND.BIG_DOG];

    maxbirthdate = [
      getTimestamp(MIDDLEDOG_LITTLE_MAXTIMESTAMP + 1),
      getTimestamp(MIDDLEDOG_MEDIUM_MAXTIMESTAMP + 1),
      getTimestamp(MIDDLEDOG_BIG_MAXTIMESTAMP + 1),
    ];
  } else if (category === ANIMALS_CATEGORY.KITTEN) {
    kind = [ANIMALS_KIND.CAT];
    minbirthdate = [getTimestamp(KITTEN_MAXTIMESTAMP)];
    maxbirthdate = [getTimestamp(0)];
  } else if (category === ANIMALS_CATEGORY.CAT) {
    kind = [ANIMALS_KIND.CAT];
    minbirthdate = [getTimestamp(MIDDLECAT_MAXTIMESTAMP)];
    maxbirthdate = [getTimestamp(KITTEN_MAXTIMESTAMP + 1)];
  } else if (category === ANIMALS_CATEGORY.OLD_CAT) {
    kind = [ANIMALS_KIND.CAT];
    maxbirthdate = [getTimestamp(MIDDLECAT_MAXTIMESTAMP + 1)];
  } else if (category === ANIMALS_CATEGORY.LITTLE_DOG) {
    kind = [ANIMALS_KIND.LITTLE_DOG];
  } else if (category === ANIMALS_CATEGORY.MEDIUM_DOG) {
    kind = [ANIMALS_KIND.MEDIUM_DOG];
  } else if (category === ANIMALS_CATEGORY.BIG_DOG) {
    kind = [ANIMALS_KIND.BIG_DOG];
  }
  return { kind, minbirthdate, maxbirthdate };
};

export const getCategoryCode = (kind: ValuesOf<typeof ANIMALS_KIND>, birthdate: number) => {
  const ageInSecs = new Date().getTime() / 1000 - birthdate;

  if (kind === ANIMALS_KIND.LITTLE_DOG || kind === ANIMALS_KIND.MEDIUM_DOG || kind === ANIMALS_KIND.BIG_DOG) {
    if (ageInSecs <= PUPPY_MAXTIMESTAMP) {
      return ANIMALS_CATEGORY.PUPPY;
    }
    if (kind === ANIMALS_KIND.LITTLE_DOG && ageInSecs <= MIDDLEDOG_LITTLE_MAXTIMESTAMP) {
      return ANIMALS_CATEGORY.DOG;
    }
    if (kind === ANIMALS_KIND.MEDIUM_DOG && ageInSecs <= MIDDLEDOG_MEDIUM_MAXTIMESTAMP) {
      return ANIMALS_CATEGORY.DOG;
    }
    if (kind === ANIMALS_KIND.BIG_DOG && ageInSecs <= MIDDLEDOG_BIG_MAXTIMESTAMP) {
      return ANIMALS_CATEGORY.DOG;
    }
    return ANIMALS_CATEGORY.OLD_DOG;
  }
  if (kind === ANIMALS_KIND.CAT) {
    if (ageInSecs <= KITTEN_MAXTIMESTAMP) {
      return ANIMALS_CATEGORY.KITTEN;
    }
    if (ageInSecs <= MIDDLECAT_MAXTIMESTAMP) {
      return ANIMALS_CATEGORY.CAT;
    }
    return ANIMALS_CATEGORY.OLD_CAT;
  }
  return 0;
};

export const prepareKind = (code: number, sex: number) => {
  if (code === ANIMALS_KIND.LITTLE_DOG) {
    return "маленькая собака";
  }
  if (code === ANIMALS_KIND.MEDIUM_DOG) {
    return "средняя собака";
  }
  if (code === ANIMALS_KIND.BIG_DOG) {
    return "большая собака";
  }
  if (code === ANIMALS_KIND.CAT) {
    if (sex === ANIMALS_SEX.MALE) {
      return "кот";
    }
    if (sex === ANIMALS_SEX.FEMALE) {
      return "кошка";
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
