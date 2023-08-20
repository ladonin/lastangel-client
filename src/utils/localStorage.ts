/*
  import { loadItem, saveItem, removeItem } fro "utils/localStorage";
 */

/**
 * Получение состояния из localStorage по ключу
 * @param key
 */
export const loadItem = (key: any): any => {
  try {
    const serializedState = localStorage.getItem(key) || "";

    return JSON.parse(serializedState);
  } catch {
    return "";
  }
};

/**
 * Сохранение значения в localStorage по ключу
 * @param key
 * @param item
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
