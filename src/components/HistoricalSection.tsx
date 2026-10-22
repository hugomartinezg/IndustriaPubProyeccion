import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HISTORICAL_DATA, MEDIA_METADATA } from '../data';
import { formatCurrency } from '../utils/formatters';
import { getMediumInvestment } from '../utils/projections';
import { Eye, EyeOff, Calendar, TrendingUp } from 'lucide-react';

export default function HistoricalSection() {
  const [selectedRange, setSelectedRange] = useState<'all' | 'recent' | 'classic'>('all');
  const [visibleMedia, setVisibleMedia] = useState<Record<string, boolean>>({
    digital: true,
    tvNacional: true,
    radio: true,
    pubExterior: true,
    prensa: true,
    tvRegLocal: true,
    revistas: true,
  });

  const [showTotal, setShowTotal] = useState<boolean>(true);

  // Filter data based on selected historical range
  const filteredData = useMemo(() => {
    switch (selectedRange) {
      case 'recent': // Last 10 years (2016-2025)
        return HISTORICAL_DATA.filter(d => d.year >= 2016);
      case 'classic': // Initial years before mobile/digital explosion (1995-2007)
        return HISTORICAL_DATA.filter(d => d.year <= 2007);
      case 'all':
      default:
        return HISTORICAL_DATA;
    }
  }, [selectedRange]);

  // Toggle medium visibility
  const toggleMedia = (id: string) => {
    setVisibleMedia(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Select all or none
  const setAllMediaState = (state: boolean) => {
    const nextState = {} as Record<string, boolean>;
    MEDIA_METADATA.forEach(m => {
      nextState[m.id] = state;
    });
    setVisibleMedia(nextState);
  };

  // Convert raw historical database to chart-friendly coordinates
  const chartData = useMemo(() => {
    return filteredData.map(pt => ({
      year: pt.year,
      total: pt.totalInv,
      digital: pt.digital,
      tvNacional: pt.tvNacional,
      radio: pt.radio,
      pubExterior: pt.pubExterior,
      prensa: pt.prensa,
      tvRegLocal: pt.tvRegLocal,
      revistas: pt.revistas,
    }));
  }, [filteredData]);

  return (
    <section id="historical-section" className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Configuration Controls panel */}
      <div className="lg:col-span-1 bg-[#111] border border-[#222] rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="font-display font-semibold text-white text-sm">Filtros de Análisis</h3>
          </div>

          {/* Time range selector */}
          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#666] block mb-2 font-mono">
              Periodo Cronológico
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                id="btn-range-all"
                onClick={() => setSelectedRange('all')}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedRange === 'all'
                    ? 'bg-blue-600 font-bold text-white'
                    : 'bg-[#181818] hover:bg-[#222] text-[#888]'
                }`}
              >
                Historial Completo (1995 - 2025)
              </button>
              <button
                id="btn-range-recent"
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
                id="btn-range-classic"
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

          {/* Variables segment */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#666] block font-mono">
                Medios Activos
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setAllMediaState(true)}
                  className="text-[9px] text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                >
                  Todos
                </button>
                <button
                  onClick={() => setAllMediaState(false)}
                  className="text-[9px] text-[#666] hover:text-[#888] underline font-medium cursor-pointer"
                >
                  Ninguno
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {MEDIA_METADATA.map((med) => {
                const isVisible = visibleMedia[med.id];
                return (
                  <button
                    key={med.id}
                    onClick={() => toggleMedia(med.id)}
                    className={`nav-media-toggle w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isVisible
                        ? 'bg-[#181818] border border-[#333] text-white'
                        : 'bg-transparent border border-transparent text-[#666] hover:bg-[#111] hover:text-slate-350'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: isVisible ? med.color : '#333' }}
                      />
                      <span className="truncate">{med.label}</span>
                    </div>
                    {isVisible ? (
                      <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Market volume selection */}
        <div className="border-t border-[#222] pt-4">
          <button
            onClick={() => setShowTotal(prev => !prev)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              showTotal
                ? 'bg-[#181818] text-white border border-blue-500/20'
                : 'bg-transparent text-[#666] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${showTotal ? 'bg-blue-500' : 'bg-slate-800'}`} />
              <span>Ver Curva Inversión Total</span>
            </div>
            {showTotal ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Main Graph panel */}
      <div className="lg:col-span-3 bg-[#111] border border-[#222] rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[450px]">
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h3 className="font-display font-semibold text-white text-base">
                  Evolución Histórica de Inversión Publicitaria
                </h3>
              </div>
              <p className="text-xs text-[#888] mt-0.5">
                Valores consolidados expresados en millones de unidades monetarias (MM). El eje vertical se optimiza automáticamente.
              </p>
            </div>
          </div>

          <div className="w-full h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
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
                
                {/* Secondary Y axis if showTotal is active */}
                <YAxis
                  yAxisId="left"
                  stroke="#888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                
                {showTotal && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  />
                )}

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0c0c0c] text-white rounded-lg p-3 shadow-lg border border-[#222] text-xs min-w-[200px]">
                          <div className="font-bold border-b border-[#222] pb-1.5 mb-2 font-display text-slate-400">
                            Año {label}
                          </div>
                          <div className="space-y-1">
                            {payload.map((entry) => {
                              if (entry.name === 'Total' && !showTotal) return null;
                              return (
                                <div key={entry.name} className="flex justify-between items-center gap-4">
                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <span
                                      className="w-2 h-2 rounded-full inline-block"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span>{entry.name === 'total' ? 'Inversión Total' : entry.name}</span>
                                  </div>
                                  <span className="font-mono font-semibold text-white">
                                    {formatCurrency(entry.value as number)}
                                  </span>
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

                {/* Draw total on right Y Axis */}
                {showTotal && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total"
                    name="Inversión Total"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 7 }}
                  />
                )}

                {/* Draw active medialines */}
                {MEDIA_METADATA.map((med) => {
                  if (!visibleMedia[med.id]) return null;
                  return (
                    <Line
                      yAxisId="left"
                      key={med.id}
                      type="monotone"
                      dataKey={med.id}
                      name={med.label}
                      stroke={med.color}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                      connectNulls={true}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend of lines */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-slate-500">
          {showTotal && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 rounded bg-emerald-500" />
              <span>Inversión Total (Eje Der)</span>
            </div>
          )}
          {MEDIA_METADATA.map(med => {
            if (!visibleMedia[med.id]) return null;
            return (
              <div key={med.id} className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 rounded" style={{ backgroundColor: med.color }} />
                <span>{med.label} (Eje Izq)</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
