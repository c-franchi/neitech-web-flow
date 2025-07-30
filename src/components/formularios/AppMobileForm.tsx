
import React from 'react';

interface AppMobileFormProps {
  respostas: any;
  setRespostas: (respostas: any) => void;
}

const AppMobileForm: React.FC<AppMobileFormProps> = ({ respostas, setRespostas }) => {
  const handleChange = (field: string, value: any) => {
    setRespostas({ ...respostas, [field]: value });
  };

  const handleCheckboxChange = (categoria: string, item: string, checked: boolean) => {
    const categoria_atual = respostas[categoria] || {};
    handleChange(categoria, { ...categoria_atual, [item]: checked });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-xl font-bold text-purple-900 mb-2">Aplicativo Mobile</h3>
        <p className="text-purple-700">Vamos planejar seu app para Android e/ou iOS</p>
      </div>

      {/* Plataforma */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Para qual plataforma você quer o app? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'android', label: 'Apenas Android' },
            { value: 'ios', label: 'Apenas iOS (iPhone)' },
            { value: 'ambos', label: 'Android + iOS' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
              <input
                type="radio"
                name="plataforma"
                value={opcao.value}
                checked={respostas.plataforma === opcao.value}
                onChange={(e) => handleChange('plataforma', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Objetivo Principal */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o objetivo principal do seu app? *
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder="Exemplo: App para delivery de comida, controle financeiro pessoal, agendamento de serviços, rede social para pets, etc."
          value={respostas.objetivoPrincipal || ''}
          onChange={(e) => handleChange('objetivoPrincipal', e.target.value)}
          rows={3}
          required
        />
      </div>

      {/* Funcionalidades */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Quais funcionalidades o app precisa ter? (marque todas que se aplicam)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Login de usuários',
            'Integração com APIs externas',
            'Notificações push',
            'Funcionamento offline',
            'Sistema de pagamento',
            'Câmera/Galeria de fotos',
            'GPS/Localização',
            'Chat/Mensagens',
            'Compartilhamento social',
            'Sincronização na nuvem',
            'Relatórios/Gráficos',
            'Scanner QR Code'
          ].map((funcionalidade) => (
            <label key={funcionalidade} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={respostas.funcionalidades?.[funcionalidade] || false}
                onChange={(e) => handleCheckboxChange('funcionalidades', funcionalidade, e.target.checked)}
                className="mr-3 text-purple-600"
              />
              <span className="text-sm">{funcionalidade}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Layout/Protótipo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui layout ou protótipo do app? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, tenho pronto' },
            { value: 'parcial', label: 'Tenho algumas ideias/rascunhos' },
            { value: 'nao', label: 'Não tenho, preciso de ajuda' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
              <input
                type="radio"
                name="possuiLayout"
                value={opcao.value}
                checked={respostas.possuiLayout === opcao.value}
                onChange={(e) => handleChange('possuiLayout', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Backend */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você já possui backend/servidor para o app? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sim', label: 'Sim, já tenho' },
            { value: 'nao', label: 'Não tenho' },
            { value: 'ajuda', label: 'Preciso de orientação' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
              <input
                type="radio"
                name="possuiBackend"
                value={opcao.value}
                checked={respostas.possuiBackend === opcao.value}
                onChange={(e) => handleChange('possuiBackend', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* App de Referência */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Existe algum app que você usa como referência?
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder="Exemplo: 'Gostaria que fosse parecido com o Uber para a parte de localização' ou 'Similar ao Instagram para a galeria de fotos'"
          value={respostas.appReferencia || ''}
          onChange={(e) => handleChange('appReferencia', e.target.value)}
          rows={3}
        />
      </div>

      {/* Prazo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o prazo ideal para entrega? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          value={respostas.prazoEsperado || ''}
          onChange={(e) => handleChange('prazoEsperado', e.target.value)}
          required
        >
          <option value="">Selecione o prazo</option>
          <option value="30-dias">30 dias</option>
          <option value="60-dias">60 dias</option>
          <option value="90-dias">90 dias</option>
          <option value="120-dias">120 dias</option>
          <option value="flexivel">Flexível, sem pressa</option>
        </select>
      </div>

      {/* Observações */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Observações adicionais ou detalhes específicos
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder="Compartilhe qualquer detalhe adicional sobre seu app, funcionalidades especiais, ou dúvidas..."
          value={respostas.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default AppMobileForm;
