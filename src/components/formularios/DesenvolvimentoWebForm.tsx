
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

      {/* Objetivo do Site */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o objetivo principal do seu site? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={respostas.objetivoSite || ''}
          onChange={(e) => handleChange('objetivoSite', e.target.value)}
          required
        >
          <option value="">Selecione o objetivo</option>
          <option value="institucional">Site Institucional - Apresentar empresa/profissional</option>
          <option value="loja">Loja Virtual - Vender produtos online</option>
          <option value="landing-page">Landing Page - Capturar leads/conversões</option>
          <option value="blog">Blog/Portal de Conteúdo</option>
          <option value="portfolio">Portfólio Profissional</option>
          <option value="catalogo">Catálogo de Produtos/Serviços</option>
          <option value="outro">Outro objetivo</option>
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
          <option value="1-3">1 a 3 páginas</option>
          <option value="4-7">4 a 7 páginas</option>
          <option value="8-15">8 a 15 páginas</option>
          <option value="16-30">16 a 30 páginas</option>
          <option value="30+">Mais de 30 páginas</option>
        </select>
      </div>

      {/* Funcionalidades */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Quais funcionalidades você precisa? (marque todas que se aplicam)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Formulário de contato',
            'Galeria de fotos',
            'Sistema de pagamento',
            'Painel administrativo',
            'Blog/Notícias',
            'Chat online',
            'Área do cliente',
            'Sistema de agendamento',
            'Integração WhatsApp',
            'Google Analytics',
            'SEO otimizado',
            'Múltiplos idiomas'
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

      {/* Sites de Referência */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Sites de referência (que você gosta do design/funcionalidade)
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Cole aqui links de sites que você admira o design ou funcionalidades
Exemplo:
- https://exemplo1.com.br (gosto do layout)
- https://exemplo2.com (funcionalidades interessantes)"
          value={respostas.sitesReferencia || ''}
          onChange={(e) => handleChange('sitesReferencia', e.target.value)}
          rows={4}
        />
      </div>

      {/* Identidade Visual */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui identidade visual (logo, cores, fontes)? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, já tenho tudo' },
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
          <option value="7-dias">7 dias (urgente)</option>
          <option value="15-dias">15 dias</option>
          <option value="30-dias">30 dias</option>
          <option value="60-dias">60 dias</option>
          <option value="90-dias">90 dias ou mais</option>
          <option value="flexivel">Flexível, sem pressa</option>
        </select>
      </div>

      {/* Observações */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Observações adicionais ou detalhes específicos
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Compartilhe qualquer detalhe adicional sobre seu projeto, expectativas especiais, ou dúvidas que gostaria de esclarecer..."
          value={respostas.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default DesenvolvimentoWebForm;
