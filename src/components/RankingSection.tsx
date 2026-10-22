import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { getGrowthMatrix } from '../utils/projections';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Award, ArrowUpRight, ArrowDownRight, Minus, Grid, ListOrdered } from 'lucide-react';

export default function RankingSection() {
  const [activeSubTab, setActiveSubTab] = useState<'ranking' | 'matrix'>('ranking');
  const matrixData = useMemo(() => getGrowthMatrix(), []);

  // Summary statistics for table
  const totalPrevYear = useMemo(() => matrixData.reduce((acc, r) => acc + r.valPrev, 0), [matrixData]);
  const totalCurrYear = useMemo(() => matrixData.reduce((acc, r) => acc + r.valCurr, 0), [matrixData]);
  const totalAbsChange = totalCurrYear - totalPrevYear;
  const totalPctChange = totalPrevYear > 0 ? totalAbsChange / totalPrevYear : 0;

  return (
    <section id="ranking-section" className="bg-[#111111] border border-[#222222] rounded-xl p-6 shadow-xs mb-8">
      {/* Header and inner tab switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#222] pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="font-display font-semibold text-white text-base">
              Rendimiento Relativo y Matriz de Crecimiento
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluación comparativa instantánea del último periodo fiscal auditado (2024 vs 2025) por canal de comunicación.
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex gap-1 bg-[#181818] p-1 rounded-md shrink-0 border border-[#222]">
          <button
            id="subtab-ranking"
            onClick={() => setActiveSubTab('ranking')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              activeSubTab === 'ranking'
                ? 'bg-[#262626] text-white shadow-xs'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Ranking 2025</span>
          </button>
          <button
            id="subtab-matrix"
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-[#262626] text-white shadow-xs'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Matriz de Crecimiento</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'ranking' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Bar Chart ranking */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-4">
              Distribución de Volumen Comercial (2025)
            </h4>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={matrixData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222" />
                  <XAxis
                    type="number"
                    stroke="#666"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    stroke="#888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0c0c0c] text-white rounded-lg p-3 shadow-lg border border-[#222] text-xs">
                            <p className="font-bold font-display text-slate-300 mb-1.5">{data.label}</p>
                            <div className="space-y-1">
                              <p className="flex justify-between gap-6">
                                <span className="text-slate-400">Inversión:</span>
                                <span className="font-mono font-semibold text-white">{formatCurrency(data.valCurr)}</span>
                              </p>
                              <p className="flex justify-between gap-6">
                                <span className="text-slate-400">Participación:</span>
                                <span className="font-mono font-semibold text-blue-400">{formatPercent(data.shareCurrent)}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Bar dataKey="valCurr" radius={[0, 4, 4, 0]} barSize={16}>
                    {matrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-blue-950/10 border border-blue-500/15 rounded-lg p-3.5 text-xs text-slate-400 leading-normal">
              <p>
                <strong className="text-white">Análisis Ejecutivo:</strong> El medio <strong className="text-blue-400 font-bold">{matrixData[0]?.label}</strong> consolida su liderazgo absoluto representando el <strong className="text-white">{formatPercent(matrixData[0]?.shareCurrent ?? 0)}</strong> de toda la torta publicitaria nacional del año 2025.
              </p>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="lg:col-span-3 overflow-x-auto">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-4">
              Tabla Ejecutiva de Competitividad por Medio (2025)
            </h4>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3 text-center w-12">Puesto</th>
                  <th className="pb-3 pl-2">Formato de Medio</th>
                  <th className="pb-3 text-right">Inversión (2025)</th>
                  <th className="pb-3 text-right">Share (%)</th>
                  <th className="pb-3 text-right">Aceleración YoY</th>
                  <th className="pb-3 text-right">Variación Neta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-xs">
                {matrixData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-[#151515] transition-colors">
                    <td className="py-3 text-center font-mono font-bold text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="py-3 pl-2 font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: row.color }} />
                      <span>{row.label}</span>
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-slate-300">
                      {formatCurrency(row.valCurr)}
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-slate-450 text-slate-400">
                      {formatPercent(row.shareCurrent)}
                    </td>
                    <td className={`py-3 text-right font-mono font-semibold ${row.pctChange >= 0 ? 'text-green-455 text-green-400' : 'text-rose-400'}`}>
                      {row.pctChange >= 0 ? '+' : ''}{formatPercent(row.pctChange)}
                    </td>
                    <td className={`py-3 text-right font-mono ${row.absChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                      {row.absChange >= 0 ? '+' : ''}{formatCurrency(row.absChange)}
                    </td>
                  </tr>
                ))}
                
                {/* Aggregated Total Row */}
                <tr className="bg-[#181818] border-t border-[#333] font-semibold text-white">
                  <td className="py-3 text-center">-</td>
                  <td className="py-3 pl-2">Total Consolidado</td>
                  <td className="py-3 text-right font-mono font-bold text-white">{formatCurrency(totalCurrYear)}</td>
                  <td className="py-3 text-right font-mono font-bold text-white">100,00%</td>
                  <td className={`py-3 text-right font-mono font-bold ${totalPctChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                    {totalPctChange >= 0 ? '+' : ''}{formatPercent(totalPctChange)}
                  </td>
                  <td className={`py-3 text-right font-mono font-bold ${totalAbsChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                    {totalAbsChange >= 0 ? '+' : ''}{formatCurrency(totalAbsChange)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Growth Matrix and Trends View */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3 pl-2">Canal / Medio</th>
                <th className="pb-3 text-right">Inversión Anterior (2024)</th>
                <th className="pb-3 text-right">Inversión Actual (2025)</th>
                <th className="pb-3 text-right">Variación Absoluta</th>
                <th className="pb-3 text-right">Crecimiento (%)</th>
                <th className="pb-3 text-right">Share Actual</th>
                <th className="pb-3 text-center w-28">Dirección</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-xs">
              {matrixData.map((row) => {
                return (
                  <tr key={row.id} className="hover:bg-[#151515] transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: row.color }} />
                      <span>{row.label}</span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-slate-300">{formatCurrency(row.valPrev)}</td>
                    <td className="py-3.5 text-right font-mono font-semibold text-white">{formatCurrency(row.valCurr)}</td>
                    <td className={`py-3.5 text-right font-mono ${row.absChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                      {row.absChange >= 0 ? '+' : ''}{formatCurrency(row.absChange)}
                    </td>
                    <td className={`py-3.5 text-right font-mono font-semibold ${row.pctChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                      {row.pctChange >= 0 ? '+' : ''}{formatPercent(row.pctChange)}
                    </td>
                    <td className="py-3.5 text-right font-mono text-slate-400">{formatPercent(row.shareCurrent)}</td>
                    <td className="py-3.5 text-center">
                      {row.trend === 'Crece' && (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/25 px-2.5 py-0.5 rounded font-semibold text-[10px]">
                          <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
                          <span>Expansión</span>
                        </span>
                      )}
                      {row.trend === 'Decrece' && (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2.5 py-0.5 rounded font-semibold text-[10px]">
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                          <span>Contracción</span>
                        </span>
                      )}
                      {row.trend === 'Mantiene' && (
                        <span className="inline-flex items-center gap-1 bg-[#1a1a1a] text-slate-400 border border-[#333] px-2.5 py-0.5 rounded font-semibold text-[10px]">
                          <Minus className="w-3.5 h-3.5 text-slate-500" />
                          <span>Estable</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {/* Aggregated totals row */}
              <tr className="bg-[#181818] border-t border-[#333] font-semibold text-white">
                <td className="py-3.5 pl-2 font-bold text-white">Total Consolidado</td>
                <td className="py-3.5 text-right font-mono font-bold text-white">{formatCurrency(totalPrevYear)}</td>
                <td className="py-3.5 text-right font-mono font-bold text-white">{formatCurrency(totalCurrYear)}</td>
                <td className={`py-3.5 text-right font-mono font-bold ${totalAbsChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {totalAbsChange >= 0 ? '+' : ''}{formatCurrency(totalAbsChange)}
                </td>
                <td className={`py-3.5 text-right font-mono font-bold ${totalPctChange >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {totalPctChange >= 0 ? '+' : ''}{formatPercent(totalPctChange)}
                </td>
                <td className="py-3.5 text-right font-mono font-bold text-white">100,00%</td>
                <td className="py-3.5 text-center">
                  <span className="inline-flex items-center gap-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded font-semibold text-[10px]">
                    {totalPctChange >= 0 ? 'Crecimiento' : 'Decrecimiento'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
