/*
  import { COLLECTIONS_TYPE, COLLECTIONS_STATUS } from 'constants/collections';
  Сборы и их параметры
 */

export const COLLECTIONS_TYPE = {
  MEDICINE: 1,
  BUY_FOR_PET: 2,
  BUILD: 3,
  COMMON: 4
} as const;

export const COLLECTIONS_STATUS = {
  PUBLISHED: 1,
  NON_PUBLISHED: 2,
  CLOSED: 3,
} as const;

export const TYPES_OPTIONS = [
  { value: String(COLLECTIONS_TYPE.MEDICINE), label: "Нужна медпомощь" },
  { value: String(COLLECTIONS_TYPE.BUY_FOR_PET), label: "Покупка вещи для питомца" },
  { value: String(COLLECTIONS_TYPE.BUILD), label: "Постройка" },
  { value: String(COLLECTIONS_TYPE.COMMON), label: "Общие нужды" },
];

export const STATUSES_OPTIONS = [
  { value: String(COLLECTIONS_STATUS.PUBLISHED), label: "Опубликован" },
  { value: String(COLLECTIONS_STATUS.NON_PUBLISHED), label: "Не опубликован" },
  { value: String(COLLECTIONS_STATUS.CLOSED), label: "Закрыт" },
];
