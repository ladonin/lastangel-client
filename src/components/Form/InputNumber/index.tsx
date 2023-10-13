/*
  import InputNumber from 'components/Form/InputNumber'
 */

import React, { ChangeEvent, useMemo, useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import cn from "classnames";
import { loadItem } from "utils/localStorage";
import "./style.scss";
type TProps = {
  label?: string;
  className?: string;
  initValue?: number;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  onChange: (val: number) => void;
};
const InputNumber: React.FC<TProps> = ({
  label,
  className,
  required,
  onChange,
  initValue,
  disabled,
  min = 0,
  max = 9999999999,
}) => {
  const id = useMemo(() => uuidv4(), []);

  const [valueState, setValueState] = useState<number | undefined>(initValue !== undefined ? Number(initValue) : undefined);

  useEffect(() => {
    initValue !== undefined && valueState === undefined && setValueState(initValue);
  }, [initValue]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value.replaceAll(/\D/gi, ""), 10);
    value = Number.isNaN(value) ? 0 : value;
    value = value > max ? max : value;
    value = value < min ? min : value;
    onChange(value);
    setValueState(value);
  };

  return (
    <div className={cn("component-inputNumber", className)}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="red">*</span>}
        </label>
      )}
      <input
        value={valueState !== undefined ? valueState.toLocaleString() : ""}
        disabled={disabled}
        id={id}
        type="text"
        onInput={onChangeHandler}
      />
    </div>
  );
};

export default InputNumber;
