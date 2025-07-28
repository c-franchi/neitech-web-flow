
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';

const OrcamentoPublico = () => {
  const { id } = useParams<{ id: string }>();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      carregarOrcamento(id);
    }
  }, [id]);

  const carregarOrcamento = async (solicitacaoId: string) => {
    try {
      setLoading(true);
      const dados = await OrcamentoService.buscarSolicitacaoPorId(solicitacaoId);
      setSolicitacao(dados);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  if (!solicitacao || !solicitacao.pdfUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Orçamento não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O orçamento solicitado não foi encontrado ou ainda não está disponível.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Seu Orçamento
              </h1>
              <p className="text-gray-600 mt-1">
                {solicitacao.nomeCliente} • {solicitacao.servicoInteresse}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Criado em {formatarData(solicitacao.dataCreacao)}
              </p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mt-1">
                Orçamento Disponível
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Actions Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {solicitacao.nomeArquivoPdf || 'orcamento.pdf'}
                </span>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="h-[80vh]">
            <iframe
              src={solicitacao.pdfUrl}
              className="w-full h-full"
              title="Orçamento PDF"
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
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
              <strong className="text-gray-700">Status:</strong>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full ml-2">
                Disponível
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrcamentoPublico;
