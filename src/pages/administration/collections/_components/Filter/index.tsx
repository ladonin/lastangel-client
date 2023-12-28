import React, { useRef, useEffect, useState, useMemo } from "react";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import {
  COLLECTIONS_TYPE,
  COLLECTIONS_STATUS,
  TYPES_OPTIONS,
  STATUSES_OPTIONS,
} from "constants/collections";

import Select from "components/Form/Select";
import { ValuesOf } from "types/common";
import { isObjectOptionsEmpty } from "helpers/common";
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

export type TFilterParams = {
  status?: ValuesOf<typeof COLLECTIONS_STATUS>;
  statusExclude?: ValuesOf<typeof COLLECTIONS_STATUS>;
  type?: ValuesOf<typeof COLLECTIONS_TYPE>;
};
type TSelectRefProps = {
  clearValue: () => void;
};
const CollectionsFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const selectCategoryRef = useRef<TSelectRefProps>();
  const selectStatusRef = useRef<TSelectRefProps>();
  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);

  useEffect(() => {
    filterState !== null && onChange(filterState);
  }, [filterState]);
  const reset = () => {
    selectCategoryRef.current?.clearValue();
    selectStatusRef.current?.clearValue();
  };
  return (
    <div className="page-administration_collections_filter">
      <div className="loc_wrapper">
        <Select
          value={filterState?.status ? String(filterState?.status) : undefined}
          placeholder="Статус"
          isClearable
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              status: val ? (Number(val.value) as ValuesOf<typeof COLLECTIONS_STATUS>) : undefined,
            }));
          }}
          className="loc_formSelectItem"
          options={STATUSES_OPTIONS}
          innerRef={selectCategoryRef}
        />
        <Select
          value={filterState?.type ? String(filterState?.type) : undefined}
          placeholder="Тип"
          isClearable
          onChange={(val) => {
            setFilterState((state) => ({
              ...state,
              type: val ? (Number(val.value) as ValuesOf<typeof COLLECTIONS_TYPE>) : undefined,
            }));
          }}
          className="loc_formSelectItem loc--type"
          options={TYPES_OPTIONS}
          innerRef={selectStatusRef}
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

export default CollectionsFilter;
