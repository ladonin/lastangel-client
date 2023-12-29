/*
  import InputPrevLoadedImages from 'components/Form/InputPrevLoadedImages'
  Перечень загруженных ранее изображений с возможностью удаления/восстановления
 */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Button, ButtonThemes } from "components/Button";
import "./style.scss";

type TPrevImagesProps = {
  images: number[];
  deletedImages?: number[] | null;
  className?: string;
  label?: string;
  removeImage: (img: number) => void;
  restoreImage: (img: number) => void;
  prepareUrlFunc: (img: number) => string;
  description?: string;
};

const InputPrevLoadedImages = ({
  images,
  deletedImages,
  className,
  label,
  removeImage,
  restoreImage,
  prepareUrlFunc,
  description,
}: TPrevImagesProps) => {
  const [imagesState, setImagesState] = useState<number[]>([]);

  useEffect(() => {
    images && setImagesState(images);
  }, [images]);
  const isDeleted = (img: number) => deletedImages && deletedImages.includes(img);

  const renderImages = () =>
    imagesState.length
      ? imagesState
          .slice()
          .reverse()
          .map((img: number, index) => (
            <div className="loc_image" key={index}>
              <img
                alt="not found"
                src={prepareUrlFunc(img)}
                className={isDeleted(img) ? "loc--deleted" : undefined}
              />

              {!isDeleted(img) && (
                <Button
                  theme={ButtonThemes.DELETE_ICON}
                  className={cn("loc_delete")}
                  onClick={() => {
                    removeImage(img);
                  }}
                  tooltip="Удалить"
                />
              )}

              {isDeleted(img) && (
                <Button
                  theme={ButtonThemes.RESTORE_ICON}
                  className={cn("loc_restore")}
                  onClick={() => {
                    restoreImage(img);
                  }}
                  tooltip="Восстановить"
                />
              )}
            </div>
          ))
      : null;

  return (
    <div className={cn("component-inputPrevLoadedImages", className)}>
      {label && <div className="loc_labelTitle">{label}</div>}
      {description && <div className="form-element-description loc--photo">{description}</div>}
      <div className="loc_images">{renderImages()}</div>
    </div>
  );
};

export default InputPrevLoadedImages;
