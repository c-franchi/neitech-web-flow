
import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, User } from 'lucide-react';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { OrcamentoService } from '@/services/orcamentoService';

interface VisualizarDetalhesProps {
  solicitacao: SolicitacaoOrcamento;
  onClose: () => void;
}

const VisualizarDetalhes: React.FC<VisualizarDetalhesProps> = ({ solicitacao, onClose }) => {
  const [detalhes, setDetalhes] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [solicitacao.id]);

  const carregarDetalhes = async () => {
    try {
      const dados = await OrcamentoService.buscarDetalhesFormulario(solicitacao.id);
      setDetalhes(dados);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
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

  const renderizarResposta = (chave: string, valor: any) => {
    if (Array.isArray(valor)) {
      return valor.join(', ');
    }
    if (typeof valor === 'object' && valor !== null) {
      return JSON.stringify(valor, null, 2);
    }
    return String(valor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={24} />
            <div>
              <h2 className="text-xl font-bold">Detalhes do Formulário</h2>
              <p className="text-blue-100">{solicitacao.nomeCliente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !detalhes ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum formulário detalhado foi preenchido ainda.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <User size={18} className="mr-2" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tipo de Serviço:</strong> {detalhes.tipoServico}
                  </div>
                  <div>
                    <strong>Data de Preenchimento:</strong> {formatarData(detalhes.dataPreenchimento)}
                  </div>
                </div>
              </div>

              {/* Respostas do formulário */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar size={18} className="mr-2" />
                  Respostas do Formulário
                </h3>
                <div className="space-y-4">
                  {detalhes.respostas && Object.entries(detalhes.respostas).map(([chave, valor]) => (
                    <div key={chave} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-800 mb-2 capitalize">
                        {chave.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-gray-600 bg-gray-50 p-3 rounded border text-sm whitespace-pre-wrap">
                        {renderizarResposta(chave, valor)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizarDetalhes;
