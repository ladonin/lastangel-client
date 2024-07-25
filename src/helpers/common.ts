/*
  import { saveFile, getCountWord, getTimestamp, getDateString, isObjectOptionsEmpty } from 'helpers/common';
  Общие вспомогательные функции
 */

import { AxiosResponse } from "axios";

// => ${getCountWord("месяц", "месяца", "месяцев")(months)}`;
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

// => таймштамп в секундах
export const getTimestamp = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  return Number(String(new Date(date).getTime())); // .slice(0,10))
};

// => 01:58:59 или 01:58
export const getDateHMS = (timestamp: number, noSecs = true) => {
  const date = new Date(timestamp * 1000);
  return `${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(-2)}${
    !noSecs ? `:${`0${date.getSeconds()}`.slice(-2)}` : ""
  }`;
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
  "Декабрь"
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
  "Декабря"
];

// => 25 марта
export const getDateDMFriendly = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()} ${monthMappingsRodit[date.getMonth()]}`;
};

// => 25 марта 2011 г.
export const getDateDMYFriendly = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()} ${monthMappingsRodit[date.getMonth()]} ${date.getFullYear()} г.`;
};

// => 25-05-2011 01:58:59 (или 01:58)
export const getDateString = (timestamp: number, noSecs = true) =>
  `${getDateYMD(timestamp)} ${getDateHMS(timestamp, noSecs)}`;

// => пустой ли объект (или пустые ли у него свойства)
export const isObjectOptionsEmpty = (obj: any) => {
  for (const param in obj) {
    if (obj[param] !== undefined) {
      return false;
    }
  }
  return true;
};

// картошка => Картошка
export const capitalizeFirtsLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

// 1234567 => 1 234 567
// 1234567.99 => 1 234 567.99
// 1234567,99 => 1 234 567.99
export const numberFriendly = (value?: string | number) => {
  if (!value) return 0;

  if (typeof value === "number") value = String(value);

  const toLocaleString = (value: string) => {
    const parts = value.split(".");
    return parts[0].replace(/\B(?=(?:\d{3})*$)/g, " ") + (parts.length === 2 ? `.${parts[1]}` : "");
  };
  return toLocaleString(value.replaceAll(",", ".")).replaceAll(".", ",") || 0;
};

// => video/mp4 и т.д.
export const getVideoType = (value: string) => {
  const parts = value.split(".");
  if (parts.length > 1) {
    const ext = parts.pop();
    return `video/${ext}`;
  }
  return "";
};

// Создает временную ссылку на странице и делает клик на неё
// Нужно для скачивания файла
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

// Копирует текст в буфер обмена
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

// Преобразует спецсимволы (перевода строки и т.д.) в теги
// Можно добавлять доп. регулярки
export const textToClient = (text: string) => {
  let result = text;
  result = result.replace(/\n|\r|\n\r/g, "<br/>");
  return result;
};

// Для мобильной версии - коэффициент
// На сколько надо изменить стандартные значения
// в зависимости от ширины вьюпорта мобильного устройства
export const getViewportKoeff = () => window.innerWidth / 980;

// Обработка введеного номера телефона клинетом
// 7A378---436=3((46 => 7378-436346
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

// Сравнение объектов
// Не хочу ради этого ставить lodash
export const objectsAreEqual = (obj1: any, obj2: any) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);


/*
Клонируем объект
var object = {
  prop1: 1,
  prop2: 'aaa',
  prop3: [1,2,3,'rrr', function foo1(){console.log('foo1')}],
  prop4: function foo2(){console.log('foo2')},
  prop5: new Set(['set1','set2','set3']),
  prop6: null,
  prop7: false,
  prop8: 0,
  prop9: [
    {
    prop9_1: 1,
    prop9_2: '9_aaa',
    prop9_3: [1,2,3,'9_rrr', function foo9_1(){console.log('foo9_1')}],
    prop9_4: function foo9_2(){console.log('foo9_2'); console.log(this.a);},
    prop9_5: new Set(['set9_1','set9_2','set9_3']),
    prop9_6: null,
    prop9_7: false,
    prop9_8: 0,
    prop9_9: [
      {
        prop9_9_1: 1,
        prop9_9_2: '9_9_aaa',
        prop9_9_3: [1,2,3,'9_9_rrr', function foo9_9_1(){console.log('foo9_9_1')}],
        prop9_9_4: function foo9_9_2(){console.log('foo9_9_2')},
        prop9_9_5: new Set(['set_99_1','set_99_2','set_99_3']),
        prop9_9_6: null,
        prop9_9_7: false,
        prop9_9_8: 0,
        prop9_9_9: [
          111,222
        ]
      },
      99,
      new Set(['set9_9_1','set9_9_2','set9_9_3']),
    ],
    prop9_10: {
      prop9_10_1: 1,
      prop9_10_2: '9_10_aaa',
      prop9_10_3: [1,2,3,'9_10_rrr', function foo9_10_1(){console.log('foo9_10_1')}],
      prop9_10_4: function foo9_10_2(){console.log('foo9_10_2')},
      prop9_10_5: new Set(['set_910_1','set_910_2','set_910_3']),
      prop9_10_6: null,
      prop9_10_7: false,
      prop9_10_8: 0,
      prop9_10_9: [
        1111,2222, new Set(['set9_10_1','set9_10_2','set9_10_3']),
      ]
    }
  },
  9
  ],
  prop10: {
        prop10_1: 1,
        prop10_2: '10_aaa',
        prop10_3: [1,2,3,'10_rrr', function foo10_1(){console.log('foo10_1')}],
        prop10_4: function foo10_2(){console.log('foo10_2')},
        prop10_5: new Set(['set_10_1','set_10_2','set_10_3']),
        prop10_6: null,
        prop10_7: false,
        prop10_8: 0,
        prop10_9: [
          1111,2222, new Set(['set10_1','set10_2','set10_3'])
        ]
      }
}

function clone(obj) {
  
  const isObject = (obj) => ({}).toString.apply(obj) === "[object Object]";
  const isSet = (set) => ({}).toString.apply(set) === "[object Set]";
  const isMap = (map) => ({}).toString.apply(map) === "[object Map]";
  const isFunction = (func) => ({}).toString.apply(func) === "[object Function]";
  const isDate = (date) => ({}).toString.apply(date) === "[object Date]";
  
  Function.prototype.clone = function() {
    let that = this;
    let clonedFunc = {[that.name]: function() { return that.apply(this, arguments)}}
    Object.defineProperties(clonedFunc[that.name], Object.getOwnPropertyDescriptors(that))
    return clonedFunc[that.name];
  }
  
 // let clonedObject = Array.isArray(obj) 
  //? Object.defineProperties([], Object.getOwnPropertyDescriptors(obj))
  //: Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
  
  let clonedObject = Object.defineProperties( Array.isArray(obj) ? [] : {}, Object.getOwnPropertyDescriptors(obj));
  clonedObject.__proto__ = Object.getPrototypeOf(obj);
  
  Object.entries(clonedObject).forEach(([prop, value]) => {
    if (Array.isArray(value) || isObject(value)) {
      clonedObject[prop] = clone(value)
    } else if (isSet(value)) {
      clonedObject[prop] = new Set(value)
    } else if (isMap(value)) {
      clonedObject[prop] = new Map(value)
    } else if (isFunction(value)) {
      clonedObject[prop] = value.clone()
    } else if (isDate(value)) {
      clonedObject[prop] = new Date(value)
    }
  })
  return clonedObject;
};




//-->proto test 1
var proto_proto_test = {
  a: 'protoprotoprotoproto'
}
var obj_proto_test = {
  __proto__: proto_proto_test
};

object.prop9[0].prop9_10.__proto__ = obj_proto_test
//<--proto test 1


// proto test 2
object.prop9.__proto__ = {a: 'array proto'}
// proto test 2


object.prop4.changgggeddddd='changed'; // function prop test 1
var clonedObject = clone(object);
object.prop4.changgggeddddd='changed2222222222222222'; // function prop test 1

//-->proto test 1
object.prop9[0].prop9_10.__proto__.a= 'channnnnggggeeeeddd';
//<--proto test 1



// proto test 2
object.prop9.__proto__.a= 'array proto channnngeeeeedddd';
// proto test 2




object.prop1='changed';

object.prop9[0].prop9_7='changed';
object.prop9[0].prop9_9[2].add('changed');
object.prop9.changgggeddddd='changed';
object.prop10.prop10_3[3]=23432424234;
object.prop10.prop10_3[4].channngeeeeddddd=1111111111111111111111111;
console.log(object)
console.log(clonedObject)






 */
