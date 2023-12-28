/*
  import InputText from 'components/Form/InputText'
 */

import React, { ChangeEvent, RefObject, useMemo, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import cn from "classnames";
import { loadItem } from "utils/localStorage";
import "./style.scss";
import { preparePhoneInputVal } from "../../../helpers/common";

type TProps = {
  label?: string;
  className?: string;
  initValue?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (val: string) => void;
  innerRef?: RefObject<any>; // Нужен, чтобы, например, применить валидацию
};
const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const PHONE_REGEXP = /^\+?[0-9\-\s()]*$/iu;

const needValidate = (type?: string) => !!type && (type === "email" || type === "phone");

const InputText: React.FC<TProps> = ({
  label,
  className,
  required,
  onChange,
  initValue = "",
  disabled,
  innerRef,
  placeholder,
  description,
  type,
}) => {
  const [validState, setValidState] = useState<boolean>(true);
  const valRef = useRef(initValue);
  const id = useMemo(() => uuidv4(), []);
  const [valueState, setValueState] = useState("");
  const validateHandler = () => {
    if (
      (type === "email" && valRef.current && !EMAIL_REGEXP.test(valRef.current)) ||
      (type === "phone" && valRef.current && !PHONE_REGEXP.test(valRef.current))
    ) {
      setValidState(false);
      return false;
    }
    setValidState(true);

    return true;
  };

  useEffect(() => {
    // Валидация, когда значение помечено красным
    // Чтобы попытаться проверить на "корректность" и вернуть на Valid
    if (!validState && needValidate(type)) {
      validateHandler();
    }
  }, [valueState, validState]);

  useEffect(() => {
    if (innerRef?.current) {
      innerRef.current.validate = validateHandler;
    }
  }, []);
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === "phone") {
      e.target.value = preparePhoneInputVal(e.target.value);
    }

    onChange(e.target.value);
    valRef.current = e.target.value;
    needValidate(type) && setValueState(e.target.value);
  };
  const clear = () => {
    if (innerRef) {
      innerRef.current.value = "";
      onChange("");
      setValueState("");
    }
  };
  useEffect(() => {
    if (innerRef?.current) {
      innerRef.current.clearValue = clear;
    }
  }, []);

  return (
    <div className={cn("component-inputText", className, { "loc--notvalid": !validState })}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="red">*</span>}
        </label>
      )}

      <input
        placeholder={placeholder}
        ref={innerRef}
        disabled={disabled}
        id={id}
        defaultValue={initValue}
        type={type || "text"}
        onInput={onChangeHandler}
      />

      {!label && required && <span className="red loc_input_star">*</span>}
      {description && <div className="form-element-description">{description}</div>}
    </div>
  );
};

export default InputText;
