import React, { useEffect, useState } from 'react';
import ImageUploader from '@/admin/ImageUploader';
import { getFlliContent, saveFlliContent } from '@/services/flliContentService';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale } from '@/content/flliContent';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

type Props = {
  adminEmail: string;
};

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-black/10 bg-white p-5">
    <div className="mb-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-black/45">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const FlliImageManager: React.FC<Props> = ({ adminEmail }) => {
  const [locale, setLocale] = useState<FlliLocale>('br');
  const [content, setContent] = useState<FlliContent>(() => cloneFlliContent(defaultFlliContent.br));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { toast } = useToast();

  const load = async (next: FlliLocale) => {
    setLoading(true);
    try {
      const data = await getFlliContent(next);
      setContent(data);
      setDirty(false);
    } catch (err) {
      console.error('Erro ao carregar conteúdo para imagens', err);
      setContent(cloneFlliContent(defaultFlliContent[next]));
      toast({ title: 'Erro', description: 'Não foi possível carregar o conteúdo. Usando padrões.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(locale);
  }, [locale]);

  const updateMedia = (key: keyof FlliContent['media'], value: string | string[]) => {
    setContent((cur) => ({ ...cur, media: { ...cur.media, [key]: value } }));
    setDirty(true);
  };

  const updateProjectImage = (index: number, value: string) => {
    const next = [...content.media.projectImages];
    while (next.length < content.projects.length) next.push('');
    next[index] = value;
    updateMedia('projectImages', next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveFlliContent(locale, content, adminEmail || '');
      setDirty(false);
      toast({ title: 'Salvo', description: 'Alterações de imagens salvas com sucesso.' });
    } catch (err) {
      console.error('Erro ao salvar imagens', err);
      toast({ title: 'Erro', description: 'Falha ao salvar as imagens.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#5d6249]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Carregando imagens</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <div className="sticky top-[72px] z-30 mb-6 rounded-2xl border border-black/10 bg-[#f0ede3]/95 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#686d4e]">Gerenciar imagens</p>
            <h1 className="mt-1 font-serif text-2xl">Imagens do site</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale('br')}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${locale === 'br' ? 'bg-[#171713] text-white' : 'border border-black/10 bg-white text-black/60'}`}
            >
              Brasil / PT-BR
            </button>
            <button
              onClick={() => setLocale('it')}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${locale === 'it' ? 'bg-[#171713] text-white' : 'border border-black/10 bg-white text-black/60'}`}
            >
              Itália / IT
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 rounded-full bg-[#74795a] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {saving ? 'Salvando...' : dirty ? 'Salvar alterações' : 'Salvo'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="IDENTIDADE" subtitle="Logo / Monograma">
          <ImageUploader
            value={content.media.logoUrl}
            onChange={(url) => updateMedia('logoUrl', url || '/brand/flli-monogram.svg')}
            pathPrefix={`site_images/${locale}/logo`}
          />
        </Section>

        <Section title="BANNER PRINCIPAL" subtitle="Imagem principal do banner">
          <ImageUploader value={content.media.heroImageUrl} onChange={(url) => updateMedia('heroImageUrl', url)} pathPrefix={`site_images/${locale}/hero`} />
        </Section>

        <Section title="CONTATO" subtitle="Imagem da seção de contato">
          <ImageUploader value={content.media.contactImageUrl} onChange={(url) => updateMedia('contactImageUrl', url)} pathPrefix={`site_images/${locale}/contact`} />
        </Section>

        <Section title="COMPARTILHAMENTO" subtitle="Imagem para WhatsApp / redes sociais (1200×630)">
          <ImageUploader value={content.media.socialImageUrl} onChange={(url) => updateMedia('socialImageUrl', url)} pathPrefix={`site_images/${locale}/social`} />
        </Section>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#686d4e]">PROJETOS</p>
        <div className="grid gap-4 md:grid-cols-3">
          {content.projects.map((proj, idx) => (
            <Section key={idx} title={`Projeto ${idx + 1}`} subtitle={proj[1]}>
              <ImageUploader value={content.media.projectImages[idx] || ''} onChange={(url) => updateProjectImage(idx, url)} pathPrefix={`site_images/${locale}/projects`} />
            </Section>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-2 rounded-full bg-[#74795a] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {saving ? 'Salvando...' : dirty ? 'Salvar alterações' : 'Salvo'}
        </button>
      </div>
    </div>
  );
};

export default FlliImageManager;
