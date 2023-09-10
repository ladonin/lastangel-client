import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import cn from "classnames";
import { isMobile, isYandex } from "react-device-detect";
import Header from "pages/_commonComponents/header";
import Footer from "pages/_commonComponents/footer";
import EmailImage from "icons/email.png";
import "./style.scss";
import PAGES from "routing/routes";
import dogAttentionImage from "icons/dog_attention.png";
import { isAdmin, quit } from "../../utils/user";
import { Button, ButtonSizes, ButtonThemes } from "../../components/Button";
import { FeedbacksApi } from "../../api/feedbacks";

const LayoutMain: React.FC = () => {
  // const location = useLocation();
  // console.log(location);
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  const { pathname } = useLocation();
  const [prevPathnameState, setPrevPathnameState] = useState<string>("");
  const navigate = useNavigate();
  const [newFeedbacksState, setNewFeedbacksState] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkMail = () => {
    isAdmin() &&
      FeedbacksApi.getNewCount().then((res) => {
        setNewFeedbacksState(Number(res));
      });
  };
  const scrollHandlerTimerRef = useRef<any>();
  useEffect(() => {
    setIsMobileState(isMobile);

    // Костыль для яндекс-браузера -->
    // если сильно крутануть скролл до самого низа,
    // то экран видимый и экран фактический смещаются относительно друг друга
    // и нажатие происходит не на то место, куда кликаешь, а выше
    const handleScroll = () => {
      if (window.scrollY + document.documentElement.clientHeight + 8 >= document.documentElement.scrollHeight) {
        scrollHandlerTimerRef.current && clearTimeout(scrollHandlerTimerRef.current);
        scrollHandlerTimerRef.current = setTimeout(
          () => window.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight - 7),
          0
        );
      }
    };
    isYandex && isMobile && window.addEventListener("scroll", handleScroll);
    return () => {
      isYandex && isMobile && window.removeEventListener("scroll", handleScroll);
    };
    // <-- Костыль для яндекс-браузера
  }, [isMobile, isYandex]);

  useEffect(() => {
    if (prevPathnameState.indexOf(`${PAGES.PET}/`) === 0 && pathname.indexOf(`${PAGES.PET}/`) === 0) {
      /* empty */
    } else {
      window.scrollTo(0, 0);
    }
    setPrevPathnameState(pathname);
  }, [pathname]);

  useEffect(() => {
    checkMail();
    timerRef.current = setInterval(() => {
      checkMail();
    }, 60000);
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  // тут сделать проверку авторизации на защищенные страницы с применением location.pathname
  return (
    <div className={cn("layout-main layout", { "loc--isMobile": isMobileState })}>
      <Header />

      <div className="page">
        <div className="loc_warningMessage">
          <img alt="nophoto" src={dogAttentionImage} />
          Уважаемые пользователи, в настоящее время сайт находится в финальной стадии разработки. Полная информация о приюте и его
          питомцах появится уже в ближайшем будущем.
        </div>

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
              <img className="loc_emailButton" src={EmailImage} />
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

        <Outlet context={[checkMail]} />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutMain;
