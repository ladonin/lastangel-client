/*
  import InputFileImages from 'components/Form/InputFileImages'

  Форма загрузки картинки(ок) без кропа
 */

import React, { PropsWithChildren, useEffect, useState } from "react";

import cn from "classnames";

import { Button, ButtonThemes } from "components/Button";

import { DIMENTIONS } from "constants/photos";

import { useGetImageDataHook, TData as TImageData } from "hooks/useGetImageDataHook";

import "./style.scss";

type TProps = {
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  noSizeRevision?: boolean;
  setImage: (files: File[] | File) => void;
  description?: string;
};

type TWrongImageData = TImageData & { error: string };

const InputFileImages: React.FC<PropsWithChildren<TProps>> = (props) => {
  const {
    className,
    setImage,
    label,
    required,
    disabled = false,
    multiple = false,
    noSizeRevision = false,
    description,
  } = props;

  const { loadImgs, imgsResult } = useGetImageDataHook();
  const [imagesState, setImagesState] = useState<File[] | null>(null);
  const [wrongImagesState, setWrongImagesState] = useState<TWrongImageData[]>([]);
  const setImageHandler = (photos: File[]) => {
    loadImgs(photos);
  };

  useEffect(() => {
    if (imgsResult === null) return;
    const goodImages: File[] = [];
    const wrongImages: TWrongImageData[] = [];

    imgsResult.map((data) => {
      const extension = data.file.type.split("/")[1];
      const availableExtensions: string[] = DIMENTIONS.IMAGES_UPLOAD_EXTENSIONS.split("|");

      if (!availableExtensions.includes(extension)) {
        wrongImages.push({
          ...data,
          error: `Текущее расширение файла не поддерживается. 
          Должно быть ${availableExtensions.join(", ")}`,
        });
      } else if (
        (!noSizeRevision && Number(data.width) < DIMENTIONS.IMAGES_UPLOAD_MIN_WIDTH) ||
        (!noSizeRevision && Number(data.height) < DIMENTIONS.IMAGES_UPLOAD_MIN_HEIGHT)
      ) {
        wrongImages.push({
          ...data,
          error: `Фото слишком мелкое: ${Number(data.width)}x${Number(
            data.height
          )}. Нужно как минимум ${DIMENTIONS.IMAGES_UPLOAD_MIN_WIDTH}x${
            DIMENTIONS.IMAGES_UPLOAD_MIN_HEIGHT
          }`,
        });
      } else if (
        Number(data.width) > DIMENTIONS.IMAGES_UPLOAD_MAX_WIDTH ||
        Number(data.height) > DIMENTIONS.IMAGES_UPLOAD_MAX_HEIGHT
      ) {
        wrongImages.push({ ...data, error: "Фото слишком большое" });
      } else {
        goodImages.push(data.file);
      }
    });
    setImagesState([...(imagesState === null ? [] : imagesState), ...goodImages]);
    setWrongImagesState(wrongImages);
  }, [imgsResult]);

  useEffect(() => {
    imagesState && setImage(imagesState);
  }, [imagesState]);

  const renderImages = (images: File[]) =>
    images.length
      ? images
          .slice()
          .reverse()
          .map((img: File, index) => (
            <div className="loc_image" key={index}>
              <img alt="not found" src={URL.createObjectURL(img)} />
              <Button
                theme={ButtonThemes.DELETE_ICON}
                className={cn("loc_delete")}
                onClick={() => {
                  imagesState &&
                    setImagesState(
                      imagesState
                        .slice()
                        .reverse()
                        .filter((val: File, ind: number) => ind !== index)
                        .reverse()
                    );
                }}
                tooltip="Удалить"
              />
            </div>
          ))
      : null;

  return (
    <div className={cn("component-inputFileImage", className)}>
      {label && (
        <div className="loc_labelTitle">
          {label} {required && <span className="red">*</span>}
        </div>
      )}

      <label className="loc_label">
        <input
          type="file"
          multiple={multiple}
          accept="image/png, image/jpeg, image/gif"
          disabled={disabled}
          onChange={(event) => {
            event.target.files && setImageHandler([...event.target.files]);
          }}
        />
        <span className="loc_selectFile">Выберите файл</span>
        {description && <div className="form-element-description loc--photo">{description}</div>}
      </label>

      {imagesState && <div className="loc_images">{renderImages(imagesState as File[])}</div>}
      {!!wrongImagesState.length && (
        <>
          {wrongImagesState.map(({ file, error }, index) => (
            <div key={index} className="loc_error">
              {error} - <span className="loc_errorFileName">{file.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default InputFileImages;
