
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
import { SolicitacaoOrcamento, Orcamento, UsuarioCliente, HistoricoInteracao } from '@/types/orcamentos';

export class OrcamentoService {
  // Criar solicitação de orçamento
  static async criarSolicitacao(dados: Omit<SolicitacaoOrcamento, 'id' | 'dataCreacao' | 'dataUltimaAtualizacao' | 'statusSolicitacao' | 'accessToken'>): Promise<string> {
    try {
      const accessToken = this.gerarAccessToken();
      
      const solicitacao = {
        ...dados,
        statusSolicitacao: 'orcamento_recebido' as const,
        accessToken,
        dataCreacao: Timestamp.now(),
        dataUltimaAtualizacao: Timestamp.now()
      };

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
        tipoInteracao: 'solicitacao_criada',
        descricao: `Solicitação de orçamento criada para o serviço: ${dados.servicoInteresse}`,
        dataInteracao: new Date()
      });

      // Enviar mensagem WhatsApp
      await this.enviarMensagemWhatsApp(dados.whatsappCliente, dados.nomeCliente, dados.servicoInteresse, docRef.id);

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
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dataCreacao: doc.data().dataCreacao.toDate(),
        dataUltimaAtualizacao: doc.data().dataUltimaAtualizacao.toDate()
      } as SolicitacaoOrcamento));
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
        solicitacao.statusSolicitacao === 'orcamento_recebido' || 
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
      const docRef = doc(db, 'solicitacoes_orcamento', id);
      await updateDoc(docRef, {
        statusSolicitacao: novoStatus,
        dataUltimaAtualizacao: Timestamp.now()
      });
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
      } else {
        const clienteDoc = querySnapshot.docs[0];
        await updateDoc(clienteDoc.ref, {
          ...dados,
          ultimoAcesso: Timestamp.now()
        });
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
        tipoInteracao: 'orcamento_enviado',
        descricao: `Orçamento em PDF anexado: ${dados.nomeArquivoPdf}`,
        dataInteracao: new Date()
      });
    } catch (error) {
      console.error('Erro ao anexar orçamento:', error);
      throw error;
    }
  }

  // Buscar solicitação por ID
  static async buscarSolicitacaoPorId(id: string): Promise<SolicitacaoOrcamento | null> {
    try {
      const docRef = doc(db, 'solicitacoes_orcamento', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          dataCreacao: data.dataCreacao.toDate(),
          dataUltimaAtualizacao: data.dataUltimaAtualizacao.toDate()
        } as SolicitacaoOrcamento;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar solicitação por ID:', error);
      throw error;
    }
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
          statusSolicitacao: 'orcamento_recebido',
          dataUltimaAtualizacao: Timestamp.now()
        });

        // Registrar no histórico
        await this.registrarHistorico({
          clienteId: id,
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

  // Limpar orçamentos expirados - método para execução periódica
  static async limparOrcamentosExpirados(): Promise<void> {
    try {
      const todasSolicitacoes = await this.buscarTodasSolicitacoes();
      const agora = new Date();
      
      for (const solicitacao of todasSolicitacoes) {
        if (solicitacao.pdfUrl) {
          const dataExpiracao = new Date(solicitacao.dataUltimaAtualizacao);
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
      await addDoc(collection(db, 'detalhes_formulario'), {
        solicitacaoId,
        tipoServico,
        respostas,
        dataPreenchimento: Timestamp.now()
      });

      // Registrar histórico
      await this.registrarHistorico({
        clienteId: solicitacaoId,
        tipoInteracao: 'formulario_detalhado',
        descricao: `Formulário detalhado preenchido para o serviço: ${tipoServico}`,
        dataInteracao: new Date()
      });
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

  // Enviar mensagem WhatsApp (simulação - em produção usar API do WhatsApp)
  private static async enviarMensagemWhatsApp(whatsapp: string, nome: string, servico: string, solicitacaoId: string): Promise<void> {
    try {
      console.log('Enviando mensagem WhatsApp para:', whatsapp);
      
      const mensagem = `Olá ${nome}! Recebemos sua solicitação para o serviço: ${servico}. 

Clique no link abaixo para preencher mais informações específicas e prepararmos seu orçamento personalizado:

https://neitechweb.vercel.app/formulario/${solicitacaoId}

Este link é válido por 7 dias. Caso tenha dúvidas, entre em contato conosco!

Atenciosamente,
Equipe NeiTech`;

      // Em produção, aqui seria feita a integração com a API do WhatsApp
      // Para demonstração, vamos apenas logar a mensagem
      console.log('Mensagem WhatsApp:', mensagem);
      
      // Registrar no histórico
      await this.registrarHistorico({
        clienteId: whatsapp,
        tipoInteracao: 'whatsapp_enviado',
        descricao: `Mensagem WhatsApp enviada com link do formulário detalhado`,
        dataInteracao: new Date()
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      throw error;
    }
  }

  // Notificar cliente sobre orçamento pronto
  static async notificarOrcamentoPronto(solicitacao: SolicitacaoOrcamento): Promise<void> {
    try {
      const mensagem = `${solicitacao.nomeCliente}, seu orçamento está pronto! 

Acesse o link abaixo para visualizar ou fazer o download:

https://neitechweb.vercel.app/orcamento/${solicitacao.id}?token=${solicitacao.accessToken}

⚠️ *Importante:* Este orçamento ficará disponível por 5 dias corridos. Após este período será automaticamente removido do sistema.

Atenciosamente,
Equipe NeiTech`;

      console.log('Mensagem orçamento pronto:', mensagem);
      
      // Registrar no histórico
      await this.registrarHistorico({
        clienteId: solicitacao.emailCliente,
        tipoInteracao: 'orcamento_enviado',
        descricao: `Notificação de orçamento pronto enviada via WhatsApp`,
        dataInteracao: new Date()
      });
    } catch (error) {
      console.error('Erro ao notificar orçamento pronto:', error);
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
}
