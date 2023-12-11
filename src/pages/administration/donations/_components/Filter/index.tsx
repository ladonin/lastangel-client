import React, { useRef, useEffect, useState, useMemo } from "react";
import Select from "components/Form/Select";
import InputText from "components/Form/InputText";
import { isObjectOptionsEmpty } from "helpers/common";
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
};
type TSelectRefProps = {
  clearValue: () => void;
};
type TInputRefProps = {
  clearValue: () => void;
};

export const ORDER_VALUES: { [key: string]: { field: string; type: string } } = {
  id_desc: { field: "id", type: "desc" },
  id_asc: { field: "id", type: "asc" },
  sum_desc: { field: "sum", type: "desc" },
  sum_asc: { field: "sum", type: "asc" },
};
export const ORDER_OPTIONS = [
  { value: "id_desc", label: "Сначала новые" },
  { value: "id_asc", label: "Сначала старые" },
  { value: "sum_desc", label: "От больших сумм" },
  { value: "sum_asc", label: "От меньших сумм" },
];
export const DEFAULT_SORT = "id_desc";

const DonationsFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
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
  return (
    <div className="page-administration_donations_filter">
      <div className="loc_wrapper">
       
        <InputText
          initValue={filterState?.card ? String(filterState?.card) : undefined}
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
          initValue={filterState?.fio ? String(filterState?.fio) : undefined}
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

        <Select
          value={filterState?.order ? String(filterState?.order) : undefined}
          placeholder="Порядок"
          isClearable
          onChange={(val) => {
            immediateRef.current = true;
            setFilterState((state) => ({
              ...state,
              order: val ? val.value : undefined,
            }));
          }}
          className="loc_formSelectItem loc--order"
          options={ORDER_OPTIONS}
          innerRef={selectOrderRef}
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

export default DonationsFilter;
