/*
  import Select from 'components/Form/Select'
 */

import React, { Ref, useEffect, useRef } from "react";
import cn from "classnames";
import SelectComponent, { Props } from "react-select";
import "./style.scss";

type TValue = { value: string; label: string };
type TProps = Props & {
  label?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  options: TValue[];
  onChange: (newValue: any, isLightClear?: boolean) => void;
  description?: string;
  innerRef?: Ref<any>;
};

const Select: React.FC<TProps> = ({
  label,
  className,
  options,
  placeholder = "Выберите значение",
  required,
  onChange,
  disabled,
  value,
  innerRef,
  description,
  ...rest
}) => {
  const val = value ? options.filter(({ value: v }) => v === value)[0] : undefined;

  const lightClearRef = useRef<string | null>(null);
  // Если изначально передали значение - храним тут состояние, что значение value инициировано
  const valueIsInitedRef = useRef(false);

  const lightClear = () => {
    // console.log('lightClear')
    lightClearRef.current = "on";
    (innerRef as any).current.clearValue();
    if (innerRef) {
      lightClearRef.current = "on";
      (innerRef as any).current.clearValue();
    }
  };

  useEffect(() => {
    if (innerRef) {
      (innerRef as any).current.lightClear = lightClear;
    }
  }, [innerRef]);

  const onChangeHandler = (val: any) => {
    if (lightClearRef.current === "on") {
      // При легком сбрасывании мы просто сбрасываем значения в селекте
      // и не вызываем событие onChange
      lightClearRef.current = null;
      onChange(val, true);
    } else {
      onChange(val);
    }
  };

  useEffect(() => {
    // Если заранее передали значение, то дергаем onChangeHandler, что значение установлено
    if (val !== undefined && !valueIsInitedRef.current) {
      valueIsInitedRef.current = true;
      onChangeHandler(val);
    }
  }, [val, value, options]);

  return (
    <div className={cn("component-select", className)}>
      {label && (
        <div className="loc_label">
          {label} {required && <span className="red">*</span>}
        </div>
      )}
      <div className="loc_select">
        <SelectComponent
          onChange={onChangeHandler}
          value={val}
          isDisabled={disabled}
          placeholder={placeholder}
          noOptionsMessage={() => "Ничего не найдено"}
          classNames={{
            control: (state) => (state.isFocused ? "loc_control loc--focused" : "loc_control"),
            container: () => "loc_container",
            dropdownIndicator: () => "loc_dropdownIndicator",
            clearIndicator: () => "loc_clearIndicator",
            menu: () => "loc_menu",
            menuList: () => "loc_menuList",
          }}
          options={options}
          ref={innerRef}
          {...rest}
        />
      </div>
      {description && <div className="form-element-description">{description}</div>}
    </div>
  );
};

export default Select;
