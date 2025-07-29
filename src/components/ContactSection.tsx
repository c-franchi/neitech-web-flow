
import React, { useState } from 'react';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { OrcamentoService } from '@/services/orcamentoService';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    emailCliente: '',
    whatsappCliente: '',
    servicoInteresse: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const servicos = [
    'Desenvolvimento Web',
    'App Mobile',
    'Design Digital',
    'Cartão Digital',
    'Vídeo Corporativo',
    'Outros'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeCliente || !formData.emailCliente || !formData.whatsappCliente || !formData.servicoInteresse) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
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
        mensagem: formData.mensagem || 'Solicitação inicial de orçamento'
      });

      toast({
        title: "Solicitação enviada!",
        description: "Você receberá uma mensagem no WhatsApp com instruções para acompanhar sua solicitação."
      });

      // Limpar formulário
      setFormData({
        nomeCliente: '',
        emailCliente: '',
        whatsappCliente: '',
        servicoInteresse: '',
        mensagem: ''
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
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Solicite seu Orçamento
            </h2>
            <p className="text-xl text-gray-600">
              Conte-nos sobre seu projeto e receba uma proposta personalizada
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
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

              <div>
                <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem (opcional)
                </label>
                <textarea
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Conte-nos um pouco sobre seu projeto (opcional)"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} className="mr-2" />
                      Enviar Solicitação
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
