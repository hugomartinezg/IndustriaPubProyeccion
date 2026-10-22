export type Scenarios = 'conservador' | 'base' | 'optimista';

export interface MediaDataPoint {
  year: number;
  tvRegLocal: number | null;
  revistas: number | null;
  pubExterior: number | null;
  prensa: number | null;
  radio: number | null;
  tvNacional: number | null;
  digital: number | null;
  totalInv: number; // TOTAL_INV from data or calculated as sum
}

export interface MediumInfo {
  id: keyof Omit<MediaDataPoint, 'year' | 'totalInv'>;
  label: string;
  color: string;
  description: string;
}

export interface ProjectionPoint {
  year: number;
  investments: Record<keyof Omit<MediaDataPoint, 'year' | 'totalInv'>, number>;
  totalInvestments: number;
  shares: Record<keyof Omit<MediaDataPoint, 'year' | 'totalInv'>, number>;
}

export type ProjectionsByScenario = Record<Scenarios, ProjectionPoint[]>;

export interface KpiCardData {
  title: string;
  value: string;
  changeValue?: string;
  changePercent?: number;
  isPositive?: boolean;
  metricType?: 'currency' | 'percent' | 'text' | 'simple';
  subtitle?: string;
}
