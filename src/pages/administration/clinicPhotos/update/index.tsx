/*
  import Update from 'pages/administration/clinicPhotos/update'
  Страница редактирования данных (страница фотографий клиники). Админка.
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { ClinicPhotosApi } from "api/clinicPhotos";
import PAGES from "routing/routes";
import { loadItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Form, { TResponse, TParams } from "../_components/Form";
import "./style.scss";

const ClinicPhotosUpdate: React.FC = () => {
  const isMobile = loadItem("isMobile");
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
    setErrorState("");
    setIsUpdatingState(true);
    ClinicPhotosApi.update({
      another_images_for_delete: paramsRef.current.another_images_for_delete,
      another_images: paramsRef.current.another_images || [],
    })
      .then(() => {
        setIsUpdatingState(false);
        setIsChangedState(true);
      })
      .catch(() => {
        setIsUpdatingState(false);
      });
  };

  useEffect(() => {
    ClinicPhotosApi.get().then((res) => {
      setDataIsLoadedState(true);
      responseRef.current = res;
      forceUpdate();
    });
  }, []);

  useEffect(() => {}, [dataIsLoadedState]);

  return (
    <>
      <Helmet>
        <title>Обновление фотографий клиники приюта</title>
        <meta name="description" content="Обновление фотографий клиники приюта" />
      </Helmet>
      <div className="page-administration_clinic-photos_update">
        <h1>Обновление фотографий клиники приюта</h1>

        {!isChangedState && (
          <div className="loc_wrapper_textForm">
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
                onClick={() => navigate(PAGES.ADMINISTRATION)}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
        {isChangedState && (
          <div className="loc_wrapper_updatedSuccess">Фото клиники успешно обновлены</div>
        )}
      </div>
    </>
  );
};

export default ClinicPhotosUpdate;
