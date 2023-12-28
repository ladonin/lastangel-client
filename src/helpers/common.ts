/*
  import { saveFile, getCountWord, getTimestamp, getDateString, isObjectOptionsEmpty } from 'helpers/common';
 */

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

//  => 30-01-2023
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

export const monthMappings = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
export const monthMappingsRodit = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
];
export const getDateYMFriendly = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()} ${monthMappingsRodit[date.getMonth()]}`;
};
export const getDateYMDFriendly = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()} ${monthMappingsRodit[date.getMonth()]} ${date.getFullYear()} г.`;
};

export const getDateString = (timestamp: number, noSecs = true) =>
  `${getDateYMD(timestamp)} ${getDateHMS(timestamp, noSecs)}`;

export const isObjectOptionsEmpty = (obj: any) => {
  for (const param in obj) {
    if (obj[param] !== undefined) {
      return false;
    }
  }
  return true;
};

export const capitalizeFirtsLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const numberFriendly = (value?: string | number) => {
  if (!value) return 0;

  if (typeof value === "number") value = String(value);

  const toLocaleString = (value: string) => {
    const parts = value.split(".");
    return parts[0].replace(/\B(?=(?:\d{3})*$)/g, " ") + (parts.length === 2 ? `.${parts[1]}` : "");
  };
  return toLocaleString(value.replaceAll(",", ".")).replaceAll(".", ",") || 0;
};
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

      const _promise = new Promise((resolve, reject) => {
        try {
          document.execCommand("copy");
          resolve(true);
        } catch (error) {
          reject(error);
        } finally {
          textArea.remove();
        }
      });

      return _promise;
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

export const textToClient = (text: string) => {
  let result = text;
  result = result.replace(/\n|\r|\n\r/g, "<br/>");
  return result;
};

export const getViewportKoeff = () => window.innerWidth / 980;

export const preparePhoneInputVal = (val: string) => {
  const hasPlus = val.indexOf("+") === 0;
  let newVal = val.replaceAll(/[^\d -]+/gi, "");
  newVal = newVal.replaceAll(/^[ -]+/gi, "");
  newVal = newVal.replaceAll(/[ ]{2,}/gi, " ");
  newVal = newVal.replaceAll(/[-]{2,}/gi, "-");
  newVal = newVal.replaceAll(/( -)/gi, " ");
  newVal = newVal.replaceAll(/(- )/gi, "-");
  return hasPlus ? `+${newVal}` : newVal;
};

// Не хочу ради этого ставить lodash
export const objectsAreEqual = (obj1: any, obj2: any) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);
