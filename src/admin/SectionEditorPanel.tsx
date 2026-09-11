import React from 'react';
import { SiteSection } from './SiteSections';
import ImageUploader from './ImageUploader';
import RichTextEditor from './RichTextEditor';
import StyleEditorPanel, { SectionStyles } from './StyleEditorPanel';
import { Plus, Trash2 } from 'lucide-react';

const fieldLabels: Record<string, string> = {
  titulo: 'Título',
  subtitulo: 'Subtítulo',
  imagem: 'Imagem',
  cta: 'Texto do Botão',
  ctaLink: 'Link do Botão',
  texto: 'Texto',
  servicos: 'Serviços',
  projetos: 'Projetos',
  depoimentos: 'Depoimentos',
  aviso: 'Aviso',
  title: 'Título',
  description: 'Descrição',
  features: 'Recursos',
  icon: 'Ícone',
  category: 'Categoria',
  image: 'Imagem (URL)',
  link: 'Link do Projeto (URL)',
  technologies: 'Stack sugerida (separe por vírgula)',
  name: 'Nome',
  role: 'Cargo / Empresa',
  content: 'Depoimento',
  rating: 'Avaliação (1-5)',
  avatar: 'Avatar (URL)',
  id: 'ID',
  empresa: 'Empresa',
  logo: 'Logo (URL)',
  itens: 'Itens do Menu',
  label: 'Texto',
  href: 'Link',
  descricao: 'Descrição',
  email: 'E-mail',
  telefone: 'Telefone',
  whatsapp: 'WhatsApp (número)',
  cidade: 'Cidade',
  copyright: 'Copyright',
  linkServicos: 'Links de Serviços',
  linkEmpresa: 'Links da Empresa',
  redesSociais: 'Redes Sociais',
};

const getLabel = (field: string) => fieldLabels[field] || field;
const isImageField = (field: string) => /imagem|image|avatar/i.test(field);
const isRichTextField = (field: string) => /descricao|texto|sobre|html/i.test(field);

interface SectionEditorPanelProps {
  section: SiteSection;
  onFieldChange: (field: string, value: any) => void;
  onArrayItemChange: (field: string, index: number, subField: string, value: any) => void;
  onAddArrayItem: (field: string) => void;
  onRemoveArrayItem: (field: string, index: number) => void;
}

const SectionEditorPanel: React.FC<SectionEditorPanelProps> = ({
  section,
  onFieldChange,
  onArrayItemChange,
  onAddArrayItem,
  onRemoveArrayItem,
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(section.content).filter(([field]) => field !== 'styles').map(([field, value]) => {
        // Array de objetos
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
          return (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
                {getLabel(field)}
              </label>
              {value.map((item: Record<string, any>, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 mb-2 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => onRemoveArrayItem(field, idx)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="text-xs font-medium text-gray-400 mb-2">Item {idx + 1}</div>
                  {Object.entries(item).map(([subField, subValue]) => {
                    if (Array.isArray(subValue) && subValue.every(v => typeof v === 'string')) {
                      return (
                        <div key={subField} className="mb-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">{getLabel(subField)}</label>
                          <input
                            className="w-full p-1.5 border rounded text-sm"
                            value={subValue.join(', ')}
                            onChange={e => onArrayItemChange(field, idx, subField, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="Separar por vírgula"
                          />
                        </div>
                      );
                    }
                    if (typeof subValue === 'number') {
                      return (
                        <div key={subField} className="mb-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">{getLabel(subField)}</label>
                          <input
                            type="number"
                            className="w-full p-1.5 border rounded text-sm"
                            value={subValue}
                            onChange={e => onArrayItemChange(field, idx, subField, Number(e.target.value))}
                          />
                        </div>
                      );
                    }
                      if (typeof subValue === 'string') {
                      if (isImageField(subField)) {
                        return (
                          <div key={subField} className="mb-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">{getLabel(subField)}</label>
                            <ImageUploader
                              value={subValue}
                              onChange={(url) => onArrayItemChange(field, idx, subField, url)}
                              label=""
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={subField} className="mb-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">{getLabel(subField)}</label>
                          <input
                            className="w-full p-1.5 border rounded text-sm"
                            value={subValue}
                            onChange={e => onArrayItemChange(field, idx, subField, e.target.value)}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
              <button
                type="button"
                onClick={() => onAddArrayItem(field)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          );
        }

        // Array de strings
        if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
          return (
            <div key={field} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel(field)}</label>
              <input
                className="w-full p-2 border rounded text-sm"
                value={value.join(', ')}
                onChange={e => onFieldChange(field, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Separar por vírgula"
              />
            </div>
          );
        }

        // String — Imagem
        if (typeof value === 'string' && isImageField(field)) {
          return (
            <ImageUploader
              key={field}
              value={value}
              onChange={url => onFieldChange(field, url)}
              label={getLabel(field)}
            />
          );
        }

        // String — Rich Text
        if (typeof value === 'string' && isRichTextField(field)) {
          return (
            <RichTextEditor
              key={field}
              value={value}
              onChange={val => onFieldChange(field, val)}
              label={getLabel(field)}
            />
          );
        }

        // String — Texto simples
        if (typeof value === 'string') {
          return (
            <div key={field} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel(field)}</label>
              <input
                className="w-full p-2 border rounded text-sm"
                value={value}
                onChange={e => onFieldChange(field, e.target.value)}
              />
            </div>
          );
        }

        return null;
      })}

      {/* Painel de Estilos Visuais */}
      <StyleEditorPanel
        styles={(section.content.styles as SectionStyles) || {}}
        onChange={(newStyles) => onFieldChange('styles', newStyles)}
        sectionName={section.name}
      />
    </div>
  );
};

export default SectionEditorPanel;
