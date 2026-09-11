
import React from 'react';

interface VideoCorporativoFormProps {
  respostas: any;
  setRespostas: (respostas: any) => void;
}

const VideoCorporativoForm: React.FC<VideoCorporativoFormProps> = ({ respostas, setRespostas }) => {
  const handleChange = (field: string, value: any) => {
    setRespostas({ ...respostas, [field]: value });
  };

  const handleCheckboxChange = (categoria: string, item: string, checked: boolean) => {
    const categoria_atual = respostas[categoria] || {};
    handleChange(categoria, { ...categoria_atual, [item]: checked });
  };

  return (
    <form className="space-y-8" aria-label="Formulário de vídeo corporativo" autoComplete="on">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-900 mb-2" id="form-title">Vídeo Corporativo</h3>
        <p className="text-indigo-700">Conte-nos mais sobre o vídeo que deseja produzir</p>
      </div>
      {/* Objetivo do Vídeo */}
      <fieldset className="space-y-3" aria-labelledby="objetivo-label">
        <legend id="objetivo-label" className="block text-sm font-semibold text-gray-800 mb-1">Qual é o objetivo principal do vídeo? *</legend>
        <textarea
          id="objetivo"
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Exemplo: Apresentar a empresa, divulgar um produto, treinamento interno, institucional, etc."
          value={respostas.objetivo || ''}
          onChange={(e) => handleChange('objetivo', e.target.value)}
          rows={3}
        />
      </fieldset>
    </form>
  );

      {/* Estilo do Vídeo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Que estilo de vídeo você imagina? *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'dinamico', label: 'Dinâmico' },
            { value: 'corporativo', label: 'Corporativo' },
            { value: 'emocional', label: 'Emocional' },
            { value: 'divertido', label: 'Divertido' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="radio"
                name="estiloVideo"
                value={opcao.value}
                checked={respostas.estiloVideo === opcao.value}
                onChange={(e) => handleChange('estiloVideo', e.target.value)}
                className="mr-3 text-red-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Referências */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você tem algum vídeo de referência?
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          placeholder="Cole aqui links de vídeos que você gosta do estilo, edição ou formato
Exemplo:
- https://youtube.com/watch?v=exemplo1 (gosto da edição)
- https://vimeo.com/exemplo2 (estilo que imagino)"
          value={respostas.videosReferencia || ''}
          onChange={(e) => handleChange('videosReferencia', e.target.value)}
          rows={4}
        />
      </div>

      {/* Prazo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o prazo ideal para entrega? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          value={respostas.prazoEsperado || ''}
          onChange={(e) => handleChange('prazoEsperado', e.target.value)}
          required
        >
          <option value="">Selecione o prazo</option>
          <option value="7-dias">7 dias (urgente)</option>
          <option value="15-dias">15 dias</option>
          <option value="30-dias">30 dias</option>
          <option value="45-dias">45 dias</option>
          <option value="flexivel">Flexível, sem pressa</option>
        </select>
      </div>

      return (
        <form className="space-y-8" aria-label="Formulário de vídeo corporativo" autoComplete="on">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-2" id="form-title">Vídeo Corporativo</h3>
            <p className="text-indigo-700">Conte-nos mais sobre o vídeo que deseja produzir</p>
          </div>
          {/* Objetivo do Vídeo */}
          <fieldset className="space-y-3" aria-labelledby="objetivo-label">
            <legend id="objetivo-label" className="block text-sm font-semibold text-gray-800 mb-1">Qual é o objetivo principal do vídeo? *</legend>
            <textarea
              id="objetivo"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Exemplo: Apresentar a empresa, divulgar um produto, treinamento interno, institucional, etc."
              value={respostas.objetivo || ''}
              onChange={(e) => handleChange('objetivo', e.target.value)}
              rows={3}
              required
              aria-required="true"
            />
          </fieldset>
          {/* Público-alvo */}
          <fieldset className="space-y-3" aria-labelledby="publico-alvo-label">
            <legend id="publico-alvo-label" className="block text-sm font-semibold text-gray-800 mb-1">Quem é o público-alvo do vídeo? *</legend>
            <input
              id="publicoAlvo"
              type="text"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Exemplo: Clientes, colaboradores, investidores, etc."
              value={respostas.publicoAlvo || ''}
              onChange={(e) => handleChange('publicoAlvo', e.target.value)}
              required
              aria-required="true"
            />
          </fieldset>
          {/* Duração Estimada */}
          <fieldset className="space-y-3" aria-labelledby="duracao-estimada-label">
            <legend id="duracao-estimada-label" className="block text-sm font-semibold text-gray-800 mb-1">Qual a duração estimada do vídeo?</legend>
            <select
              id="duracaoEstimada"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={respostas.duracaoEstimada || ''}
              onChange={(e) => handleChange('duracaoEstimada', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="ate-1-min">Até 1 minuto</option>
              <option value="1-3-min">1 a 3 minutos</option>
              <option value="3-5-min">3 a 5 minutos</option>
              <option value="5-10-min">5 a 10 minutos</option>
              <option value="10-mais">Mais de 10 minutos</option>
            </select>
          </fieldset>
        </form>
      );
    }

    export default VideoCorporativoForm;
