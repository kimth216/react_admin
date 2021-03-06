// base
import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { Delta } from 'quill';

// components
import { Spinner } from 'components';
import CustomToolbar from './CustomToolbar';

import InstagramFormat from './InstagramFormat';
import HtmlFormat from './HtmlFormat';

// lib
import { uploadImage } from 'lib/protocols';
import { getThumbUrl } from 'lib/utils';

// define
import 'react-quill/dist/quill.snow.css';
import './index.less';

// assets
import largeQuotationTop from '../../assets/images/textEditor/ico-large-quotation-top.png';
import largeQuotationBottom from '../../assets/images/textEditor/ico-large-quotation-bottom.png';
import mediumQuotationTop from '../../assets/images/textEditor/ico-medium-quotation-top.png';
import mediumQuotationBottom from '../../assets/images/textEditor/ico-medium-quotation-bottom.png';
import smallQuotationTop from '../../assets/images/textEditor/ico-small-quotation-top.png';
import smallQuotationBottom from '../../assets/images/textEditor/ico-small-quotation-bottom.png';

Quill.register({
  'formats/instagram': InstagramFormat,
  'formats/html': HtmlFormat,
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

  const quotationHandler = (value: string) => {
    let selectIndex = saveSelectionlocal();
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      if (!selectIndex) {
        selectIndex = 0;
      }

      editor.insertText(selectIndex,'\n')
      if (value === 'small') {
        editor.insertEmbed(selectIndex, 'image', smallQuotationBottom);
      } else if (value === 'medium') {
        editor.insertEmbed(selectIndex, 'image', mediumQuotationBottom);
      } else if (value === 'large') {
        editor.insertEmbed(selectIndex, 'image', largeQuotationBottom);
      }
      editor.insertText(selectIndex,'\n\n')
      editor.insertText(selectIndex,'인용구를 입력해주세요.')
      editor.insertText(selectIndex,'\n\n')
      if (value === 'small') {
        editor.insertEmbed(selectIndex, 'image', smallQuotationTop);
      } else if (value === 'medium') {
        editor.insertEmbed(selectIndex, 'image', mediumQuotationTop);
      } else if (value === 'large') {
        editor.insertEmbed(selectIndex, 'image', largeQuotationTop);
      }
      editor.insertText(selectIndex,'\n')
      editor.blur();
    }
  }

  const lineHandler = () => {
    let selectIndex = saveSelectionlocal();
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      if (!selectIndex) {
        selectIndex = 0;
      }

      editor.insertText(selectIndex,'\n')
      editor.insertEmbed(selectIndex, 'html', 'line')
      editor.insertText(selectIndex,'\n')
      editor.blur();
    }
  }

  const saveSelectionlocal = () => {
    const editor = quillRef.current;
    if (editor) {
      const range = editor.getEditor().getSelection();
      if (range) {
        return range.index;
      }
    }
    return 0;
  }

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
        quill={Quill}
        instagramTool={instagramTool}
        saveSelection={saveSelection}
        imageHandler={imageHandler}
        instagramHandler={instagramHandler}
        quotationHandler={value => quotationHandler(value)}
        lineHandler={lineHandler}
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
