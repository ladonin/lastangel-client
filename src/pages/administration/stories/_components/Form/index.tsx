/*
  import Form from 'pages/administration/stories/_components/Form'
  Форма заполнения данных (страница историй). Админка. Создание/редактирование.
 */
import React, { useEffect, useState, useRef } from "react";
import { TGetResponseItem } from "api/types/stories";
import { getAnotherImagesUrl, getVideoUrl } from "helpers/stories";
import { SIZES_ANOTHER } from "constants/photos";
import { STORIES_STATUS } from "constants/stories";
import WYSIWYGEditor from "components/Form/WYSIWYGEditor";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImages from "components/Form/InputFileImages";
import Select from "components/Form/Select";
import Textarea from "components/Form/Textarea";
import { Checkbox } from "components/Form/Checkbox";
import InputFileVideo from "components/Form/InputFileVideo";
import "./style.scss";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

export const STORIES_OPTIONS = [
  { value: String(STORIES_STATUS.PUBLISHED), label: "Опубликован" },
  { value: String(STORIES_STATUS.NON_PUBLISHED), label: "Не опубликован" },
];

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const [isMajorState, setIsMajorState] = useState(!!data?.ismajor);
  const [isAlbumHiddenState, setIsAlbumHiddenState] = useState(!!data?.hide_album);
  const [useMobileDescriptionState, setUseMobileDescriptionState] = useState(
    !!data?.use_mobile_description
  );
  const [anotherImagesState, setAnotherImagesState] = useState<File[] | null>(null);
  const [anotherImagesPrevState, setAnotherImagesPrevState] = useState([]);
  const [anotherImagesForDeleteState, setAnotherImagesForDeleteState] = useState<number[] | null>(
    null
  );
  const paramsRef = useRef<TParams>({});

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value?.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  const setVideo1Handler = (val: null | File) => {
    onChangeHandler("video1", val);
  };
  const setVideo2Handler = (val: null | File) => {
    onChangeHandler("video2", val);
  };
  const setVideo3Handler = (val: null | File) => {
    onChangeHandler("video3", val);
  };

  const setAnotherImagesHandler = (images: File[]) => {
    setAnotherImagesState(images);
  };

  const removeAnotherImageHandler = (val: number) => {
    setAnotherImagesForDeleteState(
      anotherImagesForDeleteState === null ? [val] : anotherImagesForDeleteState.concat(val)
    );
  };

  const restoreAnotherImageHandler = (val: number) => {
    anotherImagesForDeleteState &&
      setAnotherImagesForDeleteState(
        anotherImagesForDeleteState.filter((id: number) => id !== val)
      );
  };

  useEffect(() => {
    anotherImagesState !== null && onChangeHandler("another_images", anotherImagesState);
  }, [anotherImagesState]);

  useEffect(() => {
    if (data) {
      data.another_images && setAnotherImagesPrevState(JSON.parse(data.another_images));
      setIsMajorState(!!data.ismajor);

      paramsRef.current = data;
      onChange(paramsRef.current);
    }
  }, [data]);

  useEffect(() => {
    anotherImagesForDeleteState !== null &&
      onChangeHandler("another_images_for_delete", anotherImagesForDeleteState);
  }, [anotherImagesForDeleteState]);

  return (
    <div className="page-administration_stories_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <Textarea
            value={data ? data.name : undefined}
            maxWords={256}
            onChange={(val) => {
              onChangeHandler("name", val);
            }}
            label="Название"
            required
            className="loc_formTextareaItem loc__shortdescription"
          />

          <InputFileVideo
            data={data}
            getVideoUrl={getVideoUrl}
            value={data ? data.video1 : undefined}
            setVideo={setVideo1Handler}
            label="Видео 1"
            className="loc_formVideoItem"
          />
          <InputFileVideo
            data={data}
            getVideoUrl={getVideoUrl}
            value={data ? data.video2 : undefined}
            setVideo={setVideo2Handler}
            label="Видео 2"
            className="loc_formVideoItem"
          />
          <InputFileVideo
            data={data}
            getVideoUrl={getVideoUrl}
            value={data ? data.video3 : undefined}
            setVideo={setVideo3Handler}
            label="Видео 3"
            className="loc_formVideoItem"
          />

          <Checkbox
            onChange={() => {
              const value = !isMajorState;

              setIsMajorState(value);
              onChangeHandler("ismajor", value);
            }}
            className="loc_formCheckboxItem loc--isMajor"
            checked={isMajorState}
            label="Важно"
          />
          <Checkbox
            onChange={() => {
              const value = !isAlbumHiddenState;

              setIsAlbumHiddenState(value);
              onChangeHandler("hide_album", value);
            }}
            className="loc_formCheckboxItem loc--hideAlbum"
            checked={isAlbumHiddenState}
            label="Не показывать фотоальбом"
          />
          <Checkbox
            onChange={() => {
              const value = !useMobileDescriptionState;
              setUseMobileDescriptionState(value);
              onChangeHandler("use_mobile_description", value);
            }}
            className="loc_formCheckboxItem loc--useMobileDescription"
            checked={useMobileDescriptionState}
            label="Будет мобильная версия текста"
          />
        </div>

        <div className="loc_right">
          <Textarea
            value={data ? data.short_description : undefined}
            maxWords={512}
            onChange={(val) => {
              onChangeHandler("short_description", val);
            }}
            label="Краткое описание"
            required
            className="loc_formTextareaItem loc__shortdescription"
          />

          <Select
            label="Статус"
            required
            value={data ? String(data.status) : undefined}
            onChange={(val) => {
              onChangeHandler("status", val);
            }}
            className="loc_formSelectItem loc--status"
            options={STORIES_OPTIONS}
          />
        </div>
        <WYSIWYGEditor
          id="stories_editor"
          className="loc_formTextareaItem loc__fulldescription"
          required
          value={data ? data.description : undefined}
          onChange={(val) => {
            onChangeHandler("description", val);
          }}
          label="Текст"
        />
        {useMobileDescriptionState && (
          <WYSIWYGEditor
            mobileVersion
            id="stories_editor_mobi"
            className="loc_formTextareaItem loc__fulldescription"
            required
            value={data ? data.mobile_description : undefined}
            onChange={(val) => {
              onChangeHandler("mobile_description", val);
            }}
            label="Мобильная версия текста"
          />
        )}
      </div>

      <div className="loc_photos">
        <h2>Фото</h2>
        <div className="loc_left">
          <InputFileImages multiple setImage={setAnotherImagesHandler} />

          {anotherImagesPrevState && !!anotherImagesPrevState.length && (
            <InputPrevLoadedImages
              images={anotherImagesPrevState}
              deletedImages={anotherImagesForDeleteState}
              label="Ранее загруженные фото"
              removeImage={removeAnotherImageHandler}
              restoreImage={restoreAnotherImageHandler}
              prepareUrlFunc={(img: number) =>
                data ? getAnotherImagesUrl(data, img, SIZES_ANOTHER.SIZE_450) : ""
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
