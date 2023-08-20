/* 
  import Modal from 'components/Modal'
 */
import React, { ReactNode, useEffect, useState } from "react";
import cn from "classnames";
import Modal from "react-modal";
import { isMobile } from "react-device-detect";
import CloseIcon from "icons/close12.svg";
import "./style.scss";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  portalClassName?: string;
};

const ModalComponent = ({ isOpen, onClose, title, children, portalClassName }: TProps) => {
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  return isMobileState === null ? null : (
    <Modal
      isOpen={isOpen}
      portalClassName={portalClassName}
      ariaHideApp={false}
      style={{
        content: {
          top: isMobileState ? "0" : "50%",
          left: isMobileState ? "0" : "50%",
          right: "auto",
          bottom: "auto",
          marginRight: isMobileState ? "0" : "-50%",
          transform: isMobileState ? "translate(0, 0)" : "translate(-50%, -50%)",
          padding: 0,
          borderRadius: "8px",
          border: "1px solid #ade0aa",
          width: isMobileState ? "calc(100% - 16px)" : "auto",
          margin: isMobileState ? "8px" : undefined,
        },
        overlay: {
          backgroundColor: "rgba(128, 128, 128, 0.5)",
        },
      }}
      contentLabel={title}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      onRequestClose={onClose}
    >
      <div className={cn("component-modal", { "component-modal--isMobile": isMobileState })}>
        <div className="component-modal_header">
          <h2>{title}</h2>
          <CloseIcon className="component-modal_header_closeIcon" onClick={onClose} />
        </div>
        <div className="component-modal_content">{children}</div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
