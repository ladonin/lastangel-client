/*
  import Filter from 'pages/stories/_components/Filter'
  Компонент фильтра для страницы списка историй
 */
import React, { useRef, useEffect, useState } from "react";
import { isObjectOptionsEmpty } from "helpers/common";
import { loadItem } from "utils/localStorage";
import Select from "components/Form/Select";
import InputText from "components/Form/InputText";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import "./style.scss";

export type TFilterParams = {
  orderComplex?: string;
  title?: string;
};

export const ORDER_OPTIONS = [
  { value: "id desc", label: "Сначала новые" },
  { value: "id asc", label: "Сначала старые" },
];

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

type TSelectRefProps = {
  clearValue: () => void;
};

type TInputRefProps = {
  clearValue: () => void;
};

const StoriesFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = loadItem("isMobile");

  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);

  const selectOrderRef = useRef<TSelectRefProps>();
  const inputTitleRef = useRef<TInputRefProps>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const immediateRef = useRef(false);

  const reset = () => {
    selectOrderRef.current?.clearValue();
    inputTitleRef.current?.clearValue();
    immediateRef.current = true;
  };

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

  return (
    <div className="page-stories_filter">
      <div className="loc_wrapper">
        <Select
          value={filterState?.orderComplex ? String(filterState?.orderComplex) : undefined}
          isClearable
          placeholder="Сортировка"
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              orderComplex: val ? val.value : undefined,
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
          disabled={
            filterState === null ||
            isObjectOptionsEmpty({ ...filterState, excludeStatus: undefined })
          }
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

export default StoriesFilter;
