/*
  import WYSIWYGEditor from 'components/Form/WYSIWYGEditor'
 */

import React, { useRef, useState, useMemo, useEffect } from "react";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
// Не грузит стили из папки suneditor - мешают настройки package.json библиотеки
import "./suneditor.min.css";
import plugins from "suneditor/src/plugins";
import cn from "classnames";
import { loadItem } from "utils/localStorage";
import "./style.scss";

type TProps = {
  id: string;
  label?: string;
  className?: string;
  value?: string;
  required?: boolean;
  mobileVersion?: boolean;
  onChange: (val: string) => void;
  description?: string;
};
const WYSIWYGEditor: React.FC<TProps> = ({
  id,
  label,
  mobileVersion,
  className,
  value,
  required,
  onChange,
  description,
}) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  const handleChange = (content: string) => {
    onChange(content);
  };
  return (
    <div
      id={id}
      className={cn("component-WYSIWYGEditor", className, {
        "loc--isMobileVersion": !!mobileVersion,
      })}
    >
      <div className="loc_wrapper">
        {label && (
          <a className="link_text" href={`#${id}`}>
            <label>
              {label} {required && <span className="red">*</span>}
            </label>
          </a>
        )}
        {description && <div className="form-element-description">{description}</div>}
        <SunEditor
          onChange={handleChange}
          defaultValue={value}
          setOptions={{
            height: isMobile ? "85vh" : "85vh",

            plugins,
            buttonList: [
              ["undo", "redo"],
              ["fontSize", "formatBlock"],
              ["paragraphStyle", "blockquote"],
              ["bold", "underline", "italic", "strike", "subscript", "superscript"],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              "/", // Line break
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
              /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
              ["fullScreen", "showBlocks", "codeView"],
              ["preview", "print"],
              ["save" /* , "template" */],
              /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
            ],
          }}
          getSunEditorInstance={getSunEditorInstance}
        />
        
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
