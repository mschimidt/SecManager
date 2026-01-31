// Enumerações baseadas no esquema
export enum Ramo {
  AUTOMOVEL = 'Automóvel',
  VIDA = 'Vida',
  RESIDENCIAL = 'Residencial',
  EMPRESARIAL = 'Empresarial',
  OUTROS = 'Outros'
}

export enum NaturezaSinistro {
  COLISAO = 'Colisão',
  ROUBO = 'Roubo/Furto',
  INCENDIO = 'Incêndio',
  ALAGAMENTO = 'Alagamento',
  TERCEIROS = 'Danos a Terceiros'
}

export enum StatusAndamento {
  ABERTO = 'Aberto',
  EM_ANALISE = 'Em Análise',
  AGUARDANDO_PECAS = 'Aguardando Peças',
  LIQUIDADO = 'Liquidado',
  NEGADO = 'Negado'
}

// Entidades Principais
export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  tipo: 'Fisica' | 'Juridica';
}

export interface Seguradora {
  id: string;
  nome: string;
  logo?: string;
}

export interface Produtor {
  id: string;
  nome: string;
}

export interface Seguro {
  codseguro: string; // Chave primária do MDB
  clienteId: string;
  seguradoraId: string;
  produtorId: string;
  ramo: Ramo;
  numeroApolice: string;
  vigenciaInicio: string; // ISO Date
  vigenciaFim: string; // ISO Date
  itemSegurado: string; // Ex: Veículo, Endereço
  valorPremioTotal: number;
  status: 'Ativo' | 'Vencido' | 'Cancelado';
}

// Sinistros
export interface Andamento {
  id: string;
  data: string;
  descricao: string;
  status: StatusAndamento;
}

export interface Terceiro {
  id: string;
  nome: string;
  veiculo?: string;
  contato: string;
}

export interface CabSinistro {
  id: string;
  codseguro: string; // FK
  dataOcorrencia: string;
  dataAviso: string;
  natureza: NaturezaSinistro;
  resumo: string;
  statusAtual: StatusAndamento;
  andamentos: Andamento[];
  terceiros: Terceiro[];
}

// Financeiro / Produção
export interface Parcela {
  id: string;
  numeroParcela: number;
  totalParcelas: number;
  valor: number;
  vencimento: string;
  status: 'Pendente' | 'Pago' | 'Atrasado';
}

export interface CabProducao {
  id: string; // Chave da produção
  codseguro: string; // FK
  motivo: 'Seguro Novo' | 'Renovação' | 'Endosso' | 'Cancelamento';
  dataEmissao: string;
  premioLiquido: number;
  comissaoEstimada: number;
  parcelas: Parcela[];
}

// Estado Global da Aplicação
export interface AppData {
  clientes: Cliente[];
  seguros: Seguro[];
  sinistros: CabSinistro[];
  producao: CabProducao[];
  loaded: boolean;
  filename?: string;
}