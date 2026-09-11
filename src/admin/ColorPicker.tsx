import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <label className="block text-xs font-medium text-gray-600 min-w-[100px]">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 p-1.5 border rounded text-xs font-mono"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-gray-400 hover:text-red-500"
            title="Limpar cor"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
