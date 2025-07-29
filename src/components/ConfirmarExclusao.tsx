
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { SolicitacaoOrcamento } from '@/types/orcamentos';

interface ConfirmarExclusaoProps {
  solicitacao: SolicitacaoOrcamento;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmarExclusao: React.FC<ConfirmarExclusaoProps> = ({ solicitacao, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            Confirmar Exclusão
          </h2>
          
          <p className="text-gray-600 text-center mb-6">
            Você tem certeza que deseja excluir permanentemente a solicitação de <strong>{solicitacao.nomeCliente}</strong>?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">Esta ação irá remover:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Dados da solicitação</li>
              <li>• Formulário detalhado (se existir)</li>
              <li>• Arquivo PDF do orçamento (se existir)</li>
              <li>• Histórico de interações</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarExclusao;
