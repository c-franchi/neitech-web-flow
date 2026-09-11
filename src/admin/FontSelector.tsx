import React from 'react';

const FONT_OPTIONS = [
  { label: 'Padrão do sistema', value: '' },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Raleway', value: "'Raleway', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Merriweather', value: "'Merriweather', serif" },
  { label: 'Oswald', value: "'Oswald', sans-serif" },
  { label: 'Nunito', value: "'Nunito', sans-serif" },
  { label: 'Ubuntu', value: "'Ubuntu', sans-serif" },
  { label: 'PT Sans', value: "'PT Sans', sans-serif" },
  { label: 'Rubik', value: "'Rubik', sans-serif" },
  { label: 'Work Sans', value: "'Work Sans', sans-serif" },
  { label: 'Fira Sans', value: "'Fira Sans', sans-serif" },
  { label: 'Quicksand', value: "'Quicksand', sans-serif" },
  { label: 'Barlow', value: "'Barlow', sans-serif" },
  { label: 'DM Sans', value: "'DM Sans', sans-serif" },
];

const FONT_SIZE_OPTIONS = [
  { label: 'Padrão', value: '' },
  { label: 'Pequeno (14px)', value: '14px' },
  { label: 'Normal (16px)', value: '16px' },
  { label: 'Médio (18px)', value: '18px' },
  { label: 'Grande (20px)', value: '20px' },
  { label: 'Extra Grande (24px)', value: '24px' },
];

const FONT_WEIGHT_OPTIONS = [
  { label: 'Padrão', value: '' },
  { label: 'Leve (300)', value: '300' },
  { label: 'Normal (400)', value: '400' },
  { label: 'Médio (500)', value: '500' },
  { label: 'Semi-Negrito (600)', value: '600' },
  { label: 'Negrito (700)', value: '700' },
  { label: 'Extra Negrito (800)', value: '800' },
];

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (font: string) => void;
  type?: 'family' | 'size' | 'weight';
}

const FontSelector: React.FC<FontSelectorProps> = ({ label, value, onChange, type = 'family' }) => {
  const options = type === 'size' ? FONT_SIZE_OPTIONS : type === 'weight' ? FONT_WEIGHT_OPTIONS : FONT_OPTIONS;

  return (
    <div className="flex items-center gap-3 mb-2">
      <label className="block text-xs font-medium text-gray-600 min-w-[100px]">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-1.5 border rounded text-xs"
        style={type === 'family' && value ? { fontFamily: value } : {}}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={type === 'family' && opt.value ? { fontFamily: opt.value } : {}}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { FONT_OPTIONS };
export default FontSelector;
