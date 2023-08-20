import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { Link } from "react-router-dom";
import { isAuthorized } from "utils/user";
import PAGES from "routing/routes";

import "./styles.scss";

// продолжить с
// текстом логотипа
// кнопок
// иконок контактов
export default function Index() {
  return (
    <>
      <BrowserView>
        <div className="component-footer">
          <div className="component-footer_wrapper">
            {!isAuthorized() && (
              <Link to={PAGES.SIGNIN} className="link_1 loc_link">
                Войти
              </Link>
            )}
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="component-footer">
          <div className="component-footer_wrapper">
            {!isAuthorized() && (
              <Link to={PAGES.SIGNIN} className="link_1 loc_link">
                Войти
              </Link>
            )}
          </div>
        </div>
      </MobileView>
    </>
  );
}
