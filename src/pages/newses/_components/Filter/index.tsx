import React, { useRef, useEffect, useState, useMemo } from "react";
import { isObjectOptionsIsEmpty } from "helpers/common";
import Select from "components/Form/Select";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import InputText from "components/Form/InputText";
// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

export type TFilterParams = {
  order?: string;
  title?: string;
};
type TSelectRefProps = {
  clearValue: () => void;
};
type TInputRefProps = {
  clearValue: () => void;
};
export const ORDER_OPTIONS = [
  { value: "desc", label: "Сначала новые" },
  { value: "asc", label: "Сначала старые" },
];

export const DEFAULT_SORT = "desc";

const NewsFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const selectOrderRef = useRef<TSelectRefProps>();
  const inputTitleRef = useRef<TInputRefProps>();
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
    selectOrderRef.current?.clearValue();
    inputTitleRef.current?.clearValue();
    immediateRef.current = true;
  };
  return (
    <div className="page-newses_filter">
      <div className="loc_wrapper">
        <Select
          value={filterState?.order ? String(filterState?.order) : undefined}
          isClearable
          placeholder="Сортировка"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              order: val ? val.value : undefined,
            }));
          }}
          className="loc_formSelectItem loc--order"
          options={ORDER_OPTIONS}
          innerRef={selectOrderRef}
        />
        <InputText
          initValue={filterState?.title ? String(filterState?.title) : undefined}
          placeholder="Заголовок"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              title: val || undefined,
            }));
          }}
          className="loc_formInputItem loc--title"
          innerRef={inputTitleRef}
        />
        <Button
          disabled={filterState === null || isObjectOptionsIsEmpty(filterState)}
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

export default NewsFilter;
