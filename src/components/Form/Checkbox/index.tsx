import React, { PropsWithChildren, useMemo } from "react";
import cn from "classnames";
import CheckIcon from "./icons/checkIcon.svg";
import { loadItem } from "utils/localStorage";
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
};

export const Checkbox: React.FC<PropsWithChildren<TProps>> = (props) => {
  const { className, value = 1, checked, onChange, label, disabled, required, ...rest } = props;

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
    </div>
  );
};

export default Checkbox;
