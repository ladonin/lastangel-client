/*
  import Footer from 'pages/_commonComponents/footer'
  Футер сайта
 */
import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { Link } from "react-router-dom";
import { isAuthorized } from "utils/user";
import PAGES from "routing/routes";
import LessHomelessImage from "./friends/lesshomeless.png";
import "./styles.scss";

const renderCounter = () => (
  <div className="loc_metrics">
    <a
      href="https://metrika.yandex.ru/stat/?id=94884590&amp;from=informer"
      target="_blank"
      rel="nofollow noreferrer"
    >
      <img
        src="https://informer.yandex.ru/informer/94884590/3_1_CCCCCCFF_CCCCCCFF_0_visits"
        style={{ width: "88px", height: "31px", border: 0 }}
        alt="Яндекс.Метрика"
        title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
        className="ym-advanced-informer"
        data-cid="94884590"
        data-lang="ru"
      />
    </a>
  </div>
);

const renderFriendsList = () => (
  <div className="loc_friends">
    <div className="loc_content">
      <div className="loc_title">Наши друзья</div>
      <div className="loc_list">
        <a href="https://less-homeless.com/" target="_blank" rel="noreferrer">
          <img alt="загружаю" src={LessHomelessImage} />
        </a>
      </div>
    </div>
  </div>
);

const renderLinksList = () => (
  <div className="loc_links">
    <Link to={PAGES.MAIN} className="link_1 loc_link">
      Главная
    </Link>
    <Link to={PAGES.PETS} className="link_1 loc_link">
      Питомцы
    </Link>
    <Link to={PAGES.COLLECTIONS} className="link_1 loc_link">
      Сборы
    </Link>
    <Link to={PAGES.NEWS} className="link_1 loc_link">
      Новости
    </Link>
    <Link to={PAGES.STORIES} className="link_1 loc_link">
      Истории
    </Link>
    <Link to={PAGES.DOCUMENTS} className="link_1 loc_link">
      Документы
    </Link>
    <Link to={PAGES.HELP} className="link_1 loc_link">
      Помощь
    </Link>
    <Link to={PAGES.VOLUNTEERS} className="link_1 loc_link">
      Волонтеры
    </Link>
    <Link to={PAGES.FINREPORT} className="link_1 loc_link">
      Фин. отчет
    </Link>
    <Link to={PAGES.CLINIC} className="link_1 loc_link">
      Клиника
    </Link>
    <Link to={PAGES.CONTACTS} className="link_1 loc_link">
      Контакты
    </Link>
  </div>
);

export default function Index() {
  return (
    <div className="component-footer">
      <BrowserView>
        <div className="component-footer_wrapper_1">
          <div className="loc_block_1">
            Приют для животных <br />
            &copy; "Последний ангел"
            <br />с 2010г.
          </div>
          <div className="loc_block_2">
            {renderLinksList()}
            {renderFriendsList()}
          </div>
          <div className="loc_block_3">
            {!isAuthorized() && (
              <Link to={PAGES.SIGNIN} className="link_1 loc_link loc_login">
                Войти
              </Link>
            )}
            {renderCounter()}
          </div>
          <div className="loc_block_4">Сайт создан волонтерами на добровольной основе</div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="component-footer_wrapper_1">
          <div className="loc_block_2">
            {renderLinksList()}
            {renderFriendsList()}
          </div>
          <div className="loc_block_1">
            Приют для животных &copy; "Последний ангел"
            <br />с 2010г.
          </div>
          <div className="loc_block_4">Сайт создан волонтерами на добровольной основе</div>
          <div className="loc_block_3">
            {!isAuthorized() && (
              <Link to={PAGES.SIGNIN} className="link_1 loc_link loc_login">
                Войти
              </Link>
            )}
            {renderCounter()}
          </div>
        </div>
      </MobileView>
    </div>
  );
}
