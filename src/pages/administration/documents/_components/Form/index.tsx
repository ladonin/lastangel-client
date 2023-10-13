import React, { useEffect, useState, useRef, useMemo } from "react";

// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import "./style.scss";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImage from "components/Form/InputFileImage";

import { TGetResponseItem } from "api/types/documents";

import { getAnotherImagesUrl } from "helpers/documents";
import { SIZES_ANOTHER } from "constants/photos";

// TODO
// сделать цветовую дифференциацию по статусам (фон)
// сделать фильтр по статусам и пр
// сделать сортировку по дате рожденияи пр.

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const [anotherImagesState, setAnotherImagesState] = useState<File[] | null>(null);

  const paramsRef = useRef<TParams>({});

  const [anotherImagesPrevState, setAnotherImagesPrevState] = useState([]);
  const [anotherImagesForDeleteState, setAnotherImagesForDeleteState] = useState<number[] | null>(null);

  useEffect(() => {
    if (data) {
      data.another_images && setAnotherImagesPrevState(JSON.parse(data.another_images));
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
    <div className="page-administration_documents_form_component">
      <div className="loc_photos">
        <h2>Фото</h2>
        <div className="loc_left">
          <InputFileImage multiple setImage={setAnotherImagesHandler} />

          {anotherImagesPrevState && !!anotherImagesPrevState.length && (
            <InputPrevLoadedImages
              images={anotherImagesPrevState}
              deletedImages={anotherImagesForDeleteState}
              label="Ранее загруженные фото"
              removeImage={removeAnotherImageHandler}
              restoreImage={restoreAnotherImageHandler}
              prepareUrlFunc={(img: number) => (data ? getAnotherImagesUrl(data, img, SIZES_ANOTHER.SIZE_1200) : "")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
