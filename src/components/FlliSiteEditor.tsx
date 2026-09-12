import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react';
import ImageUploader from '@/admin/ImageUploader';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale } from '@/content/flliContent';
import { getFlliContent, resetFlliContent, saveFlliContent } from '@/services/flliContentService';
import { useToast } from '@/hooks/use-toast';

type Props = {
  adminEmail: string;
};

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
};

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, multiline, hint }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-black/50">{label}</span>
    {multiline ? (
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#74795a] focus:ring-2 focus:ring-[#74795a]/10"
      />
    ) : (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#74795a] focus:ring-2 focus:ring-[#74795a]/10"
      />
    )}
    {hint && <span className="mt-1 block text-[11px] text-black/35">{hint}</span>}
  </label>
);

const EditorSection: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; open?: boolean }> = ({ title, subtitle, children, open }) => (
  <details open={open} className="group rounded-2xl border border-black/10 bg-white/75 shadow-sm">
    <summary className="cursor-pointer list-none px-5 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-[-0.025em]">{title}</h2>
          {subtitle && <p className="mt-1 text-xs leading-5 text-black/45">{subtitle}</p>}
        </div>
        <span className="text-xl text-black/30 transition group-open:rotate-45">+</span>
      </div>
    </summary>
    <div className="border-t border-black/10 p-5 sm:p-6">{children}</div>
  </details>
);

const MediaCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="rounded-2xl border border-black/10 bg-black/[0.025] p-4 sm:p-5">
    <div className="mb-4">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-black/45">{description}</p>
    </div>
    {children}
  </div>
);

const FlliSiteEditor: React.FC<Props> = ({ adminEmail }) => {
  const { toast } = useToast();
  const [locale, setLocale] = useState<FlliLocale>('br');
  const [content, setContent] = useState<FlliContent>(() => cloneFlliContent(defaultFlliContent.br));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = async (nextLocale: FlliLocale) => {
    setLoading(true);
    try {
      const data = await getFlliContent(nextLocale);
      setContent(data);
      setDirty(false);
    } catch (error) {
      console.error('F.LLI editor: erro ao carregar conteúdo', error);
      setContent(cloneFlliContent(defaultFlliContent[nextLocale]));
      toast({
        title: 'Não foi possível carregar as edições',
        description: 'O editor exibiu o conteúdo padrão. Verifique as permissões do Firestore.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(locale);
  }, [locale]);

  const update = <K extends keyof FlliContent>(key: K, value: FlliContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const updateMedia = (key: keyof FlliContent['media'], value: string | string[]) => {
    setContent((current) => ({
      ...current,
      media: { ...current.media, [key]: value },
    }));
    setDirty(true);
  };

  const updateProjectImage = (index: number, value: string) => {
    const next = [...content.media.projectImages];
    while (next.length < content.projects.length) next.push('');
    next[index] = value;
    updateMedia('projectImages', next);
  };

  const updateForm = (key: keyof FlliContent['form'], value: string | string[]) => {
    setContent((current) => ({
      ...current,
      form: { ...current.form, [key]: value },
    }));
    setDirty(true);
  };

  const updateProof = (index: number, value: string) => {
    const next = [...content.proof];
    next[index] = value;
    update('proof', next);
  };

  const updateService = (index: number, position: number, value: string) => {
    const next = content.services.map((item) => [...item] as [string, string, string]);
    next[index][position] = value;
    update('services', next);
  };

  const updateProject = (index: number, position: number, value: string) => {
    const next = content.projects.map((item) => [...item] as [string, string, string, string]);
    next[index][position] = value;
    update('projects', next);
  };

  const updateProcess = (index: number, position: number, value: string) => {
    const next = content.process.map((item) => [...item] as [string, string, string]);
    next[index][position] = value;
    update('process', next);
  };

  const updateFormService = (index: number, value: string) => {
    const next = [...content.form.services];
    next[index] = value;
    updateForm('services', next);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveFlliContent(locale, content, adminEmail);
      setDirty(false);
      toast({ title: 'Site atualizado', description: `Conteúdo ${locale === 'br' ? 'Brasil' : 'Itália'} salvo com sucesso.` });
    } catch (error) {
      console.error('F.LLI editor: erro ao salvar', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível gravar o conteúdo no Firestore. Verifique as regras de acesso.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    const accepted = window.confirm(`Restaurar todo o conteúdo ${locale === 'br' ? 'em português' : 'em italiano'} para o padrão original?`);
    if (!accepted) return;

    setSaving(true);
    try {
      const restored = await resetFlliContent(locale, adminEmail);
      setContent(restored);
      setDirty(false);
      toast({ title: 'Conteúdo restaurado', description: 'O conteúdo padrão foi restaurado e publicado.' });
    } catch (error) {
      console.error('F.LLI editor: erro ao restaurar', error);
      toast({ title: 'Erro ao restaurar', description: 'Não foi possível restaurar o conteúdo.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#5d6249]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Carregando conteúdo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-20">
      <div className="sticky top-[72px] z-30 mb-6 rounded-2xl border border-black/10 bg-[#f0ede3]/95 p-3 shadow-sm backdrop-blur-xl sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
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
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`/${locale}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em]"
            >
              Visualizar <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={restoreDefaults}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restaurar
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 rounded-full bg-[#74795a] px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white disabled:opacity-40"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? 'Salvando' : dirty ? 'Salvar alterações' : 'Salvo'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#686d4e]">Editor do site</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.035em]">Editar conteúdo {locale === 'br' ? 'Brasil' : 'Itália'}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">Edite textos e imagens do site atual. Os arquivos são enviados ao Firebase Storage e as alterações passam a aparecer na página sem precisar alterar o código.</p>
      </div>

      <div className="space-y-4">
        <EditorSection title="SEO e título da página" subtitle="Texto usado pelo Google, compartilhamento e aba do navegador.">
          <div className="grid gap-4">
            <TextField label="Título SEO" value={content.title} onChange={(value) => update('title', value)} />
            <TextField label="Descrição SEO" value={content.description} multiline onChange={(value) => update('description', value)} />
          </div>
        </EditorSection>

        <EditorSection title="Imagens do site" subtitle="Troque logo, banner, imagens dos projetos, contato e compartilhamento." open>
          <div className="grid gap-4 md:grid-cols-2">
            <MediaCard title="Logo / monograma" description="Usado no cabeçalho e rodapé. Preferência: PNG, SVG ou WebP com fundo transparente.">
              <ImageUploader value={content.media.logoUrl} onChange={(url) => updateMedia('logoUrl', url || '/brand/flli-monogram.svg')} />
            </MediaCard>

            <MediaCard title="Imagem principal do banner" description="Se não houver imagem, o cartão gráfico original continuará aparecendo. Recomendado: horizontal ou quadrada, alta resolução.">
              <ImageUploader value={content.media.heroImageUrl} onChange={(url) => updateMedia('heroImageUrl', url)} />
            </MediaCard>

            <MediaCard title="Imagem da seção de contato" description="Imagem opcional exibida ao lado do formulário. Se ficar vazia, a seção mantém o layout atual.">
              <ImageUploader value={content.media.contactImageUrl} onChange={(url) => updateMedia('contactImageUrl', url)} />
            </MediaCard>

            <MediaCard title="Imagem para compartilhamento" description="Imagem usada como og:image ao compartilhar o link em WhatsApp e redes sociais. Recomendado: 1200 × 630 px.">
              <ImageUploader value={content.media.socialImageUrl} onChange={(url) => updateMedia('socialImageUrl', url)} />
            </MediaCard>
          </div>

          <div className="mt-6 border-t border-black/10 pt-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">Imagens dos projetos</p>
            <p className="mb-4 text-xs leading-5 text-black/40">Cada imagem aparece dentro do respectivo card. Se não selecionar uma imagem, o card mantém o visual original.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {content.projects.map((project, index) => (
                <MediaCard key={index} title={`Projeto ${index + 1}`} description={project[1]}>
                  <ImageUploader value={content.media.projectImages[index] || ''} onChange={(url) => updateProjectImage(index, url)} />
                </MediaCard>
              ))}
            </div>
          </div>

          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">As imagens são configuradas separadamente para Brasil e Itália. Se quiser usar as mesmas imagens nas duas versões, envie-as também na outra aba de idioma.</p>
        </EditorSection>

        <EditorSection title="Banner principal" subtitle="Primeira mensagem que o visitante vê.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Linha pequena" value={content.eyebrow} onChange={(value) => update('eyebrow', value)} />
            <div className="hidden sm:block" />
            <TextField label="Título - linha 1" value={content.heroA} onChange={(value) => update('heroA', value)} />
            <TextField label="Título - destaque" value={content.heroB} onChange={(value) => update('heroB', value)} />
            <div className="sm:col-span-2">
              <TextField label="Descrição" value={content.heroText} multiline onChange={(value) => update('heroText', value)} />
            </div>
            <TextField label="Botão principal" value={content.ctaPrimary} onChange={(value) => update('ctaPrimary', value)} />
            <TextField label="Botão secundário" value={content.ctaSecondary} onChange={(value) => update('ctaSecondary', value)} />
          </div>
          <div className="mt-6 border-t border-black/10 pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-black/50">Destaques abaixo do banner</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.proof.map((item, index) => (
                <TextField key={index} label={`Destaque ${index + 1}`} value={item} onChange={(value) => updateProof(index, value)} />
              ))}
            </div>
          </div>
        </EditorSection>

        <EditorSection title="Serviços" subtitle="Título da seção e quatro serviços exibidos em cards.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Chamada pequena" value={content.servicesKicker} onChange={(value) => update('servicesKicker', value)} />
            <TextField label="Título" value={content.servicesTitle} onChange={(value) => update('servicesTitle', value)} />
            <div className="sm:col-span-2">
              <TextField label="Descrição" value={content.servicesText} multiline onChange={(value) => update('servicesText', value)} />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {content.services.map((item, index) => (
              <div key={index} className="rounded-xl border border-black/10 bg-black/[0.025] p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#686d4e]">Serviço {index + 1}</p>
                <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
                  <TextField label="Número" value={item[0]} onChange={(value) => updateService(index, 0, value)} />
                  <TextField label="Nome" value={item[1]} onChange={(value) => updateService(index, 1, value)} />
                  <div className="sm:col-span-2">
                    <TextField label="Descrição" value={item[2]} multiline onChange={(value) => updateService(index, 2, value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection title="Projetos" subtitle="Cards de exemplos e soluções que aparecem no portfólio.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Chamada pequena" value={content.projectsKicker} onChange={(value) => update('projectsKicker', value)} />
            <TextField label="Título" value={content.projectsTitle} onChange={(value) => update('projectsTitle', value)} />
          </div>
          <div className="mt-6 space-y-4">
            {content.projects.map((item, index) => (
              <div key={index} className="rounded-xl border border-black/10 bg-black/[0.025] p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#686d4e]">Projeto {index + 1}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Categoria" value={item[0]} onChange={(value) => updateProject(index, 0, value)} />
                  <TextField label="Título" value={item[1]} onChange={(value) => updateProject(index, 1, value)} />
                  <div className="sm:col-span-2">
                    <TextField label="Descrição" value={item[2]} multiline onChange={(value) => updateProject(index, 2, value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <TextField label="Tags / tecnologias" value={item[3]} onChange={(value) => updateProject(index, 3, value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection title="Processo" subtitle="Etapas de como a F.LLI FRANCHI trabalha.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Chamada pequena" value={content.processKicker} onChange={(value) => update('processKicker', value)} />
            <TextField label="Título" value={content.processTitle} onChange={(value) => update('processTitle', value)} />
          </div>
          <div className="mt-6 space-y-4">
            {content.process.map((item, index) => (
              <div key={index} className="rounded-xl border border-black/10 bg-black/[0.025] p-4">
                <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
                  <TextField label="Número" value={item[0]} onChange={(value) => updateProcess(index, 0, value)} />
                  <TextField label="Etapa" value={item[1]} onChange={(value) => updateProcess(index, 1, value)} />
                  <div className="sm:col-span-2">
                    <TextField label="Descrição" value={item[2]} multiline onChange={(value) => updateProcess(index, 2, value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection title="Contato" subtitle="Textos da seção de solicitação de orçamento.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Chamada pequena" value={content.contactKicker} onChange={(value) => update('contactKicker', value)} />
            <TextField label="Título" value={content.contactTitle} onChange={(value) => update('contactTitle', value)} />
            <div className="sm:col-span-2">
              <TextField label="Descrição" value={content.contactText} multiline onChange={(value) => update('contactText', value)} />
            </div>
            <TextField label="Botão do formulário" value={content.form.submit} onChange={(value) => updateForm('submit', value)} />
            <TextField label="Placeholder de serviço" value={content.form.servicePlaceholder} onChange={(value) => updateForm('servicePlaceholder', value)} />
          </div>
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-black/50">Opções de serviço do formulário</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.form.services.map((service, index) => (
                <TextField key={index} label={`Opção ${index + 1}`} value={service} onChange={(value) => updateFormService(index, value)} />
              ))}
            </div>
          </div>
        </EditorSection>

        <EditorSection title="Rodapé" subtitle="Frase curta exibida no final do site.">
          <TextField label="Texto do rodapé" value={content.footer} onChange={(value) => update('footer', value)} />
        </EditorSection>
      </div>
    </div>
  );
};

export default FlliSiteEditor;
