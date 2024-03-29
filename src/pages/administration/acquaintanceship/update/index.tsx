/*
  import Update from 'pages/administration/acquaintanceship/update'
  Страница редактирования данных (знакомство с приютом). Админка.
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import PAGES from "routing/routes";
import { AcquaintanceshipApi } from "api/acquaintanceship";
import { TCommonDataRequest } from "api/types/acquaintanceship";
import { loadItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TResponse, TParams } from "../_components/Form";
import "./style.scss";

const AcquaintanceshipUpdate: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [isChangedState, setIsChangedState] = useState(false);
  const [dataIsLoadedState, setDataIsLoadedState] = useState<boolean>(false);
  const paramsRef = useRef<TParams | null>(null);
  const responseRef = useRef<TResponse | undefined>(undefined);

  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const onChange = (data: TParams) => {
    setErrorState("");
    paramsRef.current = data;
    forceUpdate();
  };

  const updateHandler = () => {
    if (!paramsRef.current) return;

    const { description } = paramsRef.current;

    if (!description || description === "<p></p>\n") {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else {
      setErrorState("");

      const {
        id: idReq,
        created,
        updated,
        another_images_prev,
        another_images,
        ...data
      } = paramsRef.current;

      setIsUpdatingState(true);

      AcquaintanceshipApi.update({
        ...(data as Omit<TCommonDataRequest, "another_images">),
        another_images: another_images || [],
      })
        .then(() => {
          setIsUpdatingState(false);
          setIsChangedState(true);
        })
        .catch(() => {
          setIsUpdatingState(false);
        });
    }
  };

  useEffect(() => {
    AcquaintanceshipApi.get().then((res) => {
      if (res !== null) {
        setDataIsLoadedState(true);
        responseRef.current = res;
        forceUpdate();
      }
    });
  }, []);

  useEffect(() => {}, [dataIsLoadedState]);

  return dataIsLoadedState ? (
    <>
      <Helmet>
        <title>Обновление страницы о приюте</title>
        <meta name="description" content="Обновление новости" />
      </Helmet>
      <div className="page-administration_acquaintanceship_update">
        <h1>
          Обновление страницы о приюте{" "}
          <Button
            className="loc_gotopageButton"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
            onClick={() => {
              navigate(`${PAGES.ACQUAINTANCESHIP}`);
            }}
          >
            Перейти на страницу
          </Button>
        </h1>

        {!isChangedState && (
          <div className="loc_wrapper_textForm">
            <Button
              className="loc_saveButton margin_b24"
              theme={ButtonThemes.SUCCESS}
              isLoading={isUpdatingState}
              disabled={!paramsRef.current}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={updateHandler}
            >
              Обновить
            </Button>

            <Form onChange={onChange} data={responseRef.current} />
            {errorState && <div className="loc_error">{errorState}</div>}
            <div className="loc_buttons">
              <Button
                className="loc_saveButton"
                theme={ButtonThemes.SUCCESS}
                isLoading={isUpdatingState}
                disabled={!paramsRef.current}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                onClick={updateHandler}
              >
                Обновить
              </Button>
              <Button
                className="loc_cancelButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                disabled={isUpdatingState}
                onClick={() => navigate(`${PAGES.ADMINISTRATION}?tab=${pathname.split("/")[2]}`)}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
        {isChangedState && (
          <div className="loc_wrapper_updatedSuccess">
            Запись успешно обновлена
            <Button
              className="margin_t24"
              theme={ButtonThemes.GHOST_BORDER}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => setIsChangedState(false)}
            >
              Продолжить редактирование
            </Button>
          </div>
        )}
      </div>
    </>
  ) : null;
};

export default AcquaintanceshipUpdate;
