const exchangeRateService = {
  getRates: () => ({
    MKD: 1,
    EUR: 61.5,
    USD: 56.4,
  }),
  convertFromMkd: (amount, currency) => {
    const rates = exchangeRateService.getRates();
    if (!rates[currency]) {
      return amount;
    }
    return amount / rates[currency];
  },
};

export default exchangeRateService;
