import React, { PropsWithChildren, useState, useMemo } from "react";
import cn from "classnames";
import { NavLink } from "react-router-dom";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Modal from "components/Modal";
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  setVideo: (files: File | null) => void;
  getVideoUrl: (data: any, name: string) => string;
  value?: string;
  data: any | { updated: number; id: number };
};

type TWrongVideoData = { file: File; error: string };

const InputFileVideo: React.FC<PropsWithChildren<TProps>> = (props) => {
  const {
    className,
    data,
    getVideoUrl,
    label,
    required,
    disabled = false,
    setVideo,
    value = "",
  } = props;
  const [videoState, setVideoState] = useState<File | null | string>(value || null);
  const [wrongVideoState, setWrongVideoState] = useState<TWrongVideoData | null>(null);
  const [modalDeleteIsOpenState, setModalDeleteIsOpenState] = useState<boolean>(false);
  // const { className, setVideo, label, required, disabled = false, multiple = false, noSizeRevision = false } = props;
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const setVideoHandler = (file: File) => {
    const parts = file.name.split(".");
    if (parts.length > 1) {
      const ext = parts.pop();
      if (file.size > 200000000 && ext !== "mp4" && ext !== "ogg" && ext !== "webm") {
        setWrongVideoState({
          error: `Некорректное разрешение файла: ${ext}`,
          file,
        });
      } else {
        setVideoState(file);
        setVideo(file);
        setWrongVideoState(null);
      }
    } else {
      setWrongVideoState({
        error: "Некорректный файл",
        file,
      });
    }
  };
  const deleteHandler = () => {
    setVideoState(null);
    setVideo(null);
    setWrongVideoState(null);
    setModalDeleteIsOpenState(false);
  };

  const renderVideo = () => {
    const valFile: File = videoState as File;
    const valStr: string = videoState as string;

    return (
      <div className={cn("loc_name", { "loc--existed": !valFile?.name })}>
        {valFile?.name ? (
          valFile?.name
        ) : valStr ? (
          <NavLink className="link_2" to={getVideoUrl(data, valStr)} target="_blank">
            ранее загруженное видео
          </NavLink>
        ) : (
          ""
        )}

        <div className="loc_deleteButton" onClick={() => setModalDeleteIsOpenState(true)}>
          удалить
        </div>

        <Modal
          isOpen={modalDeleteIsOpenState}
          title="Удаление доната"
          onClose={() => setModalDeleteIsOpenState(false)}
          portalClassName="page-administration_donations_update_deleteModal"
        >
          Вы уверены, что хотите удалить видео?
          <div className="loc_buttons">
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.DANGER}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={deleteHandler}
            >
              Удалить
            </Button>
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={() => setModalDeleteIsOpenState(false)}
            >
              Отмена
            </Button>
          </div>
        </Modal>
      </div>
    );
  };

  return (
    <div className={cn("component-inputFileVideo", className)}>
      {label && (
        <div className="loc_labelTitle">
          {label} {required && <span className="red">*</span>}
        </div>
      )}

      <label className="loc_label">
        <input
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          disabled={disabled}
          onChange={(event) => {
            event.target.files && setVideoHandler([...event.target.files][0]);
          }}
        />
        <span className="loc_selectFile">Выберите файл</span>
      </label>
      {videoState && <div className="loc_video">{renderVideo()}</div>}
      {!!wrongVideoState && (
        <div className="loc_error">
          {wrongVideoState.error} -{" "}
          <span className="loc_errorFileName">{wrongVideoState.file.name}</span>
        </div>
      )}
    </div>
  );
};

export default InputFileVideo;
