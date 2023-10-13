/*
  import Textarea from 'components/Form/Textarea'
 */

import React, { ChangeEvent, useState, useEffect, useMemo } from "react";
import cn from "classnames";
import { loadItem } from "utils/localStorage";
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
};
const Textarea: React.FC<TProps> = ({ label, className, value, placeholder, rows, maxWords, required, onChange }) => {
  const [valueState, setValueState] = useState(value || "");

  useEffect(() => {
    if (value !== undefined && value !== valueState) {
      setValueState(value);
    }
  }, [value]);

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    if (!maxWords || maxWords >= val.length) {
      setValueState(val);

      onChange(val);
    }
  };

  return (
    <div className={cn("component-textarea", className)}>
      <div className="loc_wrapper">
        {label && (
          <label>
            {label} {required && <span className="red">*</span>}
          </label>
        )}
        <textarea value={valueState} onChange={onChangeHandler} placeholder={placeholder} rows={rows} />
        {!label && required && <span className="red loc_input_star">*</span>}
      </div>
      {maxWords && <div className="loc_wordsRest">Осталось символов: {maxWords - valueState.length}</div>}
    </div>
  );
};

export default Textarea;
