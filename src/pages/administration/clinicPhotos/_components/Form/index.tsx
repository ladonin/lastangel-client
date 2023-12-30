import React, { useEffect, useState, useRef } from "react";
import InputPrevLoadedImages from "components/Form/InputPrevLoadedImages";
import InputFileImages from "components/Form/InputFileImages";
import { TGetResponseItem } from "api/types/clinicPhotos";
import { getAnotherImagesUrl } from "helpers/clinicPhotos";
import { SIZES_ANOTHER } from "constants/photos";
import "./style.scss";

export type TParams = { [key: string]: any };

export type TResponse = TGetResponseItem;

type TProps = {
  onChange: (data: TParams) => void;
  data?: TGetResponseItem;
};

const Form: React.FC<TProps> = ({ onChange, data }) => {
  const [anotherImagesState, setAnotherImagesState] = useState<File[] | null>(null);
  const [anotherImagesPrevState, setAnotherImagesPrevState] = useState([]);
  const [anotherImagesForDeleteState, setAnotherImagesForDeleteState] = useState<number[] | null>(
    null
  );
  const paramsRef = useRef<TParams>({});

  const onChangeHandler = (key: string, value: any) => {
    paramsRef.current[key] = value.value ? Number(value.value) : value;
    onChange(paramsRef.current);
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
    if (data) {
      data.another_images && setAnotherImagesPrevState(JSON.parse(data.another_images));
      paramsRef.current = data;
    }
  }, [data]);

  useEffect(() => {
    anotherImagesState !== null && onChangeHandler("another_images", anotherImagesState);
  }, [anotherImagesState]);

  useEffect(() => {
    anotherImagesForDeleteState !== null &&
      onChangeHandler("another_images_for_delete", anotherImagesForDeleteState);
  }, [anotherImagesForDeleteState]);

  return (
    <div className="page-administration_clinic-photos_form_component">
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
                data ? getAnotherImagesUrl(data, img, SIZES_ANOTHER.SIZE_1200) : ""
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
