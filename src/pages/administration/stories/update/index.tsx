import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router";

import { useNavigate, useParams } from "react-router-dom";
import { StoriesApi } from "api/stories";
import PAGES from "routing/routes";
import Modal from "components/Modal";
import { TCommonDataRequest } from "api/types/stories";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import Form, { TResponse, TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const StoryUpdate: React.FC = () => {
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
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    id &&
      StoriesApi.get(Number(id)).then((res) => {
        if (res !== null) {
          setDataLoadedState(res);
          responseRef.current = res;
          forceUpdate();
        }
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

    StoriesApi.remove(Number(id)).then(() => {
      setIsDeletingState(false);
      setIsDeletedState(true);
      closeModalDelete();
    });
  };

  // создать в форме общую функцию валидатора
  const updateHandler = () => {
    if (!paramsRef.current) return;

    const { name, status, short_description, description } = paramsRef.current;

    if (!name || !short_description || !description || description === "<p></p>\n" || !status) {
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

      StoriesApi.update(Number(id), {
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

  const openModalDelete = () => {
    setModalDeleteIsOpenState(true);
  };

  return dataLoadedState !== null ? (
    <>
      <Helmet>
        <title>Обновление истории</title>
        <meta name="description" content="Обновление истории" />
      </Helmet>
      <div className="page-administration_pets_update">
        <h1>
          Обновление истории{" "}
          {!isDeletedState && (
            <Button
              className="loc_gotopageButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                navigate(`${PAGES.STORY}/${id}`);
              }}
            >
              Перейти на страницу
            </Button>
          )}
        </h1>

        {!isChangedState && !isDeletedState && (
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
                disabled={!paramsRef.current || isDeletedState || isDeletingState}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                onClick={updateHandler}
              >
                Обновить
              </Button>

              <Button
                className="loc_deleteButton"
                theme={ButtonThemes.DANGER}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                disabled={isUpdatingState || isDeletedState}
                isLoading={isDeletingState}
                onClick={() => openModalDelete()}
              >
                Удалить
              </Button>
              <Button
                className="loc_cancelButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                disabled={isUpdatingState || isDeletingState || isDeletedState}
                onClick={() => navigate(`${PAGES.ADMINISTRATION}?tab=${pathname.split("/")[2]}`)}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
        {isChangedState && (
          <div className="loc_wrapper_updatedSuccess">
            Запись успешно обновлена ({paramsRef.current?.name})
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
        {isDeletedState && <div className="loc_wrapper_removedSuccess">Запись удалена</div>}

        <Modal
          isOpen={modalDeleteIsOpenState}
          title="Удаление новости"
          onClose={closeModalDelete}
          portalClassName="page-administration_story_update_deleteModal"
        >
          Вы уверены, что хотите удалить историю?
          <div className="loc_buttons">
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.DANGER}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={removeHandler}
            >
              Удалить
            </Button>
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.SUCCESS}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
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

export default StoryUpdate;
