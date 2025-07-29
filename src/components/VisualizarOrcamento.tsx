import React, { useState, useEffect } from 'react';
import { Download, Eye, X, ExternalLink, Clock } from 'lucide-react';
import { SolicitacaoOrcamento } from '@/types/orcamentos';

interface VisualizarOrcamentoProps {
  solicitacao: SolicitacaoOrcamento;
  onClose: () => void;
}

const VisualizarOrcamento: React.FC<VisualizarOrcamentoProps> = ({ solicitacao, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Obter URL base do site
  const getSiteUrl = () => {
    return import.meta.env.VITE_PUBLIC_SITE_URL || 'https://neitechweb.web.app';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [solicitacao]);

  const updateTimeLeft = () => {
    const dataExpiracao = new Date(solicitacao.dataUltimaAtualizacao);
    dataExpiracao.setDate(dataExpiracao.getDate() + 5);
    
    const agora = new Date();
    const diferenca = dataExpiracao.getTime() - agora.getTime();
    
    if (diferenca > 0) {
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${dias}d ${horas}h ${minutos}m`);
    } else {
      setTimeLeft('Expirado');
    }
  };

  const handleDownload = () => {
    if (solicitacao.pdfUrl) {
      const link = document.createElement('a');
      link.href = solicitacao.pdfUrl;
      link.download = solicitacao.nomeArquivoPdf || 'orcamento.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const gerarLinkWhatsApp = () => {
    const linkOrcamento = `${getSiteUrl()}/orcamento/${solicitacao.id}`;
    const mensagem = `Olá ${solicitacao.nomeCliente}! Seu orçamento já está disponível: ${linkOrcamento}

⏰ *Importante:* Este orçamento ficará disponível por 5 dias corridos. Após este período será automaticamente removido do sistema.

Acesse o link para visualizar e fazer o download do seu orçamento.`;
    
    const whatsappUrl = `https://wa.me/55${solicitacao.whatsappCliente.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              Orçamento - {solicitacao.nomeCliente}
            </h3>
            <p className="text-sm text-gray-600">{solicitacao.servicoInteresse}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-600">
                Expira em {timeLeft}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-4">
          {solicitacao.pdfUrl ? (
            <iframe
              src={solicitacao.pdfUrl}
              className="w-full h-full border rounded-lg"
              title="Orçamento PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Eye size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Nenhum orçamento anexado</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={handleDownload}
                disabled={!solicitacao.pdfUrl}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </button>
              
              <button
                onClick={gerarLinkWhatsApp}
                disabled={!solicitacao.pdfUrl}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink size={16} className="mr-2" />
                Enviar WhatsApp
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 flex flex-col gap-1">
            <div>
              <strong>Link:</strong> {getSiteUrl()}/orcamento/{solicitacao.id}
            </div>
            <div className="text-amber-600">
              <strong>⚠️ Aviso:</strong> Este orçamento expira automaticamente em 5 dias corridos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarOrcamento;
