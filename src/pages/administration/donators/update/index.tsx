import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { DonatorsApi } from "api/donators";
import PAGES from "routing/routes";
import Modal from "components/Modal";
import { TCommonDataRequest } from "api/types/donators";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TResponse, TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const DonatorUpdate: React.FC = () => {
  const { id } = useParams();
  const [errorState, setErrorState] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [isDeletingState, setIsDeletingState] = useState(false);
  const [isChangedState, setIsChangedState] = useState(false);
  const [isDeletedState, setIsDeletedState] = useState(false);
  const [modalDeleteIsOpenState, setModalDeleteIsOpenState] = useState(false);
  const paramsRef = useRef<TParams | null>(null);
  const responseRef = useRef<TResponse | undefined>(undefined);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [dataLoadedState, setDataLoadedState] = useState<TResponse | null>(null);
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  useEffect(() => {
    id &&
      DonatorsApi.get(Number(id)).then((res) => {
        setDataLoadedState(res);
        responseRef.current = res;
        forceUpdate();
        // setIsUpdatingState(false);
        // setIsChangedState(true);
        // requestRef.current = EMPTY_REQUEST;
      });
  }, [id]);

  useEffect(() => {}, [dataLoadedState]);

  const onChange = (data: TParams) => {
    setErrorState("");
    paramsRef.current = data;
    forceUpdate();
  };

  const closeModalDelete = () => {
    setModalDeleteIsOpenState(false);
  };

  const removeHandler = () => {
    setIsDeletingState(true);

    DonatorsApi.remove(Number(id)).then(() => {
      setIsDeletingState(false);
      setIsDeletedState(true);
      closeModalDelete();
    });
  };

  const updateHandler = () => {
    if (!paramsRef.current) return;

    const { card, fullname } = paramsRef.current;

    if (!card || !fullname) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else {
      setErrorState("");

      const { id: idReq, created, updated, ...data } = paramsRef.current;

      setIsUpdatingState(true);
      DonatorsApi.update(Number(id), data as TCommonDataRequest)
        .then(() => {
          setIsUpdatingState(false);
          setIsChangedState(true);
        })
        .catch(() => {
          setIsUpdatingState(false);
        });
    }
  };

  const openModalDelete = () => {
    setModalDeleteIsOpenState(true);
  };

  return dataLoadedState !== null ? (
    <>
      <Helmet>
        <title>Обновление данных о донаторе</title>
        <meta name="description" content="Обновление данных о донаторе" />
      </Helmet>
      <div className="page-administration_donators_update">
        <h1>Обновление данных о донаторе</h1>

        {!isChangedState && !isDeletedState && (
          <div className="loc_wrapper_textForm">
            <Form onChange={onChange} data={responseRef.current} />
            {errorState && <div className="loc_error">{errorState}</div>}
            <div className="loc_buttons">
              <Button
                className="loc_saveButton"
                theme={ButtonThemes.SUCCESS}
                isLoading={isUpdatingState}
                disabled={!paramsRef.current || isDeletedState || isDeletingState}
                size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                onClick={updateHandler}
              >
                Обновить
              </Button>

              <Button
                className="loc_deleteButton"
                theme={ButtonThemes.DANGER}
                size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                disabled={isUpdatingState || isDeletedState}
                isLoading={isDeletingState}
                onClick={() => openModalDelete()}
              >
                Удалить
              </Button>
              <Button
                className="loc_cancelButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                disabled={isUpdatingState || isDeletingState || isDeletedState}
                onClick={() => navigate(`${PAGES.ADMINISTRATION}?tab=${pathname.split("/")[2]}`)}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
        {isChangedState && <div className="loc_wrapper_updatedSuccess">Запись успешно обновлена</div>}
        {isDeletedState && <div className="loc_wrapper_removedSuccess">Запись удалена</div>}

        <Modal
          isOpen={modalDeleteIsOpenState}
          title="Удаление донатора"
          onClose={closeModalDelete}
          portalClassName="page-administration_donators_update_deleteModal"
        >
          Вы уверены, что хотите удалить донатора?
          <div className="loc_buttons">
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.DANGER}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={removeHandler}
            >
              Удалить
            </Button>
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={closeModalDelete}
            >
              Отмена
            </Button>
          </div>
        </Modal>
      </div>
    </>
  ) : null;
};

export default DonatorUpdate;
