import React, { useEffect, useState, useRef } from "react";

import InputText from "components/Form/InputText";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImage from "components/Form/InputFileImage";
import { STORIES_STATUS } from "constants/stories";
import Textarea from "components/Form/Textarea";
import { Checkbox } from "components/Form/Checkbox";

import { TGetResponseItem } from "api/types/stories";

import { getAnotherImagesUrl } from "helpers/stories";
import WYSIWYGEditor from "components/Form/WYSIWYGEditor";
import { SIZES_ANOTHER } from "constants/photos";
import Select from "components/Form/Select";
// const OtherComponent = React.lazy(() => import('components/header'));
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
  const [anotherImagesState, setAnotherImagesState] = useState<File[] | null>(null);

  const paramsRef = useRef<TParams>({});

  const [anotherImagesPrevState, setAnotherImagesPrevState] = useState([]);
  const [anotherImagesForDeleteState, setAnotherImagesForDeleteState] = useState<number[] | null>(null);

  useEffect(() => {
    if (data) {
      data.another_images && setAnotherImagesPrevState(JSON.parse(data.another_images));
      setIsMajorState(!!data.ismajor);

      paramsRef.current = data;
    }
  }, [data]);
  // продолжить с удаления фото - главного и дополнительного на бэке - ПРОДОЛЖЕНИЕ
  //
  // главное фото
  // на бэке просто пересохраняется фото в базе (ничего не меняется) и перезапись главного фото на новое (автозамена файла)
  //
  // потом добавление дополнительных фоток another
  // на бэке удаляем из базы номера и из хранилища файлы
  // сохранение с новыми инкрементированными номерами в базе и хранилище
  //

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  useEffect(() => {
    anotherImagesState !== null && onChangeHandler("another_images", anotherImagesState);
  }, [anotherImagesState]);

  useEffect(() => {
    anotherImagesForDeleteState !== null && onChangeHandler("another_images_for_delete", anotherImagesForDeleteState);
  }, [anotherImagesForDeleteState]);

  const setAnotherImagesHandler = (images: File[]) => {
    setAnotherImagesState(images);
  };

  const removeAnotherImageHandler = (val: number) => {
    setAnotherImagesForDeleteState(anotherImagesForDeleteState === null ? [val] : anotherImagesForDeleteState.concat(val));
  };

  const restoreAnotherImageHandler = (val: number) => {
    anotherImagesForDeleteState && setAnotherImagesForDeleteState(anotherImagesForDeleteState.filter((id: number) => id !== val));
  };

  return (
    <div className="page-administration_stories_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <InputText
            required
            label="Название"
            initValue={data ? data.name : undefined}
            onChange={(val) => {
              onChangeHandler("name", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Видео 1"
            initValue={data ? data.videoVk1 : undefined}
            onChange={(val) => {
              onChangeHandler("videoVk1", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Видео 2"
            initValue={data ? data.videoVk2 : undefined}
            onChange={(val) => {
              onChangeHandler("videoVk2", val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Видео 3"
            initValue={data ? data.videoVk3 : undefined}
            onChange={(val) => {
              onChangeHandler("videoVk3", val);
            }}
            className="loc_formInputItem"
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
          className="loc_formTextareaItem loc__fulldescription"
          required
          value={data ? data.description : undefined}
          onChange={(val) => {
            onChangeHandler("description", val);
          }}
          label="Текст"
        />
      </div>

      <div className="loc_photos">
        <h2>Фото</h2>
        <div className="loc_left">
          <InputFileImage noSizeRevision multiple setImage={setAnotherImagesHandler} />

          {anotherImagesPrevState && !!anotherImagesPrevState.length && (
            <InputPrevLoadedImages
              images={anotherImagesPrevState}
              deletedImages={anotherImagesForDeleteState}
              label="Ранее загруженные фото"
              removeImage={removeAnotherImageHandler}
              restoreImage={restoreAnotherImageHandler}
              prepareUrlFunc={(img: number) => (data ? getAnotherImagesUrl(data, img, SIZES_ANOTHER.SIZE_450) : "")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
