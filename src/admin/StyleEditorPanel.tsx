import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import ImageUploader from './ImageUploader';
import { ChevronDown, ChevronRight, Paintbrush, Sparkles } from 'lucide-react';
import type { AnimationPreset, PortfolioLayout, SectionStyles } from '../types/sectionStyles';

export type { SectionStyles } from '../types/sectionStyles';

interface StyleEditorPanelProps {
  styles: SectionStyles;
  onChange: (styles: SectionStyles) => void;
  sectionName?: string;
}

const StyleEditorPanel: React.FC<StyleEditorPanelProps> = ({ styles, onChange, sectionName }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cores: false,
    fontes: false,
    fundo: false,
    cards: false,
    botoes: false,
    animacoes: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateStyle = (key: keyof SectionStyles, value: string) => {
    onChange({ ...styles, [key]: value });
  };

  const updateBooleanStyle = (key: keyof SectionStyles, value: boolean) => {
    onChange({ ...styles, [key]: value });
  };

  const updatePreset = (value: AnimationPreset) => {
    onChange({ ...styles, animationPreset: value });
  };

  const updatePortfolioLayout = (value: PortfolioLayout) => {
    onChange({ ...styles, portfolioLayout: value });
  };

  const CollapsibleSection: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({
    id,
    title,
    children,
  }) => (
    <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-gray-700">{title}</span>
        {openSections[id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {openSections[id] && <div className="px-3 py-2">{children}</div>}
    </div>
  );

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Paintbrush size={16} className="text-purple-600" />
        <span className="text-sm font-bold text-gray-800">Estilos Visuais</span>
      </div>

      <CollapsibleSection id="animacoes" title="✨ Animações">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Preset de animação</label>
          <select
            value={styles.animationPreset || 'premium'}
            onChange={(event) => updatePreset(event.target.value as AnimationPreset)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          >
            <option value="premium">Premium Tech</option>
            <option value="subtle">Suave</option>
            <option value="minimal">Minimal</option>
            <option value="none">Sem animações</option>
          </select>
        </div>

        <label className="mb-2 flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs text-gray-700">
          <span>Animações ativas</span>
          <input
            type="checkbox"
            checked={styles.animationsEnabled !== false}
            onChange={(event) => updateBooleanStyle('animationsEnabled', event.target.checked)}
          />
        </label>

        <label className="mb-2 flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs text-gray-700">
          <span>Revelar ao rolar</span>
          <input
            type="checkbox"
            checked={styles.revealEnabled !== false}
            onChange={(event) => updateBooleanStyle('revealEnabled', event.target.checked)}
          />
        </label>

        <label className="mb-2 flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs text-gray-700">
          <span>Hover premium</span>
          <input
            type="checkbox"
            checked={styles.hoverEnabled !== false}
            onChange={(event) => updateBooleanStyle('hoverEnabled', event.target.checked)}
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs text-gray-700">
          <span>Parallax</span>
          <input
            type="checkbox"
            checked={styles.parallaxEnabled !== false}
            onChange={(event) => updateBooleanStyle('parallaxEnabled', event.target.checked)}
          />
        </label>

        {sectionName === 'hero' && (
          <>
            <label className="mt-2 mb-2 flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs text-gray-700">
              <span>Hero pinado no scroll</span>
              <input
                type="checkbox"
                checked={styles.heroPinEnabled !== false}
                onChange={(event) => updateBooleanStyle('heroPinEnabled', event.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs text-gray-700">
              <span>Sobrepor próxima seção</span>
              <input
                type="checkbox"
                checked={styles.heroOverlapEnabled !== false}
                onChange={(event) => updateBooleanStyle('heroOverlapEnabled', event.target.checked)}
              />
            </label>
          </>
        )}

        {sectionName === 'portfolio' && (
          <div className="mt-3 rounded border px-3 py-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Layout do portfólio</label>
            <select
              value={styles.portfolioLayout || 'carousel'}
              onChange={(event) => updatePortfolioLayout(event.target.value as PortfolioLayout)}
              className="w-full rounded border px-2 py-1.5 text-xs"
            >
              <option value="carousel">Carousel glass empilhado</option>
              <option value="grid">Grid tradicional</option>
            </select>
          </div>
        )}

        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          <div className="mb-1 flex items-center gap-1 font-semibold text-slate-700">
            <Sparkles size={12} /> Controle por seção
          </div>
          <div>Use o hero pinado para efeito de sobreposição e o layout carousel no portfólio para transição com fundo dinâmico.</div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="cores" title="🎨 Cores do Texto">
        <ColorPicker
          label="Texto principal"
          value={styles.textColor || ''}
          onChange={(v) => updateStyle('textColor', v)}
        />
        <ColorPicker
          label="Títulos"
          value={styles.headingColor || ''}
          onChange={(v) => updateStyle('headingColor', v)}
        />
        <ColorPicker
          label="Destaque"
          value={styles.accentColor || ''}
          onChange={(v) => updateStyle('accentColor', v)}
        />
      </CollapsibleSection>

      <CollapsibleSection id="fundo" title="🖼️ Fundo da Seção">
        <ColorPicker
          label="Cor de fundo"
          value={styles.backgroundColor || ''}
          onChange={(v) => updateStyle('backgroundColor', v)}
        />
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Imagem de fundo</label>
          <ImageUploader
            value={styles.backgroundImage || ''}
            onChange={(url) => updateStyle('backgroundImage', url)}
            label=""
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="fontes" title="🔤 Fontes e Tamanhos">
        <FontSelector
          label="Fonte do texto"
          value={styles.fontFamily || ''}
          onChange={(v) => updateStyle('fontFamily', v)}
          type="family"
        />
        <FontSelector
          label="Fonte dos títulos"
          value={styles.headingFontFamily || ''}
          onChange={(v) => updateStyle('headingFontFamily', v)}
          type="family"
        />
        <FontSelector
          label="Tamanho base"
          value={styles.fontSize || ''}
          onChange={(v) => updateStyle('fontSize', v)}
          type="size"
        />
        <FontSelector
          label="Peso do texto"
          value={styles.fontWeight || ''}
          onChange={(v) => updateStyle('fontWeight', v)}
          type="weight"
        />
        <FontSelector
          label="Peso dos títulos"
          value={styles.headingFontWeight || ''}
          onChange={(v) => updateStyle('headingFontWeight', v)}
          type="weight"
        />
      </CollapsibleSection>

      <CollapsibleSection id="botoes" title="🔘 Botões">
        <ColorPicker
          label="Cor do botão"
          value={styles.buttonColor || ''}
          onChange={(v) => updateStyle('buttonColor', v)}
        />
        <ColorPicker
          label="Texto do botão"
          value={styles.buttonTextColor || ''}
          onChange={(v) => updateStyle('buttonTextColor', v)}
        />
      </CollapsibleSection>

      <CollapsibleSection id="cards" title="🃏 Cards / Itens">
        <ColorPicker
          label="Fundo do card"
          value={styles.cardBackground || ''}
          onChange={(v) => updateStyle('cardBackground', v)}
        />
        <ColorPicker
          label="Texto do card"
          value={styles.cardTextColor || ''}
          onChange={(v) => updateStyle('cardTextColor', v)}
        />
        <ColorPicker
          label="Borda"
          value={styles.borderColor || ''}
          onChange={(v) => updateStyle('borderColor', v)}
        />
      </CollapsibleSection>

      {/* Preview rápido */}
      {(styles.backgroundColor || styles.textColor || styles.headingColor) && (
        <div
          className="mt-3 p-3 rounded-lg border text-sm"
          style={{
            backgroundColor: styles.backgroundColor || '#ffffff',
            color: styles.textColor || '#334155',
            fontFamily: styles.fontFamily || undefined,
            fontSize: styles.fontSize || undefined,
            fontWeight: styles.fontWeight || undefined,
          }}
        >
          <div
            className="font-bold mb-1"
            style={{
              color: styles.headingColor || styles.textColor || '#1e293b',
              fontFamily: styles.headingFontFamily || styles.fontFamily || undefined,
              fontWeight: styles.headingFontWeight || '700',
            }}
          >
            Preview do Título
          </div>
          <div>Texto de exemplo com as cores e fontes selecionadas.</div>
          {styles.buttonColor && (
            <button
              className="mt-2 px-3 py-1 rounded text-xs"
              style={{
                backgroundColor: styles.buttonColor,
                color: styles.buttonTextColor || '#ffffff',
              }}
            >
              Botão exemplo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StyleEditorPanel;
