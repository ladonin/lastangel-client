import React, { useState, useRef, useMemo } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import { CollectionsApi } from "api/collections";
import "./style.scss";

import PAGES from "routing/routes";

import { TCommonDataRequest } from "api/types/collections";
import { COLLECTIONS_TYPE } from "constants/collections";
import Form, { TParams } from "../_components/Form";

const CollectionCreate: React.FC = () => {
  const [errorState, setErrorState] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isAddedState, setIsAddedState] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const paramsRef = useRef<TParams>({});
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const onChange = (data: TParams) => {
    setErrorState("");
    paramsRef.current = data;
  };

  const newHandler = () => {
    paramsRef.current = {};
    setIsAddedState(false);
  };

  const saveHandler = () => {
    const {
      name,
      type,
      status,
      animal_id,
      short_description,
      description,
      main_image,
      another_images,
      target_sum,
    } = paramsRef.current;

    if (
      !name ||
      !type ||
      !status ||
      ((type === COLLECTIONS_TYPE.MEDICINE || type === COLLECTIONS_TYPE.BUY_FOR_PET) &&
        !animal_id) ||
      !target_sum ||
      !short_description ||
      !description
    ) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else if (!main_image) {
      setErrorState("Пожалуйста, приложите главное фото");
    } else {
      setErrorState("");

      const { main_image: a, another_images: b, ...data } = paramsRef.current;

      setIsLoadingState(true);

      CollectionsApi.add({
        ...(data as Omit<TCommonDataRequest, "main_image" | "another_images">),
        main_image,
        another_images: another_images || [],
      })
        .then(() => {
          setIsLoadingState(false);
          setIsAddedState(true);
          setTimeout(() => (paramsRef.current = {}), 0);
        })
        .catch(() => {
          setIsLoadingState(false);
        });
    }
  };

  return (
    <div className="page-administration_collections_create">
      <h1>Добавление сбора</h1>

      {!isAddedState && (
        <div className="loc_wrapper_textForm">
          <Form onChange={onChange} />
          {errorState && <div className="loc_error">{errorState}</div>}
          <div className="loc_buttons">
            <Button
              className="loc_saveButton"
              theme={ButtonThemes.SUCCESS}
              isLoading={isLoadingState}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={saveHandler}
            >
              Сохранить
            </Button>

            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
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
          Сбор успешно добавлен ({paramsRef.current?.name})
          <Button
            className="loc_addElseButton"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            onClick={newHandler}
          >
            Добавить еще
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionCreate;
