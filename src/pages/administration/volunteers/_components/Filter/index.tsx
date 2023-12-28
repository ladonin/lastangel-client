import React, { useRef, useEffect, useState, useMemo } from "react";
import Select from "components/Form/Select";
import { VolunteersApi } from "api/volunteers";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));

import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

export type TFilterParams = {
  notPublished?: 1 | 0;
  id?: number;
  minbirthdate?: number[];
  maxbirthdate?: number[];
};
type TSelectRefProps = {
  clearValue: () => void;
  lightClear: () => void;
};

export const DEFAULT_SORT = "desc";

const VolunteersFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const selectIdRef = useRef<TSelectRefProps>();
  const selectStatusRef = useRef<TSelectRefProps>();
  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);

  useEffect(() => {
    filterState !== null && onChange(filterState);
  }, [filterState]);

  const reset = () => {
    selectStatusRef.current?.clearValue();
    selectIdRef.current?.clearValue();
  };

  const [volunteersOptionsState, setVolunteersOptionsState] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    VolunteersApi.getList({
      offset: 0,
      limit: 999999,
      order: "name",
      order_type: "asc",
      withUnpublished: 1,
    }).then((res) => {
      setVolunteersOptionsState(
        res.map((volunteer) => ({
          value: String(volunteer.id),
          label: `${volunteer.fio} (№${volunteer.id})`,
        }))
      );
    });
  }, []);

  const getInputStatusValue = () =>
    filterState?.notPublished === 1 ? "not_published" : undefined;

  const getInputIdValue = () => (filterState?.id ? String(filterState?.id) : undefined);

  return (
    <div className="page-administration_volunteers_filter">
      <div className="loc_wrapper">
        <Select
          value={getInputStatusValue()}
          placeholder="Статус"
          isClearable
          onChange={(val, isLightClear = false) => {
            if (val?.value === "not_published") {
              setFilterState((state) => ({
                ...state,
                notPublished: 1,
              }));
            } else {
              setFilterState((state) => ({
                ...state,
                notPublished: undefined,
              }));
            }

            !isLightClear && selectIdRef.current?.lightClear && selectIdRef.current?.lightClear();
          }}
          className="loc_formSelectItem loc--status"
          options={[
            {
              value: "not_published",
              label: "Не опубликован",
            }
          ]}
          innerRef={selectStatusRef}
        />
        

        <Select
          value={getInputIdValue()}
          placeholder="ID/ФИО"
          isClearable
          onChange={(val, isLightClear = false) => {
            setFilterState((state) => ({
              ...state,
              id: val ? Number(val.value) : undefined,
            }));
            !isLightClear && selectStatusRef.current?.lightClear && selectStatusRef.current?.lightClear();
          }}
          className="loc_formSelectItem loc--fio"
          options={volunteersOptionsState}
          innerRef={selectIdRef}
        />

        <Button
          disabled={!getInputStatusValue() && !getInputIdValue()}
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

export default VolunteersFilter;
