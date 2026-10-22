import { TrendingUp, TrendingDown, Landmark, RefreshCw, Radio as RadioIcon, Monitor, Percent, ShoppingBag } from 'lucide-react';
import { getMetrics } from '../utils/projections';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface KpiSectionProps {
  metrics: ReturnType<typeof getMetrics>;
}

export default function KpiSection({ metrics }: KpiSectionProps) {
  const {
    totalLast,
    totalGrowth,
    totalAbsoluteDiff,
    maxInvestmentMediaName,
    maxInvestmentValue,
    maxGrowthMediaName,
    maxGrowthValue,
    shareDigital,
    shareRadio,
    shareTvNac,
    lastYear
  } = metrics;

  const kpis = [
    {
      id: 'kpi-total-inv',
      title: `Inversión Total (${lastYear})`,
      value: formatCurrency(totalLast),
      icon: Landmark,
      color: 'border-l-[#333] text-white bg-[#141414]',
      iconColor: 'text-slate-400',
      description: 'Inversión publicitaria agregada anual auditada.',
    },
    {
      id: 'kpi-growth-inv',
      title: 'Crecimiento de Mercado',
      value: formatPercent(totalGrowth),
      icon: totalGrowth >= 0 ? TrendingUp : TrendingDown,
      color: totalGrowth >= 0 ? 'border-l-green-500 text-white bg-[#141414]' : 'border-l-rose-500 text-white bg-[#141414]',
      iconColor: totalGrowth >= 0 ? 'text-green-400' : 'text-rose-400',
      description: 'Variación relativa frente al periodo anterior.',
      isTrend: true,
      trendValue: totalGrowth
    },
    {
      id: 'kpi-abs-change',
      title: 'Fluctuación Absoluta',
      value: formatCurrency(totalAbsoluteDiff),
      icon: RefreshCw,
      color: totalAbsoluteDiff >= 0 ? 'border-l-blue-500 text-white bg-[#141414]' : 'border-l-rose-500 text-white bg-[#141414]',
      iconColor: totalAbsoluteDiff >= 0 ? 'text-blue-400' : 'text-rose-400',
      description: 'Flujo neto de capital de marketing inyectado.',
    },
    {
      id: 'kpi-max-volume',
      title: 'Líder de Inversión',
      value: maxInvestmentMediaName,
      icon: ShoppingBag,
      color: 'border-l-blue-500 text-white bg-[#141414]',
      iconColor: 'text-blue-400',
      description: `Medio con mayor presupuesto (${formatCurrency(maxInvestmentValue)})`,
    },
    {
      id: 'kpi-max-growth',
      title: 'Medio Revelación',
      value: maxGrowthMediaName,
      icon: TrendingUp,
      color: 'border-l-purple-500 text-white bg-[#141414]',
      iconColor: 'text-purple-400',
      description: `Mayor aceleración de mercado (+${formatPercent(maxGrowthValue)})`,
    },
    {
      id: 'kpi-share-digital',
      title: 'Penetración Digital (Share)',
      value: formatPercent(shareDigital),
      icon: Percent,
      color: 'border-l-blue-500 text-white bg-[#141414]',
      iconColor: 'text-blue-400',
      description: 'Participación acumulada sobre el total publicitario.',
    },
    {
      id: 'kpi-share-radio',
      title: 'Penetración Radio (Share)',
      value: formatPercent(shareRadio),
      icon: RadioIcon,
      color: 'border-l-amber-500 text-white bg-[#141414]',
      iconColor: 'text-amber-400',
      description: 'Sostenibilidad del medio radiofónico sobre inversionistas.',
    },
    {
      id: 'kpi-share-tvnac',
      title: 'Penetración TV Nac (Share)',
      value: formatPercent(shareTvNac),
      icon: Monitor,
      color: 'border-l-indigo-500 text-white bg-[#141414]',
      iconColor: 'text-indigo-400',
      description: 'Participación de la televisión abierta nacional.',
    }
  ];

  return (
    <section id="kpi-section" className="mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xs font-semibold text-[#666] uppercase tracking-widest font-mono">
          Indicadores de Desempeño Ejecutivo (KPIs)
        </h2>
        <span className="text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded font-mono">
          Comparativa Anual {lastYear - 1} vs {lastYear}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              id={kpi.id}
              key={kpi.id}
              className={`executive-card border border-[#222] border-l-4 p-4 flex flex-col justify-between ${kpi.color}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] uppercase font-mono tracking-wider text-[#888] leading-tight">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 shrink-0 ${kpi.iconColor}`} />
              </div>
              
              <div className="mt-3">
                <span className="text-2xl font-bold font-display tracking-tight text-white leading-none block">
                  {kpi.value}
                </span>
                <span className="text-[10px] text-[#666] mt-1.5 block leading-tight">
                  {kpi.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
