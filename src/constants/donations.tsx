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
} as const;

export const MAIN_CARD = "4276100013474736";
export const MAIN_PHONE = "8 (996) 442-24-16";
export const MAIN_CARD_OWNER = (
  <Link target="_blank" to="https://vk.com/id512018972" className="link_3">
    Мария Павловна В.
  </Link>
);

export const REKVIZITS = (
  <>
    <span className="loc_title">Pеквизиты</span>
    <div className="loc_desc">
      р/с 40703810510000143, Сбербанк
      <br />
      ИНН/КИО 3300001667, КПП330001001
      <br />
      ОГРН 1233300004068, тел.: +7 (996) 442-24-16
      <br />
      Автономная некомерческая организация Приют для животных "Последний ангел"
    </div>
  </>
);
