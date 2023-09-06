/*
  import { SEX_OPTIONS, GRAFTED_OPTIONS, STERILIZED_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS, 
  ANIMALS_STATUS, ANIMALS_CATEGORY, ANIMALS_SEX, ANIMALS_GRAFTED, ANIMALS_STERILIZED } from 'constants/animals';
  Животные и их параметры
 */

export const ANIMALS_GRAFTED = {
  GRAFTED: 1,
  NON_GRAFTED: 2,
} as const;

export const ANIMALS_STERILIZED = {
  STERILIZED: 1,
  NON_STERILIZED: 2,
} as const;

export const ANIMALS_SEX = {
  MALE: 1,
  FEMALE: 2,
} as const;

export const ANIMALS_STATUS = {
  MEMBERS: 1,
  NEED_MEDICINE: 2,
  INVALID: 3,
  SPINAL: 4,
  AT_HOME: 5,
  DIED: 6,
} as const;

export const ANIMALS_CATEGORY = {
  PUPPY: 1,
  DOG: 2,
  OLD_DOG: 3,
  KITTEN: 4,
  CAT: 5,
  OLD_CAT: 6,
} as const;

export const ANIMALS_KIND = {
  DOG: 1,
  CAT: 2,
} as const;

export const SEX_OPTIONS = [
  { value: String(ANIMALS_SEX.MALE), label: "мальчик" },
  { value: String(ANIMALS_SEX.FEMALE), label: "девочка" },
];

export const IS_PUBLISHED_OPTIONS = [
  { value: "1", label: "Опубликован" },
  { value: "0", label: "Не опубликован" },
];

export const GRAFTED_OPTIONS = [
  { value: String(ANIMALS_GRAFTED.GRAFTED), label: "Привит(а)" },
  { value: String(ANIMALS_GRAFTED.NON_GRAFTED), label: "Не привит(а)" },
];

export const STERILIZED_OPTIONS = [
  {
    value: String(ANIMALS_STERILIZED.STERILIZED),
    label: "Стерилизована / кастрирован",
  },
  {
    value: String(ANIMALS_STERILIZED.NON_STERILIZED),
    label: "Не стерилизована / не кастрирован",
  },
];

export const CATEGORY_OPTIONS = [
  { value: String(ANIMALS_CATEGORY.PUPPY), label: "Щенок" },
  { value: String(ANIMALS_CATEGORY.DOG), label: "Взрослая собака" },
  { value: String(ANIMALS_CATEGORY.OLD_DOG), label: "Пожилая собака" },
  { value: String(ANIMALS_CATEGORY.KITTEN), label: "Котенок" },
  { value: String(ANIMALS_CATEGORY.CAT), label: "Кошка/кот" },
  { value: String(ANIMALS_CATEGORY.OLD_CAT), label: "Пожилая кошка/кот" },
];

export const KIND_OPTIONS = [
  { value: String(ANIMALS_KIND.DOG), label: "Собака" },
  { value: String(ANIMALS_KIND.CAT), label: "Кошка/кот" },
];

export const STATUS_OPTIONS_CR_UP = [
  { value: String(ANIMALS_STATUS.MEMBERS), label: "Здоровые жители приюта" },
  { value: String(ANIMALS_STATUS.INVALID), label: "Инвалиды" },
  { value: String(ANIMALS_STATUS.SPINAL), label: "Инвалиды-спинальники" },
  { value: String(ANIMALS_STATUS.AT_HOME), label: "Обрели дом" },
  { value: String(ANIMALS_STATUS.DIED), label: "Ушли по радуге" },
];

export const STATUS_OPTIONS_FILTER = [
  {
    value: String(ANIMALS_STATUS.NEED_MEDICINE),
    label: "Нужна медпомощь",
  },
  ...STATUS_OPTIONS_CR_UP,
];

// Собаки
// 0-1 год = щенки, 1-8 лет - средний возраст, 8+лет - старики
// Количество секунд, после которых собака перестает быть щенком = 1 год
export const PUPPY_MAXTIMESTAMP = 31536000;

// Количество секунд, после которых собака перестает быть средним возрастом = 8 лет
export const MIDDLEDOG_MAXTIMESTAMP = 8 * 31536000;

// Кошки
// 0-1 год = котята, 1-10 лет - средний возраст, 10+лет - старики
// Количество секунд, после которых кошка перестает быть котенком = 1 год
export const KITTEN_MAXTIMESTAMP = 31536000;

// Количество секунд, после которых кошка перестает быть средним возрастом = 12 лет
export const MIDDLECAT_MAXTIMESTAMP = 12 * 31536000;
