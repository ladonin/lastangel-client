import React, { PropsWithChildren, useState } from "react";
import cn from "classnames";
import "./style.scss";

type TProps = {
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  setVideo: (files: File | null) => void;
  value?: string;
};

type TWrongVideoData = { file: File; error: string };

const InputFileVideo: React.FC<PropsWithChildren<TProps>> = (props) => {
  const [videoState, setVideoState] = useState<File | null>(null);
  const [wrongVideoState, setWrongVideoState] = useState<TWrongVideoData | null>(null);

  // const { className, setVideo, label, required, disabled = false, multiple = false, noSizeRevision = false } = props;
  const { className, label, required, disabled = false, setVideo, value } = props;
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
  };
  const renderVideo = () => (
    <div className="loc_name">
      {videoState?.name}

      <div className="loc_deleteButton" onClick={deleteHandler}>
        удалить
      </div>
    </div>
  );

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
          {wrongVideoState.error} - <span className="loc_errorFileName">{wrongVideoState.file.name}</span>
        </div>
      )}
    </div>
  );
};

export default InputFileVideo;
