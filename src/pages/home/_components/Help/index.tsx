/*
  import Help from 'pages/home/_components/Help'
  Компонент "Помощь" для домашней страницы
 */
import React from "react";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";
import PAGES from "routing/routes";
import { REKVIZITS } from "constants/donations";
import { loadItem } from "utils/localStorage";
import Image from "icons/help.jpg";
import ImageMobile from "icons/helpMobile.jpg";
import DocsIcon from "icons/docs.png";
import ArrowRight from "icons/arrowRight.svg";
import WarningIcon from "icons/warning.png";
import "./style.scss";

const Help = () => {
  const isMobile = loadItem("isMobile");

  return (
    <div className="page-home_help">
      <div className="loc_title">
        <strong>Помочь приюту</strong>
        <Link to={PAGES.HELP} className="loc_go">
          перейти <ArrowRight />
        </Link>
      </div>
      <div className="loc_content">
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

        <div className="loc_item_building">
          <div className="loc_title">
            <img alt="загружаю" src={WarningIcon} /> Информация по вопросам строительства нового
            приюта:
          </div>
          <div className="loc_item">
            <span>
              На сегодняшний момент финансовым директором приюта является{" "}
              <b>Шибаева Галина Александровна</b> и все вопросы по строительству ведет она.
              <br />
              Тел.: 8 (910) 099-07-57
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
