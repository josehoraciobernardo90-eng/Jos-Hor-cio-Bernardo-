
import React from 'react';

export const PLAN_LABELS: Record<string, string> = {
  '1m': 'Mensal',
  '3m': 'Trimestral',
  'anual': 'Anual'
};

export const PLAN_MONTHS: Record<string, number> = {
  '1m': 1,
  '3m': 3,
  'anual': 12
};

export const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
});
