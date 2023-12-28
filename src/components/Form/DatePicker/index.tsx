/*
  import DatePicker from 'components/Form/DatePicker'

  Дейтпикер
 */

import React, { useState, useEffect } from "react";

import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import cn from "classnames";
import ru from "date-fns/locale/ru";

import { getTimestamp } from "helpers/common";

import "./style.scss";

registerLocale("ru", ru);

type TProps = {
  label?: string;
  className?: string;
  value?: Date;
  required?: boolean;
  onChange: (val: number) => void;
  description?: string;
  openToDate?: Date;
};
const DatePicker: React.FC<TProps> = ({
  label,
  className,
  required,
  onChange,
  description,
  value,
  openToDate = undefined,
}) => {
  const [valueState, setValueState] = useState<Date | null>(value || null);

  useEffect(() => {
    value && value !== valueState && setValueState(value);
  }, [value]);

  const onChangeHandler = (date: Date | null) => {
    setValueState(date);
    onChange(date ? getTimestamp(date) : 0);
  };

  return (
    <div className={cn("component-datePicker", className)}>
      {label && (
        <div className="loc_label">
          {label} {required && <span className="red">*</span>}
        </div>
      )}
      <div className="loc_datepicker">
        <ReactDatePicker
          openToDate={openToDate}
          showYearDropdown
          locale="ru"
          showMonthYearPicker
          popperClassName="loc_popper"
          showFullMonthYearPicker
          showPopperArrow={false}
          dateFormat="yyyy/MM/dd"
          selected={valueState}
          maxDate={new Date()}
          onChange={onChangeHandler}
        />
      </div>
      {description && <div className="form-element-description">{description}</div>}
    </div>
  );
};

export default DatePicker;
