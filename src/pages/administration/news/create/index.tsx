import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { isMobile } from "react-device-detect";
import { TCommonDataRequest } from "api/types/news";
import PAGES from "routing/routes";
import { NewsApi } from "api/news";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const NewsCreate: React.FC = () => {
  const [errorState, setErrorState] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isAddedState, setIsAddedState] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const paramsRef = useRef<TParams>({});
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  const onChange = (data: TParams) => {
    setErrorState("");
    paramsRef.current = data;
  };

  const newHandler = () => {
    paramsRef.current = {};
    setIsAddedState(false);
  };

  const saveHandler = () => {
    const { name, status, short_description, description, another_images } = paramsRef.current;

    if (!name || !short_description || !description || description === "<p></p>\n" || !status) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else {
      setErrorState("");

      const { another_images: b, ...data } = paramsRef.current;

      setIsLoadingState(true);

      NewsApi.add({
        ...(data as Omit<TCommonDataRequest, "another_images">),
        another_images: another_images || [],
      })
        .then(() => {
          setIsLoadingState(false);
          setIsAddedState(true);
          paramsRef.current = {};
        })
        .catch(() => {
          setIsLoadingState(false);
        });
    }
  };

  return (
    <div className="page-administration_news_create">
      <h1>Добавление новости</h1>

      {!isAddedState && (
        <div className="loc_wrapper_textForm">
          <Form onChange={onChange} />
          {errorState && <div className="loc_error">{errorState}</div>}
          <div className="loc_buttons">
            <Button
              className="loc_saveButton"
              theme={ButtonThemes.SUCCESS}
              isLoading={isLoadingState}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={saveHandler}
            >
              Сохранить
            </Button>

            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              disabled={isLoadingState}
              onClick={() => navigate(`${PAGES.ADMINISTRATION}?tab=${pathname.split("/")[2]}`)}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
      {isAddedState && (
        <div className="loc_wrapper_addedSuccess">
          Новость успешно добавлена
          <Button
            className="loc_addElseButton"
            theme={ButtonThemes.PRIMARY}
            size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            onClick={newHandler}
          >
            Добавить еще
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsCreate;
