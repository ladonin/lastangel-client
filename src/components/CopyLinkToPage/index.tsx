/*
  import CopyLinkToPage from 'components/CopyLinkToPage'
 */

import React, { useEffect, useState } from "react";

import "./style.scss";
import { isMobile } from "react-device-detect";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { copyToBuffer } from "helpers/common";

type Props = {
  url: string;
  text?: string;
};
const CopyLinkToPage: React.FC<Props> = ({ url, text }) => {
  const [copyToBufferStatusState, setCopyToBufferStatusState] = useState<boolean | null>(null);
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
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
        size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.SMALL}
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
          Ссылка на данную страницу успешно скопирована в буфер обмена вашего {isMobile ? "мобильного устройства" : "компьютера"}.
        </div>
      )}
      {copyToBufferStatusState === false && (
        <div className="loc_copyToBufferStatus red">Ошибка. Пожалуйста, обратитесь к администратору.</div>
      )}
    </div>
  );
};

export default CopyLinkToPage;
