export const formatCurrency = (amount: number, locale = "vi-VN") => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(amount);
};
