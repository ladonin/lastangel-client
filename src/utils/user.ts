/*
 * import { saveUserData, removeUserData, isAdmin, quit, isAuthorized } from 'utils/user'
 * Функции по работе с авторизованным пользователем
 */
import { loadItem, removeItem, saveItem } from "utils/localStorage";
import PAGES from "routing/routes";

// Сохранение данных авторизованного пользователя (сразу после авторизации)
export const saveUserData = (token: string) => {
  const { i: id, r: role } = JSON.parse(window.atob(token.split(".")[1]));

  saveItem("authToken", token);
  saveItem("userId", id);
  saveItem("userRole", role);
};

// Очистка данных пользователя (сразу после выхода)
export const removeUserData = () => {
  removeItem("authToken");
  removeItem("userId");
  removeItem("userRole");
};

// Получение роли пользователя
export const getUserRole = () => loadItem("userRole");

// Админ ли пользователь
export const isAdmin = () => getUserRole() === 1;

// Авторизован ли пользователь
export const isAuthorized = () => !!loadItem("authToken") && getUserRole() !== "";

// Выход
export const quit = () => {
  removeUserData();
  window.location.replace(PAGES.MAIN);
};
