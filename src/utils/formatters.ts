/**
 * Formatting utilities for the executive dashboard
 */

export function formatCurrency(value: number, decimalDigits = 1): string {
  if (value === null || value === undefined) return '-';
  
  // Format based on standard Spanish locale or custom clean separators
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  }).format(value);
  
  return `$ ${formatted} MM`; // Representing million units commonly used in Colombian public budget/corporate metrics
}

export function formatPercent(value: number, decimalDigits = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  
  // Value can be fractional (0.125) or pre-multiplied (12.5). Handle fractional
  const valueMult = value < 1 && value > -1 && value !== 0 ? value * 100 : value;
  
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  }).format(valueMult);
  
  return `${formatted}%`;
}

export function formatNumber(value: number, decimalDigits = 0): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  }).format(value);
}
