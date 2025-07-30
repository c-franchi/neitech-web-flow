
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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-xl font-bold text-red-900 mb-2">Vídeo Corporativo</h3>
        <p className="text-red-700">Vamos criar um vídeo profissional que represente sua marca</p>
      </div>

      {/* Objetivo do Vídeo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o objetivo principal do vídeo? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'institucional', label: 'Institucional - Apresentar a empresa' },
            { value: 'produto', label: 'Apresentação de produto/serviço' },
            { value: 'equipe', label: 'Apresentação da equipe' },
            { value: 'evento', label: 'Cobertura de evento' },
            { value: 'depoimento', label: 'Depoimentos de clientes' },
            { value: 'outro', label: 'Outro objetivo' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="radio"
                name="objetivoVideo"
                value={opcao.value}
                checked={respostas.objetivoVideo === opcao.value}
                onChange={(e) => handleChange('objetivoVideo', e.target.value)}
                className="mr-3 text-red-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duração */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual duração você imagina para o vídeo? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          value={respostas.duracaoEstimada || ''}
          onChange={(e) => handleChange('duracaoEstimada', e.target.value)}
          required
        >
          <option value="">Selecione a duração</option>
          <option value="30-segundos">30 segundos</option>
          <option value="1-minuto">1 minuto</option>
          <option value="2-minutos">2 minutos</option>
          <option value="3-5-minutos">3 a 5 minutos</option>
          <option value="5-10-minutos">5 a 10 minutos</option>
          <option value="10+-minutos">Mais de 10 minutos</option>
        </select>
      </div>

      {/* Roteiro */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui roteiro ou script? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, já tenho pronto' },
            { value: 'parcial', label: 'Tenho algumas ideias' },
            { value: 'nao', label: 'Não tenho, preciso de ajuda' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="radio"
                name="possuiRoteiro"
                value={opcao.value}
                checked={respostas.possuiRoteiro === opcao.value}
                onChange={(e) => handleChange('possuiRoteiro', e.target.value)}
                className="mr-3 text-red-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material Próprio */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você possui imagens, vídeos ou material próprio para usar? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, vou fornecer' },
            { value: 'parcial', label: 'Algumas coisas' },
            { value: 'nao', label: 'Não tenho material' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="radio"
                name="possuiMaterial"
                value={opcao.value}
                checked={respostas.possuiMaterial === opcao.value}
                onChange={(e) => handleChange('possuiMaterial', e.target.value)}
                className="mr-3 text-red-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Serviços Necessários */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Que serviços você precisa? (marque todos que se aplicam)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Criação do roteiro',
            'Filmagem/Gravação',
            'Narração/Locução',
            'Edição de vídeo',
            'Animações/Motion',
            'Trilha sonora',
            'Legendas',
            'Correção de cor',
            'Efeitos visuais',
            'Compressão/Otimização'
          ].map((servico) => (
            <label key={servico} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={respostas.servicosNecessarios?.[servico] || false}
                onChange={(e) => handleCheckboxChange('servicosNecessarios', servico, e.target.checked)}
                className="mr-3 text-red-600"
              />
              <span className="text-sm">{servico}</span>
            </label>
          ))}
        </div>
      </div>

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

      {/* Observações */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Observações adicionais ou detalhes específicos
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          placeholder="Qualquer informação adicional sobre o vídeo, mensagem que quer transmitir, público-alvo, ou detalhes específicos..."
          value={respostas.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default VideoCorporativoForm;
