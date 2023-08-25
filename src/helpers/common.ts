/*
  import { getCountWord, getTimestamp, getDateString, isObjectOptionsIsEmpty } from 'helpers/common';
 */

import { isMobile } from "react-device-detect";

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
    `${`0${date.getMinutes()}`.slice(-2)}${!noSecs ? ":" + `${`0${date.getSeconds()}`.slice(-2)}` : ""}`
  );
};

//  => 2023-01-09
export const getDateYMD = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${`0${date.getDate()}`.slice(-2)}` + "-" + `${`0${date.getMonth() + 1}`.slice(-2)}` + "-" + `${date.getFullYear()}`;
};

export const getDateString = (timestamp: number, noSecs = true) => `${getDateYMD(timestamp)} ${getDateHMS(timestamp, noSecs)}`;

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
