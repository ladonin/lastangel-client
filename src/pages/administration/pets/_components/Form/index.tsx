import React, { useEffect, useState, useRef } from "react";
import { getVideoUrl, getAnotherImagesUrl, getMainImageUrl } from "helpers/animals";
import {
  SEX_OPTIONS,
  GRAFTED_OPTIONS,
  STERILIZED_OPTIONS,
  IS_PUBLISHED_OPTIONS,
  STATUS_OPTIONS_CR_UP,
  KIND_OPTIONS,
} from "constants/animals";
import InputText from "components/Form/InputText";
import InputFileImageWithCrop from "components/Form/InputFileImageWithCrop";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImages from "components/Form/InputFileImages";
import InputFileVideo from "components/Form/InputFileVideo";
import DatePicker from "components/Form/DatePicker";
import Select from "components/Form/Select";
import Textarea from "components/Form/Textarea";
import { Checkbox } from "components/Form/Checkbox";
import { TGetResponseItem } from "api/types/animals";
import { SIZES_MAIN, SIZES_ANOTHER } from "constants/photos";
import "./style.scss";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const [isMajorState, setIsMajorState] = useState(false);
  const [anotherImagesState, setAnotherImagesState] = useState<File[] | null>(null);
  const [mainImageState, setMainImageState] = useState<{ cropped: Blob; original: Blob } | null>(
    null
  );

  const paramsRef = useRef<TParams>({});

  const [mainImagePrevState, setMainImagePrevState] = useState(0);
  const [mainImagePrevIsDeletedState, setMainImagePrevIsDeletedState] = useState<boolean | null>(
    null
  );

  const [anotherImagesPrevState, setAnotherImagesPrevState] = useState([]);
  const [anotherImagesForDeleteState, setAnotherImagesForDeleteState] = useState<number[] | null>(
    null
  );

  useEffect(() => {
    if (data) {
      data.another_images && setAnotherImagesPrevState(JSON.parse(data.another_images));
      Number(data.main_image) && setMainImagePrevState(Number(data.main_image));
      setIsMajorState(!!data.ismajor);

      paramsRef.current = data;
      onChange(paramsRef.current);
    }
  }, [data]);

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value?.value ? Number(value.value) : value;
    onChange(paramsRef.current);
  };

  const setMainImageHandler = (cropped: Blob, original: Blob) => {
    setMainImageState({ cropped, original });
    setMainImagePrevState(0);
  };

  useEffect(() => {
    mainImageState !== null && onChangeHandler("main_image", mainImageState);
  }, [mainImageState]);

  useEffect(() => {
    mainImagePrevIsDeletedState !== null &&
      onChangeHandler("main_image_is_deleted", mainImagePrevIsDeletedState);
  }, [mainImagePrevIsDeletedState]);

  useEffect(() => {
    anotherImagesState !== null && onChangeHandler("another_images", anotherImagesState);
  }, [anotherImagesState]);

  useEffect(() => {
    anotherImagesForDeleteState !== null &&
      onChangeHandler("another_images_for_delete", anotherImagesForDeleteState);
  }, [anotherImagesForDeleteState]);

  const setAnotherImagesHandler = (images: File[]) => {
    setAnotherImagesState(images);
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

  const removeMainImageHandler = () => {
    setMainImagePrevIsDeletedState(true);
    // setMainImagePrevState(0);
  };
  const restoreMainImageHandler = () => {
    setMainImagePrevIsDeletedState(false);
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

  return (
    <div className="page-administration_pets_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <Select
            label="Опубликован"
            required
            value={data ? String(data.is_published) : undefined}
            onChange={(val) => {
              onChangeHandler("is_published", val);
            }}
            className="loc_formSelectItem loc--is_published"
            options={IS_PUBLISHED_OPTIONS}
          />
          <InputText
            required
            label="Кличка"
            initValue={data ? data.name : undefined}
            onChange={(val) => {
              onChangeHandler("name", val);
            }}
            className="loc_formInputItem"
          />
          <Select
            label="Пол"
            required
            value={data ? String(data.sex) : undefined}
            onChange={(val) => {
              onChangeHandler("sex", val);
            }}
            className="loc_formSelectItem loc--sex"
            options={SEX_OPTIONS}
          />
          <Select
            label="Привит(а)"
            required
            value={data ? String(data.grafted) : undefined}
            onChange={(val) => {
              onChangeHandler("grafted", val);
            }}
            className="loc_formSelectItem loc--grafted"
            options={GRAFTED_OPTIONS}
          />
          <Select
            label="Стерил./кастр."
            required
            value={data ? String(data.sterilized) : undefined}
            onChange={(val) => {
              onChangeHandler("sterilized", val);
            }}
            className="loc_formSelectItem loc--sterilized"
            options={STERILIZED_OPTIONS}
          />
          <Select
            label="Вид"
            required
            value={data ? String(data.kind) : undefined}
            onChange={(val) => {
              onChangeHandler("kind", val);
            }}
            className="loc_formSelectItem loc--kind"
            options={KIND_OPTIONS}
          />
          <Select
            label="Статус"
            required
            value={data ? String(data.status) : undefined}
            onChange={(val) => {
              onChangeHandler("status", val);
            }}
            className="loc_formSelectItem loc--status"
            options={STATUS_OPTIONS_CR_UP}
          />
          <DatePicker
            label="Дата рождения"
            required
            onChange={(val) => {
              onChangeHandler("birthdate", val / 1000);
            }}
            value={
              data?.birthdate && Number(data?.birthdate)
                ? new Date(Number(data.birthdate * 1000))
                : undefined
            }
            className="loc_formDateItem"
          />
          <InputText
            label="Порода"
            initValue={data ? data.breed : undefined}
            onChange={(val) => {
              onChangeHandler("breed", val.toLowerCase());
            }}
            className="loc_formInputItem"
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
        </div>

        <div className="loc_right">
          <Textarea
            value={data ? data.short_description : undefined}
            maxWords={128}
            onChange={(val) => {
              onChangeHandler("short_description", val);
            }}
            label="Краткое описание"
            required
            className="loc_formTextareaItem loc__shortdescription"
          />
          <Textarea
            value={data ? data.description : undefined}
            onChange={(val) => {
              onChangeHandler("description", val);
            }}
            label="Полное описание"
            required
            className="loc_formTextareaItem loc__fulldescription"
          />
        </div>
      </div>

      <div className="loc_photos">
        <h2>Фото</h2>
        <div className="loc_left">
          {(mainImagePrevIsDeletedState === true || !mainImagePrevState) && (
            <InputFileImageWithCrop
              label="Главное фото"
              cropAspect={1}
              required
              setImage={setMainImageHandler}
            />
          )}
          {!!mainImagePrevState && (
            <InputPrevLoadedImages
              images={[1]}
              deletedImages={mainImagePrevIsDeletedState ? [1] : []}
              label="Главное фото (ранее загруженное)"
              removeImage={removeMainImageHandler}
              restoreImage={restoreMainImageHandler}
              prepareUrlFunc={() => (data ? getMainImageUrl(data, SIZES_MAIN.SQUARE) : "")}
            />
          )}
        </div>
        <div className="loc_right">
          <InputFileImages
                           label="Дополнительные фото" multiple setImage={setAnotherImagesHandler} />

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
