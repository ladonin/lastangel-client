/*
  import Textarea from 'components/Form/Textarea'
  Текстареа
 */
import React, { ChangeEvent, useState, useEffect } from "react";
import cn from "classnames";
import "./style.scss";

type TProps = {
  label?: string;
  className?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  maxWords?: number;
  required?: boolean;
  onChange: (val: string) => void;
  description?: string;
};

const Textarea: React.FC<TProps> = ({
  label,
  className,
  value,
  placeholder,
  rows,
  maxWords,
  required,
  onChange,
  description,
}) => {
  const [valueState, setValueState] = useState(value || "");

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    if (!maxWords || maxWords >= val.length) {
      setValueState(val);
      onChange(val);
    }
  };

  useEffect(() => {
    if (value !== undefined && value !== null && value !== valueState) {
      setValueState(value);
    }
  }, [value]);

  return (
    <div className={cn("component-textarea", className)}>
      <div className="loc_wrapper">
        {label && (
          <label>
            {label} {required && <span className="red">*</span>}
          </label>
        )}

        <textarea
          value={valueState}
          onChange={onChangeHandler}
          placeholder={placeholder}
          rows={rows}
        />
        {!label && required && <span className="red loc_input_star">*</span>}

        {description && <div className="form-element-description">{description}</div>}
      </div>
      {maxWords && (
        <div className="loc_wordsRest">Осталось символов: {maxWords - valueState.length}</div>
      )}
    </div>
  );
};

export default Textarea;
