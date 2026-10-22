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
  AreaChart,
  Area,
} from 'recharts';
import { MEDIA_METADATA, HISTORICAL_DATA } from '../data';
import {
  generateProjections,
  calculateConservadorGrowthRate,
  calculateWeightedGrowthRate,
  calculateOptimistaGrowthRate,
  getMediumInvestment,
} from '../utils/projections';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Scenarios } from '../types';
import { Shield, ChevronRight, BarChart3, HelpCircle, Eye, RefreshCw } from 'lucide-react';

export default function ProjectionSection() {
  const [selectedScenario, setSelectedScenario] = useState<Scenarios>('base');
  const [activeTableMode, setActiveTableMode] = useState<'both' | 'absolute' | 'percentage'>('both');

  // Compute projections
  const projections = useMemo(() => generateProjections(), []);

  // Growth rates for display
  const growthRateMeta = useMemo(() => {
    return MEDIA_METADATA.map(m => {
      return {
        id: m.id,
        label: m.label,
        color: m.color,
        conservador: calculateConservadorGrowthRate(m.id),
        base: calculateWeightedGrowthRate(m.id),
        optimista: calculateOptimistaGrowthRate(m.id)
      };
    });
  }, []);

  // Scenario descriptions
  const scenarioInfo = {
    conservador: {
      title: 'Modelo Conservador de Resiliencia',
      desc: 'Simula un escenario de contracción u optimización de presupuesto, promediando el comportamiento de los últimos 3 periodos históricos y aplicando un factor de suavizado del -20% sobre las curvas positivas de expansión.',
      badgeColor: 'bg-[#181818] text-slate-400 border-[#333]'
    },
    base: {
      title: 'Modelo de Tendencia Estructural (Histórica Ponderada)',
      desc: 'Es el escenario base estándar sugerido para planificación presupuestal. Utiliza la fórmula auditada de ponderaciones históricas de 5 periodos dando mayor peso a la historia reciente: t-1 (40%), t-2 (25%), t-3 (20%), t-4 (10%), t-5 (5%).',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/25'
    },
    optimista: {
      title: 'Modelo de Aceleración y Tracción Digital',
      desc: 'Simula un ciclo expansivo en el ecosistema publicitario impulsado por la aceleración en canales digitales. Modela primas de aceleración (+2.5% en digital, +1.5% en tradicionales) balanceadas por techos técnicos del 20% anual para evitar burbujas estadísticas.',
      badgeColor: 'bg-green-500/10 text-green-400 border-green-500/25'
    }
  };

  // Build a timeline dataset including historical 2024, 2025 and 2026-2030 projected total to display in scenario comparison
  const scenarioTimelineData = useMemo(() => {
    const timeline = [
      {
        year: 2023,
        Conservador: HISTORICAL_DATA.find(d => d.year === 2023)?.totalInv ?? 0,
        Base: HISTORICAL_DATA.find(d => d.year === 2023)?.totalInv ?? 0,
        Optimista: HISTORICAL_DATA.find(d => d.year === 2023)?.totalInv ?? 0,
        isProjected: false
      },
      {
        year: 2024,
        Conservador: HISTORICAL_DATA.find(d => d.year === 2024)?.totalInv ?? 0,
        Base: HISTORICAL_DATA.find(d => d.year === 2024)?.totalInv ?? 0,
        Optimista: HISTORICAL_DATA.find(d => d.year === 2024)?.totalInv ?? 0,
        isProjected: false
      },
      {
        year: 2025,
        Conservador: HISTORICAL_DATA.find(d => d.year === 2025)?.totalInv ?? 0,
        Base: HISTORICAL_DATA.find(d => d.year === 2025)?.totalInv ?? 0,
        Optimista: HISTORICAL_DATA.find(d => d.year === 2025)?.totalInv ?? 0,
        isProjected: false
      }
    ];

    const projConservador = projections.conservador;
    const projBase = projections.base;
    const projOptimista = projections.optimista;

    for (let i = 0; i < 5; i++) {
      timeline.push({
        year: projBase[i].year,
        Conservador: projConservador[i].totalInvestments,
        Base: projBase[i].totalInvestments,
        Optimista: projOptimista[i].totalInvestments,
        isProjected: true
      });
    }

    return timeline;
  }, [projections]);

  // Projected list for active scenario
  const activeProjections = projections[selectedScenario];

  // Helper to format values elegantly in table
  const renderTableCellValue = (absVal: number, shareVal: number) => {
    if (activeTableMode === 'absolute') {
      return <span className="font-mono text-slate-300">{formatCurrency(absVal)}</span>;
    }
    if (activeTableMode === 'percentage') {
      return <span className="font-mono font-medium text-slate-400">{formatPercent(shareVal)}</span>;
    }
    return (
      <div className="flex flex-col">
        <span className="font-mono font-bold leading-tight text-white">{formatCurrency(absVal)}</span>
        <span className="font-mono text-[10px] text-slate-500 font-medium leading-none mt-1">
          {formatPercent(shareVal)} del total
        </span>
      </div>
    );
  };

  return (
    <section id="projection-section" className="space-y-6">
      
      {/* Selector of Scenario */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#222] gap-4 mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="font-display font-semibold text-white text-base">
                Simulador del Plan Prospectivo (2026 - 2030)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Defina el comportamiento macro del mercado publicitario para simular los próximos 5 periodos fiscales.
            </p>
          </div>

          {/* Scenario toggle buttons */}
          <div className="flex bg-[#181818] p-1 rounded-lg self-start md:self-center border border-[#222]">
            {Object.keys(scenarioInfo).map((key) => {
              const scKey = key as Scenarios;
              const isActive = selectedScenario === scKey;
              return (
                <button
                  id={`btn-scenario-${scKey}`}
                  key={scKey}
                  onClick={() => setSelectedScenario(scKey)}
                  className={`px-4 py-2 rounded-md text-[10px] font-bold leading-none cursor-pointer transition-all uppercase tracking-wide ${
                    isActive
                      ? 'bg-[#262626] text-white shadow-xs'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  {scKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected scenario info panel */}
        <div className={`p-4 rounded-xl border flex gap-3 items-start ${selectedScenario === 'base' ? 'bg-blue-950/10 border-blue-500/15' : selectedScenario === 'optimista' ? 'bg-green-950/10 border-green-500/15' : 'bg-[#141414] border-[#222]'}`}>
          <div className="bg-[#0c0c0c] p-2 rounded-lg shadow-xs border border-[#222] hidden sm:block">
            <RefreshCw className={`w-5 h-5 ${selectedScenario === 'base' ? 'text-blue-400' : selectedScenario === 'optimista' ? 'text-green-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm flex items-center gap-1.5">
              <span>{scenarioInfo[selectedScenario].title}</span>
              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${scenarioInfo[selectedScenario].badgeColor}`}>
                Simulado Activo
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {scenarioInfo[selectedScenario].desc}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Scenario comparison chart */}
        <div className="lg:col-span-3 bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h4 className="font-display font-semibold text-white text-sm">
                  Evaluación Comparativa de Escenarios (Inversión Total)
                </h4>
                <p className="text-[10px] text-[#666] font-mono mt-0.5">
                  Línea de tendencia histórica e intervalo de dispersión proyectado 2026-2030 (MM).
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={scenarioTimelineData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                  <XAxis
                    dataKey="year"
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    tickFormatter={(val) => val >= 2026 ? `${val} (Proy.)` : val}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  />
                  
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const isProj = label >= 2026;
                        return (
                          <div className="bg-[#0c0c0c] text-white rounded-lg p-3 shadow-lg border border-[#222] text-xs text-left min-w-[200px]">
                            <div className="font-bold border-b border-[#222] pb-1.5 mb-2 font-display text-slate-400">
                              Año {label} {isProj ? '(Proyección Simulada)' : '(Histórico Real)'}
                            </div>
                            <div className="space-y-1.5">
                              {payload.map((entry) => {
                                return (
                                  <div key={entry.name} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                      <span
                                        className="w-2 h-2 rounded-full inline-block"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span>{entry.name}</span>
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

                  {/* Draw Scenarios */}
                  <Line
                    type="monotone"
                    dataKey="Conservador"
                    name="Conservador"
                    stroke="#666"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="Base"
                    name="Base (Ponderado)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="Optimista"
                    name="Optimista"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-2 text-[10px] text-slate-500 border-t border-[#222] pt-3 flex items-center justify-between">
            <span>Intervalo de dispersión técnica: ±18% de brecha al 2030</span>
            <span className="font-semibold text-slate-450">Nota: Proyección lineal compuesta por medio</span>
          </div>
        </div>

        {/* Growth coefficients info block */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-3">
              Tasas Anuales de Crecimiento Aplicadas
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Tasas compuestas de simulación calculadas autónomamente para cada canal bajo la regla de aislamiento de variables exógenas.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {growthRateMeta.map((gr) => {
                const activeRate = gr[selectedScenario];
                return (
                  <div key={gr.id} className="p-2.5 rounded-lg border border-[#222] bg-[#141414] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: gr.color }} />
                      <span className="text-xs font-semibold text-slate-200">{gr.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${activeRate >= 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {activeRate >= 0 ? '+' : ''}{formatPercent(activeRate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-950/15 border border-blue-500/20 rounded-lg text-xs text-slate-400">
            <strong>Certificación del Algoritmo:</strong> Ningún indicador se acopla a variables externas. La simulación opera estrictamente en series temporales puras, blindada contra devaluaciones (TRM) e inflación (IPC).
          </div>
        </div>
      </div>

      {/* Main Big table showing projections */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-4 mb-4 gap-4">
          <div>
            <h4 className="font-display font-semibold text-white text-sm">
              Tabla Modelo de Proyecciones Futuras ({selectedScenario.toUpperCase()})
            </h4>
            <p className="text-[10px] text-[#666] font-mono mt-0.5">
              Simulación de 5 periodos detallada por canal publicitario (Valores absolutos de inversión y porción de participación).
            </p>
          </div>

          {/* Table display toggles */}
          <div className="flex bg-[#181818] p-1 rounded-lg shrink-0 border border-[#222]">
            <button
              onClick={() => setActiveTableMode('both')}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeTableMode === 'both' ? 'bg-[#262626] text-white shadow-xs' : 'text-[#888] hover:text-white'
              }`}
            >
              Ambos
            </button>
            <button
              onClick={() => setActiveTableMode('absolute')}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeTableMode === 'absolute' ? 'bg-[#262626] text-white shadow-xs' : 'text-[#888] hover:text-white'
              }`}
            >
              Valores (MM)
            </button>
            <button
              onClick={() => setActiveTableMode('percentage')}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeTableMode === 'percentage' ? 'bg-[#262626] text-white shadow-xs' : 'text-[#888] hover:text-white'
              }`}
            >
              Share (%)
            </button>
          </div>
        </div>

        {/* Detailed Grid projection */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3 pl-2">Formato de Medio</th>
                <th className="pb-3 text-right">Inversión Base (2025)</th>
                <th className="pb-3 text-right text-blue-400 font-bold bg-[#141414]">Año +1 (2026)</th>
                <th className="pb-3 text-right text-blue-400 font-bold bg-[#141414]">Año +2 (2027)</th>
                <th className="pb-3 text-right text-blue-400 font-bold bg-[#141414]">Año +3 (2028)</th>
                <th className="pb-3 text-right text-blue-400 font-bold bg-[#141414]">Año +4 (2029)</th>
                <th className="pb-3 text-right text-blue-400 font-bold bg-[#141414]">Año +5 (2030)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-xs">
              {MEDIA_METADATA.map((med) => {
                // Get 2025 base value
                const baseVal = getMediumInvestment(HISTORICAL_DATA[HISTORICAL_DATA.length - 1], med.id);
                const totalBase = HISTORICAL_DATA[HISTORICAL_DATA.length - 1].totalInv;
                const baseShare = baseVal / totalBase;

                // Get projected values
                const p1 = activeProjections[0];
                const p2 = activeProjections[1];
                const p3 = activeProjections[2];
                const p4 = activeProjections[3];
                const p5 = activeProjections[4];

                return (
                  <tr key={med.id} className="hover:bg-[#151515] transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: med.color }} />
                      <span>{med.label}</span>
                    </td>
                    <td className="py-3.5 text-right font-medium">
                      {renderTableCellValue(baseVal, baseShare)}
                    </td>
                    <td className="py-3.5 text-right bg-[#151515]/20">
                      {renderTableCellValue(p1.investments[med.id], p1.shares[med.id])}
                    </td>
                    <td className="py-3.5 text-right bg-[#151515]/20">
                      {renderTableCellValue(p2.investments[med.id], p2.shares[med.id])}
                    </td>
                    <td className="py-3.5 text-right bg-[#151515]/20">
                      {renderTableCellValue(p3.investments[med.id], p3.shares[med.id])}
                    </td>
                    <td className="py-3.5 text-right bg-[#151515]/20">
                      {renderTableCellValue(p4.investments[med.id], p4.shares[med.id])}
                    </td>
                    <td className="py-3.5 text-right bg-[#151515]/20">
                      {renderTableCellValue(p5.investments[med.id], p5.shares[med.id])}
                    </td>
                  </tr>
                );
              })}

              {/* Total projected row */}
              <tr className="bg-[#181818] border-t-2 border-[#333] font-semibold text-white">
                <td className="py-3.5 pl-2 font-bold text-white">Total Consolidado Proyectado</td>
                <td className="py-3.5 text-right">
                  {renderTableCellValue(HISTORICAL_DATA[HISTORICAL_DATA.length - 1].totalInv, 1.0)}
                </td>
                <td className="py-3.5 text-right bg-[#222222]/30">
                  {renderTableCellValue(activeProjections[0].totalInvestments, 1.0)}
                </td>
                <td className="py-3.5 text-right bg-[#222222]/30">
                  {renderTableCellValue(activeProjections[1].totalInvestments, 1.0)}
                </td>
                <td className="py-3.5 text-right bg-[#222222]/30">
                  {renderTableCellValue(activeProjections[2].totalInvestments, 1.0)}
                </td>
                <td className="py-3.5 text-right bg-[#222222]/30">
                  {renderTableCellValue(activeProjections[3].totalInvestments, 1.0)}
                </td>
                <td className="py-3.5 text-right bg-[#222222]/30">
                  {renderTableCellValue(activeProjections[4].totalInvestments, 1.0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
