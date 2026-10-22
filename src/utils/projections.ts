import { HISTORICAL_DATA, MEDIA_METADATA } from '../data';
import { MediaDataPoint, ProjectionPoint, ProjectionsByScenario, Scenarios } from '../types';

// Helper to get raw investment of a medium for a specific year
export function getMediumInvestment(point: MediaDataPoint, id: string): number {
  switch (id) {
    case 'digital': return point.digital ?? 0;
    case 'tvNacional': return point.tvNacional ?? 0;
    case 'radio': return point.radio ?? 0;
    case 'pubExterior': return point.pubExterior ?? 0;
    case 'prensa': return point.prensa ?? 0;
    case 'tvRegLocal': return point.tvRegLocal ?? 0;
    case 'revistas': return point.revistas ?? 0;
    default: return 0;
  }
}

// Calculate sum of only the media for safety
export function getSumOfMedia(point: MediaDataPoint): number {
  return (
    (point.digital ?? 0) +
    (point.tvNacional ?? 0) +
    (point.radio ?? 0) +
    (point.pubExterior ?? 0) +
    (point.prensa ?? 0) +
    (point.tvRegLocal ?? 0) +
    (point.revistas ?? 0)
  );
}

// Calculate year-over-year growths for a medium
export function getHistoricalYoYGrowths(mediumId: string): { year: number; growth: number }[] {
  const list: { year: number; growth: number }[] = [];
  for (let i = 1; i < HISTORICAL_DATA.length; i++) {
    const prev = getMediumInvestment(HISTORICAL_DATA[i - 1], mediumId);
    const curr = getMediumInvestment(HISTORICAL_DATA[i], mediumId);
    
    // Only calculate growth if both periods have valid positive values
    if (prev > 0 && curr > 0) {
      const growth = (curr / prev) - 1;
      list.push({ year: HISTORICAL_DATA[i].year, growth });
    }
  }
  return list;
}

// Calculate the formulas from the prompt
export function calculateWeightedGrowthRate(mediumId: string): number {
  const growths = getHistoricalYoYGrowths(mediumId);
  if (growths.length < 5) {
    // If we don't have 5 periods, just average what we have
    if (growths.length === 0) return 0;
    const sum = growths.reduce((acc, g) => acc + g.growth, 0);
    return sum / growths.length;
  }

  // Get the last 5 periods (t-1 is the most recent)
  const last5 = growths.slice(-5); // returns index [len-5, len-4, len-3, len-2, len-1]
  
  const gt1 = last5[4].growth; // t-1 (last year available, e.g. 2025 vs 2024)
  const gt2 = last5[3].growth; // t-2 (2024 vs 2023)
  const gt3 = last5[2].growth; // t-3
  const gt4 = last5[1].growth; // t-4
  const gt5 = last5[0].growth; // t-5

  // Crecimiento Ponderado = Crecimiento t-1 * 40% + Crecimiento t-2 * 25% + Crecimiento t-3 * 20% + Crecimiento t-4 * 10% + Crecimiento t-5 * 5%
  const weighted = (gt1 * 0.40) + (gt2 * 0.25) + (gt3 * 0.20) + (gt4 * 0.10) + (gt5 * 0.05);
  return weighted;
}

export function calculateConservadorGrowthRate(mediumId: string): number {
  const growths = getHistoricalYoYGrowths(mediumId);
  if (growths.length < 3) {
    if (growths.length === 0) return 0;
    const sum = growths.reduce((acc, g) => acc + g.growth, 0);
    return sum / growths.length;
  }
  
  // Last 3 periods: t-1, t-2, t-3
  const last3 = growths.slice(-3);
  const avgGrowths = last3.reduce((acc, g) => acc + g.growth, 0) / 3;

  // Smoothing/limits for conservative scenario (avoid sharp climbs, pull slightly closer to 0 or negative if declining)
  let smoothed = avgGrowths;
  if (smoothed > 0) {
    smoothed = smoothed * 0.8; // Dampen positive growth in conservative scenario
  } else {
    smoothed = smoothed * 1.1; // Intensify drop or maintain slightly pessimistic view
  }

  // Absolute fallback limits to avoid compounding out of control
  return Math.max(-0.25, Math.min(0.12, smoothed));
}

export function calculateOptimistaGrowthRate(mediumId: string): number {
  const baseRate = calculateWeightedGrowthRate(mediumId);
  const growths = getHistoricalYoYGrowths(mediumId);
  
  if (growths.length === 0) return 0;
  
  // Recent 2 periods trend
  const lastYearGrowth = growths[growths.length - 1].growth;
  
  // If recent performance is very strong, use it but smoothed, else give a premium on baseRate
  let optimistaRate = baseRate;
  if (lastYearGrowth > baseRate) {
    // Media performance improves, take a blend of lastYearGrowth and baseRate
    optimistaRate = (lastYearGrowth * 0.4) + (baseRate * 0.6);
  } else {
    // Standard optimistic premium (+2.5% for digital, +1.5% for others)
    const premium = mediumId === 'digital' ? 0.025 : 0.015;
    optimistaRate = baseRate + premium;
  }

  // Smooth extremes
  if (optimistaRate > 0.22) {
    optimistaRate = 0.20; // Cap single-year positive growth to 20% to represent executive realism
  }
  if (optimistaRate < -0.15) {
    optimistaRate = -0.10; // Soften extreme drops in optimistic scenario
  }

  return optimistaRate;
}

// Generate the full 5-period projections
export function generateProjections(): ProjectionsByScenario {
  const lastYearPoint = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const lastYear = lastYearPoint.year; // 2025
  
  const mediaKeys = MEDIA_METADATA.map(m => m.id);
  
  // Calculate specific annual growth rates for each medium across scenarios
  const growthRates: Record<Scenarios, Record<string, number>> = {
    conservador: {},
    base: {},
    optimista: {}
  };

  mediaKeys.forEach(id => {
    growthRates.conservador[id] = calculateConservadorGrowthRate(id);
    growthRates.base[id] = calculateWeightedGrowthRate(id);
    growthRates.optimista[id] = calculateOptimistaGrowthRate(id);
  });

  const runProjectionForScenario = (scenario: Scenarios): ProjectionPoint[] => {
    const list: ProjectionPoint[] = [];
    
    // Start with values from last available year 2025
    let currentInvestments = {
      digital: getMediumInvestment(lastYearPoint, 'digital'),
      tvNacional: getMediumInvestment(lastYearPoint, 'tvNacional'),
      radio: getMediumInvestment(lastYearPoint, 'radio'),
      pubExterior: getMediumInvestment(lastYearPoint, 'pubExterior'),
      prensa: getMediumInvestment(lastYearPoint, 'prensa'),
      tvRegLocal: getMediumInvestment(lastYearPoint, 'tvRegLocal'),
      revistas: getMediumInvestment(lastYearPoint, 'revistas')
    };

    for (let p = 1; p <= 5; p++) {
      const year = lastYear + p;
      const nextInvestments = { ...currentInvestments };

      // Apply compounding growth to each medium
      mediaKeys.forEach(id => {
        const rate = growthRates[scenario][id];
        const val = currentInvestments[id as keyof typeof currentInvestments];
        // Ensure values don't go below 0
        nextInvestments[id as keyof typeof currentInvestments] = Math.max(0, val * (1 + rate));
      });

      // Total projected is sum of projected media
      const totalInvestments = Object.values(nextInvestments).reduce((sum, val) => sum + val, 0);

      // Save record
      const shares = {} as Record<keyof Omit<MediaDataPoint, 'year' | 'totalInv'>, number>;
      mediaKeys.forEach(id => {
        const val = nextInvestments[id as keyof typeof nextInvestments];
        shares[id as keyof typeof shares] = totalInvestments > 0 ? (val / totalInvestments) : 0;
      });

      list.push({
        year,
        investments: nextInvestments,
        totalInvestments,
        shares
      });

      // Advance one step
      currentInvestments = nextInvestments;
    }

    return list;
  };

  return {
    conservador: runProjectionForScenario('conservador'),
    base: runProjectionForScenario('base'),
    optimista: runProjectionForScenario('optimista')
  };
}

// Get standard metrics and KPIs
export function getMetrics() {
  const len = HISTORICAL_DATA.length;
  const lastPoint = HISTORICAL_DATA[len - 1]; // 2025
  const prevPoint = HISTORICAL_DATA[len - 2]; // 2024

  const totalLast = lastPoint.totalInv;
  const totalPrev = prevPoint.totalInv;
  
  // 1. Crecimiento anual de la inversión total
  const totalGrowth = (totalLast / totalPrev) - 1;
  const totalAbsoluteDiff = totalLast - totalPrev;

  // Find medium with highest investment in 2025
  let maxInvestmentMediaId = '';
  let maxInvestmentValue = -1;
  MEDIA_METADATA.forEach(m => {
    const val = getMediumInvestment(lastPoint, m.id);
    if (val > maxInvestmentValue) {
      maxInvestmentValue = val;
      maxInvestmentMediaId = m.id;
    }
  });
  const maxInvestmentMediaName = MEDIA_METADATA.find(m => m.id === maxInvestmentMediaId)?.label ?? '';

  // Find medium with highest percentage growth recently (2024 to 2025)
  let maxGrowthMediaId = '';
  let maxGrowthValue = -Infinity;
  MEDIA_METADATA.forEach(m => {
    const prevVal = getMediumInvestment(prevPoint, m.id);
    const currVal = getMediumInvestment(lastPoint, m.id);
    if (prevVal > 0) {
      const g = (currVal / prevVal) - 1;
      if (g > maxGrowthValue) {
        maxGrowthValue = g;
        maxGrowthMediaId = m.id;
      }
    }
  });
  const maxGrowthMediaName = MEDIA_METADATA.find(m => m.id === maxGrowthMediaId)?.label ?? '';

  // Share values for key media in 2025
  const shareDigital = (getMediumInvestment(lastPoint, 'digital') / totalLast);
  const shareRadio = (getMediumInvestment(lastPoint, 'radio') / totalLast);
  const shareTvNac = (getMediumInvestment(lastPoint, 'tvNacional') / totalLast);

  // Return formatted results
  return {
    totalLast,
    totalPrev,
    totalGrowth,
    totalAbsoluteDiff,
    maxInvestmentMediaName,
    maxInvestmentValue,
    maxGrowthMediaName,
    maxGrowthValue,
    shareDigital,
    shareRadio,
    shareTvNac,
    lastYear: lastPoint.year
  };
}

// Build the complete growth matrix
export interface GrowthMatrixRow {
  id: string;
  label: string;
  color: string;
  valPrev: number;
  valCurr: number;
  absChange: number;
  pctChange: number;
  shareCurrent: number;
  trend: 'Crece' | 'Decrece' | 'Mantiene';
}

export function getGrowthMatrix(): GrowthMatrixRow[] {
  const lastPoint = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const prevPoint = HISTORICAL_DATA[HISTORICAL_DATA.length - 2];
  const totalLast = lastPoint.totalInv;

  return MEDIA_METADATA.map(m => {
    const valPrev = getMediumInvestment(prevPoint, m.id);
    const valCurr = getMediumInvestment(lastPoint, m.id);
    const absChange = valCurr - valPrev;
    const pctChange = valPrev > 0 ? (absChange / valPrev) : 0;
    const shareCurrent = totalLast > 0 ? (valCurr / totalLast) : 0;
    
    let trend: 'Crece' | 'Decrece' | 'Mantiene' = 'Mantiene';
    if (pctChange > 0.005) {
      trend = 'Crece';
    } else if (pctChange < -0.005) {
      trend = 'Decrece';
    }

    return {
      id: m.id,
      label: m.label,
      color: m.color,
      valPrev,
      valCurr,
      absChange,
      pctChange,
      shareCurrent,
      trend
    };
  }).sort((a, b) => b.valCurr - a.valCurr); // sorted by current investment descending
}

// Build the historical share series
export interface ShareHistoryPoint {
  year: number;
  digital: number;
  tvNacional: number;
  radio: number;
  pubExterior: number;
  prensa: number;
  tvRegLocal: number;
  revistas: number;
}

export function getShareHistory(): ShareHistoryPoint[] {
  return HISTORICAL_DATA.map(pt => {
    const total = pt.totalInv;
    return {
      year: pt.year,
      digital: total > 0 ? (pt.digital ?? 0) / total * 100 : 0,
      tvNacional: total > 0 ? (pt.tvNacional ?? 0) / total * 100 : 0,
      radio: total > 0 ? (pt.radio ?? 0) / total * 100 : 0,
      pubExterior: total > 0 ? (pt.pubExterior ?? 0) / total * 100 : 0,
      prensa: total > 0 ? (pt.prensa ?? 0) / total * 100 : 0,
      tvRegLocal: total > 0 ? (pt.tvRegLocal ?? 0) / total * 100 : 0,
      revistas: total > 0 ? (pt.revistas ?? 0) / total * 100 : 0
    };
  });
}
