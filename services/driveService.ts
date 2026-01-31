import { AppData, Cliente, Seguro, CabSinistro, CabProducao } from '../types';
import { generateMockData } from './mockData';

// URL do Backend no Render (Substitua pela sua URL real após o deploy)
// Exemplo: 'https://segurmanager-api.onrender.com/api/sync'
const API_URL = 'https://segurmanager-api.onrender.com/api/sync';

export const syncFromDrive = async (): Promise<AppData> => {
  console.log(`[DriveService] Tentando sincronizar via Backend: ${API_URL}`);
  
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Erro na API (${response.status}): ${response.statusText}`);
    }

    const rawData = await response.json();
    
    if (rawData.error) {
        throw new Error(rawData.error);
    }

    // Adaptador de Dados
    // O backend retorna os nomes das colunas originais do MDB (geralmente UPPERCASE).
    // Precisamos mapear para o nosso camelCase do TypeScript se necessário.
    // Este é um mapeamento "best-effort" assumindo que o backend retorna os dados brutos.
    
    const data: AppData = {
        clientes: mapClientes(rawData.clientes),
        seguros: mapSeguros(rawData.seguros),
        sinistros: mapSinistros(rawData.sinistros),
        producao: mapProducao(rawData.producao),
        loaded: true,
        filename: rawData.filename || 'Google Drive Sync'
    };
    
    return data;

  } catch (error) {
    console.warn("[DriveService] Falha na conexão com o backend. Usando dados de demonstração para não quebrar a UI.", error);
    
    // Fallback: Retorna dados falsos se o backend não estiver rodando
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = generateMockData();
        data.filename = "Modo Demo (Sem conexão)";
        resolve(data);
      }, 2000);
    });
  }
};

// --- Funções Auxiliares de Mapeamento (Adapte conforme suas colunas do Access) ---

function mapClientes(list: any[]): Cliente[] {
    if (!list) return [];
    return list.map((item: any) => ({
        id: String(item.CODIGO || item.ID || Math.random()), 
        nome: item.NOME || 'Sem Nome',
        cpfCnpj: item.CGC_CPF || item.CPF || item.CNPJ || '',
        email: item.EMAIL || '',
        telefone: item.TELEFONE || item.CELULAR || '',
        tipo: (item.TIPO && item.TIPO.includes('J')) ? 'Juridica' : 'Fisica'
    }));
}

function mapSeguros(list: any[]): Seguro[] {
    if (!list) return [];
    return list.map((item: any) => ({
        codseguro: String(item.CODSEGURO || Math.random()),
        clienteId: String(item.CODCLIENTE || ''),
        seguradoraId: String(item.CODSEGURADORA || '1'),
        produtorId: String(item.CODPRODUTOR || '1'),
        ramo: item.RAMO || 'Outros',
        numeroApolice: item.APOLICE || '',
        vigenciaInicio: item.INICIO_VIGENCIA || new Date().toISOString(),
        vigenciaFim: item.FIM_VIGENCIA || new Date().toISOString(),
        itemSegurado: item.ITEM_SEGURADO || item.VEICULO || 'Item não especificado',
        valorPremioTotal: parseFloat(item.PREMIO_TOTAL || '0'),
        status: item.STATUS === 'C' ? 'Cancelado' : 'Ativo' // Exemplo de lógica
    }));
}

function mapSinistros(list: any[]): CabSinistro[] {
    if (!list) return [];
    return list.map((item: any) => ({
        id: String(item.CODSINISTRO || Math.random()),
        codseguro: String(item.CODSEGURO || ''),
        dataOcorrencia: item.DATA_OCORRENCIA || new Date().toISOString(),
        dataAviso: item.DATA_AVISO || new Date().toISOString(),
        natureza: item.NATUREZA || 'Outros',
        resumo: item.HISTORICO || item.RESUMO || '',
        statusAtual: item.STATUS || 'Aberto',
        andamentos: [], 
        terceiros: []
    }));
}

function mapProducao(list: any[]): CabProducao[] {
    if (!list) return [];
    return list.map((item: any) => ({
        id: String(item.CODPRODUCAO || Math.random()),
        codseguro: String(item.CODSEGURO || ''),
        motivo: item.TIPO_MOVIMENTO || 'Endosso',
        dataEmissao: item.DATA_EMISSAO || new Date().toISOString(),
        premioLiquido: parseFloat(item.PREMIO_LIQUIDO || '0'),
        comissaoEstimada: parseFloat(item.COMISSAO || '0'),
        parcelas: []
    }));
}
