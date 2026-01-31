import React from 'react';
import { 
  Users, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
import { AppData, StatusAndamento } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardStatsProps {
  data: AppData;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center min-h-[100px]">
    <div className={`p-2 rounded-lg ${colorClass} mb-2`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 leading-none">{value}</h3>
    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wide">{title}</p>
  </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  const totalClientes = data.clientes.length;
  const apolicesAtivas = data.seguros.filter(s => s.status === 'Ativo').length;
  const sinistrosAbertos = data.sinistros.filter(s => s.statusAtual !== StatusAndamento.LIQUIDADO && s.statusAtual !== StatusAndamento.NEGADO).length;
  
  const premioTotal = data.seguros
    .filter(s => s.status === 'Ativo')
    .reduce((acc, curr) => acc + curr.valorPremioTotal, 0);

  const formatCompactCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const chartData = data.producao.map(p => ({
    name: new Date(p.dataEmissao).toLocaleDateString('pt-BR', { month: 'short' }),
    valor: p.premioLiquido,
    motivo: p.motivo,
    rawDate: new Date(p.dataEmissao)
  })).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

  return (
    <div className="space-y-4">
      {/* Grid 2x2 para mobile */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
          title="Clientes" 
          value={totalClientes} 
          icon={<Users className="w-5 h-5 text-blue-600" />}
          colorClass="bg-blue-50"
        />
        <StatCard 
          title="Apólices" 
          value={apolicesAtivas} 
          icon={<FileCheck className="w-5 h-5 text-green-600" />}
          colorClass="bg-green-50"
        />
        <StatCard 
          title="Sinistros" 
          value={sinistrosAbertos} 
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          colorClass="bg-amber-50"
        />
        <StatCard 
          title="Prêmios" 
          value={formatCompactCurrency(premioTotal)} 
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          colorClass="bg-indigo-50"
        />
      </div>

      {/* Gráfico simplificado para mobile */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Produção (Mês)
          </h3>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={5} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
              />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.motivo === 'Renovação' ? '#3b82f6' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};