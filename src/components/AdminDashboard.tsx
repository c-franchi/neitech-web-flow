import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Eye, Plus, Search, Upload, FileText, ExternalLink, MessageCircle, Trash2, Info } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import UploadOrcamento from './UploadOrcamento';
import VisualizarOrcamento from './VisualizarOrcamento';
import VisualizarDetalhes from './VisualizarDetalhes';
import ConfirmarExclusao from './ConfirmarExclusao';

const AdminDashboard = () => {
  const navigate = typeof window !== 'undefined' ? (window.location ? (path) => window.location.href = path : () => {}) : () => {};
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [exclusaoModalOpen, setExclusaoModalOpen] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoOrcamento | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      const todasSolicitacoes = await OrcamentoService.buscarTodasSolicitacoes();
      setSolicitacoes(todasSolicitacoes);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: SolicitacaoOrcamento['statusSolicitacao']) => {
    try {
      await OrcamentoService.atualizarStatusSolicitacao(id, novoStatus);
      await carregarSolicitacoes();
      toast({
        title: "Status atualizado",
        description: "O status da solicitação foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive"
      });
    }
  };

  const reenviarWhatsApp = async (solicitacao: SolicitacaoOrcamento) => {
    try {
      let tipoMensagem: 'inicial' | 'formulario' | 'orcamento' = 'inicial';
      
      // Determinar tipo de mensagem baseado no status
      if (solicitacao.statusSolicitacao === 'aguardando_detalhamento') {
        tipoMensagem = 'formulario';
      } else if (solicitacao.statusSolicitacao === 'orcamento_disponivel' || solicitacao.statusSolicitacao === 'orcamento_enviado') {
        tipoMensagem = 'orcamento';
      }

      await OrcamentoService.reenviarWhatsApp(solicitacao.id, tipoMensagem);
      
      toast({
        title: "WhatsApp enviado",
        description: "A mensagem foi enviada com sucesso via WhatsApp."
      });
    } catch (error) {
      console.error('Erro ao reenviar WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem via WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const abrirUploadModal = (solicitacao: SolicitacaoOrcamento) => {
    setSolicitacaoSelecionada(solicitacao);
    setUploadModalOpen(true);
  };

  const abrirVisualizarModal = (solicitacao: SolicitacaoOrcamento) => {
    setSolicitacaoSelecionada(solicitacao);
    setVisualizarModalOpen(true);
  };

  const abrirDetalhesModal = (solicitacao: SolicitacaoOrcamento) => {
    setSolicitacaoSelecionada(solicitacao);
    setDetalhesModalOpen(true);
  };

  const abrirExclusaoModal = (solicitacao: SolicitacaoOrcamento) => {
    setSolicitacaoSelecionada(solicitacao);
    setExclusaoModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!solicitacaoSelecionada) return;

    try {
      await OrcamentoService.excluirSolicitacao(solicitacaoSelecionada.id);
      await carregarSolicitacoes();
      setExclusaoModalOpen(false);
      setSolicitacaoSelecionada(null);
      
      toast({
        title: "Solicitação excluída",
        description: "A solicitação foi excluída permanentemente do sistema."
      });
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a solicitação.",
        variant: "destructive"
      });
    }
  };

  const gerarLinkWhatsApp = (solicitacao: SolicitacaoOrcamento) => {
    const linkOrcamento = `${window.location.origin}/orcamento/${solicitacao.id}`;
    const mensagem = `Olá ${solicitacao.nomeCliente}! Seu orçamento já está disponível: ${linkOrcamento}`;
    const whatsappUrl = `https://wa.me/55${solicitacao.whatsappCliente.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '': return 'bg-gray-100 text-gray-800';
      case 'solicitacao_recebida': return 'bg-yellow-100 text-yellow-800';
      case 'aguardando_detalhamento': return 'bg-blue-100 text-blue-800';
      case 'aguardando_orcamento': return 'bg-purple-100 text-purple-800';
      case 'orcamento_disponivel': return 'bg-green-100 text-green-800';
      case 'orcamento_enviado': return 'bg-green-100 text-green-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '': return <Clock size={16} />;
      case 'solicitacao_recebida': return <Clock size={16} />;
      case 'aguardando_detalhamento': return <Eye size={16} />;
      case 'aguardando_orcamento': return <Clock size={16} />;
      case 'orcamento_disponivel': return <FileText size={16} />;
      case 'orcamento_enviado': return <CheckCircle size={16} />;
      case 'finalizado': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case '': return 'Aguardando';
      case 'solicitacao_recebida': return 'Solicitação Recebida';
      case 'aguardando_detalhamento': return 'Aguardando Detalhamento';
      case 'aguardando_orcamento': return 'Aguardando Orçamento';
      case 'orcamento_disponivel': return 'Orçamento Disponível';
      case 'orcamento_enviado': return 'Orçamento Enviado';
      case 'finalizado': return 'Finalizado';
      default: return 'Status Desconhecido';
    }
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  const solicitacoesFiltradas = solicitacoes.filter(solicitacao => {
    const matchesStatus = filtroStatus === 'todas' || solicitacao.statusSolicitacao === filtroStatus;
    const matchesSearch = solicitacao.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitacao.emailCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitacao.servicoInteresse.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mt-4 mr-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-semibold"
          onClick={() => navigate('/')}
        >
          Voltar para o site
        </button>
      </div>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie as solicitações de orçamento e acompanhe o status de cada cliente
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-4 sm:mt-0">
              <a
                href="/admin/editor"
                className="inline-flex items-center px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow transition-colors duration-200 w-full sm:w-auto justify-center"
                title="Editar conteúdo do site"
                style={{ minWidth: 160 }}
              >
                <FileText className="mr-2" size={18} />
                Editar Site
              </a>
            </div>
          </div>
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{solicitacoes.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">
                {solicitacoes.filter(s => s.statusSolicitacao === 'solicitacao_recebida' || s.statusSolicitacao === '').length}
              </p>
              <p className="text-sm text-yellow-600">Pendentes</p>
            </div>
            <div className="bg-blue-50 rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {solicitacoes.filter(s => s.statusSolicitacao === 'aguardando_detalhamento' || s.statusSolicitacao === 'aguardando_orcamento').length}
              </p>
              <p className="text-sm text-blue-600">Em andamento</p>
            </div>
            <div className="bg-green-50 rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {solicitacoes.filter(s => s.statusSolicitacao === 'orcamento_enviado' || s.statusSolicitacao === 'finalizado').length}
              </p>
              <p className="text-sm text-green-600">Concluídos</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome, email ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todos os status</option>
              <option value="solicitacao_recebida">Solicitação Recebida</option>
              <option value="aguardando_detalhamento">Aguardando Detalhamento</option>
              <option value="aguardando_orcamento">Aguardando Orçamento</option>
              <option value="orcamento_disponivel">Orçamento Disponível</option>
              <option value="orcamento_enviado">Orçamento Enviado</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          {/* Lista de Solicitações */}
          {solicitacoesFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Info size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma solicitação encontrada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitacoesFiltradas.map((solicitacao) => (
                <div key={solicitacao.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{solicitacao.nomeCliente}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(solicitacao.statusSolicitacao)}`}>
                          {getStatusIcon(solicitacao.statusSolicitacao)}
                          {getStatusLabel(solicitacao.statusSolicitacao)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p><strong>Serviço:</strong> {solicitacao.servicoInteresse}</p>
                        <p><strong>Email:</strong> {solicitacao.emailCliente}</p>
                        <p><strong>WhatsApp:</strong> {solicitacao.whatsappCliente}</p>
                        {solicitacao.dataCriacao && (
                          <p><strong>Data:</strong> {formatarData(solicitacao.dataCriacao instanceof Date ? solicitacao.dataCriacao : new Date(solicitacao.dataCriacao))}</p>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => abrirDetalhesModal(solicitacao)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye size={16} /> Detalhes
                      </button>

                      {(solicitacao.statusSolicitacao === 'aguardando_orcamento' || solicitacao.statusSolicitacao === 'solicitacao_recebida') && (
                        <button
                          onClick={() => abrirUploadModal(solicitacao)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                          title="Enviar orçamento"
                        >
                          <Upload size={16} /> Enviar Orçamento
                        </button>
                      )}

                      {(solicitacao.statusSolicitacao === 'orcamento_disponivel' || solicitacao.statusSolicitacao === 'orcamento_enviado') && (
                        <button
                          onClick={() => abrirVisualizarModal(solicitacao)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors"
                          title="Ver orçamento"
                        >
                          <FileText size={16} /> Ver Orçamento
                        </button>
                      )}

                      <button
                        onClick={() => gerarLinkWhatsApp(solicitacao)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm transition-colors"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </button>

                      {/* Seletor de Status */}
                      <select
                        value={solicitacao.statusSolicitacao}
                        onChange={(e) => atualizarStatus(solicitacao.id, e.target.value as SolicitacaoOrcamento['statusSolicitacao'])}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="solicitacao_recebida">Solicitação Recebida</option>
                        <option value="aguardando_detalhamento">Aguardando Detalhamento</option>
                        <option value="aguardando_orcamento">Aguardando Orçamento</option>
                        <option value="orcamento_disponivel">Orçamento Disponível</option>
                        <option value="orcamento_enviado">Orçamento Enviado</option>
                        <option value="finalizado">Finalizado</option>
                      </select>

                      <button
                        onClick={() => abrirExclusaoModal(solicitacao)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
                        title="Excluir solicitação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modais */}
      {uploadModalOpen && solicitacaoSelecionada && (
        <UploadOrcamento
          solicitacao={solicitacaoSelecionada}
          onSuccess={() => {
            setUploadModalOpen(false);
            setSolicitacaoSelecionada(null);
            carregarSolicitacoes();
          }}
          onCancel={() => {
            setUploadModalOpen(false);
            setSolicitacaoSelecionada(null);
          }}
        />
      )}
      {visualizarModalOpen && solicitacaoSelecionada && (
        <VisualizarOrcamento
          solicitacao={solicitacaoSelecionada}
          onClose={() => {
            setVisualizarModalOpen(false);
            setSolicitacaoSelecionada(null);
          }}
        />
      )}
      {detalhesModalOpen && solicitacaoSelecionada && (
        <VisualizarDetalhes
          solicitacao={solicitacaoSelecionada}
          onClose={() => {
            setDetalhesModalOpen(false);
            setSolicitacaoSelecionada(null);
          }}
        />
      )}
      {exclusaoModalOpen && solicitacaoSelecionada && (
        <ConfirmarExclusao
          solicitacao={solicitacaoSelecionada}
          onConfirm={confirmarExclusao}
          onCancel={() => {
            setExclusaoModalOpen(false);
            setSolicitacaoSelecionada(null);
          }}
        />
      )}
    </>
  );
};

export default AdminDashboard;
