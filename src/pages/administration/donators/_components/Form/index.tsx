import React, { useEffect, useRef } from "react";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";
import InputText from "components/Form/InputText";
import { TGetResponseItem } from "api/types/donators";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const paramsRef = useRef<TParams>({});

  useEffect(() => {
    if (data) {
      paramsRef.current = data;
    }
  }, [data]);

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  return (
    <div className="page-administration_donations_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <InputText
            label="Имя донатора"
            initValue={data ? data.firstname : undefined}
            onChange={(val) => {
              onChangeHandler("firstname", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Отчество донатора"
            initValue={data ? data.middlename : undefined}
            onChange={(val) => {
              onChangeHandler("middlename", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Фамилия донатора (первая буква)"
            initValue={data ? data.lastname : undefined}
            onChange={(val) => {
              onChangeHandler("lastname", val);
            }}
            className="loc_formInputItem"
          />
        </div>
        <div className="loc_right">
          <InputText
            required
            label="Полное ФИО"
            initValue={data ? data.fullname : undefined}
            onChange={(val) => {
              onChangeHandler("fullname", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            required
            label="Карточка/телефон донатора"
            initValue={data ? data.card : undefined}
            onChange={(val) => {
              onChangeHandler("card", val);
            }}
            className="loc_formInputItem"
          />

          <InputText
            label="Ссылка на страницу в соцсети"
            initValue={data ? data.link_to_page : undefined}
            onChange={(val) => {
              onChangeHandler("link_to_page", val);
            }}
            className="loc_formInputItem"
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
