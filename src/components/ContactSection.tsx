
import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { useToast } from '@/hooks/use-toast';
import { loadSectionFonts } from '../utils/loadGoogleFont';
import AnimatedSection from './AnimatedSection';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

type ContactSectionProps = {
  data?: {
    titulo?: string;
    subtitulo?: string;
    servicos?: string[];
    cta?: string;
    aviso?: string;
    styles?: SectionStyles;
  };
};

const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    emailCliente: '',
    whatsappCliente: '',
    servicoInteresse: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const servicos = data?.servicos && Array.isArray(data.servicos) && data.servicos.length > 0
    ? data.servicos
    : [
      'Desenvolvimento Web',
      'Aplicativos Mobile',
      'Design Digital',
      'Cartão Digital',
      'Vídeo Corporativo',
      'Outros'
    ];
  const titulo = data?.titulo || 'Solicite seu Orçamento';
  const subtitulo = data?.subtitulo || 'Conte-nos sobre seu projeto e receba uma proposta personalizada';
  const cta = data?.cta || 'Solicitar Orçamento';
  const aviso = data?.aviso || 'Seus dados são confidenciais e não serão compartilhados.';
  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);

  useEffect(() => {
    loadSectionFonts(styles);
  }, [styles?.fontFamily, styles?.headingFontFamily]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeCliente || !formData.emailCliente || !formData.whatsappCliente || !formData.servicoInteresse) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, e-mail, WhatsApp e serviço de interesse.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const solicitacaoId = await OrcamentoService.criarSolicitacao({
        nomeCliente: formData.nomeCliente,
        emailCliente: formData.emailCliente,
        whatsappCliente: formData.whatsappCliente,
        servicoInteresse: formData.servicoInteresse,
        mensagem: 'Solicitação inicial de orçamento'
      });

      toast({
        title: "Solicitação enviada!",
        description: "Recebemos seu pedido. Você receberá um retorno em até 24h no WhatsApp. Seus dados são confidenciais."
      });

      // Limpar formulário
      setFormData({
        nomeCliente: '',
        emailCliente: '',
        whatsappCliente: '',
        servicoInteresse: ''
      });
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50" style={{
      ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
      ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
      ...(styles?.fontSize ? { fontSize: styles.fontSize } : {}),
    }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16" targets="[data-contact-header]" stagger={motion.stagger} y={motion.revealY} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{
              ...(styles?.headingColor ? { color: styles.headingColor } : {}),
              ...(styles?.headingFontFamily ? { fontFamily: styles.headingFontFamily } : {}),
              ...(styles?.headingFontWeight ? { fontWeight: styles.headingFontWeight } : {}),
            }}>
              <span data-contact-header>{titulo}</span>
            </h2>
            <p data-contact-header className="text-xl text-gray-600" style={styles?.textColor ? { color: styles.textColor } : {}}>
              {subtitulo}
            </p>
          </AnimatedSection>

          <AnimatedSection className="bg-white rounded-2xl shadow-xl p-8" y={motion.revealY} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nomeCliente}
                    onChange={(e) => setFormData({...formData, nomeCliente: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.emailCliente}
                    onChange={(e) => setFormData({...formData, emailCliente: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    value={formData.whatsappCliente}
                    onChange={(e) => setFormData({...formData, whatsappCliente: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="servico" className="block text-sm font-semibold text-gray-700 mb-2">
                    Serviço de interesse *
                  </label>
                  <select
                    id="servico"
                    value={formData.servicoInteresse}
                    onChange={(e) => setFormData({...formData, servicoInteresse: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos.map((servico) => (
                      <option key={servico} value={servico}>
                        {servico}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mensagem removida para simplificação */}

              <div className="text-center space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="interactive-button inline-flex items-center px-8 py-4 bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  style={{
                    ...(styles?.buttonColor ? { backgroundColor: styles.buttonColor } : {}),
                    ...(styles?.buttonTextColor ? { color: styles.buttonTextColor } : {}),
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} className="mr-2" />
                      {cta}
                    </>
                  )}
                </button>
                <div className="text-xs text-gray-400 mt-2">{aviso}</div>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
