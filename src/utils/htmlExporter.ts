import { HISTORICAL_DATA, MEDIA_METADATA } from '../data';
import { generateProjections, getMetrics, getMediumInvestment, getShareHistory, getGrowthMatrix, calculateWeightedGrowthRate } from './projections';
import { formatCurrency, formatPercent } from './formatters';

export type ExportScope = 
  | 'all' 
  | 'summary' 
  | 'trends' 
  | 'shares' 
  | 'rankings' 
  | 'projections' 
  | 'methodology';

export interface ScopeOption {
  id: ExportScope;
  title: string;
  shortTitle: string;
  description: string;
  badge: string;
  iconName: string;
}

export const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'all',
    title: 'Todo el Documento (Proyecto Completo 1995 — 2030)',
    shortTitle: 'Todo el Documento',
    description: 'Documento integral que consolida las 6 hojas de análisis, series históricas, matrices, simulación 5P y metodología.',
    badge: 'Consolidado Maestro',
    iconName: 'Layers'
  },
  {
    id: 'summary',
    title: 'Hoja 1: Resumen Ejecutivo y Diagnóstico (2025)',
    shortTitle: '1. Resumen Ejecutivo',
    description: 'Indicadores clave de desempeño (KPIs), tabla de cierre fiscal 2025 y síntesis directiva para presidencia.',
    badge: 'Cierre 2025',
    iconName: 'Activity'
  },
  {
    id: 'trends',
    title: 'Hoja 2: Evolución Histórica y Series Temporales (1995 — 2025)',
    shortTitle: '2. Serie Histórica',
    description: 'Tabla completa año a año de los 31 periodos auditados por canal de inversión y crecimiento acumulado.',
    badge: '31 Años Auditados',
    iconName: 'LineChart'
  },
  {
    id: 'shares',
    title: 'Hoja 3: Participación de Mercado (Evolución de Share %)',
    shortTitle: '3. Participación (Share)',
    description: 'Evolución histórica del mix de medios, quiebres estructurales y métricas de concentración de mercado.',
    badge: 'Estructura del Mix',
    iconName: 'PieChart'
  },
  {
    id: 'rankings',
    title: 'Hoja 4: Matriz de Crecimiento & Ranking de Medios',
    shortTitle: '4. Matriz & Rankings',
    description: 'Clasificación 2025 por volumen, matriz de cuadrantes (Expansión, Maduros, Transición) y variaciones absolutas.',
    badge: 'Desempeño Relativo',
    iconName: 'Award'
  },
  {
    id: 'projections',
    title: 'Hoja 5: Simulador Predictivo 5 Periodos (2026 — 2030)',
    shortTitle: '5. Simulador 5P',
    description: 'Proyecciones año por año para cada medio y comparativa de los 3 Escenarios (Base, Conservador, Optimista).',
    badge: 'Prospectiva Quinquenal',
    iconName: 'ShieldAlert'
  },
  {
    id: 'methodology',
    title: 'Hoja 6: Marco Metodológico y Auditoría de Fórmulas',
    shortTitle: '6. Marco Metodológico',
    description: 'Formulación matemática formal del algoritmo de decaimiento ponderado y gobernanza de datos puros.',
    badge: 'Gobernanza Estadística',
    iconName: 'BookOpen'
  }
];

// Helper to generate the common CSS styles
function getCommonStyles(): string {
  return `
    :root {
      color-scheme: dark;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #0a0a0a;
      color: #e2e8f0;
      line-height: 1.5;
    }
    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 32px 20px;
    }
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 12px 18px;
      background: #141414;
      border: 1px solid #222;
      border-radius: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #2563eb;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #262626;
      color: #e2e8f0;
    }
    .btn-secondary:hover {
      background: #333333;
    }
    .header {
      background-color: #111111;
      border: 1px solid #222222;
      border-radius: 12px;
      padding: 26px;
      margin-bottom: 24px;
    }
    .tag {
      display: inline-block;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 700;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 4px;
      background-color: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    .title {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      margin: 10px 0 6px 0;
      letter-spacing: -0.02em;
    }
    .title span {
      color: #3b82f6;
    }
    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
    }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid #222222;
      font-size: 12px;
      color: #94a3b8;
    }
    .meta-item strong {
      color: #ffffff;
    }
    .nav-tabs-sheet {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
      padding: 8px;
      background: #111111;
      border: 1px solid #222;
      border-radius: 8px;
    }
    .nav-tab-link {
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-tab-link:hover {
      background: #1e1e1e;
      color: #ffffff;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background-color: #111111;
      border: 1px solid #222222;
      border-radius: 10px;
      padding: 16px;
    }
    .kpi-title {
      font-size: 11px;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: 700;
      color: #888888;
      margin-bottom: 6px;
    }
    .kpi-value {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      font-family: monospace;
      letter-spacing: -0.02em;
    }
    .kpi-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      font-family: monospace;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 8px;
    }
    .badge-positive {
      background-color: rgba(74, 222, 128, 0.1);
      color: #4ade80;
      border: 1px solid rgba(74, 222, 128, 0.2);
    }
    .badge-neutral {
      background-color: rgba(96, 165, 250, 0.1);
      color: #60a5fa;
      border: 1px solid rgba(96, 165, 250, 0.2);
    }
    .badge-negative {
      background-color: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .card {
      background-color: #111111;
      border: 1px solid #222222;
      border-radius: 12px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-desc {
      font-size: 12px;
      color: #888888;
      margin: 0 0 16px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      border-bottom: 1px solid #333333;
      padding: 10px 12px;
      font-size: 10px;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: 700;
      color: #888888;
      letter-spacing: 0.05em;
    }
    tr:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }
    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 18px;
    }
    .scenario-box {
      background-color: #141414;
      border: 1px solid #222222;
      border-radius: 8px;
      padding: 16px;
    }
    .scenario-name {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .scenario-val {
      font-size: 20px;
      font-weight: 800;
      font-family: monospace;
      color: #60a5fa;
      margin-bottom: 4px;
    }
    .scenario-desc {
      font-size: 11px;
      color: #888888;
      line-height: 1.4;
    }
    .formula-card {
      background-color: #141414;
      border: 1px solid #222;
      border-left: 3px solid #3b82f6;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 14px;
      font-family: monospace;
      font-size: 12px;
      color: #93c5fd;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #666666;
      padding: 24px 0;
      border-top: 1px solid #222222;
      margin-top: 32px;
    }
    @media print {
      body { background: #ffffff !important; color: #000000 !important; }
      .container { max-width: 100%; padding: 0; }
      .action-bar, .nav-tabs-sheet { display: none !important; }
      .header, .card, .kpi-card, .scenario-box, .formula-card { background: #ffffff !important; border: 1px solid #cccccc !important; }
      .title, .card-title, .kpi-value, tr td, .scenario-name { color: #000000 !important; }
      .tag { border: 1px solid #000000 !important; color: #000000 !important; }
      .formula-card { color: #000000 !important; border-left: 3px solid #000000 !important; }
    }
  `;
}

// -------------------------------------------------------------
// SECTION 1: Summary 2025 HTML generator
// -------------------------------------------------------------
function renderSummarySection(): string {
  const metrics = getMetrics();
  const lastYear = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const prevYear = HISTORICAL_DATA[HISTORICAL_DATA.length - 2];

  const rows = MEDIA_METADATA.map((med, idx) => {
    const valCurr = getMediumInvestment(lastYear, med.id);
    const valPrev = getMediumInvestment(prevYear, med.id);
    const share = lastYear.totalInv > 0 ? valCurr / lastYear.totalInv : 0;
    const absChange = valCurr - valPrev;
    const pctChange = valPrev > 0 ? absChange / valPrev : 0;
    const isPos = pctChange >= 0;

    return `
      <tr style="border-bottom: 1px solid #222; font-size: 12px;">
        <td style="padding: 10px 12px; text-align: center; color: #666; font-family: monospace; font-weight: bold;">#${idx + 1}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #ffffff;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${med.color}; margin-right: 8px;"></span>
          ${med.label}
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #e2e8f0;">${formatCurrency(valCurr)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #60a5fa; font-weight: 600;">${formatPercent(share)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; font-weight: 600; color: ${isPos ? '#4ade80' : '#f87171'};">
          ${isPos ? '+' : ''}${formatPercent(pctChange)}
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: ${isPos ? '#4ade80' : '#f87171'};">
          ${isPos ? '+' : ''}${formatCurrency(absChange)}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div id="sec-summary" class="card">
      <h2 class="card-title">1. Rendimiento por Canal Publicitario (Cierre Fiscal 2025)</h2>
      <p class="card-desc">Desglose ordenado por volumen de inversión, participación en la torta publicitaria y tasa de crecimiento interanual.</p>
      
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 40px;">Puesto</th>
              <th>Formato de Medio</th>
              <th style="text-align: right;">Inversión 2025 ($ MM)</th>
              <th style="text-align: right;">Share (%)</th>
              <th style="text-align: right;">Crecimiento YoY</th>
              <th style="text-align: right;">Variación Absoluta</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr style="background-color: #181818; font-weight: bold; border-top: 2px solid #333333; font-size: 12px;">
              <td style="padding: 10px 12px; text-align: center; color: #888;">-</td>
              <td style="padding: 10px 12px; color: #ffffff;">Total Mercado Consolidado</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(lastYear.totalInv)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">100,00%</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #4ade80;">+${formatPercent(metrics.totalGrowth)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #4ade80;">+${formatCurrency(metrics.totalAbsoluteDiff)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h2 class="card-title">Síntesis Directiva y Recomendaciones Estratégicas</h2>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #94a3b8; line-height: 1.6;">
        <li><strong style="color: #ffffff;">Liderazgo Digital Absoluto:</strong> El canal digital concentra casi el <strong>59,6%</strong> de la torta ($3.066.685,3 MM), impulsado por inversión en video online y motores de búsqueda.</li>
        <li><strong style="color: #ffffff;">Resiliencia de TV Nacional y Radio:</strong> TV Nacional ($873.125,7 MM) y Radio ($560.706,3 MM) mantienen estabilidad (+0,8% y +1,0% YoY), siendo pilares para cobertura y recordación de marca.</li>
        <li><strong style="color: #ffffff;">Transformación de Medios Impresos:</strong> Prensa ($147.248,9 MM) y Revistas ($6.839,0 MM) reducen su participación; se recomienda acelerar la monetización de sus activos digitales.</li>
      </ul>
    </div>
  `;
}

// -------------------------------------------------------------
// SECTION 2: Historical series 1995-2025 HTML generator
// -------------------------------------------------------------
function renderTrendsSection(): string {
  const tableRows = [...HISTORICAL_DATA].reverse().map((row) => {
    return `
      <tr style="border-bottom: 1px solid #222; font-size: 11px;">
        <td style="padding: 8px 10px; font-weight: bold; color: #ffffff; font-family: monospace;">${row.year}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.digital !== null ? formatCurrency(row.digital) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.tvNacional !== null ? formatCurrency(row.tvNacional) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.radio !== null ? formatCurrency(row.radio) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.pubExterior !== null ? formatCurrency(row.pubExterior) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.prensa !== null ? formatCurrency(row.prensa) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.tvRegLocal !== null ? formatCurrency(row.tvRegLocal) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace;">${row.revistas !== null ? formatCurrency(row.revistas) : '<span style="color:#555">-</span>'}</td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: bold; color: #60a5fa; background: rgba(59,130,246,0.04);">${formatCurrency(row.totalInv)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div id="sec-trends" class="card">
      <h2 class="card-title">2. Serie Histórica Cuantitativa Completa (1995 — 2025)</h2>
      <p class="card-desc">Registro fiscal de los 31 periodos anuales auditados en Millones de Pesos ($ MM). Serie sin distorsión de variables macroeconómicas.</p>
      
      <div style="overflow-x: auto; max-height: 520px;">
        <table>
          <thead>
            <tr style="position: sticky; top: 0; background-color: #111;">
              <th>Año</th>
              <th style="text-align: right;">Digital</th>
              <th style="text-align: right;">TV Nacional</th>
              <th style="text-align: right;">Radio</th>
              <th style="text-align: right;">Pub. Exterior</th>
              <th style="text-align: right;">Prensa</th>
              <th style="text-align: right;">TV Reg / Local</th>
              <th style="text-align: right;">Revistas</th>
              <th style="text-align: right; color: #60a5fa;">Total Inversión</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      
      <div style="margin-top: 16px; padding: 12px; background: #141414; border-radius: 8px; font-size: 11px; color: #888;">
        <strong>Hitos Históricos Clave:</strong> 1995 (Inicio serie $254.683 MM) • 2008 (Irrupción del medio Digital) • 2018 (Digital supera a TV Nacional por primera vez) • 2025 (Mercado supera los $5,14 Billones de pesos).
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SECTION 3: Share and Mix evolution HTML generator
// -------------------------------------------------------------
function renderSharesSection(): string {
  const shareHistory = getShareHistory();
  // Select benchmark years: 1995, 2005, 2015, 2020, 2025
  const keyYears = [1995, 2000, 2005, 2010, 2015, 2020, 2025];
  const filteredShares = shareHistory.filter(s => keyYears.includes(s.year));

  const rows = filteredShares.map((s) => {
    return `
      <tr style="border-bottom: 1px solid #222; font-size: 12px;">
        <td style="padding: 10px 12px; font-weight: bold; color: #ffffff; font-family: monospace;">${s.year}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #10b981; font-weight: bold;">${formatPercent(s.digital / 100)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #3b82f6;">${formatPercent(s.tvNacional / 100)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #f59e0b;">${formatPercent(s.radio / 100)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #8b5cf6;">${formatPercent(s.pubExterior / 100)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ef4444;">${formatPercent(s.prensa / 100)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ec4899;">${formatPercent(s.tvRegLocal / 100)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #6366f1;">${formatPercent(s.revistas / 100)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div id="sec-shares" class="card">
      <h2 class="card-title">3. Evolución del Mix y Participación de Mercado (Share %)</h2>
      <p class="card-desc">Transformación estructural de la torta publicitaria en los hitos quinquenales más representativos de la serie.</p>
      
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Año Hito</th>
              <th style="text-align: right;">Digital (%)</th>
              <th style="text-align: right;">TV Nacional (%)</th>
              <th style="text-align: right;">Radio (%)</th>
              <th style="text-align: right;">Pub. Exterior (%)</th>
              <th style="text-align: right;">Prensa (%)</th>
              <th style="text-align: right;">TV Reg / Local (%)</th>
              <th style="text-align: right;">Revistas (%)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <div class="scenarios-grid" style="margin-top: 20px;">
        <div class="scenario-box">
          <div class="scenario-name">Concentración Top 3 (2025)</div>
          <div class="scenario-val">87,51%</div>
          <div class="scenario-desc">Digital (59,63%) + TV Nacional (16,98%) + Radio (10,90%) dominan casi 9 de cada 10 pesos invertidos en Colombia.</div>
        </div>
        <div class="scenario-box">
          <div class="scenario-name">Desplazamiento Estructural</div>
          <div class="scenario-val">+59,6 pp</div>
          <div class="scenario-desc">Ganancia de cuota neta de Digital desde su incursión en 2008 hasta el cierre de 2025.</div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SECTION 4: Matrix and Rankings HTML generator
// -------------------------------------------------------------
function renderRankingsSection(): string {
  const matrixData = getGrowthMatrix();
  const totalPrev = matrixData.reduce((acc, r) => acc + r.valPrev, 0);
  const totalCurr = matrixData.reduce((acc, r) => acc + r.valCurr, 0);
  const totalAbs = totalCurr - totalPrev;
  const totalPct = totalPrev > 0 ? totalAbs / totalPrev : 0;

  const rows = matrixData.map((item, idx) => {
    const isPos = item.pctChange >= 0;
    return `
      <tr style="border-bottom: 1px solid #222; font-size: 12px;">
        <td style="padding: 10px 12px; text-align: center; color: #666; font-family: monospace; font-weight: bold;">#${idx + 1}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #ffffff;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${item.color}; margin-right: 8px;"></span>
          ${item.label}
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${formatCurrency(item.valPrev)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; font-weight: bold; color: #ffffff;">${formatCurrency(item.valCurr)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #60a5fa;">${formatPercent(item.shareCurrent)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; font-weight: 600; color: ${isPos ? '#4ade80' : '#f87171'};">
          ${isPos ? '+' : ''}${formatPercent(item.pctChange)}
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: ${isPos ? '#4ade80' : '#f87171'};">
          ${isPos ? '+' : ''}${formatCurrency(item.absChange)}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div id="sec-rankings" class="card">
      <h2 class="card-title">4. Matriz de Crecimiento & Ranking Oficial (2024 vs 2025)</h2>
      <p class="card-desc">Evaluación del desempeño relativo por volumen capturado y aceleración interanual.</p>
      
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">Rank</th>
              <th>Medio Publicitario</th>
              <th style="text-align: right;">Inversión 2024</th>
              <th style="text-align: right;">Inversión 2025</th>
              <th style="text-align: right;">Share 2025</th>
              <th style="text-align: right;">Crecimiento YoY</th>
              <th style="text-align: right;">Aporte Neto ($ MM)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr style="background-color: #181818; font-weight: bold; border-top: 2px solid #333333; font-size: 12px;">
              <td style="padding: 10px 12px; text-align: center; color: #888;">-</td>
              <td style="padding: 10px 12px; color: #ffffff;">Total Mercado</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${formatCurrency(totalPrev)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(totalCurr)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">100,00%</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #4ade80;">+${formatPercent(totalPct)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #4ade80;">+${formatCurrency(totalAbs)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SECTION 5: Projections 2026-2030 HTML generator
// -------------------------------------------------------------
function renderProjectionsSection(): string {
  const projections = generateProjections();
  const lastYear = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const baseProj = projections.base;

  const rowsBase = MEDIA_METADATA.map((med) => {
    const baseVal = getMediumInvestment(lastYear, med.id);
    const p1 = baseProj[0].investments[med.id];
    const p2 = baseProj[1].investments[med.id];
    const p3 = baseProj[2].investments[med.id];
    const p4 = baseProj[3].investments[med.id];
    const p5 = baseProj[4].investments[med.id];
    const rate = calculateWeightedGrowthRate(med.id);

    return `
      <tr style="border-bottom: 1px solid #222; font-size: 12px;">
        <td style="padding: 10px 12px; font-weight: 600; color: #ffffff;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${med.color}; margin-right: 8px;"></span>
          ${med.label}
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #94a3b8;">${formatCurrency(baseVal)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #888;">${rate >= 0 ? '+' : ''}${formatPercent(rate)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${formatCurrency(p1)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${formatCurrency(p2)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${formatCurrency(p3)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${formatCurrency(p4)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #60a5fa; font-weight: bold;">${formatCurrency(p5)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div id="sec-projections" class="card">
      <h2 class="card-title">5. Simulación Prospectiva 5 Periodos (2026 — 2030 | Escenario Base Ponderado)</h2>
      <p class="card-desc">Cálculo de decaimiento temporal ponderado en base histórica reciente (40%-25%-20%-10%-5%) sin interferencias exógenas.</p>
      
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Medio Publicitario</th>
              <th style="text-align: right;">Base 2025</th>
              <th style="text-align: right;">Tasa Pond.</th>
              <th style="text-align: right;">2026 (P1)</th>
              <th style="text-align: right;">2027 (P2)</th>
              <th style="text-align: right;">2028 (P3)</th>
              <th style="text-align: right;">2029 (P4)</th>
              <th style="text-align: right; color: #60a5fa;">2030 (P5)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsBase}
            <tr style="background-color: #181818; font-weight: bold; border-top: 2px solid #333333; font-size: 12px;">
              <td style="padding: 10px 12px; color: #ffffff;">Total Proyectado</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(lastYear.totalInv)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #4ade80;">+9,48%</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(baseProj[0].totalInvestments)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(baseProj[1].totalInvestments)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(baseProj[2].totalInvestments)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #ffffff;">${formatCurrency(baseProj[3].totalInvestments)}</td>
              <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #60a5fa;">${formatCurrency(baseProj[4].totalInvestments)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Scenarios Breakdown -->
      <div class="scenarios-grid">
        <div class="scenario-box">
          <div class="scenario-name">Escenario Conservador (2030)</div>
          <div class="scenario-val">${formatCurrency(projections.conservador[4].totalInvestments)}</div>
          <div class="scenario-desc">Amortiguación del crecimiento (+44,5% acumulado 2025-2030) frente a ajustes presupuestarios globales.</div>
        </div>
        <div class="scenario-box" style="border-color: rgba(59, 130, 246, 0.4); background-color: #161c28;">
          <div class="scenario-name" style="color: #60a5fa;">Escenario Base Ponderado (2030)</div>
          <div class="scenario-val">${formatCurrency(baseProj[4].totalInvestments)}</div>
          <div class="scenario-desc">Tendencia histórica estructural pura con tasa ponderada de decaimiento en los últimos 5 periodos.</div>
        </div>
        <div class="scenario-box">
          <div class="scenario-name">Escenario Optimista (2030)</div>
          <div class="scenario-val" style="color: #4ade80;">${formatCurrency(projections.optimista[4].totalInvestments)}</div>
          <div class="scenario-desc">Mayor aceleración en el ecosistema digital (+25%) y mayor resiliencia en medios masivos convencionales.</div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SECTION 6: Methodology HTML generator
// -------------------------------------------------------------
function renderMethodologySection(): string {
  return `
    <div id="sec-methodology" class="card">
      <h2 class="card-title">6. Marco Metodológico, Formulación Matemática y Gobernanza</h2>
      <p class="card-desc">Especificación técnica de los modelos estadísticos implementados para la auditoría y proyección sin distorsión exógena.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <div class="formula-card">
          <div style="font-weight: bold; color: #ffffff; margin-bottom: 6px;">1. Crecimiento Interanual Simple (YoY)</div>
          <div>g(t) = ( Inv(t) - Inv(t-1) ) / Inv(t-1)</div>
        </div>
        <div class="formula-card">
          <div style="font-weight: bold; color: #ffffff; margin-bottom: 6px;">2. Decaimiento Temporal Ponderado (5 Periodos)</div>
          <div>g_pond = 0.40·g(t-1) + 0.25·g(t-2) + 0.20·g(t-3) + 0.10·g(t-4) + 0.05·g(t-5)</div>
        </div>
        <div class="formula-card">
          <div style="font-weight: bold; color: #ffffff; margin-bottom: 6px;">3. Proyección Recursiva Quinquenal</div>
          <div>Inv(t+k) = Inv(t+k-1) · ( 1 + g_pond )</div>
        </div>
        <div class="formula-card">
          <div style="font-weight: bold; color: #ffffff; margin-bottom: 6px;">4. Participación Relativa de Mercado (Share %)</div>
          <div>Share(i,t) = Inv(i,t) / Σ Inv(j,t)</div>
        </div>
      </div>

      <div style="font-size: 12px; color: #94a3b8; line-height: 1.6; border-top: 1px solid #222; pt-4; margin-top: 16px;">
        <p><strong style="color: #ffffff;">Principio de Aislamiento de Variables:</strong> Los modelos se construyeron estrictamente sobre la serie temporal histórica de inversión real reportada. Se excluyen variables macroeconómicas exógenas (inflación IPC, fluctuaciones cambiarias TRM) para preservar la pureza cuantitativa de las decisiones de pauta publicitaria.</p>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SCOPED HTML GENERATOR (Full standalone page)
// -------------------------------------------------------------
export function generateScopedHtmlReport(scope: ExportScope = 'all'): string {
  const metrics = getMetrics();
  const lastYear = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const option = SCOPE_OPTIONS.find(o => o.id === scope) || SCOPE_OPTIONS[0];

  let bodyContent = '';

  if (scope === 'all') {
    bodyContent = `
      <!-- Internal Tab Anchors -->
      <div class="nav-tabs-sheet">
        <a href="#sec-summary" class="nav-tab-link">1. Resumen Ejecutivo</a>
        <a href="#sec-trends" class="nav-tab-link">2. Serie Histórica</a>
        <a href="#sec-shares" class="nav-tab-link">3. Participación</a>
        <a href="#sec-rankings" class="nav-tab-link">4. Matriz & Rankings</a>
        <a href="#sec-projections" class="nav-tab-link">5. Simulador 5P</a>
        <a href="#sec-methodology" class="nav-tab-link">6. Metodología</a>
      </div>

      ${renderSummarySection()}
      ${renderTrendsSection()}
      ${renderSharesSection()}
      ${renderRankingsSection()}
      ${renderProjectionsSection()}
      ${renderMethodologySection()}
    `;
  } else if (scope === 'summary') {
    bodyContent = renderSummarySection();
  } else if (scope === 'trends') {
    bodyContent = renderTrendsSection();
  } else if (scope === 'shares') {
    bodyContent = renderSharesSection();
  } else if (scope === 'rankings') {
    bodyContent = renderRankingsSection();
  } else if (scope === 'projections') {
    bodyContent = renderProjectionsSection();
  } else if (scope === 'methodology') {
    bodyContent = renderMethodologySection();
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AD-INVEST PRO-INSIGHT | ${option.shortTitle}</title>
  <style>
    ${getCommonStyles()}
  </style>
</head>
<body>
  <div class="container">
    <!-- Action Bar for Printing & Downloading -->
    <div class="action-bar">
      <div style="font-size: 12px; color: #94a3b8;">
        📊 <strong>${option.badge}:</strong> ${option.shortTitle} — Listo para imprimir, adjuntar o archivar.
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary" onclick="window.print()">🖨️ Imprimir / PDF</button>
        <button class="btn" onclick="downloadCurrentHtml()">⬇️ Descargar .HTML</button>
      </div>
    </div>

    <!-- Header -->
    <div class="header">
      <span class="tag">${option.badge}</span>
      <h1 class="title">AD-INVEST <span>PRO-INSIGHT</span></h1>
      <p class="subtitle">${option.description}</p>
      
      <div class="meta-bar">
        <div class="meta-item">Fecha de Corte: <strong>Diciembre 31, 2025</strong></div>
        <div class="meta-item">Unidad: <strong>Millones de Pesos ($ MM)</strong></div>
        <div class="meta-item">Alcance: <strong>${option.shortTitle}</strong></div>
        <div class="meta-item">Inversión 2025: <strong>${formatCurrency(lastYear.totalInv)}</strong></div>
      </div>
    </div>

    <!-- Top KPI Cards (Always useful for instant context) -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Inversión Total 2025</div>
        <div class="kpi-value">${formatCurrency(lastYear.totalInv)}</div>
        <span class="kpi-badge badge-positive">+${formatPercent(metrics.totalGrowth)} vs 2024</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Canal Líder (Digital)</div>
        <div class="kpi-value">${formatCurrency(getMediumInvestment(lastYear, 'digital'))}</div>
        <span class="kpi-badge badge-neutral">${formatPercent(metrics.shareDigital)} de Share</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">TV Nacional</div>
        <div class="kpi-value">${formatCurrency(getMediumInvestment(lastYear, 'tvNacional'))}</div>
        <span class="kpi-badge badge-neutral">${formatPercent(metrics.shareTvNac)} de Share</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Radio</div>
        <div class="kpi-value">${formatCurrency(getMediumInvestment(lastYear, 'radio'))}</div>
        <span class="kpi-badge badge-neutral">${formatPercent(metrics.shareRadio)} de Share</span>
      </div>
    </div>

    <!-- Scoped Body Content -->
    ${bodyContent}

    <!-- Footer -->
    <div class="footer">
      AD-INVEST PRO-INSIGHT &copy; ${new Date().getFullYear()} — Plataforma de Inteligencia Cuantitativa en Medios.<br>
      Reporte compilado automáticamente para distribución ejecutiva directa.
    </div>
  </div>

  <script>
    function downloadCurrentHtml() {
      const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ad-invest-${scope}-${new Date().toISOString().split('T')[0]}.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

// -------------------------------------------------------------
// SCOPED EMAIL HTML GENERATOR (Inline CSS table for email body)
// -------------------------------------------------------------
export function generateScopedEmailHtml(scope: ExportScope = 'all'): string {
  const metrics = getMetrics();
  const projections = generateProjections();
  const lastYear = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const prevYear = HISTORICAL_DATA[HISTORICAL_DATA.length - 2];
  const option = SCOPE_OPTIONS.find(o => o.id === scope) || SCOPE_OPTIONS[0];

  const mediaRows = MEDIA_METADATA.map((med, idx) => {
    const valCurr = getMediumInvestment(lastYear, med.id);
    const share = lastYear.totalInv > 0 ? valCurr / lastYear.totalInv : 0;
    const valPrev = getMediumInvestment(prevYear, med.id);
    const pctChange = valPrev > 0 ? (valCurr - valPrev) / valPrev : 0;
    const isPositive = pctChange >= 0;

    return `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: Arial, sans-serif; font-size: 13px; color: #64748b; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #1e293b;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 4px; background-color: ${med.color}; margin-right: 6px;"></span>
          ${med.label}
        </td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: 'Courier New', Courier, monospace; font-size: 13px; text-align: right; color: #0f172a;">${formatCurrency(valCurr)}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: 'Courier New', Courier, monospace; font-size: 13px; text-align: right; font-weight: bold; color: #2563eb;">${formatPercent(share)}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: 'Courier New', Courier, monospace; font-size: 13px; text-align: right; font-weight: bold; color: ${isPositive ? '#16a34a' : '#dc2626'};">${isPositive ? '+' : ''}${formatPercent(pctChange)}</td>
      </tr>
    `;
  }).join('');

  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="640" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        
        <!-- Header Banner -->
        <tr>
          <td style="background-color: #0f172a; padding: 22px; text-align: left;">
            <span style="display: inline-block; background-color: #1e293b; color: #38bdf8; font-family: monospace; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
              ${option.badge}
            </span>
            <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 8px 0 4px 0;">
              AD-INVEST <span style="color: #38bdf8;">PRO-INSIGHT</span>
            </h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              ${option.title}
            </p>
          </td>
        </tr>

        <!-- KPIs Callout Box -->
        <tr>
          <td style="padding: 16px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="48%" style="padding: 12px; background-color: #f1f5f9; border-radius: 6px; text-align: left; vertical-align: top;">
                  <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #64748b; font-weight: bold;">Inversión Total 2025</div>
                  <div style="font-size: 17px; font-weight: bold; font-family: 'Courier New', Courier, monospace; color: #0f172a; margin-top: 4px;">${formatCurrency(lastYear.totalInv)}</div>
                  <div style="font-size: 11px; color: #16a34a; font-weight: bold; margin-top: 2px;">+${formatPercent(metrics.totalGrowth)} vs 2024</div>
                </td>
                <td width="4%"></td>
                <td width="48%" style="padding: 12px; background-color: #f1f5f9; border-radius: 6px; text-align: left; vertical-align: top;">
                  <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #64748b; font-weight: bold;">Canal Líder (Digital)</div>
                  <div style="font-size: 17px; font-weight: bold; font-family: 'Courier New', Courier, monospace; color: #2563eb; margin-top: 4px;">${formatCurrency(getMediumInvestment(lastYear, 'digital'))}</div>
                  <div style="font-size: 11px; color: #2563eb; font-weight: bold; margin-top: 2px;">${formatPercent(metrics.shareDigital)} de la torta</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Table of 2025 performance -->
        <tr>
          <td style="padding: 0 20px 16px 20px;">
            <h3 style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 0 0 8px 0;">
              Distribución por Canal de Medios (2025)
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-align: center; color: #64748b; text-transform: uppercase;">#</th>
                  <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-align: left; color: #64748b; text-transform: uppercase;">Medio</th>
                  <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-align: right; color: #64748b; text-transform: uppercase;">Inversión</th>
                  <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-align: right; color: #64748b; text-transform: uppercase;">Share</th>
                  <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-align: right; color: #64748b; text-transform: uppercase;">YoY</th>
                </tr>
              </thead>
              <tbody>
                ${mediaRows}
                <tr style="background-color: #f1f5f9; font-weight: bold;">
                  <td style="padding: 8px 8px; border-top: 2px solid #94a3b8; font-size: 11px; text-align: center; color: #64748b;">-</td>
                  <td style="padding: 8px 8px; border-top: 2px solid #94a3b8; font-size: 11px; color: #0f172a;">Total Mercado</td>
                  <td style="padding: 8px 8px; border-top: 2px solid #94a3b8; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-align: right; color: #0f172a;">${formatCurrency(lastYear.totalInv)}</td>
                  <td style="padding: 8px 8px; border-top: 2px solid #94a3b8; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-align: right; color: #0f172a;">100%</td>
                  <td style="padding: 8px 8px; border-top: 2px solid #94a3b8; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-align: right; color: #16a34a;">+${formatPercent(metrics.totalGrowth)}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Projections Highlights -->
        <tr>
          <td style="padding: 0 20px 16px 20px;">
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px;">
              <div style="font-size: 12px; font-weight: bold; color: #1e40af; margin-bottom: 4px;">
                Proyección 2030 (Escenario Base Ponderado)
              </div>
              <div style="font-size: 11px; color: #1e3a8a; line-height: 1.4;">
                Se proyecta que el mercado alcance <strong>${formatCurrency(projections.base[4].totalInvestments)}</strong> hacia el año 2030 bajo decaimiento ponderado sin variables exógenas.
              </div>
            </div>
          </td>
        </tr>

        <!-- Footer Notice -->
        <tr>
          <td style="background-color: #f8fafc; padding: 14px 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="font-size: 10px; color: #64748b; margin: 0; line-height: 1.4;">
              Generado por AD-INVEST PRO-INSIGHT • Series Temporales Puras (Sin distorsión TRM/IPC)<br>
              Fecha: ${new Date().toLocaleDateString('es-CO')}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `.trim();
}

// -------------------------------------------------------------
// DOWNLOAD HELPER FUNCTION
// -------------------------------------------------------------
export function downloadScopedHtmlFile(scope: ExportScope = 'all'): void {
  const htmlContent = generateScopedHtmlReport(scope);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ad-invest-${scope}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Backward-compatibility wrappers
export function generateStandaloneHtmlReport(): string {
  return generateScopedHtmlReport('all');
}

export function generateEmailCompatibleHtml(): string {
  return generateScopedEmailHtml('all');
}

export function downloadStandaloneHtmlFile(): void {
  downloadScopedHtmlFile('all');
}
