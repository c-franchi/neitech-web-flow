
export interface SolicitacaoOrcamento {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  whatsappCliente: string;
  servicoInteresse: string;
  mensagem: string;
  detalhesNecessidade: string;
  statusSolicitacao: 'orcamento_recebido' | 'aguardando_orcamento' | 'orcamento_disponivel' | 'orcamento_enviado' | 'aprovado' | 'rejeitado';
  dataCreacao: Date;
  dataUltimaAtualizacao: Date;
  clienteId?: string;
  pdfUrl?: string;
  nomeArquivoPdf?: string;
  accessToken?: string;
}

export interface DetalhesFormulario {
  id: string;
  solicitacaoId: string;
  tipoServico: string;
  respostas: {
    [key: string]: any;
  };
  dataPreenchimento: Date;
}

export interface FormularioDesenvolvimentoWeb {
  tipoSite: 'institucional' | 'loja' | 'landing-page' | 'blog' | 'outro';
  quantidadePaginas: string;
  painelAdministrativo: boolean;
  integracoes: {
    whatsapp: boolean;
    pagamento: boolean;
    email: boolean;
    outros: string;
  };
  exemplosSites: string;
  observacoes?: string;
}

export interface FormularioAppMobile {
  plataforma: 'android' | 'ios' | 'ambos';
  funcaoPrincipal: string;
  integracaoBanco: boolean;
  integracaoApi: boolean;
  loginNecessario: boolean;
  funcionamentoOffline: boolean;
  exemploApp: string;
  observacoes?: string;
}

export interface FormularioDesignDigital {
  tipoDesign: 'logo' | 'banner' | 'redes-sociais' | 'identidade-visual' | 'outro';
  coresPreferidas: string;
  textosIdeias: string;
  estiloReferencia: string;
  observacoes?: string;
}

export interface FormularioCartaoDigital {
  nome: string;
  cargo: string;
  empresa: string;
  whatsapp: string;
  email: string;
  endereco: string;
  redesSociais: {
    instagram: string;
    linkedin: string;
    facebook: string;
    outros: string;
  };
  logoUrl?: string;
  estiloDesejado: string;
  observacoes?: string;
}

export interface FormularioVideoCorporativo {
  duracao: '30s' | '1min' | '2min' | '3min' | '5min' | 'mais';
  objetivo: 'institucional' | 'produto' | 'servico' | 'treinamento' | 'outro';
  possuiRoteiro: boolean;
  possuiGravacoes: boolean;
  descricaoObjetivo: string;
  observacoes?: string;
}

export interface FormularioOutros {
  descricaoDetalhada: string;
  arquivoReferenciaUrl?: string;
  prazoDesejado: string;
  observacoes?: string;
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
  tipoInteracao: 'solicitacao_criada' | 'orcamento_enviado' | 'orcamento_visualizado' | 'orcamento_aprovado' | 'orcamento_rejeitado' | 'alteracao_solicitada' | 'orcamento_expirado' | 'formulario_detalhado' | 'whatsapp_enviado';
  descricao: string;
  dataInteracao: Date;
  dadosAdicionais?: any;
}
