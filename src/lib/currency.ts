/**
 * Tanzania Shilling (TSh) Currency Formatting Utilities
 * Provides consistent currency formatting across the application
 */

// Tanzania Shilling symbol
export const TZS_SYMBOL = 'TSh';

// Format number as Tanzania Shilling
export const formatTZS = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return `${TZS_SYMBOL} 0`;
  }

  // Format with thousands separators
  const formatted = num.toLocaleString('en-TZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${TZS_SYMBOL} ${formatted}`;
};

// Format number as Tanzania Shilling with decimals (for precise amounts)
export const formatTZSPrecise = (amount: number | string, decimals: number = 0): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return `${TZS_SYMBOL} 0`;
  }

  const formatted = num.toLocaleString('en-TZ', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${TZS_SYMBOL} ${formatted}`;
};

// Format large amounts in short form (e.g., 1.5M TSh)
export const formatTZShort = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return `${TZS_SYMBOL} 0`;
  }

  let formatted: string;
  let suffix = '';

  if (num >= 1000000000) {
    formatted = (num / 1000000000).toFixed(1);
    suffix = 'B';
  } else if (num >= 1000000) {
    formatted = (num / 1000000).toFixed(1);
    suffix = 'M';
  } else if (num >= 1000) {
    formatted = (num / 1000).toFixed(1);
    suffix = 'K';
  } else {
    formatted = num.toLocaleString('en-TZ');
  }

  // Remove .0 if present
  if (formatted.endsWith('.0')) {
    formatted = formatted.slice(0, -2);
  }

  return `${TZS_SYMBOL} ${formatted}${suffix}`;
};

// Parse TZS string to number
export const parseTZS = (value: string): number => {
  // Remove TSh symbol and any non-numeric characters except decimal point
  const cleaned = value
    .replace(/TSh/gi, '')
    .replace(/[^\d.-]/g, '');
  
  return parseFloat(cleaned) || 0;
};

// Format currency for display in tables/lists
export const formatCurrencyTable = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '-';
  }

  return num.toLocaleString('en-TZ');
};

export default {
  TZS_SYMBOL,
  formatTZS,
  formatTZSPrecise,
  formatTZShort,
  parseTZS,
  formatCurrencyTable,
};

