import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { MainPhotoalbumApi } from "api/mainphotoalbum";
import PAGES from "routing/routes";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import Form, { TResponse, TParams } from "../_components/Form";
import "./style.scss";

const MainPagePhotoalbumUpdate: React.FC = () => {
  const [errorState, setErrorState] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  const [isChangedState, setIsChangedState] = useState(false);

  const paramsRef = useRef<TParams | null>(null);
  const responseRef = useRef<TResponse | undefined>(undefined);

  const navigate = useNavigate();

  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [dataIsLoadedState, setDataIsLoadedState] = useState<boolean>(false);
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    MainPhotoalbumApi.get().then((res) => {
      setDataIsLoadedState(true);
      responseRef.current = res;
      forceUpdate();
    });
  }, []);

  useEffect(() => {}, [dataIsLoadedState]);

  const onChange = (data: TParams) => {
    setErrorState("");
    paramsRef.current = data;
    forceUpdate();
  };

  const updateHandler = () => {
    if (!paramsRef.current) return;
    setErrorState("");
    setIsUpdatingState(true);
    MainPhotoalbumApi.update({
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

  return (
    <>
      <Helmet>
        <title>Обновление фотоальбома главной страницы</title>
        <meta name="description" content="Обновление фотоальбома главной страницы" />
      </Helmet>
      <div className="page-administration_mainphotoalbum_update">
        <h1>Обновление фотоальбома главной страницы</h1>

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
          <div className="loc_wrapper_updatedSuccess">Фотоальбом успешно обновлен</div>
        )}
      </div>
    </>
  );
};

export default MainPagePhotoalbumUpdate;
