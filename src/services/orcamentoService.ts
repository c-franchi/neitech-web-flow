import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { SolicitacaoOrcamento, UsuarioCliente, HistoricoInteracao } from '@/types/orcamentos';

export class OrcamentoService {
  // Obter URL base do site
  private static getSiteUrl(): string {
    return import.meta.env.VITE_PUBLIC_SITE_URL || 'https://neitechweb.web.app';
  }

  // Criar solicitação de orçamento
  static async criarSolicitacao(dados: Omit<SolicitacaoOrcamento, 'id' | 'dataCreacao' | 'dataUltimaAtualizacao' | 'statusSolicitacao' | 'accessToken'>): Promise<string> {
    try {
      const accessToken = this.gerarAccessToken();
      
      const solicitacao = {
        ...dados,
        statusSolicitacao: 'solicitacao_recebida' as any,
        accessToken,
        dataCreacao: Timestamp.now(),
        dataUltimaAtualizacao: Timestamp.now()
      };

      console.log('Criando solicitação:', solicitacao);

      const docRef = await addDoc(collection(db, 'solicitacoes_orcamento'), solicitacao);
      
      // Criar ou atualizar usuário cliente
      await this.criarOuAtualizarCliente({
        nome: dados.nomeCliente,
        email: dados.emailCliente,
        whatsapp: dados.whatsappCliente
      });

      // Registrar histórico
      await this.registrarHistorico({
        clienteId: dados.emailCliente,
        solicitacaoId: docRef.id,
        tipoInteracao: 'solicitacao_criada',
        descricao: `Solicitação de orçamento criada para o serviço: ${dados.servicoInteresse}`,
        dataInteracao: new Date()
      });

      // Enviar mensagem WhatsApp inicial automaticamente
      await this.enviarMensagemWhatsAppInicial(dados.whatsappCliente, dados.nomeCliente, dados.servicoInteresse, docRef.id);

      console.log('Solicitação criada com sucesso:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  }

  // Buscar todas as solicitações
  static async buscarTodasSolicitacoes(): Promise<SolicitacaoOrcamento[]> {
    try {
      const q = query(
        collection(db, 'solicitacoes_orcamento'),
        orderBy('dataCreacao', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dataCreacao: data.dataCreacao.toDate(),
          dataUltimaAtualizacao: data.dataUltimaAtualizacao.toDate()
        } as SolicitacaoOrcamento;
      });
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      throw error;
    }
  }

  // Buscar solicitações aguardando orçamento
  static async buscarSolicitacoesAguardando(): Promise<SolicitacaoOrcamento[]> {
    try {
      const todasSolicitacoes = await this.buscarTodasSolicitacoes();
      return todasSolicitacoes.filter(solicitacao => 
        solicitacao.statusSolicitacao === 'solicitacao_recebida' || 
        solicitacao.statusSolicitacao === 'aguardando_orcamento'
      );
    } catch (error) {
      console.error('Erro ao buscar solicitações aguardando:', error);
      throw error;
    }
  }

  // Atualizar status da solicitação
  static async atualizarStatusSolicitacao(id: string, novoStatus: SolicitacaoOrcamento['statusSolicitacao']): Promise<void> {
    try {
      console.log(`Atualizando status da solicitação ${id} para: ${novoStatus}`);
      
      const docRef = doc(db, 'solicitacoes_orcamento', id);
      await updateDoc(docRef, {
        statusSolicitacao: novoStatus,
        dataUltimaAtualizacao: Timestamp.now()
      });

      // Buscar dados da solicitação para envio de mensagens
      const solicitacao = await this.buscarSolicitacaoPorId(id);
      if (!solicitacao) {
        throw new Error('Solicitação não encontrada');
      }

      // Se mudou para "aguardando_detalhamento", enviar mensagem para formulário
      if (novoStatus === 'aguardando_detalhamento') {
        console.log('Enviando mensagem para formulário detalhado...');
        await this.enviarMensagemFormularioDetalhado(solicitacao);
      }

      // Registrar histórico da mudança de status
      await this.registrarHistorico({
        clienteId: solicitacao.emailCliente,
        solicitacaoId: id,
        tipoInteracao: 'alteracao_status',
        descricao: `Status alterado para: ${novoStatus}`,
        dataInteracao: new Date()
      });

      console.log('Status atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  // Criar ou atualizar cliente
  private static async criarOuAtualizarCliente(dados: Omit<UsuarioCliente, 'id' | 'dataCadastro' | 'ultimoAcesso'>): Promise<void> {
    try {
      const q = query(
        collection(db, 'usuarios_clientes'),
        where('email', '==', dados.email)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(collection(db, 'usuarios_clientes'), {
          ...dados,
          dataCadastro: Timestamp.now(),
          ultimoAcesso: Timestamp.now()
        });
        console.log('Cliente criado:', dados.email);
      } else {
        const clienteDoc = querySnapshot.docs[0];
        await updateDoc(clienteDoc.ref, {
          ...dados,
          ultimoAcesso: Timestamp.now()
        });
        console.log('Cliente atualizado:', dados.email);
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar cliente:', error);
      throw error;
    }
  }

  // Registrar histórico de interação
  private static async registrarHistorico(dados: Omit<HistoricoInteracao, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'historico_interacoes'), {
        ...dados,
        dataInteracao: Timestamp.now()
      });
      console.log('Histórico registrado:', dados.tipoInteracao);
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
      throw error;
    }
  }

  // Gerar código de acesso único
  static gerarCodigoAcesso(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  // Gerar senha numérica de 6 dígitos
  static gerarSenhaAcesso(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Anexar orçamento em PDF
  static async anexarOrcamento(
    solicitacaoId: string, 
    dados: { 
      pdfUrl: string; 
      nomeArquivoPdf: string; 
      statusSolicitacao: SolicitacaoOrcamento['statusSolicitacao'] 
    }
  ): Promise<void> {
    try {
      const docRef = doc(db, 'solicitacoes_orcamento', solicitacaoId);
      await updateDoc(docRef, {
        pdfUrl: dados.pdfUrl,
        nomeArquivoPdf: dados.nomeArquivoPdf,
        statusSolicitacao: dados.statusSolicitacao,
        dataUltimaAtualizacao: Timestamp.now()
      });

      await this.registrarHistorico({
        clienteId: solicitacaoId,
        solicitacaoId: solicitacaoId,
        tipoInteracao: 'orcamento_enviado',
        descricao: `Orçamento em PDF anexado: ${dados.nomeArquivoPdf}`,
        dataInteracao: new Date()
      });

      // Enviar mensagem WhatsApp sobre orçamento pronto
      const solicitacao = await this.buscarSolicitacaoPorId(solicitacaoId);
      if (solicitacao) {
        await this.notificarOrcamentoPronto(solicitacao);
      }
    } catch (error) {
      console.error('Erro ao anexar orçamento:', error);
      throw error;
    }
  }

  // Buscar solicitação por ID com registro de primeiro acesso
  static async buscarSolicitacaoPorId(id: string, registrarPrimeiroAcesso: boolean = false): Promise<SolicitacaoOrcamento | null> {
    try {
      // Validar se o ID é válido
      if (!id || id.trim() === '') {
        console.error('ID inválido fornecido');
        return null;
      }

      const docRef = doc(db, 'solicitacoes_orcamento', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const solicitacao = {
          id: docSnap.id,
          ...data,
          dataCreacao: data.dataCreacao.toDate(),
          dataUltimaAtualizacao: data.dataUltimaAtualizacao.toDate(),
          primeiroAcessoCliente: data.primeiroAcessoCliente ? data.primeiroAcessoCliente.toDate() : null
        } as SolicitacaoOrcamento;

        // Se deve registrar primeiro acesso e ainda não foi registrado
        if (registrarPrimeiroAcesso && !data.primeiroAcessoCliente && data.pdfUrl) {
          console.log('Registrando primeiro acesso do cliente ao orçamento');
          
          await updateDoc(docRef, {
            primeiroAcessoCliente: Timestamp.now()
          });

          // Atualizar o objeto retornado com o timestamp do primeiro acesso
          solicitacao.primeiroAcessoCliente = new Date();

          // Registrar no histórico
          await this.registrarHistorico({
            clienteId: solicitacao.emailCliente,
            solicitacaoId: id,
            tipoInteracao: 'orcamento_visualizado',
            descricao: 'Cliente acessou o orçamento pela primeira vez - prazo de validade iniciado',
            dataInteracao: new Date()
          });
        }

        return solicitacao;
      }
      
      console.log(`Documento não encontrado para ID: ${id}`);
      return null;
    } catch (error) {
      console.error('Erro ao buscar solicitação por ID:', error);
      return null;
    }
  }

  // Verificar se orçamento está expirado
  static verificarOrcamentoExpirado(solicitacao: SolicitacaoOrcamento): boolean {
    if (!solicitacao.pdfUrl || !solicitacao.primeiroAcessoCliente) {
      return false; // Não está expirado se não foi acessado ainda
    }

    const agora = new Date();
    const dataExpiracao = new Date(solicitacao.primeiroAcessoCliente);
    dataExpiracao.setDate(dataExpiracao.getDate() + 5); // 5 dias após primeiro acesso
    
    return agora > dataExpiracao;
  }

  // Calcular tempo restante para expiração
  static calcularTempoRestante(solicitacao: SolicitacaoOrcamento): string {
    if (!solicitacao.pdfUrl || !solicitacao.primeiroAcessoCliente) {
      return 'Aguardando primeiro acesso';
    }

    const agora = new Date();
    const dataExpiracao = new Date(solicitacao.primeiroAcessoCliente);
    dataExpiracao.setDate(dataExpiracao.getDate() + 5);
    
    const diferenca = dataExpiracao.getTime() - agora.getTime();
    
    if (diferenca <= 0) {
      return 'Expirado';
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${dias}d ${horas}h ${minutos}m`;
  }

  // Deletar orçamento expirado
  static async deletarOrcamentoExpirado(id: string): Promise<void> {
    try {
      const solicitacao = await this.buscarSolicitacaoPorId(id);
      
      if (solicitacao?.pdfUrl) {
        // Deletar arquivo do Storage
        try {
          const storageRef = ref(storage, `orcamentos/${id}/${solicitacao.nomeArquivoPdf}`);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error('Erro ao deletar arquivo do storage:', storageError);
        }
        
        // Remover URLs do documento
        const docRef = doc(db, 'solicitacoes_orcamento', id);
        await updateDoc(docRef, {
          pdfUrl: null,
          nomeArquivoPdf: null,
          statusSolicitacao: 'solicitacao_recebida',
          dataUltimaAtualizacao: Timestamp.now()
        });

        // Registrar no histórico
        await this.registrarHistorico({
          clienteId: id,
          solicitacaoId: id,
          tipoInteracao: 'orcamento_expirado',
          descricao: 'Orçamento removido automaticamente após 5 dias',
          dataInteracao: new Date()
        });
      }
    } catch (error) {
      console.error('Erro ao deletar orçamento expirado:', error);
      throw error;
    }
  }

  // Limpar orçamentos expirados - método atualizado
  static async limparOrcamentosExpirados(): Promise<void> {
    try {
      const todasSolicitacoes = await this.buscarTodasSolicitacoes();
      const agora = new Date();
      
      for (const solicitacao of todasSolicitacoes) {
        if (solicitacao.pdfUrl && solicitacao.primeiroAcessoCliente) {
          const dataExpiracao = new Date(solicitacao.primeiroAcessoCliente);
          dataExpiracao.setDate(dataExpiracao.getDate() + 5);
          
          if (agora > dataExpiracao) {
            await this.deletarOrcamentoExpirado(solicitacao.id);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao limpar orçamentos expirados:', error);
      throw error;
    }
  }

  // Gerar token de acesso seguro
  static gerarAccessToken(): string {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }

  // Salvar detalhes do formulário específico
  static async salvarDetalhesFormulario(solicitacaoId: string, tipoServico: string, respostas: any): Promise<void> {
    try {
      console.log(`Salvando detalhes do formulário para solicitação ${solicitacaoId}`);
      
      await addDoc(collection(db, 'detalhes_formulario'), {
        solicitacaoId,
        tipoServico,
        respostas,
        dataPreenchimento: Timestamp.now()
      });

      // Atualizar status da solicitação
      await this.atualizarStatusSolicitacao(solicitacaoId, 'aguardando_orcamento');

      // Registrar histórico
      await this.registrarHistorico({
        clienteId: solicitacaoId,
        solicitacaoId: solicitacaoId,
        tipoInteracao: 'formulario_detalhado',
        descricao: `Formulário detalhado preenchido para o serviço: ${tipoServico}`,
        dataInteracao: new Date()
      });

      console.log('Detalhes do formulário salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar detalhes do formulário:', error);
      throw error;
    }
  }

  // Buscar detalhes do formulário
  static async buscarDetalhesFormulario(solicitacaoId: string): Promise<any> {
    try {
      const q = query(
        collection(db, 'detalhes_formulario'),
        where('solicitacaoId', '==', solicitacaoId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          dataPreenchimento: doc.data().dataPreenchimento.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar detalhes do formulário:', error);
      throw error;
    }
  }

  // Limpar número de telefone (remover caracteres especiais)
  private static limparNumeroTelefone(numero: string): string {
    return numero.replace(/\D/g, '');
  }

  // Enviar mensagem WhatsApp inicial com abertura automática
  private static async enviarMensagemWhatsAppInicial(whatsapp: string, nome: string, servico: string, solicitacaoId: string): Promise<void> {
    try {
      const numeroLimpo = this.limparNumeroTelefone(whatsapp);
      const linkStatus = `${this.getSiteUrl()}/status/${solicitacaoId}`;
      
      const mensagem = `Olá ${nome}! 

Recebemos sua solicitação de orçamento para ${servico}. Em breve você poderá acompanhar e detalhar seu pedido.

Link para acompanhar: ${linkStatus}

Atenciosamente,
Equipe NeiTech`;

      // Gerar link do WhatsApp
      const whatsappLink = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir janela do WhatsApp automaticamente
      if (typeof window !== 'undefined') {
        window.open(whatsappLink, '_blank');
      }
      
      // Registrar no histórico
      await this.registrarHistorico({
        clienteId: whatsapp,
        solicitacaoId: solicitacaoId,
        tipoInteracao: 'whatsapp_enviado',
        descricao: `Mensagem WhatsApp inicial enviada com link de acompanhamento`,
        dataInteracao: new Date()
      });

      console.log('✅ Mensagem WhatsApp inicial enviada automaticamente');
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem WhatsApp inicial:', error);
      throw error;
    }
  }

  // Enviar mensagem WhatsApp para formulário detalhado
  private static async enviarMensagemFormularioDetalhado(solicitacao: SolicitacaoOrcamento): Promise<void> {
    try {
      const numeroLimpo = this.limparNumeroTelefone(solicitacao.whatsappCliente);
      const linkFormulario = `${this.getSiteUrl()}/formulario/${solicitacao.id}`;
      
      const mensagem = `Olá ${solicitacao.nomeCliente}! 

Para podermos elaborar seu orçamento com precisão, acesse o link abaixo e preencha um formulário mais detalhado de acordo com o serviço escolhido:

${linkFormulario}

Este link é válido por 7 dias.

Atenciosamente,
Equipe NeiTech`;

      // Gerar link do WhatsApp
      const whatsappLink = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir janela do WhatsApp automaticamente
      if (typeof window !== 'undefined') {
        window.open(whatsappLink, '_blank');
      }
      
      // Registrar no histórico
      await this.registrarHistorico({
        clienteId: solicitacao.whatsappCliente,
        solicitacaoId: solicitacao.id,
        tipoInteracao: 'whatsapp_enviado',
        descricao: `Mensagem WhatsApp enviada com link do formulário detalhado`,
        dataInteracao: new Date()
      });

      console.log('✅ Mensagem WhatsApp formulário enviada automaticamente');
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem WhatsApp formulário:', error);
      throw error;
    }
  }

  // Notificar cliente sobre orçamento pronto
  static async notificarOrcamentoPronto(solicitacao: SolicitacaoOrcamento): Promise<void> {
    try {
      const numeroLimpo = this.limparNumeroTelefone(solicitacao.whatsappCliente);
      const linkOrcamento = `${this.getSiteUrl()}/orcamento/${solicitacao.id}?token=${solicitacao.accessToken}`;
      
      const mensagem = `${solicitacao.nomeCliente}, seu orçamento está pronto! 

Acesse agora: ${linkOrcamento}

⚠️ *Importante:* Este orçamento ficará disponível por 5 dias corridos. Após este período será automaticamente removido do sistema.

Atenciosamente,
Equipe NeiTech`;

      // Gerar link do WhatsApp
      const whatsappLink = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir janela do WhatsApp automaticamente
      if (typeof window !== 'undefined') {
        window.open(whatsappLink, '_blank');
      }
      
      // Registrar no histórico
      await this.registrarHistorico({
        clienteId: solicitacao.emailCliente,
        solicitacaoId: solicitacao.id,
        tipoInteracao: 'orcamento_enviado',
        descricao: `Notificação de orçamento pronto enviada via WhatsApp`,
        dataInteracao: new Date()
      });

      console.log('✅ Notificação de orçamento pronto enviada automaticamente');
    } catch (error) {
      console.error('❌ Erro ao notificar orçamento pronto:', error);
      throw error;
    }
  }

  // Reenviar mensagem WhatsApp (para uso no painel admin)
  static async reenviarWhatsApp(solicitacaoId: string, tipoMensagem: 'inicial' | 'formulario' | 'orcamento'): Promise<void> {
    try {
      const solicitacao = await this.buscarSolicitacaoPorId(solicitacaoId);
      if (!solicitacao) {
        throw new Error('Solicitação não encontrada');
      }

      switch (tipoMensagem) {
        case 'inicial':
          await this.enviarMensagemWhatsAppInicial(
            solicitacao.whatsappCliente,
            solicitacao.nomeCliente,
            solicitacao.servicoInteresse,
            solicitacao.id
          );
          break;
        case 'formulario':
          await this.enviarMensagemFormularioDetalhado(solicitacao);
          break;
        case 'orcamento':
          await this.notificarOrcamentoPronto(solicitacao);
          break;
      }
    } catch (error) {
      console.error('Erro ao reenviar WhatsApp:', error);
      throw error;
    }
  }

  // Validar token de acesso
  static async validarAccessToken(id: string, token: string): Promise<boolean> {
    try {
      const solicitacao = await this.buscarSolicitacaoPorId(id);
      return solicitacao?.accessToken === token;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  // Excluir solicitação completamente
  static async excluirSolicitacao(id: string): Promise<void> {
    try {
      console.log(`Iniciando exclusão da solicitação ${id}`);
      
      // Buscar dados da solicitação
      const solicitacao = await this.buscarSolicitacaoPorId(id);
      
      if (!solicitacao) {
        throw new Error('Solicitação não encontrada');
      }

      // 1. Excluir arquivo PDF do Storage (se existir)
      if (solicitacao.pdfUrl && solicitacao.nomeArquivoPdf) {
        try {
          const storageRef = ref(storage, `orcamentos/${id}/${solicitacao.nomeArquivoPdf}`);
          await deleteObject(storageRef);
          console.log('Arquivo PDF excluído do Storage');
        } catch (storageError) {
          console.error('Erro ao excluir arquivo do Storage:', storageError);
        }
      }

      // 2. Excluir detalhes do formulário
      try {
        const qFormulario = query(
          collection(db, 'detalhes_formulario'),
          where('solicitacaoId', '==', id)
        );
        const formularioSnapshot = await getDocs(qFormulario);
        
        for (const docFormulario of formularioSnapshot.docs) {
          await deleteDoc(docFormulario.ref);
        }
        console.log('Detalhes do formulário excluídos');
      } catch (formularioError) {
        console.error('Erro ao excluir detalhes do formulário:', formularioError);
      }

      // 3. Excluir histórico de interações
      try {
        const qHistorico = query(
          collection(db, 'historico_interacoes'),
          where('solicitacaoId', '==', id)
        );
        const historicoSnapshot = await getDocs(qHistorico);
        
        for (const docHistorico of historicoSnapshot.docs) {
          await deleteDoc(docHistorico.ref);
        }
        console.log('Histórico de interações excluído');
      } catch (historicoError) {
        console.error('Erro ao excluir histórico:', historicoError);
      }

      // 4. Excluir a solicitação principal
      const docRef = doc(db, 'solicitacoes_orcamento', id);
      await deleteDoc(docRef);
      console.log('Solicitação principal excluída');

      console.log(`✅ Solicitação ${id} excluída completamente`);
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      throw error;
    }
  }
}
