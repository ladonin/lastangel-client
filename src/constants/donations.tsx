/*
  import { DONATIONS_TYPES } from 'constants/donations';
  Донаты и их параметры
 */

import React from "react";

import { Link } from "react-router-dom";

export const DONATIONS_TYPES = {
  PET: 1,
  COLLECTION: 2,
  COMMON: 3,
  CREDIT: 4,
} as const;

export const MAIN_CARD = "4276 1000 1347 4736";
export const MAIN_PHONE = "8 (996) 442-24-16";
export const MAIN_CARD_OWNER = (
  <Link target="_blank" to="https://vk.com/id512018972" className="link_3">
    Варенова Мария Павловна
  </Link>
);

// #REKVIZITS
export const REKVIZITS = (
  <>
    <span className="loc_title">
      Pеквизиты <span style={{ color: "rgb(13, 174, 0)" }}>Сбербанк</span>{" "}
    </span>
    <div className="loc_desc">
      <div> т. {MAIN_PHONE}</div>
      <b>{MAIN_CARD_OWNER}</b>
      <br />№ карты: {MAIN_CARD}
      <br />
      <br />
      р/с 40703810510000100143
      <br />
      ИНН 3300001667, КПП 330001001
      <br />
      БИК 041708602, ОГРН 1233300004068
      <br />
      Автономная некомерческая организация Приют для животных "Последний ангел"
    </div>
  </>
);

// Пока не используем
/* export const REKVIZITS = (
  <>
    <span className="loc_title">Pеквизиты <span style={{color: 'rgb(13, 174, 0)'}}>Сбербанк</span> </span>
    <div className="loc_desc">
      <span> т. {MAIN_PHONE}
                  </span>
      <b>{MAIN_CARD_OWNER}</b>
      <br />
      <br />
      р/с 40703810510000143
      <br />
      ИНН/КИО 3300001667 
      <br /> 
      КПП 330001001
      <br />
      ОГРН 1233300004068
      <br />
      Автономная некомерческая организация Приют для животных "Последний ангел"
    </div>
  </>
); */
