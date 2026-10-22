/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import Header from './components/Header';
import KpiSection from './components/KpiSection';
import HistoricalSection from './components/HistoricalSection';
import ShareSection from './components/ShareSection';
import RankingSection from './components/RankingSection';
import ProjectionSection from './components/ProjectionSection';
import InsightsSection from './components/InsightsSection';
import MethodologySection from './components/MethodologySection';
import ExportReportModal from './components/ExportReportModal';
import { getMetrics } from './utils/projections';
import { ExportScope } from './utils/htmlExporter';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportInitialScope, setExportInitialScope] = useState<ExportScope>('all');

  // Memoize metric values so they are stable
  const metrics = useMemo(() => getMetrics(), []);

  const handleOpenExport = (scope?: ExportScope) => {
    setExportInitialScope(scope || (activeTab as ExportScope) || 'all');
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-between">
      <div>
        {/* Navigation Executive Bar with Export HTML Trigger */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenExport={() => handleOpenExport((activeTab as ExportScope) || 'all')}
        />

        {/* Dashboard Frame */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          
          {/* Always show KPIs on simple dashboards, or tab-specifically */}
          <KpiSection metrics={metrics} />

          {/* Tab Render Selection */}
          <div className="mt-8 transition-all duration-300">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <InsightsSection 
                  metrics={metrics} 
                  onOpenExport={() => handleOpenExport('summary')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Small callouts of historical and projections to drive action */}
                  <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs">
                    <h3 className="font-display font-semibold text-white text-sm mb-2">Evolución Cronológica</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Explore el comportamiento de todos los medios publicitarios con controles interactivos de rango y selector de variables individuales.
                    </p>
                    <button
                      onClick={() => setActiveTab('trends')}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Avanzar a Gráficos de Tendencias →
                    </button>
                  </div>
                  <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs">
                    <h3 className="font-display font-semibold text-white text-sm mb-2">Simulador Predictivo</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Simule proyecciones para los próximos 5 años bajo tres escenarios estadísticos independientes sin interferencia macroeconómica.
                    </p>
                    <button
                      onClick={() => setActiveTab('projections')}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Avanzar al Simulador 5P →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trends' && <HistoricalSection />}

            {activeTab === 'shares' && <ShareSection />}

            {activeTab === 'rankings' && <RankingSection />}

            {activeTab === 'projections' && <ProjectionSection />}

            {activeTab === 'methodology' && <MethodologySection />}
          </div>
        </main>
      </div>

      {/* Export HTML Report Modal */}
      <ExportReportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        initialScope={exportInitialScope}
      />

      {/* Footer credits and safety badges */}
      <footer className="bg-slate-950 text-slate-500 py-6 border-t border-slate-900 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="font-display font-bold text-slate-300 text-sm block">Cuadro de Mando Ejecutivo</span>
              <span className="text-[10px]">Estructurado estrictamente sobre Variables Puras de Inversión. Sin variables externas.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={() => handleOpenExport('all')}
                className="hover:text-blue-400 transition-colors text-[11px] underline cursor-pointer"
              >
                Exportar Todo el Documento (.html)
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenExport('summary')}
                className="hover:text-blue-400 transition-colors text-[11px] underline cursor-pointer"
              >
                Exportar Hoja Resumen (.html)
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
