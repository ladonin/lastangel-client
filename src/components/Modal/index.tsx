/* 
  import Modal from 'components/Modal'
 */
import React, { ReactNode, useMemo } from "react";
import cn from "classnames";
import Modal from "react-modal";
import CloseIcon from "icons/close12.svg";
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  portalClassName?: string;
};

const ModalComponent = ({ isOpen, onClose, title, children, portalClassName }: TProps) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  return (
    <Modal
      isOpen={isOpen}
      portalClassName={portalClassName}
      ariaHideApp={false}
      style={{
        content: {
          top: isMobile ? "0" : "50%",
          left: isMobile ? "0" : "50%",
          right: "auto",
          bottom: "auto",
          marginRight: isMobile ? "0" : "-50%",
          transform: isMobile ? "translate(0, 0)" : "translate(-50%, -50%)",
          padding: 0,
          borderRadius: "8px",
          border: "1px solid #ade0aa",
          width: isMobile ? "calc(100% - 16px)" : "auto",
          margin: isMobile ? "8px" : undefined,
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
      <div className={cn("component-modal", { "component-modal--isMobile": isMobile })}>
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
