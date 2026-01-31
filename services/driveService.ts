import { AppData } from '../types';
import { generateMockData } from './mockData';

// ID do arquivo no Google Drive (Simulado)
const DRIVE_FILE_ID = "1B2x3y4z_Exemplo_ID_Do_Arquivo_MDB";
const API_KEY = "Exemplo_API_Key";

export const syncFromDrive = async (): Promise<AppData> => {
  console.log(`Iniciando sincronização com Google Drive. File ID: ${DRIVE_FILE_ID}`);
  
  // Simula o delay de rede para baixar o arquivo do Google Drive
  return new Promise((resolve) => {
    setTimeout(() => {
      // Aqui, em uma aplicação real com backend, faríamos:
      // 1. Fetch do arquivo binário do Drive API
      // 2. Parsing do MDB para JSON
      
      const data = generateMockData();
      data.filename = "Backup_Carteira_Drive.mdb";
      data.loaded = true;
      
      resolve(data);
    }, 2500); // 2.5 segundos de "download"
  });
};