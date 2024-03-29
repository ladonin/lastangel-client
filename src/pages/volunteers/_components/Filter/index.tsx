/*
  import Filter from 'pages/volunteers/_components/Filter'
  Компонент фильтра для страницы списка волонтеров
 */
import React, { useRef, useEffect, useState } from "react";
import { VolunteersApi } from "api/volunteers";
import { loadItem } from "utils/localStorage";
import Select from "components/Form/Select";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import "./style.scss";

export type TFilterParams = {
  id?: number;
};

type TProps = {
  onChange: (filter: TFilterParams) => void;
  filter: TFilterParams | null;
};

type TSelectRefProps = {
  clearValue: () => void;
  lightClear: () => void;
};

const VolunteersFilter: React.FC<TProps> = ({ onChange, filter = null }) => {
  const isMobile = loadItem("isMobile");

  const [volunteersOptionsState, setVolunteersOptionsState] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [filterState, setFilterState] = useState<TFilterParams | null>(filter);

  const selectCategoryRef = useRef<TSelectRefProps>();
  const selectIdRef = useRef<TSelectRefProps>();
  const selectStatusRef = useRef<TSelectRefProps>();
  const filterUsed = useRef(false);

  const reset = () => {
    filterUsed.current = true;
    selectCategoryRef.current?.clearValue();
    selectStatusRef.current?.clearValue();
    selectIdRef.current?.clearValue();
  };

  const getInputIdValue = () => (filterState?.id ? String(filterState?.id) : undefined);

  useEffect(() => {
    if (!filterUsed.current) return;
    filterState !== null && onChange(filterState);
  }, [filterState]);

  useEffect(() => {
    VolunteersApi.getList({
      offset: 0,
      limit: 999999,
      order: "fio",
      order_type: "asc",
    }).then((res) => {
      setVolunteersOptionsState(
        res.map((volunteer) => ({
          value: String(volunteer.id),
          label: volunteer.fio,
        }))
      );
    });
  }, []);

  return (
    <div className="page-volunteers_filter">
      <div className="loc_wrapper">
        <Select
          value={getInputIdValue()}
          placeholder="Имя волонтера"
          isClearable
          onChange={(val) => {
            filterUsed.current = true;
            setFilterState((state) => ({
              ...state,
              id: val ? Number(val.value) : undefined,
            }));
          }}
          className="loc_formSelectItem"
          options={volunteersOptionsState}
          innerRef={selectIdRef}
        />
        <Button
          disabled={!getInputIdValue()}
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
