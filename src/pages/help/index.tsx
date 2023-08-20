import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import BreadCrumbs from "components/BreadCrumbs";
import { AnimalsApi } from "api/animals";
import { CollectionsApi } from "api/collections";
import { useQueryHook } from "hooks/useQueryHook";
import Image from "icons/help.jpg";
import SberIcon from "icons/sber.png";
import DocsIcon from "icons/docs.png";
import PAGES from "routing/routes";
import { MAIN_CARD, MAIN_CARD_OWNER, MAIN_PHONE, REKVIZITS } from "../../constants/donations";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const Help: React.FC = () => {
  const query = useQueryHook();
  const navigate = useNavigate();
  const [targetState, setTargetState] = useState("");
  const [targetTypeState, setTargetTypeState] = useState("");
  useEffect(() => {
    if (query) {
      const target = query.get("target");
      if (target !== null && typeof target !== "undefined") {
        setTargetState(target);
        setTargetTypeState(target[0] === "c" ? "collection" : "pet");
      }
    }
  }, [query]);

  const [targetDataState, setTargetDataState] = useState<{ name: string; id: number } | null>(null);

  useEffect(() => {
    if (targetState && targetTypeState && !targetDataState) {
      if (targetTypeState === "pet") {
        AnimalsApi.get(Number(targetState)).then((res) => {
          setTargetDataState(res);
        });
      } else {
        CollectionsApi.get(Number(targetState.slice(1))).then((res) => {
          setTargetDataState(res);
        });
      }
    }
  }, [targetState, targetTypeState]);

  return (
    <div className="page-help">
      <BreadCrumbs title="Помощь" />
      {targetDataState && (
        <div className="loc_target">
          <div className="loc_selected">
            Вы выбрали:{" "}
            <span
              className="loc_targetName"
              onClick={() => {
                navigate(`${targetTypeState === "pet" ? PAGES.PET : PAGES.COLLECTION}/${targetState}`);
              }}
            >
              {targetDataState.name} (Код {`${targetTypeState === "pet" ? "П" : "С"}${targetDataState.id}`})
            </span>
          </div>

          <div className="loc_description">
            Желательно также сообщить нам идентификатор питомца/сбора и саму сумму.
            <div className="loc_smsComment">Эта информация нужна нам для регистрации её на сайте.</div>
            <br /> Это можно сделать с помощью отправки смс на номер{" "}
            <span className="loc_contact" style={{ whiteSpace: "nowrap" }}>
              {MAIN_PHONE} ({MAIN_CARD_OWNER})
            </span>
            , либо при переводе средств через приложение (сбербанк онлайн и т.п.) указать сообщение получателю. Данное сообщение
            (смс) должно быть следующего вида:
            <br />
            <div className="loc_smsExample">100 П1</div>
            <div className="loc_smsDescription">Где 100 - сумма, П1 - № питомца (П - питомец, 1 - его номер)</div>
            <br />
            <div className="loc_smsExample">100 С1</div>
            <div className="loc_smsDescription">Где 100 - сумма, С1 - № сбора (С - сбор, 1 - его номер)</div>
            <div className="loc_smsComment">
              Данная информация может быть и произвольной формы, главное, чтобы мы поняли на кого/что регистрировать Ваше
              пожертвование.
            </div>
            <div className="loc_smsComment">
              Если вы не сообщите нам эту информацию, то мы сами определим куда направить Ваш донат. Это может быть сбор на
              срочную операцию, постройку, либо на питомца, на которого меньше всего собрано средств за последнее время. Если Вам
              будет интересно, Вы можете связаться с нами и узнать, куда мы направили Ваши средства.
            </div>
            <div className="loc_smsComment">
              Информацию по собранным средствам за последние 30 дней Вы можете узнать, нажав на кнопку "Подробнее" на странице
              питомца/сбора.
            </div>
          </div>
        </div>
      )}
      <div className="loc_addDonator">
        Если Вы хотите зарегистрировать себя как Донатор с подробной информацией о Вас, то Вам нужно сделать запрос через{" "}
        <span
          className="loc_contact"
          onClick={() => {
            navigate(PAGES.CONTACTS);
          }}
        >
          обратную связь
        </span>{" "}
        (форма обращения свободная) , либо связаться с нами по номеру телефона{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          {MAIN_PHONE} ({MAIN_CARD_OWNER})
        </span>
        .
      </div>
      <div className="loc_rekviz">
        <div className="loc_top">
          <img alt="nophoto" src={Image} className="loc_image" />
          <div className="loc_right">
            <div className="loc_item">
              <div className="loc_sber">
                <img src={SberIcon} alt="Карты СБ приюта" />
                <span className="loc_title">Карты СБ приюта</span>
                <div className="loc_desc">
                  <div>
                    {MAIN_CARD} или т. {MAIN_PHONE}
                  </div>
                  Держатель карты <b>{MAIN_CARD_OWNER}</b>
                </div>
              </div>
            </div>

            <div className="loc_item">
              <div className="loc_docs">
                <img src={DocsIcon} alt="Реквизиты приюта" />
                {REKVIZITS}
              </div>
            </div>
          </div>
        </div>
        <div className="loc_item_other">
          <div className="loc_title">Также можно помочь:</div>
          <div className="loc_item">
            <span className="loc_name">Вещами:</span>
            <span>кормами, лекарствами, предметами быта и т.д.</span>
          </div>
          <div className="loc_item">
            <span className="loc_name">Рекламой:</span>
            <span>
              расскажите о нас в социальных сетях. поделитесь любой нашей записью или дайте ссылку на сайт, расскажите о нас
              знакомым и друзьям.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
