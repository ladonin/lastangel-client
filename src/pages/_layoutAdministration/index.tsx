import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useLocation } from "react-router";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import Footer from "pages/_commonComponents/footer";
import "./style.scss";
import PAGES from "routing/routes";
import Header from "pages/_commonComponents/header";
import { FeedbacksApi } from "api/feedbacks";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { quit } from "utils/user";
import { UserApi } from "api/user";
import EmailImage from "icons/email.png";

const LayoutAdministration: React.FC = () => {
  const { pathname } = useLocation();

  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  const navigate = useNavigate();
  const [showPageState, setShowPageState] = useState(false);

  useEffect(() => {
    UserApi.checkToken("admin").then((res) => {
      if (res === false) {
        navigate(PAGES.MAIN);
      } else {
        setShowPageState(true);
      }
    });
  }, []);

  const showAddButton = () =>
    pathname !== PAGES.ADMINISTRATION_PET_CREATE &&
    pathname.indexOf(PAGES.ADMINISTRATION_PET_UPDATE) === -1 &&
    pathname !== PAGES.ADMINISTRATION_COLLECTION_CREATE &&
    pathname.indexOf(PAGES.ADMINISTRATION_COLLECTION_UPDATE) === -1 &&
    pathname !== PAGES.ADMINISTRATION_DONATION_CREATE &&
    pathname.indexOf(PAGES.ADMINISTRATION_DONATION_UPDATE) === -1 &&
    pathname !== PAGES.ADMINISTRATION_DONATOR_CREATE &&
    pathname.indexOf(PAGES.ADMINISTRATION_DONATOR_UPDATE) === -1 &&
    pathname !== PAGES.ADMINISTRATION_NEWS_CREATE &&
    pathname.indexOf(PAGES.ADMINISTRATION_NEWS_UPDATE) === -1 &&
    pathname !== PAGES.ADMINISTRATION_STORY_CREATE &&
    pathname.indexOf(PAGES.ADMINISTRATION_STORY_UPDATE) === -1 &&
    pathname !== PAGES.ADMINISTRATION_MAIN_PAGE_PHOTOALBUM_UPDATE &&
    pathname !== PAGES.ADMINISTRATION_FEEDBACKS &&
    pathname !== PAGES.ADMINISTRATION_DOCUMENTS_UPDATE;

  // тут сделать проверку авторизации на защищенные страницы с применением location.pathname
  const [newFeedbacksState, setNewFeedbacksState] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkMail = () => {
    FeedbacksApi.getNewCount().then((res) => {
      setNewFeedbacksState(Number(res));
    });
  };

  useEffect(() => {
    checkMail();
    timerRef.current = setInterval(() => {
      checkMail();
    }, 60000);
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  return (
    showPageState && (
      <div className={cn("layout-administration layout", { "loc--isMobile": isMobileState })}>
        <Header />

        <div className="page">
          <div className="page_administrationMenu">
            <div
              className="loc_emails"
              onClick={() => {
                navigate(PAGES.ADMINISTRATION_FEEDBACKS);
              }}
            >
              {!!newFeedbacksState && <div className="loc_count">{newFeedbacksState}</div>}
              <img alt="nophoto" className="loc_emailButton" src={EmailImage} />
            </div>

            <h2
              className="loc_title"
              onClick={() => {
                const tabValue = pathname.split("/")[2];

                navigate(tabValue ? `${PAGES.ADMINISTRATION}?tab=${tabValue}` : PAGES.ADMINISTRATION);
              }}
            >
              Администрирование
            </h2>

            <Button
              className="loc_exitButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
              onClick={() => {
                quit();
              }}
            >
              Выход
            </Button>
            {showAddButton() && (
              <div className="loc_buttons">
                <Button
                  theme={ButtonThemes.SUCCESS}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  className="loc_addPetButton"
                  onClick={() => {
                    navigate(PAGES.ADMINISTRATION_PET_CREATE);
                  }}
                >
                  Добавить питомца
                </Button>
                <Button
                  theme={ButtonThemes.SUCCESS}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  className="loc_addCollectionButton"
                  onClick={() => {
                    navigate(PAGES.ADMINISTRATION_COLLECTION_CREATE);
                  }}
                >
                  Добавить сбор
                </Button>
                <Button
                  theme={ButtonThemes.SUCCESS}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  className="loc_addDonationButton"
                  onClick={() => {
                    navigate(PAGES.ADMINISTRATION_DONATION_CREATE);
                  }}
                >
                  Зарегистрировать донат
                </Button>
                <Button
                  theme={ButtonThemes.SUCCESS}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  className="loc_addDonatorButton"
                  onClick={() => {
                    navigate(PAGES.ADMINISTRATION_DONATOR_CREATE);
                  }}
                >
                  Зарегистрировать Донатора
                </Button>
                <Button
                  theme={ButtonThemes.SUCCESS}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  className="loc_addNewsButton"
                  onClick={() => {
                    navigate(PAGES.ADMINISTRATION_NEWS_CREATE);
                  }}
                >
                  Добавить новость
                </Button>
                <Button
                  theme={ButtonThemes.SUCCESS}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  className="loc_addStoryButton"
                  onClick={() => {
                    navigate(PAGES.ADMINISTRATION_STORY_CREATE);
                  }}
                >
                  Добавить историю
                </Button>
              </div>
            )}
          </div>

          <Outlet context={[checkMail]} />
        </div>
        <Footer />
      </div>
    )
  );
};

export default LayoutAdministration;
