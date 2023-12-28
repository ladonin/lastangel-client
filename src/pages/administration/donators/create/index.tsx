import React, { useState, useRef, useMemo } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { DonatorsApi } from "api/donators";
import PAGES from "routing/routes";
import { TCommonDataRequest } from "api/types/donators";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import Form, { TParams } from "../_components/Form";
import "./style.scss";

const DonatorCreate: React.FC = () => {
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
    const { card, fullname } = paramsRef.current;

    if (!card || !fullname) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else {
      setErrorState("");
      setIsLoadingState(true);

      DonatorsApi.add(paramsRef.current as TCommonDataRequest)
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
    <div className="page-administration_donators_create">
      <h1>Регистрация донатора</h1>

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
          Донатор успешно добавлен ({paramsRef.current?.fullname})
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

export default DonatorCreate;
