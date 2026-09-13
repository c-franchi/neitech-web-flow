
import React, { useEffect, useState } from 'react';
import { SiteSection } from './SiteSections';
import { fetchSiteSections, updateSiteSection } from './firestoreSiteSections';
import { fetchSiteSectionsStaging, saveSiteSectionStaging, publishStagingToProduction } from './firestoreSiteSectionsStaging';
import { saveSectionVersion, fetchSectionVersions } from './firestoreSiteSectionVersions';
import ImageUploader from './ImageUploader';
import RichTextEditor from './RichTextEditor';
import StyleEditorPanel, { SectionStyles } from './StyleEditorPanel';
import { Plus, Trash2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

// Mapeamento de nomes de campos para labels amigáveis em português
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
  image: 'Imagem',
  link: 'Link do Projeto (URL)',
  technologies: 'Stack sugerida (separe por vírgula)',
  name: 'Nome',
  role: 'Cargo / Empresa',
  content: 'Depoimento',
  rating: 'Avaliação (1-5)',
  avatar: 'Avatar (URL)',
  id: 'ID',
};

const getLabel = (field: string) => fieldLabels[field] || field;

// Detecta tipo de campo para escolher o editor adequado
const isImageField = (field: string) => /imagem|image|avatar/i.test(field);
const isRichTextField = (field: string) => /descricao|texto|sobre|content|html/i.test(field);

// Componente para editar um único campo (string)
const FieldEditor: React.FC<{
  field: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ field, value, onChange }) => {
  if (isImageField(field)) {
    return <ImageUploader value={value} onChange={onChange} label={getLabel(field)} />;
  }
  if (isRichTextField(field)) {
    return <RichTextEditor value={value} onChange={onChange} label={getLabel(field)} />;
  }
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel(field)}</label>
      <input
        className="w-full p-2 border rounded"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

// Componente para editar um item de array (objeto com sub-campos)
const ArrayItemEditor: React.FC<{
  item: Record<string, any>;
  index: number;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ item, index, onChange, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 relative">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
        title="Remover item"
      >
        <Trash2 size={16} />
      </button>
      <div className="text-xs font-semibold text-gray-400 mb-2">Item {index + 1}</div>
      {Object.entries(item).map(([subField, subValue]) => {
        // Arrays dentro de itens (ex: features)
        if (Array.isArray(subValue) && subValue.every(v => typeof v === 'string')) {
          return (
            <div key={subField} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel(subField)}</label>
              <input
                className="w-full p-2 border rounded text-sm"
                value={subValue.join(', ')}
                onChange={e => onChange(index, subField, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Separar por vírgula"
              />
              <span className="text-xs text-gray-400">Separar por vírgula</span>
            </div>
          );
        }
        // Número (ex: rating, id)
        if (typeof subValue === 'number') {
          return (
            <div key={subField} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel(subField)}</label>
              <input
                type="number"
                className="w-full p-2 border rounded text-sm"
                value={subValue}
                onChange={e => onChange(index, subField, Number(e.target.value))}
              />
            </div>
          );
        }
        // String
        if (typeof subValue === 'string') {
          return (
            <FieldEditor
              key={subField}
              field={subField}
              value={subValue}
              onChange={val => onChange(index, subField, val)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

const AdminContentPanel: React.FC = () => {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<Record<string, any[]>>({});
  const [showHistory, setShowHistory] = useState<string | null>(null);

  useEffect(() => {
    // Admin content editing requires an authenticated admin (Google Sign-In via /admin).
    if (!auth.currentUser) {
      console.warn('AdminContentPanel: usuário não autenticado. Autentique via /admin (Google).');
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = previewMode ? await fetchSiteSectionsStaging() : await fetchSiteSections();
      setSections(data);
      setLoading(false);
    };
    load();
  }, [previewMode]);

  const handleFieldChange = (sectionId: string, field: string, value: any) => {
    setSections((prev) => prev.map(sec =>
      sec.id === sectionId ? { ...sec, content: { ...sec.content, [field]: value } } : sec
    ));
  };

  // Handler para edição de sub-campo de item de array
  const handleArrayItemChange = (sectionId: string, field: string, index: number, subField: string, value: any) => {
    setSections((prev) => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      const arr = [...(sec.content[field] || [])];
      arr[index] = { ...arr[index], [subField]: value };
      return { ...sec, content: { ...sec.content, [field]: arr } };
    }));
  };

  // Adicionar novo item ao array
  const handleAddArrayItem = (sectionId: string, field: string) => {
    setSections((prev) => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      const arr = [...(sec.content[field] || [])];
      // Cria novo item com mesma estrutura do primeiro item (valores vazios)
      const template = arr.length > 0
        ? Object.fromEntries(Object.entries(arr[0]).map(([k, v]) => {
            if (typeof v === 'number') return [k, k === 'id' ? arr.length + 1 : 0];
            if (Array.isArray(v)) return [k, []];
            return [k, ''];
          }))
        : {};
      arr.push(template);
      return { ...sec, content: { ...sec.content, [field]: arr } };
    }));
  };

  // Remover item do array
  const handleRemoveArrayItem = (sectionId: string, field: string, index: number) => {
    setSections((prev) => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      const arr = [...(sec.content[field] || [])];
      arr.splice(index, 1);
      return { ...sec, content: { ...sec.content, [field]: arr } };
    }));
  };

  const handleSave = async (section: SiteSection) => {
    if (previewMode) {
      await saveSiteSectionStaging(section);
      alert('Seção salva no modo staging!');
    } else {
      await updateSiteSection(section.id, section.content, 'admin');
      await saveSectionVersion(section, 'admin');
      alert('Seção salva e versão registrada!');
    }
  };

  const handlePublish = async () => {
    await publishStagingToProduction();
    alert('Alterações publicadas!');
    setPreviewMode(false);
  };

  const handleShowHistory = async (sectionId: string) => {
    const versions = await fetchSectionVersions(sectionId);
    setHistory((prev) => ({ ...prev, [sectionId]: versions }));
    setShowHistory(sectionId);
  };

  const handleRestoreVersion = async (sectionId: string, content: Record<string, any>) => {
    setSections((prev) => prev.map(sec =>
      sec.id === sectionId ? { ...sec, content } : sec
    ));
    setShowHistory(null);
    alert('Versão restaurada! Clique em Salvar para publicar.');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edição de Conteúdo do Site</h1>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button
          className={`px-4 py-2 rounded ${previewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-700 hover:text-white`}
          onClick={() => setPreviewMode(!previewMode)}
        >{previewMode ? 'Visualizando: Staging (Preview)' : 'Visualizando: Produção'}</button>
        <a
          href="/admin/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >Abrir Preview Visual</a>
        {previewMode && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handlePublish}
          >Publicar alterações</button>
        )}
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando seções...</div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="border rounded-lg p-6 bg-white shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{section.label}</h2>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                  onClick={() => handleShowHistory(section.id)}
                >Histórico de versões</button>
              </div>

              {Object.entries(section.content).filter(([field]) => field !== 'styles').map(([field, value]) => {
                // Array de objetos (serviços, projetos, depoimentos)
                if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
                  return (
                    <div key={field} className="mb-4">
                      <label className="block text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
                        {getLabel(field)}
                      </label>
                      {value.map((item: Record<string, any>, idx: number) => (
                        <ArrayItemEditor
                          key={idx}
                          item={item}
                          index={idx}
                          onChange={(i, subField, val) => handleArrayItemChange(section.id, field, i, subField, val)}
                          onRemove={(i) => handleRemoveArrayItem(section.id, field, i)}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddArrayItem(section.id, field)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors"
                      >
                        <Plus size={16} /> Adicionar item
                      </button>
                    </div>
                  );
                }

                // Array de strings (ex: lista de serviços no contato)
                if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
                  return (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel(field)}</label>
                      <input
                        className="w-full p-2 border rounded"
                        value={value.join(', ')}
                        onChange={e => handleFieldChange(section.id, field, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="Separar por vírgula"
                      />
                      <span className="text-xs text-gray-400">Separar por vírgula</span>
                    </div>
                  );
                }

                // String fields (image, rich text, plain text)
                if (typeof value === 'string') {
                  return (
                    <FieldEditor
                      key={field}
                      field={field}
                      value={value}
                      onChange={val => handleFieldChange(section.id, field, val)}
                    />
                  );
                }

                return null;
              })}

              {/* Painel de Estilos Visuais */}
              <StyleEditorPanel
                styles={(section.content.styles as SectionStyles) || {}}
                onChange={(newStyles) => handleFieldChange(section.id, 'styles', newStyles)}
                sectionName={section.name}
              />

              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleSave(section)}
              >Salvar</button>

              {/* Modal de histórico */}
              {showHistory === section.id && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                      onClick={() => setShowHistory(null)}
                    >Fechar</button>
                    <h3 className="text-lg font-bold mb-4">Histórico de versões</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {(history[section.id] || []).map((ver, idx) => (
                        <div key={ver.id || idx} className="border rounded p-3 bg-gray-50">
                          <div className="text-xs text-gray-500 mb-1">{ver.updatedAt?.toDate?.().toLocaleString?.() || ''} por {ver.updatedBy}</div>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-2">{JSON.stringify(ver.content, null, 2)}</pre>
                          <button
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                            onClick={() => handleRestoreVersion(section.id, ver.content)}
                          >Restaurar esta versão</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContentPanel;
