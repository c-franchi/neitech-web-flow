
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Plus, Search } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';

/**
 * AdminDashboard - Painel administrativo para gerenciar solicitações
 * Features: Visualização de solicitações, filtros, mudança de status
 */
const AdminDashboard = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      const solicitacoesPendentes = await OrcamentoService.buscarSolicitacoesPendentes();
      setSolicitacoes(solicitacoesPendentes);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'orcamento_enviado': return 'bg-purple-100 text-purple-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock size={16} />;
      case 'em_andamento': return <Eye size={16} />;
      case 'orcamento_enviado': return <Plus size={16} />;
      case 'aprovado': return <CheckCircle size={16} />;
      case 'rejeitado': return <XCircle size={16} />;
      default: return <Clock size={16} />;
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
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="orcamento_enviado">Orçamento Enviado</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
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
                          <span className="capitalize">{solicitacao.statusSolicitacao.replace('_', ' ')}</span>
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
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="orcamento_enviado">Orçamento Enviado</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="rejeitado">Rejeitado</option>
                      </select>
                      
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Criar Orçamento
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
