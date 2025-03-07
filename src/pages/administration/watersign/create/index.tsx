/*
  import Update from 'pages/administration/metatags/update'
  Страница редактирования метатэгов сайта. Админка.
 */
import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { loadItem } from "utils/localStorage";
import PAGES from "routing/routes";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { WatersignApi } from "api/watersign";
import InputNumber from "components/Form/InputNumber";
import "./style.scss";

const WatersignCreate: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const [isBusyState, setIsBusyState] = useState(false);
  const [transparentState, setTransparentState] = useState<number>(10);

  const inputRef = useRef<HTMLInputElement>(null);

  const addWater = (image: File) => {
    setIsBusyState(true);
    WatersignApi.create(image, transparentState).finally(() => {
      setIsBusyState(false);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <>
      <Helmet>
        <title>Водяной знак на фото</title>
        <meta name="description" content="Водяной знак на фото" />
      </Helmet>
      <div className="page-administration_watersign_create">
        <h1>Водяной знак на фото</h1>

        <div className="loc_wrapper_textForm">
          <InputNumber
            label="Контраст водяного знака"
            initValue={10}
            disabled={isBusyState}
            min={0}
            max={100}
            onChange={(val) => {
              setTransparentState(+val);
            }}
            className="loc_formInputItem"
          />
          <label className="loc_label">
            <input
              ref={inputRef}
              type="file"
              disabled={isBusyState}
              accept=".png, .jpg, .jpeg"
              onChange={(event) => {
                event.target.files && addWater([...event.target.files][0]);
              }}
            />
            <span className={cn("loc_selectFile", { loc_isBusy: isBusyState })}>Выберите файл</span>
          </label>
          {isBusyState && <div>Идет обработка...</div>}
          <div className="loc_buttons">
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              disabled={isBusyState}
              onClick={() => navigate(`${PAGES.ADMINISTRATION}`)}
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WatersignCreate;
