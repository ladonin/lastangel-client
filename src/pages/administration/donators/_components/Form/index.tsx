/*
  import Form from 'pages/administration/donators/_components/Form'
  Форма заполнения данных (страница донаторов). Админка. Создание/редактирование.
 */
import React, { useEffect, useRef } from "react";
import InputText from "components/Form/InputText";
import { TGetResponseItem } from "api/types/donators";
import "./style.scss";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const paramsRef = useRef<TParams>({});

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  useEffect(() => {
    if (data) {
      paramsRef.current = data;
      onChange(paramsRef.current);
    }
  }, [data]);

  return (
    <div className="page-administration_donators_form_component">
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
