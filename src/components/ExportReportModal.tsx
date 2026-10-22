import { useState, useMemo } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Mail, 
  FileCode, 
  Eye, 
  Share2, 
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  LineChart,
  PieChart,
  Award,
  ShieldAlert,
  BookOpen,
  Printer,
  Package
} from 'lucide-react';
import { 
  ExportScope, 
  SCOPE_OPTIONS, 
  generateScopedHtmlReport, 
  generateScopedEmailHtml, 
  downloadScopedHtmlFile 
} from '../utils/htmlExporter';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScope?: ExportScope;
}

export default function ExportReportModal({ isOpen, onClose, initialScope = 'all' }: ExportReportModalProps) {
  const [selectedScope, setSelectedScope] = useState<ExportScope>(initialScope);
  const [activeFormat, setActiveFormat] = useState<'standalone' | 'email_body'>('standalone');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const currentScopeObj = useMemo(() => {
    return SCOPE_OPTIONS.find(s => s.id === selectedScope) || SCOPE_OPTIONS[0];
  }, [selectedScope]);

  const currentHtmlContent = useMemo(() => {
    if (activeFormat === 'standalone') {
      return generateScopedHtmlReport(selectedScope);
    } else {
      return generateScopedEmailHtml(selectedScope);
    }
  }, [selectedScope, activeFormat]);

  if (!isOpen) return null;

  const handleCopy = (type: string) => {
    navigator.clipboard.writeText(currentHtmlContent);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleDownloadSingle = () => {
    downloadScopedHtmlFile(selectedScope);
    setCopiedType('download-single');
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleDownloadAllSheets = () => {
    // Download all 6 individual sheets plus the master document sequentially
    const scopesToDownload: ExportScope[] = ['all', 'summary', 'trends', 'shares', 'rankings', 'projections', 'methodology'];
    scopesToDownload.forEach((sc, idx) => {
      setTimeout(() => {
        downloadScopedHtmlFile(sc);
      }, idx * 250);
    });
    setCopiedType('download-all');
    setTimeout(() => {
      setCopiedType(null);
    }, 3500);
  };

  const handlePrintPreview = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(currentHtmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  const getScopeIcon = (scopeId: ExportScope) => {
    switch (scopeId) {
      case 'all': return Layers;
      case 'summary': return Activity;
      case 'trends': return LineChart;
      case 'shares': return PieChart;
      case 'rankings': return Award;
      case 'projections': return ShieldAlert;
      case 'methodology': return BookOpen;
      default: return Layers;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-[#111111] border border-[#262626] w-full max-w-5xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-base text-white">
                  Exportar Proyecto o Hojas en HTML
                </h3>
                <span className="text-[10px] bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                  Multi-Hoja & Master
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Seleccione si desea exportar una hoja individual o todo el proyecto consolidado para descargar en .html o enviar por correo.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#222222] rounded-lg transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Scope Selector (Select Sheet or All Document) */}
        <div className="px-6 py-3 border-b border-[#222222] bg-[#0c0c0c]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>1. Seleccione el Alcance a Exportar:</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Vista activa: <strong className="text-white">{currentScopeObj.shortTitle}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {SCOPE_OPTIONS.map((opt) => {
              const IconComp = getScopeIcon(opt.id);
              const isSelected = selectedScope === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedScope(opt.id)}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-xs' 
                      : 'bg-[#161616] border-[#222222] text-slate-400 hover:bg-[#1f1f1f] hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    {opt.id === 'all' && (
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded font-mono font-bold">
                        FULL
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {opt.shortTitle}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Format Selector & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-[#222222] bg-[#141414]">
          {/* Format pills */}
          <div className="flex items-center gap-1 bg-[#1c1c1c] p-1 rounded-lg border border-[#262626]">
            <button
              onClick={() => setActiveFormat('standalone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeFormat === 'standalone'
                  ? 'bg-[#2a2a2a] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Archivo .HTML Autónomo (Adjunto / Navegador)</span>
            </button>

            <button
              onClick={() => setActiveFormat('email_body')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeFormat === 'email_body'
                  ? 'bg-[#2a2a2a] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-green-400" />
              <span>Cuerpo de Email (HTML Inline)</span>
            </button>
          </div>

          {/* Action trigger buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => handleCopy('copy-code')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-slate-200 border border-[#333] rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Copiar código HTML generado al portapapeles"
            >
              {copiedType === 'copy-code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar HTML</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrintPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-slate-200 border border-[#333] rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Abrir en ventana nueva para imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleDownloadSingle}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              title="Descargar archivo HTML de la hoja o proyecto seleccionado"
            >
              {copiedType === 'download-single' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>¡Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar {selectedScope === 'all' ? 'Proyecto (.html)' : 'Hoja (.html)'}</span>
                </>
              )}
            </button>

            {selectedScope !== 'all' && (
              <button
                onClick={handleDownloadAllSheets}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] border border-[#333] text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Descarga todas las 6 hojas individuales y el archivo consolidado"
              >
                {copiedType === 'download-all' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">¡Descargando paquete!</span>
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5 text-blue-400" />
                    <span>Descargar Todas las Hojas</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content & Live Preview Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {/* Guide tip banner */}
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">Alcance seleccionado: {currentScopeObj.title}</strong> — {currentScopeObj.description}
            </div>
          </div>

          {/* Preview Section Frame */}
          <div className="border border-[#222222] rounded-lg overflow-hidden bg-[#0a0a0a]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-[#222222] text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Vista Previa Interactiva del Archivo HTML</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-[#222] px-2 py-0.5 rounded">
                {activeFormat === 'standalone' ? 'Formato Documento Autónomo (Dark Executive)' : 'Formato Plantilla Email (Tablas Universales)'}
              </span>
            </div>

            <div className="p-1 bg-black/40 min-h-[360px] max-h-[440px] overflow-y-auto">
              <iframe
                title="Preview HTML Export"
                srcDoc={currentHtmlContent}
                className="w-full min-h-[420px] rounded border-0 bg-white"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#222222] bg-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Todos los archivos exportados contienen series temporales puras de inversión sin variables macroeconómicas exógenas.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white rounded-lg transition-colors cursor-pointer text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
