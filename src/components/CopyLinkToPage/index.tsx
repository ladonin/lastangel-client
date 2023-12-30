/*
  import CopyLinkToPage from 'components/CopyLinkToPage'
  Кнопка копирования ссылки на указанную страницу в буфер
 */
import React, { useEffect, useState } from "react";
import { loadItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { copyToBuffer } from "helpers/common";
import "./style.scss";

type Props = {
  url: string;
  text?: string;
  targetText?: string;
};

const CopyLinkToPage: React.FC<Props> = ({ url, text, targetText }) => {
  const [copyToBufferStatusState, setCopyToBufferStatusState] = useState<boolean | null>(null);
  const isMobile = loadItem("isMobile");

  useEffect(() => {
    if (copyToBufferStatusState !== null) {
      setTimeout(() => {
        setCopyToBufferStatusState(null);
      }, 10000);
    }
  }, [copyToBufferStatusState]);

  return (
    <div className="component-copyLinkToPage">
      <Button
        className="loc_copyLinkButton"
        theme={ButtonThemes.GHOST_BORDER}
        size={isMobile ? ButtonSizes.GIANT : ButtonSizes.SMALL}
        onClick={() => {
          copyToBuffer(url)
            .then(() => setCopyToBufferStatusState(true))
            .catch(() => setCopyToBufferStatusState(false));
        }}
      >
        {text || "Поделиться страницей с друзьями"}
      </Button>
      {copyToBufferStatusState === true && (
        <div className="loc_copyToBufferStatus">
          Ссылка {targetText || "на данную страницу"} успешно скопирована в буфер обмена вашего{" "}
          {isMobile ? "мобильного устройства" : "компьютера"}.
        </div>
      )}
      {copyToBufferStatusState === false && (
        <div className="loc_copyToBufferStatus red">
          Ошибка. Пожалуйста, обратитесь к администратору.
        </div>
      )}
    </div>
  );
};

export default CopyLinkToPage;
