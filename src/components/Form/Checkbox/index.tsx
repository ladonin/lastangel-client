/*
  import Checkbox from 'components/Form/Checkbox'
  Чекбокс
 */
import React, { PropsWithChildren } from "react";
import cn from "classnames";
import CheckIcon from "./icons/checkIcon.svg";
import "./style.scss";

type TProps = {
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  error?: boolean;
  required?: boolean;
  value?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
};

export const Checkbox: React.FC<PropsWithChildren<TProps>> = (props) => {
  const {
    className,
    value = 1,
    checked,
    onChange,
    label,
    disabled,
    required,
    description,
    ...rest
  } = props;

  return (
    <div className={cn("component-checkbox", className)}>
      {label && (
        <div className="loc_label">
          {label} {required && <span className="red">*</span>}
        </div>
      )}
      <label>
        <div className="loc_checkbox">
          <input
            {...rest}
            value={value}
            disabled={disabled}
            checked={checked}
            onChange={(e) => {
              onChange && onChange(e);
            }}
            type="checkbox"
            readOnly={!onChange}
          />
          <div className={cn("loc_box", { "loc--disabled": disabled })}>
            <CheckIcon
              className={cn("loc_check", {
                "loc--checked": checked,
                "loc--disabled": disabled,
              })}
            />
          </div>
        </div>
      </label>
      {description && <div className="form-element-description">{description}</div>}
    </div>
  );
};

export default Checkbox;
