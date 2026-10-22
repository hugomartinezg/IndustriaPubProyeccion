import { Sparkles, TrendingUp, TrendingDown, RefreshCw, Layers, Mail, Download } from 'lucide-react';
import { getMetrics } from '../utils/projections';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface InsightsSectionProps {
  metrics: ReturnType<typeof getMetrics>;
  onOpenExport?: () => void;
}

export default function InsightsSection({ metrics, onOpenExport }: InsightsSectionProps) {
  const { maxInvestmentValue, maxInvestmentMediaName, shareDigital, totalLast } = metrics;

  return (
    <section id="insights-section" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Call-to-action Executive Assessment */}
        <div className="lg:col-span-2 bg-[#141414] text-[#E0E0E0] rounded-xl p-6 shadow-sm border border-[#222] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-display font-semibold text-white text-lg">Resumen de Situación y Recomendaciones Directivas</h3>
              </div>
              {onOpenExport && (
                <button
                  onClick={onOpenExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Exportar HTML</span>
                </button>
              )}
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              El mercado de inversión publicitaria consolidado al cierre de 2025 alcanza la cifra de <strong className="text-blue-400 font-bold">{formatCurrency(totalLast)}</strong>. El análisis histórico de nuestra base de datos revela que nos encontramos en la cúspide de una transformación estructural definitiva. Los canales clásicos han cedido formalmente la hegemonía del alcance de audiencias.
            </p>
            
            <ul className="text-xs text-slate-350 space-y-3">
              <li className="flex gap-2.5 items-start">
                <span className="bg-blue-500/20 text-blue-400 font-mono font-bold rounded w-5 h-5 text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">1</span>
                <span>
                  <strong className="text-white">Hacia un ecosistema Digital-First:</strong> Con un share consolidado de <strong className="text-blue-400">{formatPercent(shareDigital)}</strong>, las estrategias de captación deben centrarse en digitalizar campañas e integrar modelado atributivo robusto.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="bg-blue-500/20 text-blue-400 font-mono font-bold rounded w-5 h-5 text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">2</span>
                <span>
                  <strong className="text-white">Reorganización de presupuestos impresos:</strong> Revistas y Prensa presentan retornos de inversión marginales. Se sugiere la desconexión paulatina de estos canales y la migración de presupuestos hacia publicidad exterior digital (DOOH).
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="bg-blue-500/20 text-blue-400 font-mono font-bold rounded w-5 h-5 text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">3</span>
                <span>
                  <strong className="text-white">Consolidar Televisión Abierta como cobertura de masa:</strong> La TV Nacional sigue siendo el segundo jugador con mayor volumen físico de dinero. Debe conservarse específicamente para esfuerzos de branding de alto impacto en lanzamientos.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#222] text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>* Elaborado por el Consultor de Analítica de Medios para Presidencia y Juntas Comerciales.</span>
            {onOpenExport && (
              <button
                onClick={onOpenExport}
                className="text-blue-400 hover:text-blue-300 underline font-sans cursor-pointer"
              >
                Generar reporte para envío por correo →
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights card */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-white tracking-wide text-sm mb-4">
              Radiografía del Portafolio Actual (2025)
            </h4>
            
            <div className="space-y-4">
              {/* Highlight Digital */}
              <div className="border-b border-[#222] pb-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Digital
                  </span>
                  <span className="font-mono font-semibold text-blue-400">{formatPercent(shareDigital)} share</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full mt-2">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${shareDigital * 100}%` }} />
                </div>
              </div>

              {/* Highlight TV Nacional */}
              <div className="border-b border-[#222] pb-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    TV Nacional
                  </span>
                  <span className="font-mono font-semibold text-slate-400">17,68% share</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full mt-2">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `17.68%` }} />
                </div>
              </div>

              {/* Highlight Radio */}
              <div className="border-b border-[#222] pb-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Radio
                  </span>
                  <span className="font-mono font-semibold text-slate-400">10,91% share</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `10.91%` }} />
                </div>
              </div>

              {/* Highlight Pub Exterior */}
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Pub. Exterior
                  </span>
                  <span className="font-mono font-semibold text-slate-400">6,40% share</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full mt-2">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `6.40%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-950/20 rounded-lg border border-blue-500/15 text-[11px] text-slate-400 mt-4 leading-normal font-mono">
            El <strong className="text-white">{maxInvestmentMediaName}</strong> lidera con <span className="text-blue-400 font-bold">{formatCurrency(maxInvestmentValue)}</span>.
          </div>
        </div>
      </div>
    </section>
  );
}
