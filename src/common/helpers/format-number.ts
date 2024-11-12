/* eslint-disable prettier/prettier */

const DEFAULT_LOCALE = { code: 'en-SA', currency: 'SAR' };
function processInput(inputValue) {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

export function fCurrency(inputValue, currencySymbol, options = {}) {
  DEFAULT_LOCALE.currency = currencySymbol;

  const locale = DEFAULT_LOCALE;
  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'decimal',
    // currency: locale.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(number);

  return `${fm} ${DEFAULT_LOCALE.currency}`;
}

export function calculateTax(price, taxRate) {
  const taxAmount = price * (taxRate / 100);
  return taxAmount;
}

// ----------------------------------------------------------------------

export function calculateAfterTax(price, taxRate) {
  const taxAmount = price * (taxRate / 100);
  const finalPrice = price + taxAmount;
  return finalPrice;
}
