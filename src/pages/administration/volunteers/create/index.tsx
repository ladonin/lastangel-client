import React, { useState, useRef, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { VolunteersApi } from "api/volunteers";
import PAGES from "routing/routes";
import { TCommonDataRequest } from "api/types/volunteers";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import Form, { TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));

import "./style.scss";

const VolunteerCreate: React.FC = () => {
  const { pathname } = useLocation();
  const [errorState, setErrorState] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isAddedState, setIsAddedState] = useState(false);
  const navigate = useNavigate();

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
      fio,
      birthdate,
      short_description,
      description,
      is_published,
      main_image,
      another_images,
      video1,
      video2,
      video3,
      vk_link,
      ok_link,
      inst_link,
      phone,
    } = paramsRef.current;

    if (is_published === undefined || !fio || !description || !short_description) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else if (!main_image) {
      setErrorState("Пожалуйста, приложите главное фото");
    } else {
      setErrorState("");

      const { main_image: a, another_images: b, ...data } = paramsRef.current;

      setIsLoadingState(true);

      VolunteersApi.add({
        ...(data as Omit<TCommonDataRequest, "main_image" | "another_images">),
        main_image,
        another_images: another_images || [],
      })
        .then(() => {
          setIsLoadingState(false);
          setIsAddedState(true);
          // Для отображения клички в итоге и сброса уже потом
          setTimeout(() => {
            paramsRef.current = {};
          }, 0);
        })
        .catch(() => {
          setIsLoadingState(false);
        });
    }
  };

  return (
    <div className="page-administration_volunteers_create">
      <h1>Добавление волонтера</h1>

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
          Волонтер успешно добавлен ({paramsRef.current?.fio})
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

export default VolunteerCreate;
