import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import { MetatagsApi } from "api/metatags";
import Header from "pages/_commonComponents/header";
import Footer from "pages/_commonComponents/footer";
import EmailImage from "icons/email.png";
import PAGES from "routing/routes";
import { isAdmin, quit } from "utils/user";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { FeedbacksApi } from "api/feedbacks";
import { loadItem, saveItem } from "utils/localStorage";
import "./style.scss";

const LayoutMain: React.FC = () => {
  // const location = useLocation();
  // console.log(location);
  const [isMobileState, setIsMobileState] = useState<boolean | undefined>(loadItem("isMobile"));
  const { pathname } = useLocation();
  const [prevPathnameState, setPrevPathnameState] = useState<string>("");
  const navigate = useNavigate();
  const [newFeedbacksState, setNewFeedbacksState] = useState<number>(0);
  const [metatagsState, setMetatagsState] = useState<any>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkMail = () => {
    isAdmin() &&
      FeedbacksApi.getNewCount().then((res) => {
        setNewFeedbacksState(Number(res));
      });
  };

  const getMetatags = () => metatagsState;

  useEffect(() => {
    // react-device-detect выдает всякую помойку иногда и не стоит ожидать,
    // что он отдаст только true или false
    if ((isMobile === true || isMobile === false) && isMobileState === undefined) {
      saveItem("isMobile", isMobile);
      setIsMobileState(isMobile);
    }
  }, [isMobile, isMobileState]);

  useEffect(() => {
    if (
      prevPathnameState.indexOf(`${PAGES.PET}/`) === 0 &&
      pathname.indexOf(`${PAGES.PET}/`) === 0
    ) {
      /* empty */
    } else {
      window.scrollTo(0, 0);
    }
    setPrevPathnameState(pathname);
  }, [pathname]);

  useEffect(() => {
    checkMail();
    MetatagsApi.get().then((res) => {
      res && setMetatagsState(JSON.parse(res));
      console.log(JSON.parse(res))
    });
    timerRef.current = setInterval(() => {
      checkMail();
    }, 60000);
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  // тут сделать проверку авторизации на защищенные страницы с применением location.pathname
  return isMobileState === undefined ? null : (
    <div className={cn("layout-main layout", { "loc--isMobile": isMobileState })}>
      <Header />

      <div className="page">
        {/* <div className="loc_warningMessage">
          <img alt="." src={dogAttentionImage} />
          Уважаемые пользователи, в настоящее время сайт находится 
          в финальной стадии разработки. Полная информация о приюте и его
          питомцах появится уже в ближайшем будущем.
        </div> */}

        {isAdmin() && (
          <div className="page_administrationMenu">
            <Button
              theme={ButtonThemes.SUCCESS}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                navigate(PAGES.ADMINISTRATION);
              }}
            >
              Администрирование
            </Button>

            <div
              className="loc_emails"
              onClick={() => {
                navigate(PAGES.ADMINISTRATION_FEEDBACKS);
              }}
            >
              {!!newFeedbacksState && <div className="loc_count">{newFeedbacksState}</div>}
              <img alt="." className="loc_emailButton" src={EmailImage} />
            </div>

            <Button
              theme={ButtonThemes.PRIMARY}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                quit();
              }}
            >
              Выход
            </Button>
          </div>
        )}

        {metatagsState && <Outlet context={{ checkMail, getMetatags }} />}
      </div>
      <Footer />
    </div>
  );
};

export default LayoutMain;
