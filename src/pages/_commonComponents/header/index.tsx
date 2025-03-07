/*
  import Header from 'pages/_commonComponents/header'
  Шапка сайта
 */
import React, { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate, NavLink } from "react-router-dom";
import cn from "classnames";
import { useLocation } from "react-router";

import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import PAGES from "routing/routes";
import logo from "icons/logo.png";
import VkLogo from "icons/vk_logo.png";
import OkLogo from "icons/ok_logo.png";
import InstLogo from "icons/inst_logo.png";
import CaretIcon from "icons/triangle16.svg";
import flowerSrc from "icons/flower1.png";
import "./styles.scss";

type TMenuItem = {
  title: string;
  link: string;
  inMobileSubMenu: false | number;
  inDesctopSubMenu: boolean;
};

const MENU_ITEMS: TMenuItem[] = [
  { title: "Главная", link: PAGES.MAIN, inMobileSubMenu: false, inDesctopSubMenu: false },
  { title: "Питомцы", link: PAGES.PETS, inMobileSubMenu: false, inDesctopSubMenu: false },
  { title: "Сборы", link: PAGES.COLLECTIONS, inMobileSubMenu: false, inDesctopSubMenu: false },
  { title: "Новости", link: PAGES.NEWS, inMobileSubMenu: 1, inDesctopSubMenu: false },
  { title: "Истории", link: PAGES.STORIES, inMobileSubMenu: 1, inDesctopSubMenu: false },
  { title: "Документы", link: PAGES.DOCUMENTS, inMobileSubMenu: 1, inDesctopSubMenu: true },
  { title: "Помощь", link: PAGES.HELP, inMobileSubMenu: 1, inDesctopSubMenu: false },
  { title: "Фин. отчет", link: PAGES.FINREPORT, inMobileSubMenu: 1, inDesctopSubMenu: false },
  { title: "Клиника", link: PAGES.CLINIC, inMobileSubMenu: 2, inDesctopSubMenu: true },
  { title: "Контакты", link: PAGES.CONTACTS, inMobileSubMenu: false, inDesctopSubMenu: false },
  { title: "Волонтеры", link: PAGES.VOLUNTEERS, inMobileSubMenu: 2, inDesctopSubMenu: false },
];

const LINKS_BELONGINGS = {
  [PAGES.PET]: PAGES.PETS,
  [PAGES.COLLECTION]: PAGES.COLLECTIONS,
  [PAGES.DONATOR]: PAGES.DONATORS,
  [PAGES.NEWS]: PAGES.NEWS,
  [PAGES.STORY]: PAGES.STORIES,
  [PAGES.VOLUNTEER]: PAGES.VOLUNTEERS,
};

export default function Index() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openDesctopSubmenuState, setOpenDesctopSubmenuState] = useState(false);
  const [openMobileSubmenuState, setOpenMobileSubmenuState] = useState(true);

  const checkActive = (item: TMenuItem, isActive: boolean) => {
    if (isActive) return true;

    for (const singlePath in LINKS_BELONGINGS) {
      if (pathname.indexOf(singlePath) === 0 && item.link === LINKS_BELONGINGS[singlePath]) {
        return true;
      }
    }
    return false;
  };

  const checkElseActive = () => {
    for (const index in MENU_ITEMS) {
      if (MENU_ITEMS[index].inDesctopSubMenu && MENU_ITEMS[index].link === pathname) {
        return true;
      }
    }
    return false;
  };

  const renderMenuItem = (item: TMenuItem, index: number) => (
    <NavLink
      to={item.link}
      className={({ isActive }) => `loc_item${checkActive(item, isActive) ? " loc--active" : ""}`}
      key={index}
    >
      {item.title}
    </NavLink>
  );

  const renderMenu = (mobile: boolean) => (
    <>
      {!mobile && (
        <>
          {MENU_ITEMS.filter(({ inDesctopSubMenu }) => !inDesctopSubMenu).map((item, index) =>
            renderMenuItem(item, index)
          )}
          <div
            className={cn("loc_else", {
              "loc--opened": openDesctopSubmenuState,
              "loc--active": checkElseActive(),
            })}
            onClick={() => {
              setOpenDesctopSubmenuState(!openDesctopSubmenuState);
            }}
          >
            Еще <CaretIcon className="loc_caret" />
            {openDesctopSubmenuState && (
              <>
                <div className="loc_overflow" />
                <div className="loc_subMenu">
                  {MENU_ITEMS.filter(({ inDesctopSubMenu }) => inDesctopSubMenu).map(
                    (item, index) => renderMenuItem(item, index)
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {mobile && (
        <>
          {MENU_ITEMS.filter(({ inMobileSubMenu }) => !inMobileSubMenu).map((item, index) =>
            renderMenuItem(item, index)
          )}

          <div
            className={cn("loc_else", { "loc--opened": openMobileSubmenuState })}
            onClick={() => {
              setOpenMobileSubmenuState(!openMobileSubmenuState);
            }}
          >
            Еще <CaretIcon className="loc_caret" />
          </div>
          {openMobileSubmenuState && (
            <div className="loc_subMenu">
              <div className="loc_subMenu-1">
                {MENU_ITEMS.filter(({ inMobileSubMenu }) => inMobileSubMenu === 1).map(
                  (item, index) => renderMenuItem(item, index)
                )}
              </div>
              <div className="loc_subMenu-2">
                {MENU_ITEMS.filter(({ inMobileSubMenu }) => inMobileSubMenu === 2).map(
                  (item, index) => renderMenuItem(item, index)
                )}
              </div>
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
              <NavLink to={PAGES.MAIN} className="link_img">
                <img alt="загружаю" src={logo} className="loc_logo" />
              </NavLink>
            </div>
            <div className="loc_rightPart">
              <div className="loc_topPart">
                <div className="loc_logoText">
                  <h1 className="loc_1">Последний ангел</h1>
                  <h2 className="loc_2">
                    Приют для бездомных животных и инвалидов <br /> в г. Александров
                  </h2>
                </div>

                {renderButtons(ButtonSizes.MEDIUM)}
                {renderContacts()}
              </div>

              <div className="loc_bottomPart">{renderMenu(false)}</div>
            </div>
            <div className="loc_acquaintanceship">
              <NavLink to={PAGES.ACQUAINTANCESHIP} className="link_img">
                <div className="loc_button">
                  <img alt="загружаю" src={flowerSrc} /> Знакомство с приютом{" "}
                  <img alt="загружаю" src={flowerSrc} />
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="component-headerMobile">
          <div className="loc_wrapper">
            <div className="loc_leftPart">
              <NavLink to={PAGES.MAIN} className="link_img">
                <img alt="загружаю" src={logo} className="loc_logo" />
              </NavLink>
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

          <div className="loc_menu">
            {renderMenu(true)}

            <div className="loc_acquaintanceship">
              <NavLink to={PAGES.ACQUAINTANCESHIP} className="link_img">
                <div className="loc_button">
                  <img alt="загружаю" src={flowerSrc} /> Знакомство с приютом{" "}
                  <img alt="загружаю" src={flowerSrc} />
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </MobileView>
    </>
  );
}
