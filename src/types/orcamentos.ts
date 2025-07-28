
export interface SolicitacaoOrcamento {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  whatsappCliente: string;
  servicoInteresse: string;
  mensagem: string;
  statusSolicitacao: 'pendente' | 'em_andamento' | 'orcamento_enviado' | 'aprovado' | 'rejeitado';
  dataCreacao: Date;
  dataUltimaAtualizacao: Date;
  clienteId?: string;
}

export interface Orcamento {
  id: string;
  codigoAcesso: string;
  senhaAcesso: string;
  solicitacaoId: string;
  clienteId: string;
  itensOrcamento: ItemOrcamento[];
  valorTotal: number;
  observacoes: string;
  condicoesGerais: string;
  statusOrcamento: 'criado' | 'enviado' | 'visualizado' | 'aprovado' | 'rejeitado';
  dataCreacao: Date;
  dataEnvio?: Date;
  dataVisualizacao?: Date;
  dataResposta?: Date;
  validadeOrcamento: Date;
}

export interface ItemOrcamento {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface UsuarioCliente {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  dataCadastro: Date;
  ultimoAcesso?: Date;
}

export interface HistoricoInteracao {
  id: string;
  clienteId: string;
  orcamentoId?: string;
  tipoInteracao: 'solicitacao_criada' | 'orcamento_enviado' | 'orcamento_visualizado' | 'orcamento_aprovado' | 'orcamento_rejeitado' | 'alteracao_solicitada';
  descricao: string;
  dataInteracao: Date;
  dadosAdicionais?: any;
}
