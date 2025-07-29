
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, FileText, Upload, Loader2 } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const FormularioDetalhado = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (id) {
      carregarSolicitacao(id);
    }
  }, [id]);

  const carregarSolicitacao = async (solicitacaoId: string) => {
    try {
      const dados = await OrcamentoService.buscarSolicitacaoPorId(solicitacaoId);
      if (dados && dados.statusSolicitacao === 'orcamento_recebido') {
        setSolicitacao(dados);
      } else {
        toast({
          title: "Erro",
          description: "Solicitação não encontrada ou já foi processada.",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao carregar solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solicitacao) return;

    setSubmitting(true);
    try {
      await OrcamentoService.salvarDetalhesFormulario(solicitacao.id, solicitacao.servicoInteresse, formData);
      await OrcamentoService.atualizarStatusSolicitacao(solicitacao.id, 'aguardando_orcamento');
      
      toast({
        title: "Sucesso!",
        description: "Detalhes enviados com sucesso. Entraremos em contato em breve com seu orçamento personalizado."
      });
      
      // Redirecionar para página de confirmação
      navigate(`/confirmacao/${solicitacao.id}`);
    } catch (error) {
      console.error('Erro ao enviar detalhes:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar detalhes. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormularioDesenvolvimentoWeb = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo do site *
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.tipoSite || ''}
          onChange={(e) => setFormData({...formData, tipoSite: e.target.value})}
          required
        >
          <option value="">Selecione o tipo</option>
          <option value="institucional">Site Institucional</option>
          <option value="loja">Loja Virtual</option>
          <option value="landing-page">Landing Page</option>
          <option value="blog">Blog</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantas páginas aproximadamente? *
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.quantidadePaginas || ''}
          onChange={(e) => setFormData({...formData, quantidadePaginas: e.target.value})}
          placeholder="Ex: 5 páginas, 10 páginas, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Precisa de painel administrativo?
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="painelAdministrativo"
              value="sim"
              checked={formData.painelAdministrativo === true}
              onChange={(e) => setFormData({...formData, painelAdministrativo: true})}
              className="mr-2"
            />
            Sim
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painelAdministrativo"
              value="nao"
              checked={formData.painelAdministrativo === false}
              onChange={(e) => setFormData({...formData, painelAdministrativo: false})}
              className="mr-2"
            />
            Não
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Integrações necessárias:
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.integracoes?.whatsapp || false}
              onChange={(e) => setFormData({
                ...formData,
                integracoes: {
                  ...formData.integracoes,
                  whatsapp: e.target.checked
                }
              })}
              className="mr-2"
            />
            WhatsApp
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.integracoes?.pagamento || false}
              onChange={(e) => setFormData({
                ...formData,
                integracoes: {
                  ...formData.integracoes,
                  pagamento: e.target.checked
                }
              })}
              className="mr-2"
            />
            Sistema de Pagamento
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.integracoes?.email || false}
              onChange={(e) => setFormData({
                ...formData,
                integracoes: {
                  ...formData.integracoes,
                  email: e.target.checked
                }
              })}
              className="mr-2"
            />
            Email Marketing
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exemplos de sites de referência
        </label>
        <Textarea
          className="w-full"
          value={formData.exemplosSites || ''}
          onChange={(e) => setFormData({...formData, exemplosSites: e.target.value})}
          placeholder="Cole links ou descreva sites que você gosta..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderFormularioAppMobile = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Qual plataforma? *
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.plataforma || ''}
          onChange={(e) => setFormData({...formData, plataforma: e.target.value})}
          required
        >
          <option value="">Selecione a plataforma</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="ambos">Ambos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Qual a função principal do app? *
        </label>
        <Textarea
          className="w-full"
          value={formData.funcaoPrincipal || ''}
          onChange={(e) => setFormData({...formData, funcaoPrincipal: e.target.value})}
          placeholder="Descreva a função principal do aplicativo..."
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Necessidades técnicas:
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.integracaoBanco || false}
              onChange={(e) => setFormData({...formData, integracaoBanco: e.target.checked})}
              className="mr-2"
            />
            Integração com banco de dados
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.integracaoApi || false}
              onChange={(e) => setFormData({...formData, integracaoApi: e.target.checked})}
              className="mr-2"
            />
            Integração com API externa
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.loginNecessario || false}
              onChange={(e) => setFormData({...formData, loginNecessario: e.target.checked})}
              className="mr-2"
            />
            Sistema de login
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.funcionamentoOffline || false}
              onChange={(e) => setFormData({...formData, funcionamentoOffline: e.target.checked})}
              className="mr-2"
            />
            Funcionamento offline
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exemplo de app similar
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.exemploApp || ''}
          onChange={(e) => setFormData({...formData, exemploApp: e.target.value})}
          placeholder="Ex: Instagram, Uber, iFood..."
        />
      </div>
    </div>
  );

  const renderFormularioOutros = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descreva detalhadamente sua necessidade *
        </label>
        <Textarea
          className="w-full"
          value={formData.descricaoDetalhada || ''}
          onChange={(e) => setFormData({...formData, descricaoDetalhada: e.target.value})}
          placeholder="Descreva o que você precisa, objetivos, funcionalidades, etc..."
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prazo desejado
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.prazoDesejado || ''}
          onChange={(e) => setFormData({...formData, prazoDesejado: e.target.value})}
          placeholder="Ex: 30 dias, 2 meses, urgente..."
        />
      </div>
    </div>
  );

  const renderFormularioPorServico = () => {
    if (!solicitacao) return null;

    switch (solicitacao.servicoInteresse.toLowerCase()) {
      case 'desenvolvimento web':
        return renderFormularioDesenvolvimentoWeb();
      case 'app mobile':
        return renderFormularioAppMobile();
      case 'design digital':
      case 'cartão digital':
      case 'vídeo corporativo':
        return renderFormularioOutros();
      default:
        return renderFormularioOutros();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Formulário não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O formulário solicitado não foi encontrado ou já foi processado.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Detalhes do Orçamento
            </h1>
            <p className="text-gray-600">
              Olá {solicitacao.nomeCliente}! Para prepararmos um orçamento personalizado para <strong>{solicitacao.servicoInteresse}</strong>, precisamos de algumas informações adicionais.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormularioPorServico()}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações adicionais
              </label>
              <Textarea
                className="w-full"
                value={formData.observacoes || ''}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Alguma informação adicional que considere importante..."
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Send size={16} className="mr-2" />
                )}
                {submitting ? 'Enviando...' : 'Enviar Detalhes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioDetalhado;
