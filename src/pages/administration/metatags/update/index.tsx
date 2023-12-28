import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { MetatagsApi } from "api/metatags";
import PAGES from "routing/routes";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import Form from "../_components/Form";
import "./style.scss";

const MetatagsUpdate: React.FC = () => {
  const { id } = useParams();
  const [errorState, setErrorState] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [isChangedState, setIsChangedState] = useState(false);
  const paramsRef = useRef<{ [key: string]: any } | null>(null);
  const responseRef = useRef<string>("{}");
  const navigate = useNavigate();

  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [dataIsLoadedState, setDataIsLoadedState] = useState<boolean>(false);
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    MetatagsApi.get().then((res) => {
      setDataIsLoadedState(true);
      responseRef.current = res;
      forceUpdate();
      // setIsUpdatingState(false);
      // setIsChangedState(true);
      // requestRef.current = EMPTY_REQUEST;
    });
  }, []);

  const onChange = (data: { [key: string]: any }) => {
    setErrorState("");
    paramsRef.current = data;
    forceUpdate();
  };

  const updateHandler = () => {
    if (!paramsRef.current) return;
    setErrorState("");
    const data = paramsRef.current;
    setIsUpdatingState(true);
    MetatagsApi.update(JSON.stringify(data))
      .then(() => {
        setIsUpdatingState(false);
        setIsChangedState(true);
      })
      .catch(() => {
        setIsUpdatingState(false);
      });
  };

  return dataIsLoadedState !== null ? (
    <>
      <Helmet>
        <title>Обновление метатегов</title>
        <meta name="description" content="Обновление метатегов" />
      </Helmet>
      <div className="page-administration_metatags_update">
        <h1>Обновление метатегов</h1>

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
                onClick={() => navigate(`${PAGES.ADMINISTRATION}`)}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
        {isChangedState && (
          <div className="loc_wrapper_updatedSuccess">Метатеги успешно обновлены</div>
        )}
      </div>
    </>
  ) : null;
};

export default MetatagsUpdate;
