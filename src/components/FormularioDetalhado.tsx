
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, FileText } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const FormularioDetalhado = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [respostas, setRespostas] = useState<any>({});

  useEffect(() => {
    if (id && id.trim() !== '') {
      carregarSolicitacao(id);
    } else {
      setErro(true);
      setLoading(false);
    }
  }, [id]);

  const carregarSolicitacao = async (solicitacaoId: string) => {
    try {
      setLoading(true);
      setErro(false);
      
      const dados = await OrcamentoService.buscarSolicitacaoPorId(solicitacaoId);
      if (dados) {
        // Verificar se a solicitação está no status correto para preenchimento
        if (dados.statusSolicitacao !== 'aguardando_detalhamento') {
          toast({
            title: "Formulário não disponível",
            description: "Este formulário não está mais disponível para preenchimento.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        setSolicitacao(dados);
      } else {
        setErro(true);
        toast({
          title: "Solicitação não encontrada",
          description: "A solicitação solicitada não foi encontrada ou não existe.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar solicitação:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !solicitacao) return;

    try {
      setSubmitting(true);
      await OrcamentoService.salvarDetalhesFormulario(id, solicitacao.servicoInteresse, respostas);
      
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Recebemos suas informações. Você será notificado via WhatsApp quando o orçamento estiver pronto."
      });

      navigate(`/confirmacao/${id}`);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormularioEspecifico = () => {
    if (!solicitacao) return null;

    const tipoServico = solicitacao.servicoInteresse.toLowerCase();

    // Desenvolvimento Web
    if (tipoServico.includes('desenvolvimento') || tipoServico.includes('website') || tipoServico.includes('site')) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Detalhes do Desenvolvimento Web</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tipo do site</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={respostas.tipoSite || ''}
              onChange={(e) => setRespostas({...respostas, tipoSite: e.target.value})}
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="institucional">Institucional</option>
              <option value="loja">Loja Virtual</option>
              <option value="landing-page">Landing Page</option>
              <option value="blog">Blog</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantidade estimada de páginas</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 5-10 páginas"
              value={respostas.quantidadePaginas || ''}
              onChange={(e) => setRespostas({...respostas, quantidadePaginas: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Precisa de painel administrativo?</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="painelAdmin"
                  value="true"
                  checked={respostas.painelAdministrativo === true}
                  onChange={() => setRespostas({...respostas, painelAdministrativo: true})}
                  className="mr-2"
                />
                Sim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="painelAdmin"
                  value="false"
                  checked={respostas.painelAdministrativo === false}
                  onChange={() => setRespostas({...respostas, painelAdministrativo: false})}
                  className="mr-2"
                />
                Não
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Integrações necessárias</label>
            <div className="space-y-2">
              {['WhatsApp', 'Pagamento online', 'Email marketing', 'Outras'].map((integracao) => (
                <label key={integracao} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={respostas.integracoes?.[integracao] || false}
                    onChange={(e) => setRespostas({
                      ...respostas,
                      integracoes: {
                        ...respostas.integracoes,
                        [integracao]: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  {integracao}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Exemplos de sites de referência</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Cole aqui links de sites que você gosta do design/funcionalidade"
              value={respostas.exemplosSites || ''}
              onChange={(e) => setRespostas({...respostas, exemplosSites: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prazo desejado</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 30 dias, 2 meses"
              value={respostas.prazoDesejado || ''}
              onChange={(e) => setRespostas({...respostas, prazoDesejado: e.target.value})}
            />
          </div>
        </div>
      );
    }

    // Formulário genérico para outros serviços
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Detalhes do Serviço: {solicitacao.servicoInteresse}</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Descreva detalhadamente sua necessidade</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Explique com detalhes o que você precisa, suas expectativas, referências, etc."
            value={respostas.descricaoDetalhada || ''}
            onChange={(e) => setRespostas({...respostas, descricaoDetalhada: e.target.value})}
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prazo desejado</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 15 dias, 1 mês"
            value={respostas.prazoDesejado || ''}
            onChange={(e) => setRespostas({...respostas, prazoDesejado: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Observações adicionais</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Alguma informação adicional importante"
            value={respostas.observacoes || ''}
            onChange={(e) => setRespostas({...respostas, observacoes: e.target.value})}
            rows={3}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="text-center mt-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Carregando formulário...</p>
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
            Formulário não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            A solicitação que você está procurando não foi encontrada ou este formulário não está mais disponível.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Formulário Detalhado
            </h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Informações da Solicitação
            </h3>
            <p className="text-blue-800">
              <strong>Cliente:</strong> {solicitacao.nomeCliente}<br />
              <strong>Serviço:</strong> {solicitacao.servicoInteresse}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {renderFormularioEspecifico()}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Enviar Detalhes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioDetalhado;
