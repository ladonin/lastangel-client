/*
  import { loadItem, saveItem, removeItem } fro "utils/localStorage";
  Работа с локальным хранилищем
 */

/**
 * Получение состояния из localStorage по ключу
 * @param key
 * @param complex
 */
export const loadItem = (key: any): any => {
  try {
    const value = localStorage.getItem(key) || "";
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

/**
 * Сохранение значения в localStorage по ключу
 * @param key
 * @param value
 */
export const saveItem = (key: string, value: any): void => {
  try {
    const serializedState = JSON.stringify(value);

    localStorage.setItem(key, serializedState);
  } catch {
    console.info("--ошибка записи в localstorage--");
  }
};

/**
 * Удаление значения из localStorage по ключу
 * @param key
 */
export const removeItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    console.info("--ошибка удаления в localstorage--");
  }
};
