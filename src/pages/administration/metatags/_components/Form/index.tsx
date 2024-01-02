/*
  import Form from 'pages/administration/metatags/_components/Form'
  Форма заполнения данных (страница метатегов сайта). Админка. Создание/редактирование.
 */
import React, { useEffect, useRef, useState } from "react";
import InputText from "components/Form/InputText";
import Textarea from "components/Form/Textarea";
import "./style.scss";

export type TParams = { [key: string]: any };

export type TResponse = string;

type TProps = {
  onChange: (data: TParams) => void;
  data: string;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const paramsRef = useRef<TParams>({});
  const [dataInitState, setDataInitState] = useState<{ [key: string]: string }>({});

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      paramsRef.current = parsedData;
      setDataInitState(parsedData);
      onChange(paramsRef.current);
    }
  }, [data]);

  return (
    <div className="page-administration_metatags_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <InputText
            label="Title Главная"
            initValue={dataInitState ? dataInitState.main_title : undefined}
            onChange={(val) => {
              onChangeHandler("main_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.main_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("main_description", val);
            }}
            label="Description Главная"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Питомцы (список)"
            initValue={dataInitState ? dataInitState.pets_title : undefined}
            onChange={(val) => {
              onChangeHandler("pets_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.pets_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("pets_description", val);
            }}
            label="Description Питомцы (список)"
            className="loc_formTextareaItem"
          />
          <InputText
            label="Title Питомец"
            initValue={dataInitState ? dataInitState.pet_title : undefined}
            onChange={(val) => {
              onChangeHandler("pet_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.pet_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("pet_description", val);
            }}
            label="Description Питомец"
            className="loc_formTextareaItem"
          />
          <InputText
            label="Title Сборы (список)"
            initValue={dataInitState ? dataInitState.collections_title : undefined}
            onChange={(val) => {
              onChangeHandler("collections_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.collections_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("collections_description", val);
            }}
            label="Description Сборы (список)"
            className="loc_formTextareaItem"
          />
          <InputText
            label="Title Сбор"
            initValue={dataInitState ? dataInitState.collection_title : undefined}
            onChange={(val) => {
              onChangeHandler("collection_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.collection_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("collection_description", val);
            }}
            label="Description Сбор"
            className="loc_formTextareaItem"
          />
          <InputText
            label="Title Новости (список)"
            initValue={dataInitState ? dataInitState.newses_title : undefined}
            onChange={(val) => {
              onChangeHandler("newses_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.newses_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("newses_description", val);
            }}
            label="Description Новости (список)"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Новость"
            initValue={dataInitState ? dataInitState.news_title : undefined}
            onChange={(val) => {
              onChangeHandler("news_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.news_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("news_description", val);
            }}
            label="Description Новость"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Истории (список)"
            initValue={dataInitState ? dataInitState.stories_title : undefined}
            onChange={(val) => {
              onChangeHandler("stories_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.stories_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("stories_description", val);
            }}
            label="Description Истории (список)"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title История"
            initValue={dataInitState ? dataInitState.story_title : undefined}
            onChange={(val) => {
              onChangeHandler("story_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.story_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("story_description", val);
            }}
            label="Description История"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Волонтеры (список)"
            initValue={dataInitState ? dataInitState.volunteers_title : undefined}
            onChange={(val) => {
              onChangeHandler("volunteers_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.volunteers_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("volunteers_description", val);
            }}
            label="Description Волонтеры (список)"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Волонтер"
            initValue={dataInitState ? dataInitState.volunteer_title : undefined}
            onChange={(val) => {
              onChangeHandler("volunteer_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.volunteer_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("volunteer_description", val);
            }}
            label="Description Волонтер"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Клиника"
            initValue={dataInitState ? dataInitState.clinic_title : undefined}
            onChange={(val) => {
              onChangeHandler("clinic_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.clinic_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("clinic_description", val);
            }}
            label="Description Клиника"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Документы"
            initValue={dataInitState ? dataInitState.documents_title : undefined}
            onChange={(val) => {
              onChangeHandler("documents_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.documents_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("documents_description", val);
            }}
            label="Description Документы"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Помощь"
            initValue={dataInitState ? dataInitState.help_title : undefined}
            onChange={(val) => {
              onChangeHandler("help_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.help_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("help_description", val);
            }}
            label="Description Помощь"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Контакты"
            initValue={dataInitState ? dataInitState.contacts_title : undefined}
            onChange={(val) => {
              onChangeHandler("contacts_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.contacts_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("contacts_description", val);
            }}
            label="Description Контакты"
            className="loc_formTextareaItem"
          />

          <InputText
            label="Title Финотчет"
            initValue={dataInitState ? dataInitState.finreport_title : undefined}
            onChange={(val) => {
              onChangeHandler("finreport_title", val);
            }}
            className="loc_formInputItem"
          />
          <Textarea
            value={dataInitState ? dataInitState.finreport_description : undefined}
            maxWords={1024}
            onChange={(val) => {
              onChangeHandler("finreport_description", val);
            }}
            label="Description Финотчет"
            className="loc_formTextareaItem"
          />
        </div>
        <div className="loc_right" />
      </div>
    </div>
  );
};

export default Form;
