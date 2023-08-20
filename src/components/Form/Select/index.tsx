/*
  import Select from 'components/Form/Select'
 */

import React, { Ref } from "react";
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
  onChange: (newValue: any) => void;

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
  ...rest
}) => {
  const val = value ? options.filter(({ value: v }) => v === value)[0] : undefined;

  return (
    <div className={cn("component-select", className)}>
      {label && (
        <div className="loc_label">
          {label} {required && <span className="red">*</span>}
        </div>
      )}
      <div className="loc_select">
        <SelectComponent
          onChange={onChange}
          value={val}
          isDisabled={disabled}
          placeholder={placeholder}
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
    </div>
  );
};

export default Select;
