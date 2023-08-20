import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router";
import { AnimalsApi } from "api/animals";
import PAGES from "routing/routes";
import { TCommonDataRequest } from "api/types/animals";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const PetCreate: React.FC = () => {
  const { pathname } = useLocation();
  const [errorState, setErrorState] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isAddedState, setIsAddedState] = useState(false);
  const navigate = useNavigate();

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
    const {
      name,
      short_description,
      description,
      sex,
      grafted,
      sterilized,
      category,
      status,
      is_published,
      main_image,
      another_images,
    } = paramsRef.current;

    if (
      is_published === undefined ||
      !name ||
      !short_description ||
      !description ||
      !sex ||
      !grafted ||
      !sterilized ||
      !category ||
      !status
    ) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else if (!main_image) {
      setErrorState("Пожалуйста, приложите главное фото");
    } else {
      setErrorState("");

      const { main_image: a, another_images: b, ...data } = paramsRef.current;

      setIsLoadingState(true);

      AnimalsApi.add({
        ...(data as Omit<TCommonDataRequest, "main_image" | "another_images">),
        main_image,
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
    <div className="page-administration_pets_create">
      <h1>Добавление питомца</h1>

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
              onClick={() => {
                navigate(`${PAGES.ADMINISTRATION}?tab=${pathname.split("/")[2]}`);
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
      {isAddedState && (
        <div className="loc_wrapper_addedSuccess">
          Животное успешно добавлено
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

export default PetCreate;
