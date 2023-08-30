import React, { useRef, useEffect, useState } from "react";

import { isMobile } from "react-device-detect";
import { ANIMALS_CATEGORY, ANIMALS_STATUS, CATEGORY_OPTIONS, STATUS_OPTIONS_FILTER } from "constants/animals";
import Select from "components/Form/Select";
import { ValuesOf } from "types/common";
import { AnimalsApi } from "api/animals";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

export type TFilterParams = {
  status?: ValuesOf<typeof ANIMALS_STATUS>;
  notPublished?: 1 | 0;
  statusExclude?: ValuesOf<typeof ANIMALS_STATUS>[];
  category?: ValuesOf<typeof ANIMALS_CATEGORY>;
  id?: number;
};
type TSelectRefProps = {
  clearValue: () => void;
};

const PetsFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  const selectCategoryRef = useRef<TSelectRefProps>();
  const selectIdRef = useRef<TSelectRefProps>();
  const selectStatusRef = useRef<TSelectRefProps>();
  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);
  console.log("filterStateэ");
  console.log(filterState);
  useEffect(() => {
    filterState !== null && onChange(filterState);
  }, [filterState]);

  const reset = () => {
    selectCategoryRef.current?.clearValue();
    selectStatusRef.current?.clearValue();
    selectIdRef.current?.clearValue();
  };

  const [animalsOptionsState, setAnimalsOptionsState] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    AnimalsApi.getList({
      offset: 0,
      limit: 999999,
      order: "id",
      order_type: "asc",
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
      withUnpublished: 1,
    }).then((res) => {
      setAnimalsOptionsState(res.map((animal) => ({ value: String(animal.id), label: `${animal.name} (№${animal.id})` })));
    });
  }, []);

  const getInputStatusValue = () =>
    filterState?.status ? String(filterState?.status) : filterState?.notPublished === 1 ? "not_published" : undefined;
  const getInputCategoryValue = () => (filterState?.category ? String(filterState?.category) : undefined);
  const getInputIdValue = () => (filterState?.id ? String(filterState?.id) : undefined);

  return (
    <div className="page-administration_pets_filter">
      <div className="loc_wrapper">
        <Select
          value={getInputStatusValue()}
          placeholder="Статус"
          isClearable
          onChange={(val) => {
            if (val?.value === "not_published") {
              setFilterState((state) => ({
                ...state,
                notPublished: 1,
                status: undefined,
              }));
            } else {
              setFilterState((state) => ({
                ...state,
                status: val ? (Number(val.value) as ValuesOf<typeof ANIMALS_STATUS>) : undefined,
                notPublished: undefined,
              }));
            }
          }}
          className="loc_formSelectItem"
          options={[
            ...STATUS_OPTIONS_FILTER,
            {
              value: "not_published",
              label: "Не опубликован",
            },
          ]}
          innerRef={selectStatusRef}
        />
        <Select
          value={getInputCategoryValue()}
          placeholder="Категория"
          isClearable
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              category: val ? (Number(val.value) as ValuesOf<typeof ANIMALS_CATEGORY>) : undefined,
            }));
          }}
          className="loc_formSelectItem"
          options={CATEGORY_OPTIONS}
          innerRef={selectCategoryRef}
        />

        <Select
          value={getInputIdValue()}
          placeholder="ID/Имя"
          isClearable
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              id: val ? Number(val.value) : undefined,
            }));
          }}
          className="loc_formSelectItem"
          options={animalsOptionsState}
          innerRef={selectIdRef}
        />

        <Button
          disabled={!getInputStatusValue() && !getInputCategoryValue() && !getInputIdValue()}
          className="loc_resetButton"
          theme={ButtonThemes.GREY}
          size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={reset}
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
};

export default PetsFilter;
