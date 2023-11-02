/*
  import InputNumber from 'components/Form/InputNumber'
 */

import React, { ChangeEvent, useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import cn from "classnames";
import "./style.scss";

type TProps = {
  label?: string;
  className?: string;
  initValue?: number;
  min?: number;
  max?: number;
  required?: boolean;
  float?: number;
  disabled?: boolean;
  onChange: (val: number | string) => void;
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
  float = false,
}) => {
  const id = useMemo(() => uuidv4(), []);

  const [valueState, setValueState] = useState<number | string | undefined>(
    initValue !== undefined ? Number(initValue) : undefined
  );

  useEffect(() => {
    initValue !== undefined && valueState === undefined && setValueState(initValue);
  }, [initValue]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const floatNumbers = Number(float);
    if (floatNumbers) {
      console.log(e.target.value)
      const value = e.target.value
        .replaceAll(/[^0-9,.бБюЮ]/gi, "")
        .replaceAll(/[\.юЮбБ]+/gi, ",")
        .replaceAll(/[,]+/gi, ",");
      if (
        value.split(",").length > floatNumbers ||
        (value.split(",").length === floatNumbers && value.split(",")[1].length > floatNumbers)
      ) {
        return;
      }
      onChange(value);
      setValueState(value);
      return;
    }

    let value = parseInt(e.target.value.replaceAll(/\D/gi, ""), 10);
    value = Number.isNaN(value) ? 0 : value;
    value = value > max ? max : value;
    value = value < min ? min : value;
    onChange(value);
    setValueState(value);
  };

  const renderValue = () => {
    if (valueState === undefined) return "";
    return String(valueState).replaceAll(/\./gi, ",");
    // if (float) {
    //   const parts = String(valueState).split(",");
    //   if (parts.length === 2) {
    //     const decimals = parts[1];
    //     return `${Number(parts[0]).toLocaleString()},${decimals}`;
    //   }
    // }
    // return Number(valueState).toLocaleString();
  };

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
    </div>
  );
};

export default InputNumber;
