/*
  import help from 'pages/help'
  Страница помощи
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";

import { AnimalsApi } from "api/animals";
import { CollectionsApi } from "api/collections";
import PAGES from "routing/routes";
import { loadItem } from "utils/localStorage";
import { MAIN_CARD_OWNER, MAIN_PHONE, REKVIZITS } from "constants/donations";
import { useQueryHook } from "hooks/useQueryHook";
import BreadCrumbs from "components/BreadCrumbs";
import Image from "icons/help.jpg";
import ImageMobile from "icons/helpMobile.jpg";
import DocsIcon from "icons/docs.png";
import PrayIcon from "icons/pray.png";
import InvalidIcon2 from "./icons/2.png";
import InvalidIcon4 from "./icons/4.png";
import InvalidIcon7 from "./icons/7.png";
import InvalidIcon8 from "./icons/8.png";
import "./style.scss";

const Help: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const query = useQueryHook();
  const [targetState, setTargetState] = useState("");
  const [targetTypeState, setTargetTypeState] = useState("");
  const [targetDataState, setTargetDataState] = useState<{ name: string; id: number } | null>(null);

  const { getMetatags } = useOutletContext<any>();

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.help_title || "",
      description: data.help_description || "",
    };
  }, []);

  useEffect(() => {
    if (query) {
      const target = query.get("target");
      if (target !== null && typeof target !== "undefined") {
        setTargetState(target);
        setTargetTypeState(target[0] === "c" ? "collection" : "pet");
      }
    }
  }, [query]);

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
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-help">
        <BreadCrumbs title="Помощь" />

        <div className="loc_target">
          {targetDataState && (
            <div className="loc_selected">
              Вы выбрали:{" "}
              <Link
                to={`${targetTypeState === "pet" ? PAGES.PET : PAGES.COLLECTION}/${targetState}`}
                className="loc_targetName link_3"
              >
                {targetDataState.name} ({/* Код${targetTypeState === "pet" ? "Питомец" : "Сбор" */}№
                {targetDataState.id})
              </Link>
            </div>
          )}

          <div className="loc_description">
            <div className="loc_smsComment">
              Уважаемые посетители, если Вы хотите, чтобы Ваш донат был привязан к определенному
              питомцу или сбору, просьба, сообщить нам об этом{" "}
              <img alt="загружаю" src={PrayIcon} height="16" style={{ display: "inline-block" }} />.
            </div>
            Это можно сделать с помощью:
            <ul>
              <li>
                <Link to={PAGES.CONTACTS} className="link_3">
                  обратной связи
                </Link>
              </li>
              <li>
                отправки произвольного смс (либо сообщения в whatsapp, telegram) на номер{" "}
                <span className="loc_contact">
                  {MAIN_PHONE} ({MAIN_CARD_OWNER})
                </span>
              </li>
              <li>
                либо через сообщение получателю, когда переводите средства через приложение
                (сбербанк онлайн и т.п.) .
              </li>
            </ul>
            Данное сообщение (смс) может быть произвольного вида, главное, чтобы нам было понятно,
            кому Вы жертвуете средства. Желательно, чтобы в сообщении была указана сумма и кому или
            на что они должны пойти. Это может быть кличка животного или его номер (либо номер или
            название сбора, если это сбор).
            <br />
            <br />
            {/* <div className="loc_smsExample">100 П1</div>
            <div className="loc_smsDescription">Где 100 - сумма, П1 - № питомца (П - питомец, 1 - его номер)</div>
            <br />
            <div className="loc_smsExample">100 С1</div>
            <div className="loc_smsDescription">Где 100 - сумма, С1 - № сбора (С - сбор, 1 - его номер)</div>
            <div className="loc_smsComment">
              Данная информация может быть и произвольной формы, главное, чтобы мы поняли на кого/что регистрировать Ваше
              пожертвование.
            </div>
            <div className="loc_smsComment">
              Если Вы не сообщите нам эту информацию, то мы сами определим куда направить Ваш донат. Это может быть сбор на
              срочную операцию, постройку, либо на питомца, на которого меньше всего собрано средств за последнее время. Если Вам
              будет интересно, Вы можете связаться с нами и узнать, куда мы направили Ваши средства.
            </div> */}
            <div className="loc_delimiter" />
            <br />
            <div className="loc_alternative">
              Если Вы не укажете эту информацию, то Ваша помощь будет направлена "На общие нужды
              приюта", а там распределена на самых нуждающихся хвостиков.
              <br />
              Это инвалиды <img alt="загружаю" className="loc_invalidIcon" src={InvalidIcon7} /> и
              те, кому требуется срочное лечение{" "}
              <img alt="загружаю" className="loc_invalidIcon" src={InvalidIcon4} />{" "}
              <img alt="загружаю" className="loc_invalidIcon" src={InvalidIcon2} />. В нашем приюте
              они всегда есть :(
              <img alt="загружаю" className="loc_invalidIcon" src={InvalidIcon8} />.
            </div>
            <br />
            <div className="loc_delimiter" />
            <br />
            <div className="loc_smsComment">
              Информацию по собранным средствам за последние 30 дней Вы можете узнать, нажав на
              кнопку "Подробнее" на странице питомца/сбора или на странице{" "}
              <Link to={PAGES.FINREPORT} className="link_3">
                Фин. отчет
              </Link>{" "}
              <i>(в ней отображается полный список всех донатов приюта)</i>.
            </div>
          </div>
        </div>

        <div className="loc_addDonator">
          Если Вы хотите зарегистрировать себя как Донатор с подробной информацией о Вас, то Вам
          нужно сделать запрос через{" "}
          <Link to={PAGES.CONTACTS} className="loc_contact link_3">
            обратную связь
          </Link>{" "}
          (форма обращения свободная), либо связаться с нами по номеру телефона{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            {MAIN_PHONE} ({MAIN_CARD_OWNER})
          </span>
          .
        </div>
        <div className="loc_rekviz">
          <div className="loc_top">
            <img alt="загружаю" src={isMobile ? ImageMobile : Image} className="loc_image" />
            <div className="loc_right">
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
                расскажите о нас в социальных сетях, поделитесь любой нашей записью или дайте ссылку
                на сайт, расскажите о нас знакомым и друзьям.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
