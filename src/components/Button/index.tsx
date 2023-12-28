/*
  import { Button, ButtonThemes, ButtonSizes } from 'components/Button'
 */

import React, { MouseEvent, ReactNode, useMemo } from "react";

import cn from "classnames";
import LoaderIcon from "components/LoaderIcon";
import "./style.scss";
import DeleteIcon from "icons/delete.svg";
import RestoreIcon from "icons/restore.svg";
import Tooltip from "../Tooltip";

export enum ButtonThemes {
  PRIMARY = "primary",
  DANGER = "danger",
  ORANGE = "orange",
  PINK = "pink",
  SUCCESS = "success",
  GREY = "grey",
  GHOST = "ghost",
  GHOST_BORDER = "ghostBorder",
  DELETE_ICON = "delete_icon",
  RESTORE_ICON = "restore_icon",
}

export enum ButtonSizes {
  GIANT = "giant",
  HUGE = "huge",
  BIG = "big",
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
}

type TProps = {
  theme: ButtonThemes;
  size?: ButtonSizes;
  children?: ReactNode;
  className?: string;
  title?: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: ReactNode | string;
  tooltip?: string;
};

export const Button: React.FC<TProps> = (props) => {
  const { theme, size = ButtonSizes.MEDIUM, children, className, onClick, isLoading, disabled = false, tooltip } = props;

  const themeIcon = useMemo(() => {
    if (theme === ButtonThemes.DELETE_ICON) return <DeleteIcon />;
    if (theme === ButtonThemes.RESTORE_ICON) return <RestoreIcon />;
    return null;
  }, [theme]);

  const onClickHandler = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    !disabled && !isLoading && onClick && onClick();
  };

  const renderButton = (classname?: string) => (
    <div
      className={cn(
        "component-button",
        `component-button_theme-${theme}`,
        { [`component-button_size-${size}`]: size },
        { "component-button_disabled": disabled },
        { "component-button_isLoading": isLoading },
        classname
      )}
      onClick={onClickHandler}
    >
      {isLoading ? (
        <LoaderIcon />
      ) : (
        <>
          {themeIcon}
          {children}
        </>
      )}
    </div>
  );

  return tooltip ? <Tooltip text={tooltip} className={className} content={renderButton()} /> : renderButton(className);
};
