/*
  import { saveFile, getCountWord, getTimestamp, getDateString, isObjectOptionsIsEmpty } from 'helpers/common';
 */

import { isMobile } from "react-device-detect";
import { AxiosResponse } from "axios";

export const getCountWord = (single: string, few: string, many: string) => (value: number) => {
  const unit = value % 10;
  const hundredUnit = value % 100;

  if (hundredUnit > 10 && hundredUnit < 20) {
    return many;
  }

  if (unit === 1) {
    return single;
  }

  if (unit > 1 && unit < 5) {
    return few;
  }

  return many;
};

// В секундах
export const getTimestamp = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  return Number(String(new Date(date).getTime())); // .slice(0,10))
};

export const getDateHMS = (timestamp: number, noSecs = true) => {
  const date = new Date(timestamp * 1000);
  return (
    `${`0${date.getHours()}`.slice(-2)}` +
    `:` +
    `${`0${date.getMinutes()}`.slice(-2)}${
      !noSecs ? ":" + `${`0${date.getSeconds()}`.slice(-2)}` : ""
    }`
  );
};

//  => 2023-01-09
export const getDateYMD = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return (
    `${`0${date.getDate()}`.slice(-2)}` +
    "-" +
    `${`0${date.getMonth() + 1}`.slice(-2)}` +
    "-" +
    `${date.getFullYear()}`
  );
};

export const getDateString = (timestamp: number, noSecs = true) =>
  `${getDateYMD(timestamp)} ${getDateHMS(timestamp, noSecs)}`;

export const isObjectOptionsIsEmpty = (obj: any) => {
  for (const param in obj) {
    if (obj[param] !== undefined) {
      return false;
    }
  }
  return true;
};

export const capitalizeFirtsLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const numberFriendly = (value?: number) => Number(value)?.toLocaleString() || 0;

export const getVideoType = (value: string) => {
  const parts = value.split(".");
  if (parts.length > 1) {
    const ext = parts.pop();
    return `video/${ext}`;
  }
  return "";
};
const createLinkAndClick = (file: Blob | File, fileName: string, addDownload = true) => {
  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;

  addDownload && link.setAttribute("download", fileName);
  link.setAttribute("target", "_blank");
  document.body.appendChild(link);

  link.click();

  setTimeout(() => {
    link.remove();
    window.URL.revokeObjectURL(url);
  }, 100);
};
export const copyToBuffer = (value: string) => {
  async function copyToClipboard(textToCopy: string) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();

      const promise = new Promise((resolve, reject) => {
        try {
          document.execCommand("copy");
          resolve(true);
        } catch (error) {
          reject(error);
        } finally {
          textArea.remove();
        }
      });

      return promise;
    }
    return true;
  }

  return copyToClipboard(value);
};

/**
 * Сохранение файла полученного через ajax.
 * Создает ссылку на файл, после виртуального клика удаляется.
 * @param response - ответ сервера с данными о файле
 * @param format - формат файла
 * @param addDownload - если false, то файл будет открыт в новой вкладке браузера без скачивания
 */
export const saveFile = (response: AxiosResponse, format = "", addDownload = true): void => {
  const blob = new Blob([response.data], { type: response.headers["content-type"] });
  const disposition = response.headers["content-disposition"];
  let fileName = "";

  if (disposition && disposition.indexOf("attachment") !== -1) {
    const filenameRegex = /filename=(.*)/;
    const matches = filenameRegex.exec(disposition);

    if (matches !== null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, "");
    }
  }

  if (format) {
    fileName = `${fileName}.${format}`;
  }

  createLinkAndClick(blob, fileName, addDownload);
};
