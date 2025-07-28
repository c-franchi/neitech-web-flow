
import React, { useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { OrcamentoService } from '@/services/orcamentoService';
import { SolicitacaoOrcamento } from '@/types/orcamentos';
import { useToast } from '@/hooks/use-toast';

interface UploadOrcamentoProps {
  solicitacao: SolicitacaoOrcamento;
  onSuccess: () => void;
  onCancel: () => void;
}

const UploadOrcamento: React.FC<UploadOrcamentoProps> = ({ solicitacao, onSuccess, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Criar referência no Firebase Storage
      const fileName = `orcamento_${solicitacao.nomeCliente}_${Date.now()}.pdf`;
      const storageRef = ref(storage, `orcamentos/${solicitacao.id}/${fileName}`);
      
      // Upload do arquivo
      await uploadBytes(storageRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      // Atualizar solicitação no Firestore
      await OrcamentoService.anexarOrcamento(solicitacao.id, {
        pdfUrl: downloadURL,
        nomeArquivoPdf: fileName,
        statusSolicitacao: 'orcamento_disponivel'
      });

      toast({
        title: "Sucesso",
        description: "Orçamento anexado com sucesso!"
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do orçamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Anexar Orçamento
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={uploading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Cliente:</strong> {solicitacao.nomeCliente}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Serviço:</strong> {solicitacao.servicoInteresse}
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <p className="text-gray-600">Enviando orçamento...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">
                Arraste o arquivo PDF aqui ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Selecionar Arquivo
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Apenas arquivos PDF • Máximo 10MB
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={uploading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadOrcamento;
