import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionsApi } from "api/collections";
import PAGES from "routing/routes";
import Modal from "components/Modal";
import { TCommonDataRequest } from "api/types/collections";
import { COLLECTIONS_TYPE } from "constants/collections";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TResponse, TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const CollectionUpdate: React.FC = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const [errorState, setErrorState] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [isDeletingState, setIsDeletingState] = useState(false);
  const [isChangedState, setIsChangedState] = useState(false);
  const [isDeletedState, setIsDeletedState] = useState(false);
  const [modalDeleteIsOpenState, setModalDeleteIsOpenState] = useState(false);
  const paramsRef = useRef<TParams | null>(null);
  const responseRef = useRef<TResponse | undefined>(undefined);

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
      CollectionsApi.get(Number(id)).then((res) => {
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

    CollectionsApi.remove(Number(id)).then(() => {
      setIsDeletingState(false);
      setIsDeletedState(true);
      closeModalDelete();
    });
  };

  const updateHandler = () => {
    if (!paramsRef.current) return;

    const { name, type, status, animal_id, short_description, description, target_sum, main_image, main_image_is_deleted } =
      paramsRef.current;

    if (
      !name ||
      !type ||
      !status ||
      ((type === COLLECTIONS_TYPE.MEDICINE || type === COLLECTIONS_TYPE.BUY_FOR_PET) && !animal_id) ||
      !target_sum ||
      !short_description ||
      !description
    ) {
      setErrorState("Пожалуйста, заполните все обязательные поля");
    } else if (main_image_is_deleted === true && !main_image) {
      setErrorState("Пожалуйста, приложите главное фото");
    } else {
      setErrorState("");

      const {
        id: idReq,
        created,
        updated,
        main_image_prev,
        another_images_prev,
        main_image,
        another_images,
        main_image_is_deleted,
        ...data
      } = paramsRef.current;

      setIsUpdatingState(true);
      CollectionsApi.update(Number(id), {
        ...(data as Omit<TCommonDataRequest, "main_image" | "another_images">),
        main_image: main_image === 1 ? undefined : main_image,
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
        <title>Обновление сбора</title>
        <meta name="description" content="Обновление сбора" />
      </Helmet>
      <div className="page-administration_collections_update">
        <h1>
          Обновление сбора{" "}
          {!isDeletedState && (
            <Button
              className="loc_gotopageButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                navigate(`${PAGES.COLLECTION}/${id}`);
              }}
            >
              Перейти на страницу
            </Button>
          )}
        </h1>

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
          title="Удаление сбора"
          onClose={closeModalDelete}
          portalClassName="page-administration_collections_update_deleteModal"
        >
          Вы уверены, что хотите удалить сбор?
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

export default CollectionUpdate;
