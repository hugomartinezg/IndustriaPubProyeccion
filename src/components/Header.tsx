import { Activity, BookOpen, Layers, LineChart, ShieldAlert, Award, FileDown, Mail } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport?: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenExport }: HeaderProps) {
  const navItems = [
    { id: 'summary', label: 'Resumen Ejecutivo', icon: Activity },
    { id: 'trends', label: 'Evolución Histórica', icon: LineChart },
    { id: 'shares', label: 'Participación (Share)', icon: Layers },
    { id: 'rankings', label: 'Matriz & Rankings', icon: Award },
    { id: 'projections', label: 'Simulador 5P', icon: ShieldAlert },
    { id: 'methodology', label: 'Metodología', icon: BookOpen },
  ];

  return (
    <header id="app-header" className="bg-[#0A0A0A] text-[#E0E0E0] border-b border-[#222] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                Consultoría Senior en Analítica de Medios
              </span>
              <span className="text-slate-500 text-xs font-medium">| Reporte Ejecutivo 1995-2025</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white mt-1.5">
              AD-INVEST <span className="text-blue-500 font-extrabold">PRO-INSIGHT</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 max-w-2xl">
              Análisis cuantitativo de evolución histórica (1995-2025) y simulación de 5 periodos bajo tres escenarios independientes de variables exógenas.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 border-t border-[#222] md:border-0 pt-3 md:pt-0">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] text-[#666] uppercase font-mono tracking-wider">Periodo de Análisis</span>
              <span className="text-xs font-medium text-blue-400 font-display">1995 — 2030 (Proy.)</span>
            </div>
            <div className="h-8 w-px bg-[#333] hidden sm:block"></div>
            
            {/* Export HTML Button */}
            {onOpenExport && (
              <button
                id="btn-export-html-header"
                onClick={onOpenExport}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-xs hover:shadow-blue-900/20 cursor-pointer"
                title="Exportar dashboard en HTML para compartir en correo"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Exportar HTML / Correo</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <nav className="flex overflow-x-auto scrollbar-none border-t border-[#222] -mx-4 px-4 sm:mx-0 sm:px-0 bg-[#0A0A0A]">
          <ul className="flex space-x-1 py-1 mt-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-medium rounded-t-lg transition-all duration-150 border-b-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#141414] text-white border-blue-500'
                        : 'text-[#888] border-transparent hover:text-white hover:bg-[#141414]/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
