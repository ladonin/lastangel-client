import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  ANIMALS_CATEGORY,
  ANIMALS_KIND,
  ANIMALS_STATUS,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS_FILTER,
} from "constants/animals";
import Select from "components/Form/Select";
import { ValuesOf } from "types/common";
import { AnimalsApi } from "api/animals";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { getCategoryAgeParams } from "helpers/animals";
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

export type TFilterParams = {
  status?: ValuesOf<typeof ANIMALS_STATUS>;
  category?: ValuesOf<typeof ANIMALS_CATEGORY>;
  kind?: ValuesOf<typeof ANIMALS_KIND>[];
  minbirthdate?: number[];
  maxbirthdate?: number[];
  id?: number;
};
type TSelectRefProps = {
  clearValue: () => void;
  lightClear: () => void;
};
const PetsFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const selectCategoryRef = useRef<TSelectRefProps>();
  const selectIdRef = useRef<TSelectRefProps>();
  const selectStatusRef = useRef<TSelectRefProps>();
  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);
  const filterUsed = useRef(false);

  useEffect(() => {
    if (!filterUsed.current) return;
    filterState !== null && onChange(filterState);
  }, [filterState]);
  const reset = () => {
    filterUsed.current = true;
    selectCategoryRef.current?.clearValue();
    selectStatusRef.current?.clearValue();
    selectIdRef.current?.clearValue();
  };
  const [animalsOptionsState, setAnimalsOptionsState] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  useEffect(() => {
    AnimalsApi.getList({
      offset: 0,
      limit: 999999,
      order: "name",
      order_type: "asc",
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
    }).then((res) => {
      setAnimalsOptionsState(
        res.map((animal) => ({
          value: String(animal.id),
          label: `${animal.name} (№${animal.id})`,
        }))
      );
    });
  }, []);

  const getInputStatusValue = () => (filterState?.status ? String(filterState?.status) : undefined);
  const getInputCategoryValue = () =>
    filterState?.category ? String(filterState?.category) : undefined;
  const getInputIdValue = () => (filterState?.id ? String(filterState?.id) : undefined);

  return (
    <div className="page-pets_filter">
      <div className="loc_wrapper">
        <Select
          value={getInputStatusValue()}
          placeholder="Статус"
          isClearable
          onChange={(val, isLightClear = false) => {
            filterUsed.current = true;
            setFilterState((state) => ({
              ...state,
              status: val ? (Number(val.value) as ValuesOf<typeof ANIMALS_STATUS>) : undefined,
            }));
            !isLightClear && selectIdRef.current?.lightClear && selectIdRef.current?.lightClear();
          }}
          className="loc_formSelectItem"
          options={STATUS_OPTIONS_FILTER}
          innerRef={selectStatusRef}
        />
        <Select
          value={getInputCategoryValue()}
          placeholder="Категория"
          isClearable
          onChange={(val, isLightClear = false) => {
            filterUsed.current = true;
            const category = val
              ? (Number(val.value) as ValuesOf<typeof ANIMALS_CATEGORY>)
              : undefined;
            setFilterState((state) => ({
              ...state,
              category,
              ...getCategoryAgeParams(category),
            }));

            !isLightClear && selectIdRef.current?.lightClear && selectIdRef.current?.lightClear();
          }}
          className="loc_formSelectItem"
          options={CATEGORY_OPTIONS}
          innerRef={selectCategoryRef}
        />
        <Select
          value={getInputIdValue()}
          placeholder="Номер/Имя животного"
          isClearable
          onChange={(val, isLightClear = false) => {
            filterUsed.current = true;
            setFilterState((state) => ({
              ...state,
              id: val ? Number(val.value) : undefined,
            }));
            !isLightClear &&
              selectCategoryRef.current?.lightClear &&
              selectCategoryRef.current?.lightClear();
            !isLightClear &&
              selectStatusRef.current?.lightClear &&
              selectStatusRef.current?.lightClear();
          }}
          className="loc_formSelectItem"
          options={animalsOptionsState}
          innerRef={selectIdRef}
        />
        <Button
          disabled={!getInputStatusValue() && !getInputCategoryValue() && !getInputIdValue()}
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

export default PetsFilter;
