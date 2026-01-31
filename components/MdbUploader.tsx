import React, { useState } from 'react';
import { Upload, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppData } from '../types';
import { generateMockData } from '../services/mockData';

interface MdbUploaderProps {
  onDataLoaded: (data: AppData) => void;
}

const MdbUploader: React.FC<MdbUploaderProps> = ({ onDataLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    // Validação simples de extensão para fins de UX
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.mdb') && !fileName.endsWith('.accdb')) {
      setError("Por favor, envie um arquivo de banco de dados Access (.mdb ou .accdb).");
      return;
    }

    setError(null);
    setLoading(true);

    // Simulação de processamento do arquivo binário
    // Em um cenário real, isso seria enviado para um backend ou processado via WASM
    setTimeout(() => {
      const mockData = generateMockData();
      mockData.filename = file.name;
      setLoading(false);
      onDataLoaded(mockData);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Importar Base Legada</h1>
          <p className="text-gray-500">
            Arraste seu arquivo de backup (.mdb) do sistema antigo para migrar os dados para o novo painel.
          </p>
        </div>

        <div className="p-8">
          <div 
            className={`relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl transition-all duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {loading ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium text-blue-800">Lendo tabelas SEGUROS, CLIENTES...</p>
                <p className="text-xs text-gray-500 mt-1">Isso pode levar alguns segundos</p>
              </div>
            ) : (
              <>
                <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Arraste e solte o arquivo aqui
                </p>
                <p className="text-xs text-gray-400 mb-4">ou clique para selecionar</p>
                <input 
                  type="file" 
                  accept=".mdb,.accdb"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleChange}
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Selecionar Arquivo
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Estrutura Reconhecida</h4>
            <div className="grid grid-cols-2 gap-2">
              {['SEGUROS', 'CLIENTES', 'CABSINISTRO', 'FINANCEIRO'].map((table) => (
                <div key={table} className="flex items-center gap-2 p-2 rounded bg-gray-50 border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-gray-600">{table}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400">SegurManager v1.0 &copy; 2024</p>
    </div>
  );
};

export default MdbUploader;