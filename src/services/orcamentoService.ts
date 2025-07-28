import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SolicitacaoOrcamento, Orcamento, UsuarioCliente, HistoricoInteracao } from '@/types/orcamentos';

export class OrcamentoService {
  // Criar solicitação de orçamento
  static async criarSolicitacao(dados: Omit<SolicitacaoOrcamento, 'id' | 'dataCreacao' | 'dataUltimaAtualizacao' | 'statusSolicitacao'>): Promise<string> {
    try {
      const solicitacao = {
        ...dados,
        statusSolicitacao: 'pendente' as const,
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
        clienteId: dados.emailCliente, // Usando email como ID temporário
        tipoInteracao: 'solicitacao_criada',
        descricao: `Solicitação de orçamento criada para o serviço: ${dados.servicoInteresse}`,
        dataInteracao: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  }

  // Buscar todas as solicitações (sem filtro por status para evitar índice)
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

  // Buscar solicitações pendentes (método simplificado)
  static async buscarSolicitacoesPendentes(): Promise<SolicitacaoOrcamento[]> {
    try {
      // Buscar todas e filtrar no lado do cliente para evitar índice composto
      const todasSolicitacoes = await this.buscarTodasSolicitacoes();
      return todasSolicitacoes.filter(solicitacao => solicitacao.statusSolicitacao === 'pendente');
    } catch (error) {
      console.error('Erro ao buscar solicitações pendentes:', error);
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
        // Criar novo cliente
        await addDoc(collection(db, 'usuarios_clientes'), {
          ...dados,
          dataCadastro: Timestamp.now(),
          ultimoAcesso: Timestamp.now()
        });
      } else {
        // Atualizar cliente existente
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

      // Registrar no histórico
      await this.registrarHistorico({
        clienteId: solicitacaoId, // Usando solicitacaoId como referência
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
}
