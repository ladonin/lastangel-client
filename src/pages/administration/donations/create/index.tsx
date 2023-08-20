import React, { useEffect, useState, useRef } from "react";

import { isMobile } from "react-device-detect";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { DonationsApi } from "api/donations";
import PAGES from "routing/routes";
import { TCommonDataRequest } from "api/types/donations";
import { DONATIONS_TYPES } from "constants/donations";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const DonationCreate: React.FC = () => {
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
    const { sum, target_id, type } = paramsRef.current;

    if (!sum || !type || (!target_id && (type === DONATIONS_TYPES.PET || type === DONATIONS_TYPES.COLLECTION))) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else {
      setErrorState("");
      setIsLoadingState(true);

      DonationsApi.add(paramsRef.current as TCommonDataRequest)
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
    <div className="page-administration_donations_create">
      <h1>Регистрация доната</h1>

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
          Донат успешно добавлен
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

export default DonationCreate;
