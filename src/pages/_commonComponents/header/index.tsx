import React, { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate, NavLink, Link } from "react-router-dom";
import cn from "classnames";
import logo from "icons/logo.png";
import VkLogo from "icons/vk_logo.png";
import OkLogo from "icons/ok_logo.png";
import InstLogo from "icons/inst_logo.png";
import CaretIcon from "icons/triangle16.svg";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import PAGES from "routing/routes";

import "./styles.scss";

const MENU_ITEMS = [
  { title: "Главная", link: PAGES.MAIN, inMobileSubMenu: false },
  { title: "Питомцы", link: PAGES.PETS, inMobileSubMenu: false },
  { title: "Сборы", link: PAGES.COLLECTIONS, inMobileSubMenu: false },
  { title: "Новости", link: PAGES.NEWS, inMobileSubMenu: true },
  { title: "Истории", link: PAGES.STORIES, inMobileSubMenu: true },
  { title: "Документы", link: PAGES.DOCUMENTS, inMobileSubMenu: true },
  { title: "Помощь", link: PAGES.HELP, inMobileSubMenu: true },
  { title: "Фин. отчет", link: PAGES.FINREPORT, inMobileSubMenu: true },
  { title: "Клиника", link: PAGES.CLINIC, inMobileSubMenu: true },
  { title: "Контакты", link: PAGES.CONTACTS, inMobileSubMenu: false },
];

type TMenuItem = { title: string; link: string; inMobileSubMenu: boolean };
// продолжить с
// текстом логотипа
// кнопок
// иконок контактов
export default function Index() {
  const navigate = useNavigate();
  const [openSubmenuState, setOpenSubmenuState] = useState(false);

  const renderMenuItem = (item: TMenuItem, index: number) => (
    <Link to={item.link} className="loc_item" key={index}>
      {item.title}
    </Link>
  );
  const renderMenu = (mobile: boolean) => (
    <>
      {!mobile && MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}

      {mobile && (
        <>
          {MENU_ITEMS.filter(({ inMobileSubMenu }) => !inMobileSubMenu).map((item, index) =>
            renderMenuItem(item, index)
          )}

          <div
            className={cn("loc_else", { "loc--opened": openSubmenuState })}
            onClick={() => {
              setOpenSubmenuState(!openSubmenuState);
            }}
          >
            Еще <CaretIcon className="loc_caret" />
          </div>
          {openSubmenuState && (
            <div className="loc_subMenu">
              {MENU_ITEMS.filter(({ inMobileSubMenu }) => inMobileSubMenu).map((item, index) =>
                renderMenuItem(item, index)
              )}
            </div>
          )}
        </>
      )}
    </>
  );

  const renderButtons = (size: ButtonSizes) => (
    <div className="loc_buttons">
      <Button theme={ButtonThemes.PRIMARY} size={size} onClick={() => navigate(PAGES.CURATORY)}>
        <strong>стать куратором</strong>
      </Button>
      <Button theme={ButtonThemes.SUCCESS} size={size} onClick={() => navigate(PAGES.HELP)}>
        <strong>помочь приюту</strong>
      </Button>
    </div>
  );

  const renderContacts = () => (
    <div className="loc_contacts">
      <NavLink to="https://vk.com/club190912136" target="_blank">
        <img src={VkLogo} alt="Мы во вконтакте" title="Мы во вконтакте" />
      </NavLink>
      <NavLink to="https://m.ok.ru/profile/565776551254" target="_blank">
        <img src={OkLogo} alt="Мы в одноклассниках" title="Мы в одноклассниках" />
      </NavLink>
      <NavLink to="https://www.instagram.com/posledniyangel" target="_blank">
        <img src={InstLogo} alt="Мы в instagram" title="Мы в instagram" />
      </NavLink>
    </div>
  );
  return (
    <>
      <BrowserView>
        <div className="component-header">
          <div className="loc_wrapper">
            <div className="loc_leftPart">
              <img
                alt="."
                src={logo}
                className="loc_logo"
                onClick={() => {
                  navigate(PAGES.MAIN);
                }}
              />
            </div>
            <div className="loc_rightPart">
              <div className="loc_topPart">
                <div className="loc_logoText">
                  <h1 className="loc_1">Последний ангел</h1>
                  <h2 className="loc_2">приют для бездомных животных в г. Александров</h2>
                </div>

                {renderButtons(ButtonSizes.MEDIUM)}
                {renderContacts()}
              </div>

              <div className="loc_bottomPart">{renderMenu(false)}</div>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="component-headerMobile">
          <div className="loc_wrapper">
            <div className="loc_leftPart">
              <img
                alt="."
                src={logo}
                className="loc_logo"
                onClick={() => {
                  navigate(PAGES.MAIN);
                }}
              />
            </div>
            <div className="loc_rightPart">
              <h1 className="loc_name">Последний ангел</h1>
              <h2 className="loc_description">
                Приют для бездомных животных
                <br />в г. Александров
              </h2>
            </div>
          </div>
          <div className="loc_bottom">
            {renderButtons(ButtonSizes.BIG)}
            {renderContacts()}
          </div>

          <div className="loc_menu">{renderMenu(true)}</div>
        </div>
      </MobileView>
    </>
  );
}
