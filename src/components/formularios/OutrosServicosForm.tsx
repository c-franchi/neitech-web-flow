
import React from 'react';

interface OutrosServicosFormProps {
  respostas: any;
  setRespostas: (respostas: any) => void;
}

const OutrosServicosForm: React.FC<OutrosServicosFormProps> = ({ respostas, setRespostas }) => {
  const handleChange = (field: string, value: any) => {
    setRespostas({ ...respostas, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-900 mb-2">Outros Serviços</h3>
        <p className="text-indigo-700">Conte-nos mais sobre seu projeto personalizado</p>
      </div>

      {/* Descrição Detalhada */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Descreva detalhadamente seu projeto *
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Explique com o máximo de detalhes possível:
- O que você precisa
- Como imagina que funcione
- Qual é o objetivo
- Quem é o público-alvo
- Qualquer referência que tenha em mente

Exemplo: 'Preciso de um sistema para controlar estoque da minha loja, que funcione no celular e computador, com relatórios de vendas e integração com WhatsApp para avisar quando produtos estão acabando.'"
          value={respostas.descricaoDetalhada || ''}
          onChange={(e) => handleChange('descricaoDetalhada', e.target.value)}
          rows={8}
          required
        />
      </div>

      {/* Referências/Exemplos */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você tem exemplos, referências ou algo similar ao que precisa?
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Compartilhe:
- Links de sites/apps que fazem algo parecido
- Empresas que oferecem serviço similar
- Imagens ou descrições de referência
- Qualquer material que possa nos ajudar a entender melhor

Exemplo: 'É parecido com o sistema do Mercado Livre, mas mais simples' ou 'Vi um vídeo no YouTube que mostra exatamente o que preciso: https://youtube.com/watch?v=exemplo'"
          value={respostas.exemplosReferencias || ''}
          onChange={(e) => handleChange('exemplosReferencias', e.target.value)}
          rows={6}
        />
      </div>

      {/* Funcionalidades Esperadas */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Liste as principais funcionalidades que você espera
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Liste uma funcionalidade por linha, exemplo:
- Cadastro de usuários
- Sistema de login
- Envio de notificações
- Relatórios em PDF
- Integração com WhatsApp
- Pagamento online
- Upload de arquivos"
          value={respostas.funcionalidadesEsperadas || ''}
          onChange={(e) => handleChange('funcionalidadesEsperadas', e.target.value)}
          rows={6}
        />
      </div>

      {/* Orçamento Estimado */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você tem um orçamento estimado em mente?
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          value={respostas.orcamentoEstimado || ''}
          onChange={(e) => handleChange('orcamentoEstimado', e.target.value)}
        >
          <option value="">Selecione uma faixa (opcional)</option>
          <option value="ate-500">Até R$ 500</option>
          <option value="500-1000">R$ 500 - R$ 1.000</option>
          <option value="1000-2500">R$ 1.000 - R$ 2.500</option>
          <option value="2500-5000">R$ 2.500 - R$ 5.000</option>
          <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
          <option value="10000+">Acima de R$ 10.000</option>
          <option value="nao-sei">Não tenho ideia</option>
        </select>
      </div>

      {/* Prazo */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Qual é o prazo ideal para entrega? *
        </label>
        <select 
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          value={respostas.prazoEsperado || ''}
          onChange={(e) => handleChange('prazoEsperado', e.target.value)}
          required
        >
          <option value="">Selecione o prazo</option>
          <option value="7-dias">7 dias (urgente)</option>
          <option value="15-dias">15 dias</option>
          <option value="30-dias">30 dias</option>
          <option value="60-dias">60 dias</option>
          <option value="90-dias">90 dias</option>
          <option value="flexivel">Flexível, sem pressa</option>
        </select>
      </div>

      {/* Sugestões do Time */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Você gostaria de receber sugestões da nossa equipe? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'sim', label: 'Sim, quero sugestões e ideias' },
            { value: 'nao', label: 'Não, já sei exatamente o que quero' }
          ].map((opcao) => (
            <label key={opcao.value} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
              <input
                type="radio"
                name="querSugestoes"
                value={opcao.value}
                checked={respostas.querSugestoes === opcao.value}
                onChange={(e) => handleChange('querSugestoes', e.target.value)}
                className="mr-3 text-indigo-600"
              />
              <span className="text-sm font-medium">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Observações Finais */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Informações adicionais importantes
        </label>
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Qualquer outra informação que considere relevante para seu projeto, dúvidas, expectativas especiais, ou detalhes técnicos específicos..."
          value={respostas.informacoesAdicionais || ''}
          onChange={(e) => handleChange('informacoesAdicionais', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default OutrosServicosForm;
