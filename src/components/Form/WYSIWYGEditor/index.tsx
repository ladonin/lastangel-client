/*
  import WYSIWYGEditor from 'components/Form/WYSIWYGEditor'
 */

import React, { useRef, useState, useEffect, useMemo } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import cn from "classnames";
import { loadItem } from "utils/localStorage";
import "./style.scss";
type TProps = {
  label?: string;
  className?: string;
  value?: string;
  required?: boolean;
  onChange: (val: string) => void;
};
const Textarea: React.FC<TProps> = ({ label, className, value, required, onChange }) => {
  const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
  const valueInited = useRef(false);

  useEffect(() => {
    if (value && !valueInited.current) {
      valueInited.current = true;
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [value]);

  const onEditorStateChange = (editorVal: any) => {
    setEditorState(editorVal);

    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <div className={cn("component-WYSIWYGEditor", className)}>
      <div className="loc_wrapper">
        {label && (
          <label>
            {label} {required && <span className="red">*</span>}
          </label>
        )}

        <Editor
          editorState={editorState}
          wrapperClassName="loc_wrapper"
          editorClassName="loc_editor"
          onEditorStateChange={onEditorStateChange}
          handlePastedText={(
            text: string,
            html: string,
            editorState: EditorState,
            onChange: (editorState: EditorState) => void
          ) => {
            const contentBlock = htmlToDraft(text);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              setEditorState(EditorState.createWithContent(contentState));
            }
            return false;
          }}
          toolbar={{
            fontSize: {
              className: "hidden",
            },
            fontFamily: {
              className: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Textarea;
