/*
  import InputNumber from 'components/Form/InputNumber'
  Инпут числовой с pretty-форматированием
 */
import React, { ChangeEvent, useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import cn from "classnames";
import { numberFriendly } from "helpers/common";
import "./style.scss";

type TProps = {
  label?: string;
  className?: string;
  initValue?: number;
  min?: number;
  max?: number;
  required?: boolean;
  floatNumbers?: number;
  disabled?: boolean;
  onChange: (val: number | string) => void;
  description?: string;
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
  floatNumbers,
  description,
}) => {
  const id = useMemo(() => uuidv4(), []);

  const [valueState, setValueState] = useState<number | string | undefined>(
    initValue !== undefined ? Number(initValue) : undefined
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const withMinus = e.target.value.indexOf("-") === 0;
    if (floatNumbers) {
      let value = e.target.value
        .replaceAll(/[^0-9,.бБюЮ]/gi, "")
        .replaceAll(/[,юЮбБ]+/gi, ".")
        .replaceAll(/[.]+/gi, ".");
      if (
        value.split(".").length > floatNumbers ||
        (value.split(".").length === floatNumbers && value.split(".")[1].length > floatNumbers)
      ) {
        return;
      }
      if (withMinus && min < 0) value = `-${value}`;
      const valFloat = parseFloat(value);
      if (value) {
        value = valFloat > max ? String(max) : value;
        value = valFloat < min ? String(min) : value;
      }

      onChange(value);
      setValueState(numberFriendly(value, false));
      return;
    }

    let value = e.target.value.replaceAll(/[^0-9]/gi, "");
    if (value) {
      value = parseInt(value, 10) > max ? String(max) : value;
      value = parseInt(value, 10) < min ? String(min) : value;
    }

    if (withMinus && min < 0) value = `-${value}`;
    onChange(value);
    setValueState(numberFriendly(value, false));
  };

  const renderValue = () => {
    if (valueState === undefined) return "";
    return String(valueState).replace(",", ".");
  };

  useEffect(() => {
    initValue !== undefined && valueState === undefined && setValueState(initValue);
  }, [initValue]);

  return (
    <div className={cn("component-inputNumber", className)}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="red">*</span>}
        </label>
      )}

      <input
        value={renderValue()}
        disabled={disabled}
        id={id}
        type="text"
        onInput={onChangeHandler}
      />
      {description && <div className="form-element-description">{description}</div>}
    </div>
  );
};

export default InputNumber;
