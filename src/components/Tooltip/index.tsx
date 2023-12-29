/* 
  import Tooltip from 'components/Tooltip'
  Подсказка (тултип)
 */
import React, { ReactNode, useMemo } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./style.scss";

type TProps = {
  content: ReactNode;
  text: string;
  className?: string;
};

const Tooltip = ({ content, text, className }: TProps) => {
  const id = useMemo(() => `tooltip-id-${Math.random()}`, []);

  return (
    <>
      <div
        style={{ width: "fit-content" }}
        data-tooltip-id={id}
        data-tooltip-content={text}
        className={className}
      >
        {content}
      </div>
      <ReactTooltip id={id} />
    </>
  );
};

export default Tooltip;
