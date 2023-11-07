import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { AnimalsApi } from "api/animals";
import PAGES from "routing/routes";
import Modal from "components/Modal";
import { TCommonDataRequest } from "api/types/animals";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import Form, { TResponse, TParams } from "../_components/Form";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const PetUpdate: React.FC = () => {
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

  const [dataIsLoadedState, setDataIsLoadedState] = useState<boolean>(false);
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    id &&
      AnimalsApi.get(Number(id)).then((res) => {
        setDataIsLoadedState(true);
        responseRef.current = res;
        forceUpdate();
        // setIsUpdatingState(false);
        // setIsChangedState(true);
        // requestRef.current = EMPTY_REQUEST;
      });
  }, [id]);

  useEffect(() => {}, [dataIsLoadedState]);

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

    AnimalsApi.remove(Number(id)).then(() => {
      setIsDeletingState(false);
      setIsDeletedState(true);
      closeModalDelete();
    });
  };

  // создать в форме общую функцию валидатора
  const updateHandler = () => {
    if (!paramsRef.current) return;

    const {
      name,
      birthdate,
      short_description,
      description,
      sex,
      grafted,
      sterilized,
      kind,
      status,
      is_published,
      main_image,
      main_image_is_deleted,
    } = paramsRef.current;

    if (
      is_published === undefined ||
      !name ||
      !birthdate ||
      !short_description ||
      !description ||
      !sex ||
      !grafted ||
      !sterilized ||
      !kind ||
      !status
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

      AnimalsApi.update(Number(id), {
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

  return dataIsLoadedState !== null ? (
    <>
      <Helmet>
        <title>Обновление записи о питомце</title>
        <meta name="description" content="Обновление питомца" />
      </Helmet>
      <div className="page-administration_pets_update">
        <h1>
          Обновление записи о питомце{" "}
          {!isDeletedState && (
            <Button
              className="loc_gotopageButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                navigate(`${PAGES.PET}/${id}`);
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
          </div>
        )}
        {isDeletedState && <div className="loc_wrapper_removedSuccess">Запись удалена</div>}

        <Modal
          isOpen={modalDeleteIsOpenState}
          title="Удаление животного"
          onClose={closeModalDelete}
          portalClassName="page-administration_pets_update_deleteModal"
        >
          Вы уверены, что хотите удалить информацию о питомце?
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

export default PetUpdate;
