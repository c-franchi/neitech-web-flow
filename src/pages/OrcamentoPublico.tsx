
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, ArrowLeft, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';

const OrcamentoPublico = () => {
  const { id } = useParams<{ id: string }>();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      carregarOrcamento(id);
    }
  }, [id]);

  useEffect(() => {
    if (solicitacao) {
      const timer = setInterval(() => {
        updateTimeLeft();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [solicitacao]);

  const carregarOrcamento = async (solicitacaoId: string) => {
    try {
      setLoading(true);
      const dados = await OrcamentoService.buscarSolicitacaoPorId(solicitacaoId);
      
      if (dados && dados.pdfUrl) {
        // Verificar se o orçamento expirou (5 dias)
        const dataExpiracao = new Date(dados.dataUltimaAtualizacao);
        dataExpiracao.setDate(dataExpiracao.getDate() + 5);
        
        if (new Date() > dataExpiracao) {
          setExpired(true);
          // Deletar orçamento expirado
          await OrcamentoService.deletarOrcamentoExpirado(solicitacaoId);
        } else {
          setSolicitacao(dados);
          updateTimeLeft();
        }
      } else {
        setSolicitacao(null);
      }
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
      toast({
        title: "Erro",
        description: "Orçamento não encontrado ou não disponível.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!solicitacao) return;
    
    const dataExpiracao = new Date(solicitacao.dataUltimaAtualizacao);
    dataExpiracao.setDate(dataExpiracao.getDate() + 5);
    
    const agora = new Date();
    const diferenca = dataExpiracao.getTime() - agora.getTime();
    
    if (diferenca > 0) {
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${dias}d ${horas}h ${minutos}m`);
    } else {
      setExpired(true);
    }
  };

  const handleDownload = () => {
    if (solicitacao?.pdfUrl) {
      const link = document.createElement('a');
      link.href = solicitacao.pdfUrl;
      link.download = solicitacao.nomeArquivoPdf || 'orcamento.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  if (expired || !solicitacao || !solicitacao.pdfUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {expired ? (
              <>
                <Clock className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Orçamento Expirado
                </h1>
                <p className="text-gray-600 mb-6">
                  Este orçamento estava disponível por 5 dias corridos e expirou. 
                  Entre em contato conosco para solicitar um novo orçamento.
                </p>
              </>
            ) : (
              <>
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Orçamento não encontrado
                </h1>
                <p className="text-gray-600 mb-6">
                  O orçamento solicitado não foi encontrado ou ainda não está disponível.
                </p>
              </>
            )}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Seu Orçamento
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                {solicitacao.nomeCliente} • {solicitacao.servicoInteresse}
              </p>
            </div>
            <div className="flex flex-col lg:text-right">
              <p className="text-sm text-gray-500">
                Criado em {formatarData(solicitacao.dataCreacao)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Disponível
                </span>
                <div className="flex items-center text-xs text-amber-600">
                  <Clock size={12} className="mr-1" />
                  Expira em {timeLeft}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alert de Expiração */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mx-4 mt-4 rounded-r-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
          <p className="text-sm text-amber-800">
            <strong>Atenção:</strong> Este orçamento ficará disponível por 5 dias corridos. 
            Após este período será automaticamente removido do sistema.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-4 lg:py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Actions Bar */}
          <div className="bg-gray-50 px-4 lg:px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {solicitacao.nomeArquivoPdf || 'orcamento.pdf'}
                </span>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* PDF Viewer - Responsivo */}
          <div className="relative">
            <div className="h-[60vh] lg:h-[80vh] w-full">
              <iframe
                src={solicitacao.pdfUrl}
                className="w-full h-full border-0"
                title="Orçamento PDF"
                style={{ minHeight: '400px' }}
              />
            </div>
            
            {/* Overlay para mobile com link direto */}
            <div className="lg:hidden absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Para melhor visualização em dispositivos móveis:
                </p>
                <a
                  href={solicitacao.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full justify-center"
                >
                  <FileText size={16} className="mr-2" />
                  Abrir PDF em Nova Aba
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 lg:mt-8 bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Informações do Orçamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-700">Cliente:</strong>
              <p className="text-gray-600">{solicitacao.nomeCliente}</p>
            </div>
            <div>
              <strong className="text-gray-700">Serviço:</strong>
              <p className="text-gray-600">{solicitacao.servicoInteresse}</p>
            </div>
            <div>
              <strong className="text-gray-700">Data da Solicitação:</strong>
              <p className="text-gray-600">{formatarData(solicitacao.dataCreacao)}</p>
            </div>
            <div>
              <strong className="text-gray-700">Válido até:</strong>
              <p className="text-gray-600">
                {formatarData(new Date(new Date(solicitacao.dataUltimaAtualizacao).getTime() + 5 * 24 * 60 * 60 * 1000))}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Salve este orçamento em seu dispositivo, pois ele será removido automaticamente após 5 dias.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrcamentoPublico;
