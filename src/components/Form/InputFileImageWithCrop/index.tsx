/*
  import InputFileImageWithCrop from 'components/Form/InputFileImageWithCrop'

  Форма загрузки картинки с кропом
 */

import React, { PropsWithChildren, useEffect, useMemo, useState, useCallback } from "react";

import cn from "classnames";
import Cropper, { Area } from "react-easy-crop";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { DIMENTIONS } from "constants/photos";

import { loadItem } from "utils/localStorage";

import { useGetImageDataHook, TData as TImageData } from "hooks/useGetImageDataHook";

import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Modal from "components/Modal";
import getCroppedImg from "./utils";

import "./style.scss";

type TProps = {
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  cropAspect: number;
  setImage: (cropped: Blob, original: Blob) => void;
  description?: string;
};

type TWrongImageData = TImageData & { error: string };
type TCrop = { x: number; y: number };

const CROP_DEFAULT: TCrop = { x: 0, y: 0 };

const InputFileImageWithCrop: React.FC<PropsWithChildren<TProps>> = (props) => {
  const { className, setImage, label, required, disabled = false, cropAspect, description } = props;
  const { loadImgs: loadImg, imgsResult: imgResult } = useGetImageDataHook();
  const [imageState, setImageState] = useState<File | null>(null);
  const [croppedImageState, setCroppedImageState] = useState<string | null>(null);
  const [croppedImageBlobState, setCroppedImageBlobState] = useState<Blob | null>(null);
  const [cropResultState, setCropResultState] = useState<{
    pixels: Area;
    percents: Area;
  } | null>(null);
  const [imageWasCroppedState, setImageWasCroppedState] = useState<boolean>(false);
  const [openCropModalState, setOpenCropModalState] = useState<boolean>(false);
  const [cropState, setCropState] = useState<TCrop>(CROP_DEFAULT);
  const [cropZoomState, setCropZoomState] = useState(1);
  const [cropMaxZoomState, setCropMaxZoomState] = useState(1);
  const [cropRotationState, setCropRotationState] = useState(0);
  const [wrongImageState, setWrongImageState] = useState<TWrongImageData | null>(null);
  const setImageHandler = (photo: File) => {
    loadImg([photo]);
  };
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    if (imgResult === null) return;
    let error = null;
    const data = imgResult[0];
    const extension = data.file.type.split("/")[1];
    const availableExtensions: string[] = (DIMENTIONS.IMAGES_UPLOAD_EXTENSIONS || "").split("|");

    if (!availableExtensions.includes(extension)) {
      error = {
        ...data,
        error: `Текущее расширение файла не поддерживается. Должно быть ${availableExtensions.join(
          ", "
        )}`,
      };
    } else if (
      Number(data.width) < DIMENTIONS.IMAGES_UPLOAD_MIN_WIDTH ||
      Number(data.height) < DIMENTIONS.IMAGES_UPLOAD_MIN_HEIGHT
    ) {
      error = { ...data, error: "Фото слишком мелкое" };
    } else if (
      Number(data.width) > DIMENTIONS.IMAGES_UPLOAD_MAX_WIDTH ||
      Number(data.height) > DIMENTIONS.IMAGES_UPLOAD_MAX_HEIGHT
    ) {
      error = { ...data, error: "Фото слишком большое" };
    } else {
      setImageState(data.file);

      // Вычисляем максимальный зум
      const widthZoom =
        (Number(data.width) * cropAspect) / Number(DIMENTIONS.IMAGES_UPLOAD_MIN_WIDTH);
      const heightZoom =
        Number(data.height) / cropAspect / Number(DIMENTIONS.IMAGES_UPLOAD_MIN_HEIGHT);
      const maxZoom = Math.min(widthZoom, heightZoom);
      setCropMaxZoomState(maxZoom < 1 ? 1 : maxZoom);
    }

    setWrongImageState(error);
  }, [imgResult]);

  useEffect(() => {
    if (croppedImageBlobState !== null && imageState !== null) {
      setImage(croppedImageBlobState, imageState);
    }
  }, [croppedImageBlobState]);

  useEffect(() => {
    imageState && setOpenCropModalState(true);
  }, [imageState]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setImageWasCroppedState(true);
      setCropResultState({ pixels: croppedAreaPixels, percents: croppedArea });
    },
    [imageState]
  );

  const urlForCrop = useMemo(
    () => (imageState ? URL.createObjectURL(imageState) : ""),
    [imageState]
  );

  const createCroppedImage = useCallback(async () => {
    if (!imageState || !cropResultState) return;

    const croppedImage: Blob | null = await getCroppedImg(
      URL.createObjectURL(imageState),
      cropResultState.pixels,
      cropRotationState
    );
    if (croppedImage === null) return;

    setCropState(CROP_DEFAULT);
    setCropRotationState(0);
    setCropZoomState(1);

    setCroppedImageState(URL.createObjectURL(croppedImage));
    setCroppedImageBlobState(croppedImage);
  }, [cropResultState, 0, imageState]);

  const saveCrop = () => {
    setOpenCropModalState(false);
    createCroppedImage();
  };

  const needRenderCropModal = () => !!urlForCrop;

  return (
    <div className={cn("component-inputFileImageWithCrop", className)}>
      {label && (
        <div className="loc_labelTitle">
          {label} {required && <span className="red">*</span>}
        </div>
      )}
      <Modal
        isOpen={needRenderCropModal() && (!imageWasCroppedState || openCropModalState)}
        title="Подготовка фото"
        onClose={saveCrop}
        portalClassName={cn("component-inputFileImageWithCrop_cropModal", {
          "loc--isMobile": isMobile,
        })}
      >
        <div className="loc_wrapper">
          <div className="loc_zoom">
            <div className="loc_lable">Масштаб</div>
            <Slider
              onChange={(nextValues) => {
                setCropZoomState(nextValues as number);
              }}
              min={1}
              max={cropMaxZoomState}
              defaultValue={1}
              value={cropZoomState}
              step={0.1}
            />
          </div>
          <div className="loc_rotation">
            <div className="loc_lable">Поворот</div>
            <Slider
              onChange={(nextValues) => {
                setCropRotationState(nextValues as number);
              }}
              min={0}
              max={360}
              defaultValue={0}
              value={cropRotationState}
              step={1}
            />
          </div>
          <div className="loc_crop">
            <Cropper
              image={urlForCrop}
              crop={cropState}
              zoom={cropZoomState}
              minZoom={1}
              maxZoom={cropMaxZoomState || 1}
              rotation={cropRotationState}
              aspect={cropAspect}
              onCropChange={setCropState}
              onCropComplete={onCropComplete}
              onZoomChange={setCropZoomState}
              onRotationChange={setCropRotationState}
            />
          </div>

          <Button
            className="loc_okButton"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            onClick={saveCrop}
          >
            Готово
          </Button>
        </div>
      </Modal>

      <label className="loc_label">
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          disabled={disabled}
          onChange={(event) => {
            event.target.files && setImageHandler([...event.target.files][0]);
          }}
        />
        <span className="loc_selectFile">Выберите файл</span>

        {description && <div className="form-element-description loc--photo">{description}</div>}
      </label>

      {/* imageState !== null && cropAspect === 1 && (
        <div className="loc_description">
          Внимание. Фото должно быть строго квадратным.
        </div>
      ) */}

      {croppedImageState && (
        <div className="loc_image">
          <img alt="not found" src={croppedImageState} />
        </div>
      )}

      {!!wrongImageState && (
        <div className="loc_error">
          {wrongImageState.error} -{" "}
          <span className="loc_errorFileName">{wrongImageState.file.name}</span>
        </div>
      )}
    </div>
  );
};

export default InputFileImageWithCrop;
