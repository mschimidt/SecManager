import React from 'react';
import { Cliente, Seguro, CabSinistro, CabProducao, StatusAndamento } from '../types';
import { User, Phone, Shield, Calendar, AlertTriangle, DollarSign, ChevronRight } from 'lucide-react';

// --- Card de Cliente ---
export const MobileClientCard: React.FC<{ cliente: Cliente }> = ({ cliente }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 active:scale-[0.98] transition-transform">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cliente.tipo === 'Juridica' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{cliente.nome}</h3>
          <p className="text-xs text-slate-500">{cliente.cpfCnpj}</p>
        </div>
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cliente.tipo === 'Juridica' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
        {cliente.tipo === 'Juridica' ? 'PJ' : 'PF'}
      </span>
    </div>
    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
      <div className="flex items-center gap-2 text-slate-500">
        <Phone className="w-3 h-3" />
        <span className="text-xs">{cliente.telefone}</span>
      </div>
      <button className="text-xs font-medium text-blue-600 flex items-center gap-1">
        Detalhes <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  </div>
);

// --- Card de Apólice (Seguro) ---
export const MobilePolicyCard: React.FC<{ seguro: Seguro; nomeCliente: string }> = ({ seguro, nomeCliente }) => {
  const isAtivo = seguro.status === 'Ativo';
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 border-l-4 border-l-blue-500">
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
          {seguro.numeroApolice}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isAtivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {seguro.status}
        </span>
      </div>
      
      <h3 className="font-bold text-slate-800 text-sm mb-1">{seguro.ramo}</h3>
      <p className="text-xs text-slate-500 mb-3 line-clamp-1">{seguro.itemSegurado}</p>
      
      <div className="flex items-center gap-2 mb-3">
        <User className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-600">{nomeCliente}</span>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1 text-slate-500">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px]">Fim: {new Date(seguro.vigenciaFim).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="font-bold text-slate-700 text-sm">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(seguro.valorPremioTotal)}
        </div>
      </div>
    </div>
  );
};

// --- Card de Sinistro ---
export const MobileClaimCard: React.FC<{ sinistro: CabSinistro }> = ({ sinistro }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
    <div className="flex justify-between mb-2">
      <span className="text-[10px] text-slate-400 font-mono">#{sinistro.id}</span>
      <span className="text-[10px] text-slate-500">{new Date(sinistro.dataOcorrencia).toLocaleDateString('pt-BR')}</span>
    </div>
    
    <div className="flex items-start gap-3 mb-3">
      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 text-sm">{sinistro.natureza}</h4>
        <p className="text-xs text-slate-500 line-clamp-2">{sinistro.resumo}</p>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
        sinistro.statusAtual === StatusAndamento.LIQUIDADO ? 'bg-green-100 text-green-700' : 
        sinistro.statusAtual === StatusAndamento.NEGADO ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {sinistro.statusAtual}
      </span>
      <button className="text-xs text-blue-600 font-medium">Ver Andamento</button>
    </div>
  </div>
);

// --- Card de Financeiro ---
export const MobileFinanceCard: React.FC<{ producao: CabProducao }> = ({ producao }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const parcelasPagas = producao.parcelas.filter(p => p.status === 'Pago').length;
  const totalParcelas = producao.parcelas.length;
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{producao.motivo}</span>
        <span className="text-[10px] text-slate-400">{new Date(producao.dataEmissao).toLocaleDateString('pt-BR')}</span>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-[10px] text-slate-400 uppercase">Prêmio Líquido</p>
          <p className="font-bold text-slate-800">{formatCurrency(producao.premioLiquido)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase">Comissão</p>
          <p className="font-bold text-green-600 text-sm">{formatCurrency(producao.comissaoEstimada)}</p>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
        <div 
          className="bg-blue-500 h-1.5 rounded-full" 
          style={{ width: `${(parcelasPagas / totalParcelas) * 100}%` }}
        ></div>
      </div>
      <div className="text-right text-[10px] text-slate-500">
        {parcelasPagas} de {totalParcelas} parcelas pagas
      </div>
    </div>
  );
};