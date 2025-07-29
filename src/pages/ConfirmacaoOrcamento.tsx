
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Clock, MessageCircle } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';

const ConfirmacaoOrcamento = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarSolicitacao(id);
    }
  }, [id]);

  const carregarSolicitacao = async (solicitacaoId: string) => {
    try {
      const dados = await OrcamentoService.buscarSolicitacaoPorId(solicitacaoId);
      setSolicitacao(dados);
    } catch (error) {
      console.error('Erro ao carregar solicitação:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Detalhes Enviados com Sucesso!
            </h1>
            <p className="text-gray-600">
              Obrigado pelas informações detalhadas, {solicitacao?.nomeCliente}!
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-800">
                Próximos Passos
              </h2>
            </div>
            <div className="text-left space-y-3 text-blue-800">
              <p>✅ Sua solicitação foi recebida e está sendo analisada</p>
              <p>⏳ Nosso time está preparando um orçamento personalizado</p>
              <p>📱 Você receberá uma mensagem no WhatsApp quando estiver pronto</p>
              <p>📧 Também enviaremos um email com todos os detalhes</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">
                Tempo de Resposta
              </span>
            </div>
            <p className="text-green-700 text-sm">
              Normalmente respondemos em até 24 horas úteis
            </p>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p><strong>Serviço:</strong> {solicitacao?.servicoInteresse}</p>
            <p><strong>Data da Solicitação:</strong> {solicitacao?.dataCreacao.toLocaleDateString('pt-BR')}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoOrcamento;
