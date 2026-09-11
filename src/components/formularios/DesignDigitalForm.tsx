
import React from 'react';

interface DesignDigitalFormProps {
  respostas: any;
  setRespostas: (respostas: any) => void;
}

const DesignDigitalForm: React.FC<DesignDigitalFormProps> = ({ respostas, setRespostas }) => {
  const handleChange = (field: string, value: any) => {
    setRespostas({ ...respostas, [field]: value });
  };

  const handleCheckboxChange = (categoria: string, item: string, checked: boolean) => {
    const categoria_atual = respostas[categoria] || {};
    handleChange(categoria, { ...categoria_atual, [item]: checked });
  };

  return (
    <form className="space-y-8" aria-label="Formulário de design digital" autoComplete="on">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
        <h3 className="text-xl font-bold text-pink-900 mb-2" id="form-title">Design Digital</h3>
        <p className="text-pink-700">Vamos criar materiais visuais incríveis para sua marca</p>
      </div>

      {/* Tipo de Material */}
      <fieldset className="space-y-4" aria-labelledby="tipo-material-label">
        <legend id="tipo-material-label" className="block text-sm font-semibold text-gray-800 mb-1">Que tipo de material de design você precisa? * (marque todos que se aplicam)</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Logo/Logotipo',
            'Posts para redes sociais',
            'Stories Instagram/Facebook',
            'Banners para site',
            'Cartão de visita',
            'Papelaria (receituário, etc.)',
            'Flyers/Panfletos',
            'Cardápio digital',
            'Apresentação/Slides',
            'Identidade visual completa'
          ].map((tipo) => (
            <label key={tipo} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
              <input
                type="checkbox"
                checked={respostas.tipoMaterial?.[tipo] || false}
                onChange={(e) => handleCheckboxChange('tipoMaterial', tipo, e.target.checked)}
                className="mr-3 text-pink-600"
                aria-checked={respostas.tipoMaterial?.[tipo] || false}
                aria-labelledby={`tipo-material-label tipo-material-${tipo}`}
              />
              <span className="text-sm text-gray-800" id={`tipo-material-${tipo}`}>{tipo}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Cores Preferidas */}

      <div className="space-y-3">
        <label htmlFor="coresPreferidas" className="block text-sm font-semibold text-gray-800">
          Você tem cores preferidas ou já possui uma marca/identidade?
        </label>
        <textarea
          id="coresPreferidas"
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder={"Exemplo:\n- Cores: azul e branco (como Facebook)\n- Já tenho logo, só preciso adaptar\n- Sem preferência, deixo com vocês\n- Cores que NÃO gosto: rosa, roxo"}
          value={respostas.coresPreferidas || ''}
          onChange={(e) => handleChange('coresPreferidas', e.target.value)}
          rows={4}
        />
      </div>

      {/* Formatos de Entrega */}
      <fieldset className="space-y-3" aria-labelledby="formato-entrega-label">
        <legend id="formato-entrega-label" className="block text-sm font-semibold text-gray-800 mb-1">Quais formatos de entrega você precisa? *</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'PNG',
            'JPG',
            'PDF',
            'SVG',
            'Arquivo editável (AI, PSD, etc.)',
            'Outros'
          ].map((formato) => (
            <label key={formato} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={respostas.formatoEntrega?.[formato] || false}
                onChange={(e) => handleCheckboxChange('formatoEntrega', formato, e.target.checked)}
                className="mr-3 text-pink-600"
                aria-checked={respostas.formatoEntrega?.[formato] || false}
                aria-labelledby={`formato-entrega-label formato-entrega-${formato}`}
                required
              />
              <span id={`formato-entrega-${formato}`} className="text-xs">{formato}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Estilo Visual */}
      <fieldset className="space-y-3" aria-labelledby="estilo-visual-label">
        <legend id="estilo-visual-label" className="block text-sm font-semibold text-gray-800 mb-1">Que estilo visual você prefere? *</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'moderno', label: 'Moderno e clean' },
            { value: 'minimalista', label: 'Minimalista' },
            { value: 'elegante', label: 'Elegante e sofisticado' },
            { value: 'colorido', label: 'Colorido e vibrante' },
            { value: 'classico', label: 'Clássico e formal' },
            { value: 'criativo', label: 'Criativo e diferente' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
              <input
                type="radio"
                name="estiloVisual"
                value={opcao.value}
                checked={respostas.estiloVisual === opcao.value}
                onChange={(e) => handleChange('estiloVisual', e.target.value)}
                className="mr-3 text-pink-600"
                aria-checked={respostas.estiloVisual === opcao.value}
                aria-labelledby={`estilo-visual-label estilo-visual-${opcao.value}`}
                required
              />
              <span id={`estilo-visual-${opcao.value}`} className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Cores Preferidas */}

      <div className="space-y-3">
        <label htmlFor="coresPreferidas" className="block text-sm font-semibold text-gray-800">
          Você tem cores preferidas ou já possui uma marca/identidade?
        </label>
        <textarea
          id="coresPreferidas"
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder={"Exemplo:\n- Cores: azul e branco (como Facebook)\n- Já tenho logo, só preciso adaptar\n- Sem preferência, deixo com vocês\n- Cores que NÃO gosto: rosa, roxo"}
          value={respostas.coresPreferidas || ''}
          onChange={(e) => handleChange('coresPreferidas', e.target.value)}
          rows={4}
        />
      </div>

      {/* Texto/Frase */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual texto, frase ou nome deve aparecer no design?
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder="Exemplo:
- Nome da empresa: João Silva Advocacia
- Slogan: 'Cuidando do seu futuro'
- Frase para post: 'Novidade chegando em breve!'
- Apenas o logo, sem texto adicional"
          value={respostas.textoDesign || ''}
          onChange={(e) => handleChange('textoDesign', e.target.value)}
          rows={3}
        />
      </div>

      {/* Referências Visuais */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Referências visuais (links, imagens ou descrição)
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder="Compartilhe:
- Links de designs que você gosta
- Descrição do que imagina
- Referências de cores/estilos
- Exemplos de concorrentes

Exemplo: 'Gosto do estilo do logo da Nike, simples mas marcante'"
          value={respostas.referenciasVisuais || ''}
          onChange={(e) => handleChange('referenciasVisuais', e.target.value)}
          rows={5}
        />
      </div>

      {/* Prazo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o prazo ideal para entrega? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          value={respostas.prazoEsperado || ''}
          onChange={(e) => handleChange('prazoEsperado', e.target.value)}
          required
        >
          <option value="">Selecione o prazo</option>
          <option value="2-dias">2 dias (urgente)</option>
          <option value="5-dias">5 dias</option>
          <option value="7-dias">1 semana</option>
          <option value="15-dias">15 dias</option>
          <option value="flexivel">Flexível, sem pressa</option>
        </select>
      </div>

      {/* Observações */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Observações adicionais ou detalhes específicos
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder="Qualquer detalhe adicional que possa ajudar na criação do seu design..."
          value={respostas.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={3}
        />
      </div>
    </form>
  );
};

export default DesignDigitalForm;
