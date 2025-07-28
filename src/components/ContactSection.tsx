import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrcamentoService } from '@/services/orcamentoService';

/**
 * ContactSection - Formulário de contato e informações
 * Features: Validação, animações de feedback, informações de contato, integração com Firebase
 */
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.service || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Validação do WhatsApp (formato básico)
    const whatsappRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!whatsappRegex.test(formData.whatsapp)) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira o WhatsApp no formato (XX) XXXXX-XXXX",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Salvar solicitação no Firebase
      const solicitacaoId = await OrcamentoService.criarSolicitacao({
        nomeCliente: formData.name,
        emailCliente: formData.email,
        whatsappCliente: formData.whatsapp,
        servicoInteresse: formData.service,
        mensagem: formData.message
      });

      console.log('Solicitação criada com ID:', solicitacaoId);

      // Enviar mensagem para WhatsApp (comportamento existente)
      const whatsappMessage = `Olá! Vim do site da NeiTech.
      
*Nome:* ${formData.name}
*Email:* ${formData.email}
*WhatsApp:* ${formData.whatsapp}
*Serviço:* ${formData.service}
*Mensagem:* ${formData.message}

*Código da Solicitação:* ${solicitacaoId}`;

      const whatsappUrl = `https://wa.me/5516997813038?text=${encodeURIComponent(whatsappMessage)}`;

      // Aguarda um pouco para simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Abre o WhatsApp
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Sua solicitação foi registrada e você será redirecionado para o WhatsApp. Guarde o código da solicitação para acompanhamento."
      });

      // Reset após 3 segundos
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          whatsapp: '',
          service: '',
          message: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setIsSubmitting(false);
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente ou entre em contato diretamente.",
        variant: "destructive"
      });
    }
  };

  // Função para formatar WhatsApp enquanto o usuário digita
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setFormData({
      ...formData,
      whatsapp: formatted
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'neifranchi@gmail.com',
      href: 'mailto:neifranchi@gmail.com',
      description: 'Resposta em até 24h'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '(16) 99781-3038',
      href: 'https://wa.me/5516997813038',
      description: 'Atendimento imediato'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Araraquara, SP',
      href: null,
      description: 'Atendimento presencial'
    }
  ];

  return (
    <section id="contact" className="bg-white py-[49px]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            Entre em <span className="text-blue-600">Contato</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Pronto para transformar sua ideia em realidade digital? Vamos conversar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Informações de Contato */}
          <div className="space-y-8 px-0 py-[30px] mx-px my-[20px]">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Vamos trabalhar juntos
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Estamos sempre prontos para novos desafios. Entre em contato conosco 
                e vamos discutir como podemos ajudar a impulsionar seu negócio no mundo digital.
              </p>
            </div>

            {/* Cards de contato */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                info.href ? (
                  <a
                    key={info.title}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : '_self'}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <info.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{info.title}</h4>
                      <p className="text-slate-600">{info.value}</p>
                      <p className="text-sm text-slate-500">{info.description}</p>
                    </div>
                  </a>
                ) : (
                  <div
                    key={info.title}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <info.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{info.title}</h4>
                      <p className="text-slate-600">{info.value}</p>
                      <p className="text-sm text-slate-500">{info.description}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl shadow-lg py-[20px] px-[5px]">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-semibold text-slate-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleWhatsAppChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="(XX) XXXXX-XXXX"
                    maxLength={15}
                  />
                </div>

                {/* Serviço */}
                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-slate-700 mb-2">
                    Serviço de Interesse *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                    <option value="App Mobile">App Mobile</option>
                    <option value="Design Digital">Design Digital</option>
                    <option value="Cartão Digital">Cartão Digital</option>
                    <option value="Vídeo Corporativo">Vídeo Corporativo</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Conte-nos sobre seu projeto..."
                  />
                </div>

                {/* Botão Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-400 text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Enviar Solicitação</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Mensagem de sucesso */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Solicitação Enviada!</h3>
                <p className="text-slate-600">
                  Sua solicitação foi registrada com sucesso. Você será redirecionado para o WhatsApp e receberá um código para acompanhar o andamento do seu orçamento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
