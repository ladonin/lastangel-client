import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { loadItem } from "utils/localStorage";
import "./style.scss";
import { AnimalsApi } from "api/animals";
import { COLLECTIONS_TYPE, TYPES_OPTIONS, STATUSES_OPTIONS } from "constants/collections";
import InputText from "components/Form/InputText";
import InputNumber from "components/Form/InputNumber";

import InputFileImageWithCrop from "components/Form/InputFileImageWithCrop";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImage from "components/Form/InputFileImage";
import Select from "components/Form/Select";
import Textarea from "components/Form/Textarea";
import { Checkbox } from "components/Form/Checkbox";
import { ValuesOf } from "types/common";

import { TGetResponseItem } from "api/types/collections";
import { getMainImageUrl, getAnotherImagesUrl, getVideoUrl } from "helpers/collections";
import { SIZES_MAIN, SIZES_ANOTHER } from "constants/photos";
import InputFileVideo from "components/Form/InputFileVideo";
import { ANIMALS_STATUS } from "../../../../../constants/animals";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const needTypeAnimalId = (type: ValuesOf<typeof COLLECTIONS_TYPE>) =>
  type === COLLECTIONS_TYPE.MEDICINE || type === COLLECTIONS_TYPE.BUY_FOR_PET;

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const [isMajorState, setIsMajorState] = useState(false);
  const [animalsOptionsState, setAnimalsOptionsState] = useState<
    { value: string; label: string }[]
  >([]);
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
  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);
  useEffect(() => {
    if (data) {
      data.another_images && setAnotherImagesPrevState(JSON.parse(data.another_images));
      Number(data.main_image) && setMainImagePrevState(Number(data.main_image));
      setIsMajorState(!!data.ismajor);

      paramsRef.current = data;
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
  }, []);
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

  const setVideo1Handler = (val: null | File) => {
    onChangeHandler("video1", val);
  };
  const setVideo2Handler = (val: null | File) => {
    onChangeHandler("video2", val);
  };
  const setVideo3Handler = (val: null | File) => {
    onChangeHandler("video3", val);
  };

  return (
    <div className="page-administration_collections_form_component">
      <div className="loc_form">
        <div className="loc_left">
          <InputText
            required
            label="Наименование"
            initValue={data ? data.name : undefined}
            onChange={(val) => {
              onChangeHandler("name", val);
            }}
            className="loc_formInputItem"
          />
          <Select
            label="Статус"
            required
            value={data ? String(data.status) : undefined}
            onChange={(val) => {
              onChangeHandler("status", val);
            }}
            className="loc_formSelectItem"
            options={STATUSES_OPTIONS}
          />
          <InputNumber
            label="Сумма сбора, руб"
            required
            initValue={data ? data.target_sum : undefined}
            onChange={(val) => {
              onChangeHandler("target_sum", val);
            }}
            className="loc_formInputItem"
          />
          <Select
            label="Тип"
            required
            value={data ? String(data.type) : undefined}
            onChange={(val) => {
              onChangeHandler("type", val);
              forceUpdate();
            }}
            className="loc_formSelectItem"
            options={TYPES_OPTIONS}
          />

          <Select
            label="ID/Имя животного"
            required={needTypeAnimalId(paramsRef.current.type)}
            disabled={!needTypeAnimalId(paramsRef.current.type)}
            value={data ? String(data.animal_id) : undefined}
            onChange={(val) => {
              onChangeHandler("animal_id", val);
            }}
            className="loc_formSelectItem"
            options={animalsOptionsState}
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
          <InputFileImage label="Дополнительные фото" multiple setImage={setAnotherImagesHandler} />

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
