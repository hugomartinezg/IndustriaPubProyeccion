import { BookOpen, BookCheck, ClipboardList, ShieldAlert, CheckCircle } from 'lucide-react';

export default function MethodologySection() {
  return (
    <section id="methodology-section" className="space-y-6">
      
      {/* Visual documentation banner */}
      <div className="bg-[#111111] text-white rounded-xl p-6 shadow-xs border border-[#222222]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h3 className="font-display font-semibold text-white text-lg">Marco Metodológico y Auditoría de Fórmulas</h3>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Este informe metodológico detalla la fundamentación estadística del cuadro de mando. Su diseño sigue las directrices del Comité de Auditoría y Planeación de Medios, priorizando la consistencia interna (análisis por serie temporal pura) y prohibiendo la correlación analógica con conductores de volatilidad exógena como el IPC, el Índice de Tipo de Cambio (TRM) o el crecimiento general de la población.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Mathematical Fomulas Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2.5">
            <BookCheck className="w-4 h-4 text-green-400" />
            <h4 className="font-display font-bold text-white text-sm">Fórmulas Clave Sugeridas y Aplicadas</h4>
          </div>

          <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
            <div>
              <span className="font-mono font-semibold text-blue-400 block mb-1">
                A. Participación por Medio (Market Share/Torta):
              </span>
              <p className="p-2 bg-[#181818] border border-[#333] rounded font-mono text-[11px] text-slate-300">
                Participación Medio = Inversión Medio / TOTAL_INV
              </p>
              <p className="mt-1 text-slate-500 font-sans text-[11px]">
                Evalúa la influencia presupuestaria instantánea de un formato individual sobre los desembolsos acumulados de los contratistas.
              </p>
            </div>

            <div>
              <span className="font-mono font-semibold text-blue-400 block mb-1">
                B. Crecimiento YoY y Variación Absoluta:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 bg-[#181818] border border-[#333] rounded font-mono text-[11px] text-slate-300">
                  Crecimiento = (Inv.Actual / Inv.Anterior) - 1
                </div>
                <div className="p-2 bg-[#181818] border border-[#333] rounded font-mono text-[11px] text-slate-300">
                  Var.Absoluta = Inv.Actual - Inv.Anterior
                </div>
              </div>
            </div>

            <div>
              <span className="font-mono font-semibold text-blue-400 block mb-1">
                C. Crecimiento Ponderado de Base Histórica de 5 Periodos:
              </span>
              <p className="p-2.5 bg-[#181818] border border-[#333] rounded font-mono text-[10px] text-slate-300 whitespace-pre-line leading-relaxed">
                Crecimiento Ponderado = 
                Crecimiento t-1 * 40% +
                Crecimiento t-2 * 25% +
                Crecimiento t-3 * 20% +
                Crecimiento t-4 * 10% +
                Crecimiento t-5 * 5%
              </p>
              <p className="mt-1 text-slate-500 font-sans text-[11px]">
                Esta fórmula de decaimiento logarítmico otorga una influencia dominante del 65% a los últimos 2 periodos (t-1, t-2), manteniendo representatividad adaptativa de ciclos de planificación previos sin sobreestimarlos.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Alerts & Structural Insights Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h4 className="font-display font-bold text-white text-sm">Alertas del Comité y Hallazgos del Comportamiento</h4>
          </div>

          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            {/* Insight 1 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white font-semibold block">La Revolución Digital Unidireccional:</strong>
                <p className="text-slate-400 mt-0.5 font-sans leading-normal">
                  El canal <strong className="text-blue-400 font-semibold">Digital</strong> inició formalmente en 2008 con un volumen secundario de $40.601,0 MM (2% del share). Para fines del 2025, alcanza la cifra récord de <strong className="text-white">$3.066.685,3 MM</strong> (59.6% del total). Su tasa de crecimiento ponderado en el escenario Base se sitúa en <strong className="text-green-400">+12,1% anual</strong>, consolidándolo como el motor absoluto de absorción de inversiones.
                </p>
              </div>
            </div>

            {/* Insight 2 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white font-semibold block">Resiliencia Estructural de Medios Clásicos:</strong>
                <p className="text-slate-400 mt-0.5 font-sans leading-normal">
                  A diferencia de la prensa escrita, formatos tradicionales como la <strong className="text-blue-400 font-semibold">Radio</strong> y la <strong className="text-blue-400 font-semibold">Publicidad Exterior</strong> muestran una resiliencia remarcable. Publicidad Exterior duplicó su participación de share en la última década, mientras que Radio retiene un volumen saludable de $560.706,3 MM gracias a su alta penetración comunitaria.
                </p>
              </div>
            </div>

            {/* Insight 3 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white font-semibold block">Agotamiento de Papel Impreso:</strong>
                <p className="text-slate-400 mt-0.5 font-sans leading-normal">
                  Los formatos de <strong className="text-white font-semibold">Revistas</strong> y <strong className="text-white font-semibold">Prensa</strong> declinan de manera continua e irreversible. Revistas registra un decrecimiento acumulado interanual drástico en 2025 (-20,6%), pasando de un máximo de $118.890,0 MM de inversión en 2007 a solo $6.839,0 MM en 2025. Los modelos predictivos prevén una pérdida virtual total de participación hacia el año 2030 (menos de 0,1% del share).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Architecture Card */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2.5">
          <ClipboardList className="w-4 h-4 text-blue-400" />
          <h4 className="font-display font-semibold text-white text-sm">Arquitectura Operativa del Cuadro de Mando</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-3 bg-[#141414] rounded-lg border border-[#222]">
            <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Nivel I: Diagnóstico Rápido</span>
            </span>
            <p className="text-[#888] leading-normal text-[11px]">
              Agrupa los 8 KPIs principales en tarjetas ejecutivas de alto impacto visual con variaciones porcentuales automáticas para consulta en juntas directivas.
            </p>
          </div>

          <div className="p-3 bg-[#141414] rounded-lg border border-[#222]">
            <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Nivel II: Trayectoria Cronológica</span>
            </span>
            <p className="text-[#888] leading-normal text-[11px]">
              Usa motores gráficos interactivos (Líneas y Áreas apiladas) para contrastar visualizaciones de mercado de largo plazo sobre el total de inversiones o participación de share.
            </p>
          </div>

          <div className="p-3 bg-[#141414] rounded-lg border border-[#222]">
            <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Nivel III: Escenarios Predictivos</span>
            </span>
            <p className="text-[#888] leading-normal text-[11px]">
              Tabulaciones del simulador de 5 periodos (2026-2030) detallando dispersión técnica para planes financieros bajo comportamiento Base, Conservador u Optimista.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
