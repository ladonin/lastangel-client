/*
  import Help from 'pages/home/components/Help'
 */
import React from "react";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router-dom";
import Image from "icons/help.jpg";
import SberIcon from "icons/sber.png";
import DocsIcon from "icons/docs.png";
import ArrowRight from "icons/arrowRight.svg";
import PAGES from "routing/routes";
import { MAIN_CARD, MAIN_CARD_OWNER, MAIN_PHONE, REKVIZITS } from "constants/donations";
import "./style.scss";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="page-home_help">
      <div className="loc_title">
        Помочь приюту
        <div
          className="loc_go"
          onClick={() => {
            navigate(PAGES.HELP);
          }}
        >
          перейти <ArrowRight />
        </div>
      </div>
      <div className="loc_content">
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
