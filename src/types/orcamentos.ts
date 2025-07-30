export interface SolicitacaoOrcamento {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  whatsappCliente: string;
  servicoInteresse: string;
  mensagem: string;
  statusSolicitacao: '' | 'solicitacao_recebida' | 'aguardando_detalhamento' | 'aguardando_orcamento' | 'orcamento_disponivel' | 'orcamento_enviado' | 'finalizado';
  dataCreacao: Date;
  dataUltimaAtualizacao: Date;
  clienteId?: string;
  pdfUrl?: string;
  nomeArquivoPdf?: string;
  accessToken?: string;
  dataExpiracao?: Date;
  primeiroAcessoCliente?: Date; // Novo campo para controle de validade
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
  dominioHospedagem: boolean;
  exemplosSites: string;
  prazoDesejado: string;
  observacoes?: string;
}

export interface FormularioAppMobile {
  plataforma: 'android' | 'ios' | 'ambos';
  funcaoPrincipal: string;
  loginUsuario: boolean;
  integracaoBanco: boolean;
  integracaoApi: boolean;
  funcionamentoOffline: boolean;
  quantidadeTelas: string;
  exemploApp: string;
  prazoEsperado: string;
  observacoes?: string;
}

export interface FormularioDesignDigital {
  tipoDesign: 'logo' | 'redes-sociais' | 'identidade-visual' | 'banners' | 'outro';
  paletaCores: string;
  referenciaVisual: string;
  frasesSlogan: string;
  estiloDesejado: 'moderno' | 'classico' | 'elegante' | 'minimalista' | 'colorido';
  arquivoReferenciaUrl?: string;
  observacoes?: string;
}

export interface FormularioCartaoDigital {
  nome: string;
  cargo: string;
  whatsapp: string;
  email: string;
  redesSociais: {
    instagram: string;
    linkedin: string;
    facebook: string;
    outros: string;
  };
  localizacao: string;
  mapaRota: boolean;
  estiloVisual: 'moderno' | 'elegante' | 'informal' | 'criativo';
  linkPagamento: boolean;
  logoUrl?: string;
  qrCodeCompartilhar: boolean;
  observacoes?: string;
}

export interface FormularioVideoCorporativo {
  objetivo: 'institucional' | 'produto' | 'equipe' | 'evento' | 'outro';
  duracao: string;
  possuiRoteiro: boolean;
  possuiGravacoes: boolean;
  narracaoLocucao: boolean;
  estiloVideo: 'dinamico' | 'corporativo' | 'emocional' | 'divertido';
  observacoes?: string;
}

export interface FormularioOutros {
  descricaoDetalhada: string;
  arquivoReferenciaUrl?: string;
  sugestoesExpectativas: string;
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
  solicitacaoId?: string;
  orcamentoId?: string;
  tipoInteracao: 'solicitacao_criada' | 'orcamento_enviado' | 'orcamento_visualizado' | 'orcamento_aprovado' | 'orcamento_rejeitado' | 'alteracao_solicitada' | 'orcamento_expirado' | 'formulario_detalhado' | 'whatsapp_enviado' | 'alteracao_status';
  descricao: string;
  dataInteracao: Date;
  dadosAdicionais?: any;
}
