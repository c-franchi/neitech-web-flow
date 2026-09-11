import React, { useState } from 'react';
import { useState as useLocalState } from 'react';
import { fetchSiteSections, saveSiteSection } from '../admin/firestoreSiteSections';
import HeroSection from '../components/HeroSection';
import { useIsAdmin } from '../hooks/useIsAdmin';

type EditBlock = null | 'titulo' | 'subtitulo' | 'descricao' | `servico-${number}`;

const defaultServicos = [
  { icon: 'Code', text: 'Desenvolvimento Web' },
  { icon: 'Smartphone', text: 'Aplicativos Mobile' },
  { icon: 'Palette', text: 'Design Digital' },
];

const HeroSectionInlineEditor: React.FC = () => {
  const [editBlock, setEditBlock] = useState<EditBlock>(null);
  const [editMode, setEditMode] = useState(false);
  const isAdmin = useIsAdmin();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [draft, setDraft] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [titleStyle, setTitleStyle] = useLocalState({
    fontFamily: 'inherit',
    fontSize: '3rem',
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: 'normal',
    lineHeight: '1.1',
    textAlign: 'left',
  });

  React.useEffect(() => {
    fetchSiteSections().then((sections) => {
      const hero = sections.find((s) => s.name === 'hero');
      const content = hero?.content || {};
      setData(content);
      setDraft({
        ...content,
        servicos: content.servicos || defaultServicos,
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (field: string, value: string) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (idx: number, field: string, value: string) => {
    setDraft((prev: any) => {
      const newServicos = [...(prev.servicos || defaultServicos)];
      newServicos[idx] = { ...newServicos[idx], [field]: value };
      return { ...prev, servicos: newServicos };
    });
  };
  // Handler para estilos visuais do título
  const handleTitleStyleChange = (field: string, value: string | number) => {
    setTitleStyle((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveSiteSection({
      id: 'hero',
      name: 'hero',
      label: 'Hero/Banner Principal',
      content: { ...draft, titleStyle },
      updatedAt: new Date(),
      updatedBy: 'admin-inline',
    });
    setData({ ...draft, titleStyle });
    setEditBlock(null);
    setSaving(false);
  };

  if (loading) return <div>Carregando...</div>;

  // Painéis de edição visual por bloco
  const renderEditPanel = () => {
    if (!isAdmin || !editBlock) return null;
    if (editBlock === 'titulo') {
      return (
        <div className="fixed top-20 right-8 z-30 bg-white border border-slate-200 rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">Editar Título</h3>
          <input
            className="border rounded px-2 py-1 mb-2"
            value={draft.titulo || ''}
            onChange={e => handleChange('titulo', e.target.value)}
          />
          {/* Estilos visuais do título */}
          <label className="flex flex-col text-sm font-semibold gap-1">
            Fonte
            <select value={titleStyle.fontFamily} onChange={e => handleTitleStyleChange('fontFamily', e.target.value)} className="border rounded px-2 py-1">
              <option value="inherit">Padrão</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Oswald, sans-serif">Oswald</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-semibold gap-1">
            Tamanho
            <input type="number" min="1" max="120" value={parseInt(titleStyle.fontSize)} onChange={e => handleTitleStyleChange('fontSize', e.target.value + 'px')} className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col text-sm font-semibold gap-1">
            Peso
            <select value={titleStyle.fontWeight} onChange={e => handleTitleStyleChange('fontWeight', e.target.value)} className="border rounded px-2 py-1">
              <option value="400">Normal</option>
              <option value="500">Médio</option>
              <option value="600">Semi-bold</option>
              <option value="700">Bold</option>
              <option value="900">Extra Bold</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-semibold gap-1">
            Cor
            <input type="color" value={titleStyle.color} onChange={e => handleTitleStyleChange('color', e.target.value)} className="w-10 h-8 p-0 border-none bg-transparent" />
          </label>
          <label className="flex flex-col text-sm font-semibold gap-1">
            Espaçamento entre letras
            <input type="number" min="-5" max="20" value={parseFloat(titleStyle.letterSpacing)} onChange={e => handleTitleStyleChange('letterSpacing', e.target.value + 'px')} className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col text-sm font-semibold gap-1">
            Espaçamento entre linhas
            <input type="number" min="0.5" max="3" step="0.05" value={parseFloat(titleStyle.lineHeight)} onChange={e => handleTitleStyleChange('lineHeight', e.target.value)} className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col text-sm font-semibold gap-1">
            Alinhamento
            <select value={titleStyle.textAlign} onChange={e => handleTitleStyleChange('textAlign', e.target.value)} className="border rounded px-2 py-1">
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </label>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave} disabled={saving}>Salvar</button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditBlock(null); setDraft(data); }}>Cancelar</button>
          </div>
        </div>
      );
    }
    if (editBlock === 'subtitulo') {
      return (
        <div className="fixed top-20 right-8 z-30 bg-white border border-slate-200 rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">Editar Subtítulo</h3>
          <input
            className="border rounded px-2 py-1 mb-2"
            value={draft.subtitulo || ''}
            onChange={e => handleChange('subtitulo', e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave} disabled={saving}>Salvar</button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditBlock(null); setDraft(data); }}>Cancelar</button>
          </div>
        </div>
      );
    }
    if (editBlock === 'descricao') {
      return (
        <div className="fixed top-20 right-8 z-30 bg-white border border-slate-200 rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">Editar Descrição</h3>
          <textarea
            className="border rounded px-2 py-1 mb-2"
            value={draft.descricao || ''}
            onChange={e => handleChange('descricao', e.target.value)}
            rows={4}
          />
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave} disabled={saving}>Salvar</button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditBlock(null); setDraft(data); }}>Cancelar</button>
          </div>
        </div>
      );
    }
    if (editBlock && editBlock.startsWith('servico-')) {
      const idx = parseInt(editBlock.replace('servico-', ''));
      const servico = draft.servicos?.[idx] || defaultServicos[idx];
      return (
        <div className="fixed top-20 right-8 z-30 bg-white border border-slate-200 rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">Editar Serviço</h3>
          <input
            className="border rounded px-2 py-1 mb-2"
            value={servico.text}
            onChange={e => handleServiceChange(idx, 'text', e.target.value)}
          />
          <label className="flex flex-col text-sm font-semibold gap-1">
            Ícone
            <select
              className="border rounded px-2 py-1"
              value={servico.icon}
              onChange={e => handleServiceChange(idx, 'icon', e.target.value)}
            >
              <option value="Code">Code</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Palette">Palette</option>
            </select>
          </label>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave} disabled={saving}>Salvar</button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditBlock(null); setDraft(data); }}>Cancelar</button>
          </div>
        </div>
      );
    }
    return null;
  };

  // Renderização do HeroSection com wrappers clicáveis nos blocos reais
  return (
    <div className="relative">
      {renderEditPanel()}
      {isAdmin && !editMode && (
        <div className="flex justify-end mt-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setEditMode(true)}>
            Editar esta seção
          </button>
        </div>
      )}
      <div className="relative">
        <HeroSection
          data={{ ...draft, titleStyle }}
          editMode={false}
          onFieldChange={handleChange}
          onServiceChange={handleServiceChange}
          // Renderização customizada dos blocos para edição visual
          // O HeroSection não suporta slots, então fazemos overlay wrappers
        />
        {/* Wrappers clicáveis sobrepostos */}
        {isAdmin && editMode && (
          <>
            {/* Título */}
            <div
              onClick={() => setEditBlock('titulo')}
              style={{ position: 'absolute', left: 0, top: 80, width: '60%', height: 70, cursor: 'pointer', zIndex: 10 }}
              className={editBlock === 'titulo' ? 'ring-4 ring-blue-500 rounded' : 'ring-2 ring-blue-300 rounded'}
              title="Editar título"
            />
            {/* Subtítulo */}
            <div
              onClick={() => setEditBlock('subtitulo')}
              style={{ position: 'absolute', left: 0, top: 160, width: '60%', height: 50, cursor: 'pointer', zIndex: 10 }}
              className={editBlock === 'subtitulo' ? 'ring-4 ring-blue-500 rounded' : 'ring-2 ring-blue-300 rounded'}
              title="Editar subtítulo"
            />
            {/* Descrição */}
            <div
              onClick={() => setEditBlock('descricao')}
              style={{ position: 'absolute', left: 0, top: 220, width: '60%', height: 60, cursor: 'pointer', zIndex: 10 }}
              className={editBlock === 'descricao' ? 'ring-4 ring-blue-500 rounded' : 'ring-2 ring-blue-300 rounded'}
              title="Editar descrição"
            />
            {/* Serviços */}
            {draft.servicos?.map((serv: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setEditBlock(`servico-${idx}`)}
                style={{ position: 'absolute', left: 0, top: 290 + idx * 40, width: '60%', height: 36, cursor: 'pointer', zIndex: 10 }}
                className={editBlock === `servico-${idx}` ? 'ring-4 ring-blue-500 rounded' : 'ring-2 ring-blue-300 rounded'}
                title={`Editar serviço ${idx + 1}`}
              />
            ))}
          </>
        )}
      </div>
      {/* Quando sair do modo edição, limpa o bloco selecionado */}
      {isAdmin && editMode && (
        <div className="flex justify-end mt-2">
          <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditMode(false); setEditBlock(null); }}>
            Sair do modo edição
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroSectionInlineEditor;
