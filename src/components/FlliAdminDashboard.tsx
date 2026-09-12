import React, { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  FileText,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import UploadOrcamento from './UploadOrcamento';
import VisualizarDetalhes from './VisualizarDetalhes';

const STATUS_OPTIONS: Array<{ value: SolicitacaoOrcamento['statusSolicitacao']; label: string }> = [
  { value: 'solicitacao_recebida', label: 'Solicitação recebida' },
  { value: 'aguardando_detalhamento', label: 'Aguardando detalhamento' },
  { value: 'aguardando_orcamento', label: 'Aguardando orçamento' },
  { value: 'orcamento_disponivel', label: 'Orçamento disponível' },
  { value: 'orcamento_enviado', label: 'Orçamento enviado' },
  { value: 'finalizado', label: 'Finalizado' },
];

const statusLabel = (status: SolicitacaoOrcamento['statusSolicitacao']) =>
  STATUS_OPTIONS.find((item) => item.value === status)?.label || 'Aguardando';

const formatDate = (value?: Date) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const FlliAdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<SolicitacaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('todos');
  const [uploadingFor, setUploadingFor] = useState<SolicitacaoOrcamento | null>(null);
  const [detailsFor, setDetailsFor] = useState<SolicitacaoOrcamento | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const data = await OrcamentoService.buscarTodasSolicitacoes();
      setItems(data);
    } catch (error) {
      console.error('F.LLI admin: erro ao carregar solicitações', error);
      toast({
        title: 'Erro ao carregar o painel',
        description: 'Não foi possível consultar as solicitações no Firebase.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = status === 'todos' || item.statusSolicitacao === status;
      const matchesText = !term || [
        item.nomeCliente,
        item.emailCliente,
        item.whatsappCliente,
        item.servicoInteresse,
      ].some((field) => (field || '').toLowerCase().includes(term));
      return matchesStatus && matchesText;
    });
  }, [items, query, status]);

  const stats = useMemo(() => ({
    total: items.length,
    novos: items.filter((item) => !item.statusSolicitacao || item.statusSolicitacao === 'solicitacao_recebida').length,
    andamento: items.filter((item) => ['aguardando_detalhamento', 'aguardando_orcamento'].includes(item.statusSolicitacao)).length,
    concluidos: items.filter((item) => ['orcamento_enviado', 'finalizado'].includes(item.statusSolicitacao)).length,
  }), [items]);

  const updateStatus = async (item: SolicitacaoOrcamento, nextStatus: SolicitacaoOrcamento['statusSolicitacao']) => {
    setBusyId(item.id);
    try {
      await OrcamentoService.atualizarStatusSolicitacao(item.id, nextStatus);
      await load(true);
      toast({ title: 'Status atualizado', description: `${item.nomeCliente}: ${statusLabel(nextStatus)}.` });
    } catch (error) {
      console.error('F.LLI admin: erro ao atualizar status', error);
      toast({ title: 'Erro', description: 'Não foi possível atualizar o status.', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: SolicitacaoOrcamento) => {
    if (!window.confirm(`Excluir definitivamente a solicitação de ${item.nomeCliente}?`)) return;
    setBusyId(item.id);
    try {
      await OrcamentoService.excluirSolicitacao(item.id);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      toast({ title: 'Solicitação excluída', description: 'O registro foi removido do sistema.' });
    } catch (error) {
      console.error('F.LLI admin: erro ao excluir solicitação', error);
      toast({ title: 'Erro', description: 'Não foi possível excluir a solicitação.', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  const openWhatsApp = (item: SolicitacaoOrcamento) => {
    const digits = (item.whatsappCliente || '').replace(/\D/g, '');
    const number = digits.startsWith('55') ? digits : `55${digits}`;
    const url = `${window.location.origin}/status/${item.id}`;
    const message = `Olá ${item.nomeCliente}! Acompanhe sua solicitação F.LLI FRANCHI: ${url}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f0ede3]">
        <div className="flex items-center gap-3 text-[#5d6249]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-semibold uppercase tracking-[0.16em]">Carregando painel</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ede3] px-4 py-8 text-[#171713] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#686d4e]">F.LLI FRANCHI · Administração</p>
            <h1 className="font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Solicitações e orçamentos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Painel conectado ao mesmo fluxo usado pelos formulários do site em português e italiano.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/br" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-black hover:text-white">
              Site BR <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href="/it" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-black hover:text-white">
              Site IT <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button onClick={() => void load(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-full bg-[#74795a] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Atualizar
            </button>
          </div>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Total', stats.total],
            ['Novas', stats.novos],
            ['Em andamento', stats.andamento],
            ['Concluídas', stats.concluidos],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-black/10 bg-white/65 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">{label}</p>
              <p className="mt-2 font-serif text-4xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 grid gap-3 rounded-2xl border border-black/10 bg-white/65 p-4 md:grid-cols-[1fr_260px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente, e-mail, WhatsApp ou serviço" className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#74795a]" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#74795a]">
            <option value="todos">Todos os status</option>
            {STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/20 bg-white/40 p-12 text-center text-black/50">Nenhuma solicitação encontrada.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const busy = busyId === item.id;
              return (
                <article key={item.id} className="rounded-2xl border border-black/10 bg-white/75 p-5 shadow-sm">
                  <div className="grid gap-5 xl:grid-cols-[1fr_280px] xl:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold">{item.nomeCliente}</h2>
                        <span className="rounded-full bg-[#74795a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5d6249]">{statusLabel(item.statusSolicitacao)}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-black/65">{item.servicoInteresse}</p>
                      <div className="mt-3 grid gap-1 text-xs text-black/50 sm:grid-cols-2">
                        <span>{item.emailCliente}</span>
                        <span>{item.whatsappCliente}</span>
                        <span>Criado: {formatDate(item.dataCreacao)}</span>
                        <span>Atualizado: {formatDate(item.dataUltimaAtualizacao)}</span>
                      </div>
                      {item.mensagem && <p className="mt-4 rounded-xl bg-black/[0.035] p-3 text-sm leading-6 text-black/60">{item.mensagem}</p>}
                    </div>

                    <div className="space-y-3">
                      <select value={item.statusSolicitacao || 'solicitacao_recebida'} disabled={busy} onChange={(event) => void updateStatus(item, event.target.value as SolicitacaoOrcamento['statusSolicitacao'])} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#74795a] disabled:opacity-50">
                        {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setDetailsFor(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-black hover:text-white"><FileText className="h-4 w-4" /> Detalhes</button>
                        <button onClick={() => setUploadingFor(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-black hover:text-white"><Upload className="h-4 w-4" /> PDF</button>
                        <button onClick={() => openWhatsApp(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-black hover:text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
                        <button onClick={() => void remove(item)} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-600 hover:text-white disabled:opacity-50"><Trash2 className="h-4 w-4" /> Excluir</button>
                      </div>

                      {item.pdfUrl && (
                        <a href={`/orcamento/${item.id}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#171713] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white">
                          Abrir orçamento <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {uploadingFor && (
        <UploadOrcamento
          solicitacao={uploadingFor}
          onCancel={() => setUploadingFor(null)}
          onSuccess={() => {
            setUploadingFor(null);
            void load(true);
          }}
        />
      )}
      {detailsFor && <VisualizarDetalhes solicitacao={detailsFor} onClose={() => setDetailsFor(null)} />}
    </div>
  );
};

export default FlliAdminDashboard;
