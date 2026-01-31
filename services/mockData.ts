import { 
  AppData, 
  Cliente, 
  Seguro, 
  CabSinistro, 
  CabProducao, 
  Ramo, 
  NaturezaSinistro, 
  StatusAndamento,
  Parcela
} from '../types';

// Helper de data
const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Gerador de dados falsos para demonstração
export const generateMockData = (): AppData => {
  const clientes: Cliente[] = [
    { id: '1', nome: 'João Silva', cpfCnpj: '123.456.789-00', email: 'joao@email.com', telefone: '(11) 99999-9999', tipo: 'Fisica' },
    { id: '2', nome: 'Maria Oliveira', cpfCnpj: '987.654.321-00', email: 'maria@empresa.com', telefone: '(21) 98888-8888', tipo: 'Juridica' },
    { id: '3', nome: 'Carlos Souza', cpfCnpj: '456.789.123-00', email: 'carlos@email.com', telefone: '(31) 97777-7777', tipo: 'Fisica' },
    { id: '4', nome: 'Tech Solutions Ltda', cpfCnpj: '12.345.678/0001-90', email: 'contato@techsol.com', telefone: '(11) 3030-3030', tipo: 'Juridica' },
    { id: '5', nome: 'Ana Pereira', cpfCnpj: '321.654.987-00', email: 'ana@email.com', telefone: '(41) 96666-6666', tipo: 'Fisica' },
  ];

  const seguros: Seguro[] = [
    {
      codseguro: '1001',
      clienteId: '1',
      seguradoraId: 'PORTO',
      produtorId: 'CORRETOR1',
      ramo: Ramo.AUTOMOVEL,
      numeroApolice: '001.234.567',
      vigenciaInicio: subDays(new Date(), 100).toISOString(),
      vigenciaFim: addDays(new Date(), 265).toISOString(),
      itemSegurado: 'Chevrolet Onix 2022 Placa ABC-1234',
      valorPremioTotal: 2500.00,
      status: 'Ativo'
    },
    {
      codseguro: '1002',
      clienteId: '2',
      seguradoraId: 'AZUL',
      produtorId: 'CORRETOR1',
      ramo: Ramo.EMPRESARIAL,
      numeroApolice: '002.888.999',
      vigenciaInicio: subDays(new Date(), 20).toISOString(),
      vigenciaFim: addDays(new Date(), 345).toISOString(),
      itemSegurado: 'Escritório Central - Av. Paulista',
      valorPremioTotal: 12000.00,
      status: 'Ativo'
    },
    {
      codseguro: '1003',
      clienteId: '3',
      seguradoraId: 'TOKIO',
      produtorId: 'CORRETOR2',
      ramo: Ramo.VIDA,
      numeroApolice: '003.555.444',
      vigenciaInicio: subDays(new Date(), 400).toISOString(),
      vigenciaFim: subDays(new Date(), 35).toISOString(),
      itemSegurado: 'Vida Individual - Capital 500k',
      valorPremioTotal: 800.00,
      status: 'Vencido'
    },
    {
      codseguro: '1004',
      clienteId: '4',
      seguradoraId: 'ALLIANZ',
      produtorId: 'CORRETOR1',
      ramo: Ramo.RESIDENCIAL,
      numeroApolice: '004.111.222',
      vigenciaInicio: subDays(new Date(), 10).toISOString(),
      vigenciaFim: addDays(new Date(), 355).toISOString(),
      itemSegurado: 'Apartamento Jardins',
      valorPremioTotal: 1500.00,
      status: 'Ativo'
    },
    {
      codseguro: '1005',
      clienteId: '5',
      seguradoraId: 'PORTO',
      produtorId: 'CORRETOR2',
      ramo: Ramo.AUTOMOVEL,
      numeroApolice: '005.333.777',
      vigenciaInicio: subDays(new Date(), 150).toISOString(),
      vigenciaFim: addDays(new Date(), 215).toISOString(),
      itemSegurado: 'Jeep Compass 2023',
      valorPremioTotal: 5500.00,
      status: 'Ativo'
    },
  ];

  const sinistros: CabSinistro[] = [
    {
      id: 'SIN-001',
      codseguro: '1001',
      dataOcorrencia: subDays(new Date(), 15).toISOString(),
      dataAviso: subDays(new Date(), 14).toISOString(),
      natureza: NaturezaSinistro.COLISAO,
      resumo: 'Batida traseira no semáforo',
      statusAtual: StatusAndamento.AGUARDANDO_PECAS,
      andamentos: [
        { id: 'A1', data: subDays(new Date(), 14).toISOString(), descricao: 'Aviso de Sinistro', status: StatusAndamento.ABERTO },
        { id: 'A2', data: subDays(new Date(), 10).toISOString(), descricao: 'Vistoria Realizada', status: StatusAndamento.EM_ANALISE },
        { id: 'A3', data: subDays(new Date(), 2).toISOString(), descricao: 'Peças Solicitadas à Fábrica', status: StatusAndamento.AGUARDANDO_PECAS },
      ],
      terceiros: [
        { id: 'T1', nome: 'Roberto Alves', veiculo: 'Fiat Uno', contato: '9999-9999' }
      ]
    },
    {
      id: 'SIN-002',
      codseguro: '1005',
      dataOcorrencia: subDays(new Date(), 60).toISOString(),
      dataAviso: subDays(new Date(), 59).toISOString(),
      natureza: NaturezaSinistro.ROUBO,
      resumo: 'Furto qualificado em estacionamento',
      statusAtual: StatusAndamento.LIQUIDADO,
      andamentos: [
        { id: 'B1', data: subDays(new Date(), 59).toISOString(), descricao: 'Abertura', status: StatusAndamento.ABERTO },
        { id: 'B2', data: subDays(new Date(), 40).toISOString(), descricao: 'Indenização Paga', status: StatusAndamento.LIQUIDADO },
      ],
      terceiros: []
    }
  ];

  const producao: CabProducao[] = [
    {
      id: 'PROD-001',
      codseguro: '1001',
      motivo: 'Seguro Novo',
      dataEmissao: subDays(new Date(), 100).toISOString(),
      premioLiquido: 2200.00,
      comissaoEstimada: 440.00,
      parcelas: [
        { id: 'P1', numeroParcela: 1, totalParcelas: 4, valor: 625.00, vencimento: subDays(new Date(), 70).toISOString(), status: 'Pago' },
        { id: 'P2', numeroParcela: 2, totalParcelas: 4, valor: 625.00, vencimento: subDays(new Date(), 40).toISOString(), status: 'Pago' },
        { id: 'P3', numeroParcela: 3, totalParcelas: 4, valor: 625.00, vencimento: subDays(new Date(), 10).toISOString(), status: 'Pago' },
        { id: 'P4', numeroParcela: 4, totalParcelas: 4, valor: 625.00, vencimento: addDays(new Date(), 20).toISOString(), status: 'Pendente' },
      ]
    },
    {
        id: 'PROD-002',
        codseguro: '1002',
        motivo: 'Renovação',
        dataEmissao: subDays(new Date(), 20).toISOString(),
        premioLiquido: 10000.00,
        comissaoEstimada: 1500.00,
        parcelas: [
          { id: 'P5', numeroParcela: 1, totalParcelas: 1, valor: 12000.00, vencimento: addDays(new Date(), 10).toISOString(), status: 'Pendente' },
        ]
      },
  ];

  return {
    clientes,
    seguros,
    sinistros,
    producao,
    loaded: true
  };
};