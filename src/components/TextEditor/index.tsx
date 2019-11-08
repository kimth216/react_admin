// base
import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { Delta } from 'quill';

// components
import { Spinner } from 'components';
import CustomToolbar from './CustomToolbar';

import InstagramFormat from './InstagramFormat';

// lib
import { uploadImage } from 'lib/protocols';
import { getThumbUrl } from 'lib/utils';

// assets
import 'react-quill/dist/quill.snow.css';

import './index.less';

Quill.register({
  'formats/instagram': InstagramFormat,
});

interface TextEditorProps {
  name?: string;
  initialValue?: string;
  instagramTool?: boolean;
  onChange?: (value: string) => void;
}

const TextEditor = React.forwardRef<ReactQuill, TextEditorProps>((props: TextEditorProps, ref) => {
  const { name = 'editor', initialValue, instagramTool = true, onChange } = props;

  const quillRef = useRef<ReactQuill>(null);

  const [selection, setSelection] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const instagramHandler = (value: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      editor.insertEmbed(selection, 'instagram', value);
      editor.blur();
    }
  };

  const imageHandler = async (file: File) => {
    setInProgress(true);

    const res = await uploadImage(file);

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      editor.insertEmbed(selection, 'image', getThumbUrl(res.data.fileKey, 540, 540, 'scale'));
      editor.blur();
    }

    setInProgress(false);
  };

  const instgramProcess = (delta: Delta) => {
    if (delta.ops) {
      delta.ops.forEach(op => {
        if (op.insert) {
          if (op.insert.instagram) {
            window.instgrm.Embeds.process();
          }
        }
      });
    }
  };

  const handleChange = (editor: any) => {
    if (onChange) {
      const contents = editor.getContents();

      instgramProcess(contents);

      setTimeout(() => {
        onChange(editor.getHTML());
      }, 1000);
    }
  };

  const saveSelection = () => {
    const editor = quillRef.current;
    if (editor) {
      const range = editor.getEditor().getSelection();

      if (range) {
        setSelection(range.index);
      }
    }
  };

  useEffect(() => {
    if (quillRef.current && initialValue) {
      const editor = quillRef.current.getEditor();

      editor.clipboard.dangerouslyPasteHTML(initialValue);

      window.scrollTo(0, 0);
    }
  }, [initialValue]);

  return (
    <div className={`text-editor ${name}`}>
      <CustomToolbar
        name={name}
        instagramTool={instagramTool}
        saveSelection={saveSelection}
        imageHandler={imageHandler}
        instagramHandler={instagramHandler}
      />
      <ReactQuill
        theme="snow"
        id={name}
        ref={quillRef}
        modules={{
          toolbar: `#${name}-toolbar`,
        }}
        onChange={(content, delta, source, editor) => handleChange(editor)}
        style={{
          height: 500,
        }}
      />
      {inProgress && <Spinner />}
    </div>
  );
});

export default TextEditor;
