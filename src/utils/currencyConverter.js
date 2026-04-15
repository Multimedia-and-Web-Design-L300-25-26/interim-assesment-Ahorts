const exchangeRates = {
  USD: 1,
  GHS: 11.05,
  EUR: 0.92,
  GBP: 0.79,
};

const convertPrice = (priceUSD, targetCurrency = 'USD') => {
  const rate = exchangeRates[targetCurrency] || 1;
  return parseFloat((priceUSD * rate).toFixed(2));
};

module.exports = { exchangeRates, convertPrice };
