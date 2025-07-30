
import React from 'react';

interface CartaoDigitalFormProps {
  respostas: any;
  setRespostas: (respostas: any) => void;
}

const CartaoDigitalForm: React.FC<CartaoDigitalFormProps> = ({ respostas, setRespostas }) => {
  const handleChange = (field: string, value: any) => {
    setRespostas({ ...respostas, [field]: value });
  };

  const handleCheckboxChange = (categoria: string, item: string, checked: boolean) => {
    const categoria_atual = respostas[categoria] || {};
    handleChange(categoria, { ...categoria_atual, [item]: checked });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-bold text-green-900 mb-2">Cartão Digital</h3>
        <p className="text-green-700">Vamos criar seu cartão de visita digital moderno e interativo</p>
      </div>

      {/* Dados Básicos Obrigatórios */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4">Dados Básicos (obrigatórios)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nome completo *</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="João Silva"
              value={respostas.nome || ''}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Cargo/Profissão *</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Dentista / CEO / Designer"
              value={respostas.cargo || ''}
              onChange={(e) => handleChange('cargo', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">WhatsApp *</label>
            <input
              type="tel"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="(11) 99999-9999"
              value={respostas.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email *</label>
            <input
              type="email"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="joao@email.com"
              value={respostas.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Localização *</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="São Paulo, SP / Rua das Flores, 123"
              value={respostas.localizacao || ''}
              onChange={(e) => handleChange('localizacao', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Redes Sociais (opcionais)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="@seuusuario"
              value={respostas.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="linkedin.com/in/seuusuario"
              value={respostas.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="facebook.com/seuusuario"
              value={respostas.facebook || ''}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Outras redes</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="TikTok, YouTube, etc."
              value={respostas.outrasRedes || ''}
              onChange={(e) => handleChange('outrasRedes', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Funcionalidades Extras */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Funcionalidades extras que você gostaria de incluir:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Botão de localização/mapa',
            'QR Code para compartilhar',
            'Link para pagamento (Pix)',
            'Botão de agendamento',
            'Galeria de trabalhos',
            'Vídeo de apresentação',
            'Link para site/portfólio',
            'Botão de avaliação'
          ].map((extra) => (
            <label key={extra} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={respostas.funcionalidadesExtras?.[extra] || false}
                onChange={(e) => handleCheckboxChange('funcionalidadesExtras', extra, e.target.checked)}
                className="mr-3 text-green-600"
              />
              <span className="text-sm">{extra}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Estilo Visual */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Que estilo visual você prefere para seu cartão? *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'moderno', label: 'Moderno' },
            { value: 'elegante', label: 'Elegante' },
            { value: 'clean', label: 'Clean/Minimalista' },
            { value: 'criativo', label: 'Criativo' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
              <input
                type="radio"
                name="estiloVisual"
                value={opcao.value}
                checked={respostas.estiloVisual === opcao.value}
                onChange={(e) => handleChange('estiloVisual', e.target.value)}
                className="mr-3 text-green-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Logo/Foto */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui logo ou foto profissional? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, vou enviar' },
            { value: 'nao', label: 'Não tenho' },
            { value: 'preciso', label: 'Preciso que vocês façam' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
              <input
                type="radio"
                name="possuiLogo"
                value={opcao.value}
                checked={respostas.possuiLogo === opcao.value}
                onChange={(e) => handleChange('possuiLogo', e.target.value)}
                className="mr-3 text-green-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Observações adicionais ou detalhes específicos
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="Alguma informação adicional, cores preferidas, ou funcionalidade específica que gostaria no seu cartão digital..."
          value={respostas.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default CartaoDigitalForm;
