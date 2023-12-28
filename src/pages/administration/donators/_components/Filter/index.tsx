import React, { useRef, useEffect, useState, useMemo } from "react";
import InputText from "components/Form/InputText";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

export type TFilterParams = {
  card?: string;
  fio?: string;
  order?: string;
  order_type?: string;
};
type TSelectRefProps = {
  clearValue: () => void;
};
type TInputRefProps = {
  clearValue: () => void;
};

const DonatorsFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const inputCardRef = useRef<TInputRefProps>();
  const inputNameRef = useRef<TInputRefProps>();
  const selectOrderRef = useRef<TSelectRefProps>();
  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const immediateRef = useRef(false);
  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);

    if (filterState !== null) {
      timeoutRef.current = setTimeout(
        () => {
          onChange(filterState);
          immediateRef.current = false;
        },
        immediateRef.current ? 0 : 1000
      );
    }
  }, [filterState]);
  const reset = () => {
    inputCardRef.current?.clearValue();
    inputNameRef.current?.clearValue();
    selectOrderRef.current?.clearValue();
    immediateRef.current = true;
  };

  const getInputCardValue = () => (filterState?.card ? String(filterState?.card) : undefined);
  const getInputFioValue = () => (filterState?.fio ? String(filterState?.fio) : undefined);

  return (
    <div className="page-administration_donators_filter">
      <div className="loc_wrapper">
        <InputText
          initValue={getInputCardValue()}
          placeholder="№ карты"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              card: val || undefined,
            }));
          }}
          className="loc_formInputItem loc--card"
          innerRef={inputCardRef}
        />
        <InputText
          initValue={getInputFioValue()}
          placeholder="ФИО"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              fio: val || undefined,
            }));
          }}
          className="loc_formInputItem loc--name"
          innerRef={inputNameRef}
        />
        <Button
          disabled={!getInputCardValue() && !getInputFioValue()}
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

export default DonatorsFilter;
