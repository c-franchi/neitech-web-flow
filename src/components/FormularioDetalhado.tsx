
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, FileText } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Importar os componentes de formulário específicos
import DesenvolvimentoWebForm from './formularios/DesenvolvimentoWebForm';
import AppMobileForm from './formularios/AppMobileForm';
import DesignDigitalForm from './formularios/DesignDigitalForm';
import CartaoDigitalForm from './formularios/CartaoDigitalForm';
import VideoCorporativoForm from './formularios/VideoCorporativoForm';
import OutrosServicosForm from './formularios/OutrosServicosForm';

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

  const determinarTipoFormulario = (servicoInteresse: string): string => {
    const servico = servicoInteresse.toLowerCase();
    
    if (servico.includes('desenvolvimento') || servico.includes('website') || servico.includes('site')) {
      return 'desenvolvimento-web';
    }
    if (servico.includes('app') || servico.includes('mobile') || servico.includes('aplicativo')) {
      return 'app-mobile';
    }
    if (servico.includes('design') || servico.includes('logo') || servico.includes('identidade')) {
      return 'design-digital';
    }
    if (servico.includes('cartão') || servico.includes('cartao')) {
      return 'cartao-digital';
    }
    if (servico.includes('vídeo') || servico.includes('video') || servico.includes('corporativo')) {
      return 'video-corporativo';
    }
    
    return 'outros';
  };

  const renderFormularioEspecifico = () => {
    if (!solicitacao) return null;

    const tipoFormulario = determinarTipoFormulario(solicitacao.servicoInteresse);

    switch (tipoFormulario) {
      case 'desenvolvimento-web':
        return <DesenvolvimentoWebForm respostas={respostas} setRespostas={setRespostas} />;
      case 'app-mobile':
        return <AppMobileForm respostas={respostas} setRespostas={setRespostas} />;
      case 'design-digital':
        return <DesignDigitalForm respostas={respostas} setRespostas={setRespostas} />;
      case 'cartao-digital':
        return <CartaoDigitalForm respostas={respostas} setRespostas={setRespostas} />;
      case 'video-corporativo':
        return <VideoCorporativoForm respostas={respostas} setRespostas={setRespostas} />;
      default:
        return <OutrosServicosForm respostas={respostas} setRespostas={setRespostas} />;
    }
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

            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-800 mb-2">📋 Antes de enviar:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Verifique se preencheu todos os campos obrigatórios (*)</li>
                  <li>• Suas respostas nos ajudam a criar um orçamento mais preciso</li>
                  <li>• Você será notificado via WhatsApp quando o orçamento estiver pronto</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="mr-3 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-3" />
                      Enviar Detalhes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioDetalhado;
