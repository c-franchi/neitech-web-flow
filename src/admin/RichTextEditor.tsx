
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
  return (
    <div className="mb-2">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <ReactQuill value={value} onChange={onChange} theme="snow" />
    </div>
  );
};

export default RichTextEditor;
