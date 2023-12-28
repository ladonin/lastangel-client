import React, { useRef, useEffect, useState, useMemo } from "react";
import { isObjectOptionsEmpty } from "helpers/common";
import InputText from "components/Form/InputText";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};
type TInputRefProps = {
  clearValue: () => void;
};
export type TFilterParams = {
  fio?: string;
  phone?: string;
  email?: string;
};

const Filter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const inputFioRef = useRef<TInputRefProps>();
  const inputPhoneRef = useRef<TInputRefProps>();
  const inputEmailRef = useRef<TInputRefProps>();

  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);

    if (filterState !== null) {
      timeoutRef.current = setTimeout(() => {
        onChange(filterState);
      }, 1000);
    }
  }, [filterState]);
  const reset = () => {
    inputFioRef.current?.clearValue();
  };
  return (
    <div className="page-administration_feedbacks_filter">
      <div className="loc_wrapper">
        <InputText
          initValue={filterState?.fio ? String(filterState?.fio) : undefined}
          placeholder="ФИО"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              fio: val || undefined,
            }));
          }}
          className="loc_formInputItem loc--fio"
          innerRef={inputFioRef}
        />

        <InputText
          initValue={filterState?.phone ? String(filterState?.phone) : undefined}
          placeholder="Телефон"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              phone: val || undefined,
            }));
          }}
          className="loc_formInputItem loc--phone"
          innerRef={inputPhoneRef}
        />

        <InputText
          initValue={filterState?.email ? String(filterState?.email) : undefined}
          placeholder="Email"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              email: val || undefined,
            }));
          }}
          className="loc_formInputItem loc--email"
          innerRef={inputEmailRef}
        />

        <Button
          disabled={filterState === null || isObjectOptionsEmpty(filterState)}
          className="loc_resetButton"
          theme={ButtonThemes.GREY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={reset}
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
};

export default Filter;
