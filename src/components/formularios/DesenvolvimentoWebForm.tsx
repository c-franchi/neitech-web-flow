
import React from 'react';

interface DesenvolvimentoWebFormProps {
  respostas: any;
  setRespostas: (respostas: any) => void;
}

const DesenvolvimentoWebForm: React.FC<DesenvolvimentoWebFormProps> = ({ respostas, setRespostas }) => {
  const handleChange = (field: string, value: any) => {
    setRespostas({ ...respostas, [field]: value });
  };

  const handleCheckboxChange = (categoria: string, item: string, checked: boolean) => {
    const categoria_atual = respostas[categoria] || {};
    handleChange(categoria, { ...categoria_atual, [item]: checked });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Desenvolvimento Web</h3>
        <p className="text-blue-700">Vamos detalhar seu projeto de site para criar um orçamento preciso</p>
      </div>

      {/* Tipo do Site */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o tipo de site que você deseja? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={respostas.tipoSite || ''}
          onChange={(e) => handleChange('tipoSite', e.target.value)}
          required
        >
          <option value="">Selecione o tipo de site</option>
          <option value="institucional">Site Institucional - Apresentar empresa/profissional</option>
          <option value="loja">Loja Virtual - E-commerce completo</option>
          <option value="landing-page">Landing Page - Capturar leads/conversões</option>
          <option value="blog">Blog/Portal de Conteúdo</option>
          <option value="portfolio">Portfólio Profissional</option>
          <option value="catalogo">Catálogo de Produtos/Serviços</option>
          <option value="evento">Site de Evento</option>
          <option value="educacional">Plataforma Educacional</option>
          <option value="outro">Outro tipo</option>
        </select>
      </div>

      {/* Quantidade de Páginas */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Quantas páginas aproximadamente o site terá? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={respostas.quantidadePaginas || ''}
          onChange={(e) => handleChange('quantidadePaginas', e.target.value)}
          required
        >
          <option value="">Selecione a quantidade</option>
          <option value="1">1 página</option>
          <option value="2-3">2 a 3 páginas</option>
          <option value="4-5">4 a 5 páginas</option>
          <option value="6-10">6 a 10 páginas</option>
          <option value="11-15">11 a 15 páginas</option>
          <option value="16-20">16 a 20 páginas</option>
          <option value="20+">Mais de 20 páginas</option>
        </select>
      </div>

      {/* Domínio */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui domínio (www.seusite.com.br)? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, já tenho' },
            { value: 'nao', label: 'Não tenho' },
            { value: 'ajuda', label: 'Preciso de ajuda' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="possuiDominio"
                value={opcao.value}
                checked={respostas.possuiDominio === opcao.value}
                onChange={(e) => handleChange('possuiDominio', e.target.value)}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Hospedagem */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui hospedagem? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, já tenho' },
            { value: 'nao', label: 'Não tenho' },
            { value: 'ajuda', label: 'Preciso de ajuda' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="possuiHospedagem"
                value={opcao.value}
                checked={respostas.possuiHospedagem === opcao.value}
                onChange={(e) => handleChange('possuiHospedagem', e.target.value)}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Precisa de Painel Administrativo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Precisa de painel administrativo? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'sim', label: 'Sim, preciso gerenciar conteúdo' },
            { value: 'nao', label: 'Não, site estático' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="painelAdministrativo"
                value={opcao.value}
                checked={respostas.painelAdministrativo === opcao.value}
                onChange={(e) => handleChange('painelAdministrativo', e.target.value)}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Funcionalidades */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Quais funcionalidades você precisa? (marque todas que se aplicam)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Formulário de contato',
            'Galeria de fotos/vídeos',
            'Sistema de pagamento',
            'Blog/Sistema de notícias',
            'Chat online/WhatsApp',
            'Área do cliente/login',
            'Sistema de agendamento',
            'Integração com redes sociais',
            'Google Analytics',
            'SEO otimizado',
            'Múltiplos idiomas',
            'Newsletter/Email marketing',
            'Mapa de localização',
            'Carrinho de compras',
            'Sistema de avaliações',
            'Busca avançada'
          ].map((funcionalidade) => (
            <label key={funcionalidade} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={respostas.funcionalidades?.[funcionalidade] || false}
                onChange={(e) => handleCheckboxChange('funcionalidades', funcionalidade, e.target.checked)}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm">{funcionalidade}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Integrações Necessárias */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Precisa de integrações específicas?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'WhatsApp Business API',
            'Pagamento online (cartão/Pix)',
            'Email marketing (Mailchimp, etc)',
            'CRM (Pipedrive, HubSpot)',
            'ERP existente',
            'Google Ads/Facebook Ads',
            'Sistema de estoque',
            'Transportadoras (correios, etc)'
          ].map((integracao) => (
            <label key={integracao} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={respostas.integracoes?.[integracao] || false}
                onChange={(e) => handleCheckboxChange('integracoes', integracao, e.target.checked)}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm">{integracao}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Identidade Visual */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui identidade visual (logo, cores, fontes)? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'completa', label: 'Sim, tenho logo, cores e fontes' },
            { value: 'parcial', label: 'Tenho logo, mas falta o resto' },
            { value: 'nao', label: 'Não tenho, preciso contratar' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="identidadeVisual"
                value={opcao.value}
                checked={respostas.identidadeVisual === opcao.value}
                onChange={(e) => handleChange('identidadeVisual', e.target.value)}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sites de Referência */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Sites de referência que você admira
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Cole aqui links de sites que você gosta do design ou funcionalidades:

Exemplo:
- https://exemplo1.com.br (gosto do layout clean)
- https://exemplo2.com (funcionalidades interessantes)
- https://exemplo3.com (cores e estilo)"
          value={respostas.sitesReferencia || ''}
          onChange={(e) => handleChange('sitesReferencia', e.target.value)}
          rows={4}
        />
      </div>

      {/* Prazo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o prazo ideal para entrega? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={respostas.prazoEsperado || ''}
          onChange={(e) => handleChange('prazoEsperado', e.target.value)}
          required
        >
          <option value="">Selecione o prazo</option>
          <option value="7-dias">7 dias (urgente - taxa adicional)</option>
          <option value="15-dias">15 dias</option>
          <option value="30-dias">30 dias</option>
          <option value="45-dias">45 dias</option>
          <option value="60-dias">60 dias</option>
          <option value="90-dias">90 dias ou mais</option>
          <option value="flexivel">Flexível, sem pressa</option>
        </select>
      </div>

      {/* Orçamento Estimado */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é seu orçamento estimado para o projeto?
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={respostas.orcamentoEstimado || ''}
          onChange={(e) => handleChange('orcamentoEstimado', e.target.value)}
        >
          <option value="">Prefiro não informar</option>
          <option value="ate-2000">Até R$ 2.000</option>
          <option value="2000-5000">R$ 2.000 - R$ 5.000</option>
          <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
          <option value="10000-20000">R$ 10.000 - R$ 20.000</option>
          <option value="acima-20000">Acima de R$ 20.000</option>
        </select>
      </div>

      {/* Observações */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Observações adicionais ou detalhes específicos
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Compartilhe qualquer detalhe adicional sobre seu projeto:

• Funcionalidades específicas que não foram mencionadas
• Expectativas especiais de design
• Integração com sistemas existentes
• Dúvidas que gostaria de esclarecer
• Deadline específico ou evento importante"
          value={respostas.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};

export default DesenvolvimentoWebForm;
