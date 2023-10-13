import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useLocation } from "react-router";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import Footer from "pages/_commonComponents/footer";
import "./style.scss";
import { loadItem, saveItem } from "utils/localStorage";
import PAGES from "routing/routes";
import Header from "pages/_commonComponents/header";
import { FeedbacksApi } from "api/feedbacks";
import { AnimalsApi } from "api/animals";
import { CollectionsApi } from "api/collections";
import { DonationsApi } from "api/donations";
import { NewsApi } from "api/news";
import { StoriesApi } from "api/stories";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { quit } from "utils/user";
import { UserApi } from "api/user";
import EmailImage from "icons/email.png";

const LayoutAdministration: React.FC = () => {
  const { pathname } = useLocation();

  const [isMobileState, setIsMobileState] = useState<boolean | undefined>(loadItem("isMobile"));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if ((isMobile === true || isMobile === false) && isMobileState === undefined) {
      saveItem("isMobile", isMobile);
      setIsMobileState(isMobile);
    }
  }, [isMobile, isMobileState]);
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

  return isMobileState !== undefined && showPageState ? (
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
              <Button
                className="loc_mainPagePhotoalbumButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                onClick={() => navigate(PAGES.ADMINISTRATION_MAIN_PAGE_PHOTOALBUM_UPDATE)}
              >
                Фотоальбом главной страницы
              </Button>
              <Button
                className="loc_documentsButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                onClick={() => navigate(PAGES.ADMINISTRATION_DOCUMENTS_UPDATE)}
              >
                Фото документов приюта
              </Button>

              <Button
                className="loc_documentsButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                onClick={() => navigate(PAGES.ADMINISTRATION_CLINIC_PHOTOS_UPDATE)}
              >
                Фото клиники
              </Button>

              <div className="loc_block_1">
                <div className="loc_block_1_title">Скачать данные о питомцах в</div>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => AnimalsApi.downloadData("txt")}
                >
                  txt
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => AnimalsApi.downloadData("html")}
                >
                  html
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => AnimalsApi.downloadData("csv")}
                >
                  csv
                </Button>
              </div>

              <div className="loc_block_1">
                <div className="loc_block_1_title">Скачать данные о сборах в</div>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => CollectionsApi.downloadData("txt")}
                >
                  txt
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => CollectionsApi.downloadData("html")}
                >
                  html
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => CollectionsApi.downloadData("csv")}
                >
                  csv
                </Button>
              </div>

              <div className="loc_block_1">
                <div className="loc_block_1_title">Скачать данные о донатах в</div>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => DonationsApi.downloadData("txt")}
                >
                  txt
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => DonationsApi.downloadData("html")}
                >
                  html
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => DonationsApi.downloadData("csv")}
                >
                  csv
                </Button>
              </div>

              <div className="loc_block_1">
                <div className="loc_block_1_title">Скачать новости в</div>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => NewsApi.downloadData("txt")}
                >
                  txt
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => NewsApi.downloadData("html")}
                >
                  html
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => NewsApi.downloadData("csv")}
                >
                  csv
                </Button>
              </div>

              <div className="loc_block_1">
                <div className="loc_block_1_title">Скачать истории в</div>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => StoriesApi.downloadData("txt")}
                >
                  txt
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => StoriesApi.downloadData("html")}
                >
                  html
                </Button>
                <Button
                  theme={ButtonThemes.GHOST_BORDER}
                  size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
                  onClick={() => StoriesApi.downloadData("csv")}
                >
                  csv
                </Button>
              </div>
            </div>
          )}
        </div>

        <Outlet context={[checkMail]} />
      </div>
      <Footer />
    </div>
  ) : null;
};

export default LayoutAdministration;
