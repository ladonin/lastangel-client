import React, { useEffect, useState, useRef, useMemo } from "react";
// const OtherComponent = React.lazy(() => import('components/header'));
import { AnimalsApi } from "api/animals";
import { CollectionsApi } from "api/collections";
import { DONATIONS_TYPES } from "constants/donations";
import InputText from "components/Form/InputText";
import InputNumber from "components/Form/InputNumber";
import Select from "components/Form/Select";
import { Checkbox } from "components/Form/Checkbox";
import { TGetResponseItem } from "api/types/donations";
import { ANIMALS_STATUS } from "constants/animals";
import { isAnonym } from "helpers/donations";
import "./style.scss";

const TYPES_OPTIONS = [
  { value: String(DONATIONS_TYPES.PET), label: "Содержание животного" },
  { value: String(DONATIONS_TYPES.COLLECTION), label: "На сбор" },
  { value: String(DONATIONS_TYPES.COMMON), label: "Общие нужды" },
];

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const [animalsOptionsState, setAnimalsOptionsState] = useState<
    { value: string; label: string }[]
  >([]);
  const [collectionsOptionsState, setCollectionsOptionsState] = useState<
    { value: string; label: string }[]
  >([]);
  const [targetOptionsState, setTargetOptionsState] = useState<{ value: string; label: string }[]>(
    []
  );
  const [isAnonymState, setIsAnonymState] = useState(false);

  const paramsRef = useRef<TParams>({});

  useEffect(() => {
    if (data) {
      paramsRef.current = data;
      if (isAnonym(data)) {
        setIsAnonymState(true);
      }
    }
  }, [data]);

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  useEffect(() => {
    AnimalsApi.getList({
      offset: 0,
      limit: 999999,
      order: "name",
      order_type: "asc",
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
    }).then((res) => {
      setAnimalsOptionsState(
        res.map((animal) => ({ value: String(animal.id), label: `${animal.name} (№${animal.id})` }))
      );
    });
    CollectionsApi.getList().then((res) => {
      setCollectionsOptionsState(
        res.map((animal) => ({ value: String(animal.id), label: `${animal.name} (№${animal.id})` }))
      );
    });
  }, []);

  useEffect(() => {
    if (isAnonymState) {
      /* empty */
    }
  }, [isAnonymState]);

  return (
    <div className="page-administration_donations_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <Checkbox
            onChange={() => {
              onChangeHandler("donator_firstname", "");
              onChangeHandler("donator_middlename", "");
              onChangeHandler("donator_lastname", "");
              onChangeHandler("donator_card", "");
              setIsAnonymState(!isAnonymState);
            }}
            className="loc_formCheckboxItem"
            checked={isAnonymState}
            label="Аноним"
          />

          <InputText
            disabled={isAnonymState}
            label="Имя донатора"
            initValue={data ? data.donator_firstname : undefined}
            onChange={(val) => {
              onChangeHandler("donator_firstname", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            disabled={isAnonymState}
            label="Отчество донатора"
            initValue={data ? data.donator_middlename : undefined}
            onChange={(val) => {
              onChangeHandler("donator_middlename", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            disabled={isAnonymState}
            label="Фамилия донатора (первая буква)"
            initValue={data ? data.donator_lastname : undefined}
            onChange={(val) => {
              onChangeHandler("donator_lastname", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            disabled={isAnonymState}
            label="Карточка/телефон донатора"
            initValue={data ? data.donator_card : undefined}
            onChange={(val) => {
              onChangeHandler("donator_card", val);
            }}
            className="loc_formInputItem"
          />
        </div>
        <div className="loc_right">
          <InputNumber
            floatNumbers={2}
            label="Сумма, руб"
            required
            initValue={data ? data.sum : undefined}
            onChange={(val) => {
              onChangeHandler("sum", val);
            }}
            className="loc_formInputItem"
          />
          <Select
            label="Тип доната"
            required
            value={data ? String(data.type) : undefined}
            onChange={(val) => {
              onChangeHandler("type", val);

              if (Number(val.value) === DONATIONS_TYPES.PET) {
                setTargetOptionsState(animalsOptionsState);
              } else if (Number(val.value) === DONATIONS_TYPES.COLLECTION) {
                setTargetOptionsState(collectionsOptionsState);
              } else {
                setTargetOptionsState([]);
              }
            }}
            className="loc_formSelectItem"
            options={TYPES_OPTIONS}
          />

          <Select
            label="Для кого/чего"
            required={!!targetOptionsState.length}
            disabled={!targetOptionsState.length}
            value={data ? String(data.target_id) : undefined}
            onChange={(val) => {
              onChangeHandler("target_id", val);
            }}
            className="loc_formSelectItem"
            options={targetOptionsState}
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
