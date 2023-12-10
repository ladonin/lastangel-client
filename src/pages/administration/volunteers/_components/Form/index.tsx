import React, { useEffect, useState, useRef } from "react";

// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";
import { getVideoUrl, getAnotherImagesUrl, getMainImageUrl } from "helpers/volunteers";
import { IS_PUBLISHED_OPTIONS } from "constants/volunteers";
import InputText from "components/Form/InputText";
import InputFileImageWithCrop from "components/Form/InputFileImageWithCrop";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImages from "components/Form/InputFileImages";
import InputFileVideo from "components/Form/InputFileVideo";
import DatePicker from "components/Form/DatePicker";
import Select from "components/Form/Select";
import Textarea from "components/Form/Textarea";
import { Checkbox } from "components/Form/Checkbox";

import { TGetResponseItem } from "api/types/volunteers";

import { SIZES_MAIN, SIZES_ANOTHER } from "constants/photos";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: any; // TGetResponseItem;
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
    <div className="page-administration_volunteers_form_component">
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
            label="ФИО"
            initValue={data ? data.fio : undefined}
            onChange={(val) => {
              onChangeHandler("fio", val);
            }}
            className="loc_formInputItem"
          />
          <DatePicker
            label="Дата рождения"
            openToDate={new Date("Sun Jan 1 1985 00:00:00 GMT+0300")}
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
            label="Номер телефона"
            initValue={data ? data.phone : undefined}
            type="phone"
            onChange={(val) => {
              onChangeHandler("phone", val.toLowerCase());
            }}
            className="loc_formInputItem"
          />

          <InputText
            label="Ссылка на VK"
            initValue={data ? data.vk_link : undefined}
            onChange={(val) => {
              onChangeHandler("vk_link", val.toLowerCase());
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Ссылка на OK"
            initValue={data ? data.ok_link : undefined}
            onChange={(val) => {
              onChangeHandler("ok_link", val.toLowerCase());
            }}
            className="loc_formInputItem"
          />
          <InputText
            label="Ссылка на INSTAGRAM"
            initValue={data ? data.inst_link : undefined}
            onChange={(val) => {
              onChangeHandler("inst_link", val.toLowerCase());
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
        </div>

        <div className="loc_right">
          <Textarea
            value={data ? data.short_description : undefined}
            maxWords={128}
            required
            onChange={(val) => {
              onChangeHandler("short_description", val);
            }}
            label="Краткое описание"
            className="loc_formTextareaItem loc__shortdescription"
          />
          <Textarea
            value={data ? data.description : undefined}
            required
            onChange={(val) => {
              onChangeHandler("description", val);
            }}
            label="Полное описание"
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
            label="Дополнительные фото"
            multiple
            setImage={setAnotherImagesHandler}
          />

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
