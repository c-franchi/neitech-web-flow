import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Plus, Search, Upload, FileText, ExternalLink } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import UploadOrcamento from './UploadOrcamento';
import VisualizarOrcamento from './VisualizarOrcamento';

const AdminDashboard = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
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

  const abrirUploadModal = (solicitacao: SolicitacaoOrcamento) => {
    setSolicitacaoSelecionada(solicitacao);
    setUploadModalOpen(true);
  };

  const abrirVisualizarModal = (solicitacao: SolicitacaoOrcamento) => {
    setSolicitacaoSelecionada(solicitacao);
    setVisualizarModalOpen(true);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie as solicitações de orçamento e acompanhe o status de cada cliente
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">{solicitacoes.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recebidas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {solicitacoes.filter(s => s.statusSolicitacao === 'solicitacao_recebida').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aguard. Detalhe</p>
                <p className="text-2xl font-bold text-blue-600">
                  {solicitacoes.filter(s => s.statusSolicitacao === 'aguardando_detalhamento').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aguard. Orçamento</p>
                <p className="text-2xl font-bold text-purple-600">
                  {solicitacoes.filter(s => s.statusSolicitacao === 'aguardando_orcamento').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">
                  {solicitacoes.filter(s => s.statusSolicitacao === 'orcamento_disponivel').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Finalizados</p>
                <p className="text-2xl font-bold text-gray-600">
                  {solicitacoes.filter(s => s.statusSolicitacao === 'finalizado').length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, email ou serviço..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="solicitacao_recebida">Solicitação Recebida</option>
                <option value="aguardando_detalhamento">Aguardando Detalhamento</option>
                <option value="aguardando_orcamento">Aguardando Orçamento</option>
                <option value="orcamento_disponivel">Orçamento Disponível</option>
                <option value="orcamento_enviado">Orçamento Enviado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Solicitações */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Solicitações de Orçamento ({solicitacoesFiltradas.length})
            </h2>
          </div>

          {solicitacoesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma solicitação encontrada com os filtros aplicados.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {solicitacoesFiltradas.map((solicitacao) => (
                <div key={solicitacao.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {solicitacao.nomeCliente}
                        </h3>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(solicitacao.statusSolicitacao)}`}>
                          {getStatusIcon(solicitacao.statusSolicitacao)}
                          <span>{getStatusLabel(solicitacao.statusSolicitacao)}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Email:</strong> {solicitacao.emailCliente}
                        </div>
                        <div>
                          <strong>WhatsApp:</strong> {solicitacao.whatsappCliente}
                        </div>
                        <div>
                          <strong>Serviço:</strong> {solicitacao.servicoInteresse}
                        </div>
                        <div>
                          <strong>Data:</strong> {formatarData(solicitacao.dataCreacao)}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <strong className="text-sm text-gray-700">Mensagem:</strong>
                        <p className="text-sm text-gray-600 mt-1">{solicitacao.mensagem}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <select
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={solicitacao.statusSolicitacao}
                        onChange={(e) => atualizarStatus(solicitacao.id, e.target.value as SolicitacaoOrcamento['statusSolicitacao'])}
                      >
                        <option value="">Aguardando</option>
                        <option value="solicitacao_recebida">Solicitação Recebida</option>
                        <option value="aguardando_detalhamento">Aguardando Detalhamento</option>
                        <option value="aguardando_orcamento">Aguardando Orçamento</option>
                        <option value="orcamento_disponivel">Orçamento Disponível</option>
                        <option value="orcamento_enviado">Orçamento Enviado</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                      
                      {/* Botões de ação baseados no status */}
                      {(solicitacao.statusSolicitacao === 'aguardando_orcamento') && (
                        <button
                          onClick={() => abrirUploadModal(solicitacao)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                        >
                          <Upload size={14} />
                          <span>Anexar Orçamento</span>
                        </button>
                      )}
                      
                      {solicitacao.pdfUrl && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => abrirVisualizarModal(solicitacao)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-1"
                          >
                            <Eye size={14} />
                            <span>Ver PDF</span>
                          </button>
                          <button
                            onClick={() => gerarLinkWhatsApp(solicitacao)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                          >
                            <ExternalLink size={14} />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      )}
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
    </div>
  );
};

export default AdminDashboard;
