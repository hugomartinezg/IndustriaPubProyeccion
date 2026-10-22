import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MEDIA_METADATA } from '../data';
import { getShareHistory } from '../utils/projections';
import { formatPercent } from '../utils/formatters';
import { PieChart, ListFilter, ArrowLeftRight } from 'lucide-react';

export default function ShareSection() {
  const [selectedRange, setSelectedRange] = useState<'all' | 'recent' | 'classic'>('all');
  
  const historyData = useMemo(() => getShareHistory(), []);

  // Filter data based on selected historical range
  const filteredData = useMemo(() => {
    switch (selectedRange) {
      case 'recent': // Last 10 years (2016-2025)
        return historyData.filter(d => d.year >= 2016);
      case 'classic': // Initial years before mobile/digital explosion (1995-2007)
        return historyData.filter(d => d.year <= 2007);
      case 'all':
      default:
        return historyData;
    }
  }, [historyData, selectedRange]);

  // Read first and last year values to show structural shifts
  const shiftMetrics = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    
    return {
      startYear: first.year,
      endYear: last.year,
      digitalShift: last.digital - first.digital,
      tvNacShift: last.tvNacional - first.tvNacional,
      prensaShift: last.prensa - first.prensa,
      revistasShift: last.revistas - first.revistas,
      radioShift: last.radio - first.radio,
      pubExteriorShift: last.pubExterior - first.pubExterior,
      tvRegLocalShift: last.tvRegLocal - first.tvRegLocal
    };
  }, [filteredData]);

  return (
    <section id="share-section" className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Structural summary changes */}
      <div className="lg:col-span-1 bg-[#111] border border-[#222] rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-400" />
            <h3 className="font-display font-semibold text-white text-sm">Distribución de Share</h3>
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Análisis porcentual que evalúa la participación individual de cada medio sobre el presupuesto publicitario general. Ayuda a visualizar la transferencia histórica de capital entre formatos análogos y digitales.
          </p>

          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#666] block mb-2 font-mono">
              Filtro del Gráfico
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                id="btn-share-all"
                onClick={() => setSelectedRange('all')}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedRange === 'all'
                    ? 'bg-blue-600 font-bold text-white'
                    : 'bg-[#181818] hover:bg-[#222] text-[#888]'
                }`}
              >
                Completo (1995 - 2025)
              </button>
              <button
                id="btn-share-recent"
                onClick={() => setSelectedRange('recent')}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedRange === 'recent'
                    ? 'bg-blue-600 font-bold text-white'
                    : 'bg-[#181818] hover:bg-[#222] text-[#888]'
                }`}
              >
                Última Década (2016 - 2025)
              </button>
              <button
                id="btn-share-classic"
                onClick={() => setSelectedRange('classic')}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedRange === 'classic'
                    ? 'bg-blue-600 font-bold text-white'
                    : 'bg-[#181818] hover:bg-[#222] text-[#888]'
                }`}
              >
                Periodo Inicial (1995 - 2007)
              </button>
            </div>
          </div>
        </div>

        {shiftMetrics && (
          <div className="border-t border-[#222] pt-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#666] block mb-3 font-mono">
              Migración de Share ({shiftMetrics.startYear} vs {shiftMetrics.endYear})
            </span>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {/* Digital element growth */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">Digital</span>
                <span className={`font-mono font-semibold ${shiftMetrics.digitalShift >= 0 ? 'text-green-455 text-green-400' : 'text-rose-400'}`}>
                  {shiftMetrics.digitalShift >= 0 ? '+' : ''}{formatPercent(shiftMetrics.digitalShift, 1)}
                </span>
              </div>
              
              {/* Other parameters */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">TV Nacional</span>
                <span className={`font-mono font-semibold ${shiftMetrics.tvNacShift >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {shiftMetrics.tvNacShift >= 0 ? '+' : ''}{formatPercent(shiftMetrics.tvNacShift, 1)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">Radio</span>
                <span className={`font-mono font-semibold ${shiftMetrics.radioShift >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {shiftMetrics.radioShift >= 0 ? '+' : ''}{formatPercent(shiftMetrics.radioShift, 1)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400 font-medium">Pub. Exterior</span>
                <span className={`font-mono font-semibold ${shiftMetrics.pubExteriorShift >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {shiftMetrics.pubExteriorShift >= 0 ? '+' : ''}{formatPercent(shiftMetrics.pubExteriorShift, 1)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400 font-medium">Prensa</span>
                <span className={`font-mono font-semibold ${shiftMetrics.prensaShift >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {shiftMetrics.prensaShift >= 0 ? '+' : ''}{formatPercent(shiftMetrics.prensaShift, 1)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-rose-450 text-rose-400">
                <span className="font-mono text-slate-400 font-medium">Revistas</span>
                <span className="font-mono font-semibold">
                  {shiftMetrics.revistasShift >= 0 ? '+' : ''}{formatPercent(shiftMetrics.revistasShift, 1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Area Chart panel */}
      <div className="lg:col-span-3 bg-[#111] border border-[#222] rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[450px]">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowLeftRight className="w-4 h-4 text-blue-400" />
            <h3 className="font-display font-semibold text-white text-base">
              Composición Porcentual de Inversiones (Market Share)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Gráfico de área apilado al 100%. Muestra cómo se divide la inversión total año por año.
          </p>

          <div className="w-full h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis
                  dataKey="year"
                  stroke="#666"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                />
                
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const totalSum = payload.reduce((acc, entry) => acc + Number(entry.value ?? 0), 0) || 1;
                      
                      return (
                        <div className="bg-[#0c0c0c] text-white rounded-lg p-3 shadow-lg border border-[#222] text-xs min-w-[220px]">
                          <div className="font-bold border-b border-[#222] pb-1.5 mb-2 font-display text-slate-450 text-slate-400">
                            Año {label} (Distribución)
                          </div>
                          <div className="space-y-1.5">
                            {payload
                              .slice()
                              .reverse() // Reverse so the order matches the visual stack
                              .map((entry) => {
                                const val = Number(entry.value ?? 0);
                                const sharePct = (val / totalSum) * 100;
                                return (
                                  <div key={entry.name} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                      <span
                                        className="w-2 h-2 rounded-full inline-block"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span>{entry.name}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-mono font-semibold block text-white">
                                        {formatPercent(sharePct, 2)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Draw Areas. Stacking requires stackId */}
                {MEDIA_METADATA.map((med) => {
                  return (
                    <Area
                      key={med.id}
                      type="monotone"
                      dataKey={med.id}
                      name={med.label}
                      stackId="1"
                      stroke={med.color}
                      fill={med.color}
                      fillOpacity={0.7}
                      connectNulls={true}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend of spaces */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-slate-500">
          {MEDIA_METADATA.map(med => {
            return (
              <div key={med.id} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: med.color }} />
                <span>{med.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
