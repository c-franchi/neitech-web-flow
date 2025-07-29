
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, FileText, Eye, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento, HistoricoInteracao } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const StatusSolicitacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [historico, setHistorico] = useState<HistoricoInteracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (id && id.trim() !== '') {
      carregarDados(id);
    } else {
      setErro(true);
      setLoading(false);
    }
  }, [id]);

  const carregarDados = async (solicitacaoId: string) => {
    try {
      setLoading(true);
      setErro(false);
      
      const dados = await OrcamentoService.buscarSolicitacaoPorId(solicitacaoId);
      if (dados) {
        setSolicitacao(dados);
        // Buscar histórico seria implementado aqui
      } else {
        setErro(true);
        toast({
          title: "Solicitação não encontrada",
          description: "A solicitação solicitada não foi encontrada ou não existe.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro(true);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case '':
        return {
          label: 'Aguardando Processamento',
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock size={16} />
        };
      case 'solicitacao_recebida':
        return {
          label: 'Solicitação Recebida',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock size={16} />
        };
      case 'aguardando_detalhamento':
        return {
          label: 'Aguardando Detalhamento',
          color: 'bg-blue-100 text-blue-800',
          icon: <Eye size={16} />
        };
      case 'aguardando_orcamento':
        return {
          label: 'Aguardando Orçamento',
          color: 'bg-purple-100 text-purple-800',
          icon: <Clock size={16} />
        };
      case 'orcamento_disponivel':
        return {
          label: 'Orçamento Disponível',
          color: 'bg-green-100 text-green-800',
          icon: <FileText size={16} />
        };
      case 'orcamento_enviado':
        return {
          label: 'Orçamento Enviado',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} />
        };
      case 'finalizado':
        return {
          label: 'Finalizado',
          color: 'bg-gray-100 text-gray-800',
          icon: <CheckCircle size={16} />
        };
      default:
        return {
          label: 'Status Desconhecido',
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock size={16} />
        };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-36" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-8 w-36" />
              </div>
            </div>

            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Carregando status da solicitação...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (erro || !solicitacao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4 text-center">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Solicitação não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A solicitação que você está procurando não foi encontrada ou não existe. 
            Verifique se o link está correto.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao início
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(solicitacao.statusSolicitacao);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Status da Solicitação
            </h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {solicitacao.nomeCliente}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <p className="text-lg text-gray-900">
                  {solicitacao.servicoInteresse}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Solicitação
                </label>
                <p className="text-lg text-gray-900">
                  {formatarData(solicitacao.dataCreacao)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Atual
                </label>
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última Atualização
                </label>
                <p className="text-lg text-gray-900">
                  {formatarData(solicitacao.dataUltimaAtualizacao)}
                </p>
              </div>

              {solicitacao.pdfUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orçamento
                  </label>
                  <a
                    href={`/orcamento/${solicitacao.id}?token=${solicitacao.accessToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileText size={16} className="mr-2" />
                    Visualizar Orçamento
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {solicitacao.mensagem && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem Inicial
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{solicitacao.mensagem}</p>
              </div>
            </div>
          )}

          {/* Ações baseadas no status */}
          {solicitacao.statusSolicitacao === 'aguardando_detalhamento' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Próximo Passo: Detalhamento
              </h3>
              <p className="text-blue-800 mb-4">
                Para criarmos um orçamento mais preciso, precisamos de algumas informações específicas sobre seu projeto.
              </p>
              <a
                href={`/formulario/${solicitacao.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText size={16} className="mr-2" />
                Preencher Formulário Detalhado
              </a>
            </div>
          )}

          {solicitacao.statusSolicitacao === 'aguardando_orcamento' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Aguardando Orçamento
              </h3>
              <p className="text-purple-800">
                Recebemos todas as informações necessárias. Nossa equipe está preparando seu orçamento personalizado. Você será notificado assim que estiver pronto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusSolicitacao;
