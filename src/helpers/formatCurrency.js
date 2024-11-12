export const formatCurrency = (balance) => {
  return new Intl.NumberFormat("vi-VN").format(balance) + "đ";
};
