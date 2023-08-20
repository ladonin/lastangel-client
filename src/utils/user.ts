/*
 * import { saveUserData, removeUserData, isAdmin, quit, isAuthorized } from 'utils/user'
 */
import { loadItem, removeItem, saveItem } from "utils/localStorage";
import PAGES from "routing/routes";

export const saveUserData = (token: string) => {
  const { i: id, r: role } = JSON.parse(window.atob(token.split(".")[1]));

  saveItem("authToken", token);
  saveItem("userId", id);
  saveItem("userRole", role);
};

export const removeUserData = () => {
  removeItem("authToken");
  removeItem("userId");
  removeItem("userRole");
};
export const getUserRole = () => loadItem("userRole");
export const isAdmin = () => getUserRole() === 1;

export const isAuthorized = () => !!loadItem("authToken") && getUserRole() !== "";

export const quit = () => {
  removeUserData();
  window.location.replace(PAGES.MAIN);
};
