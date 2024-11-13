export const formatCurrency = (balance) => {
  return new Intl.NumberFormat("vi-VN").format(balance) + "đ";
};

export const formatHideCurrency = (price) => {
  let formattedPrice = price.toString().trim();

  // Xử lý cho số có 7 chữ số
  if (formattedPrice.length === 7) {
    // 1.600.000 -> 1.??0.000
    formattedPrice = formattedPrice[0] + ".??" + formattedPrice.slice(3);
  } else if (formattedPrice.length === 6) {
    // 148.000 -> 1?8.000
    formattedPrice =
      formattedPrice[0] +
      "?" +
      formattedPrice[2] +
      "." +
      formattedPrice.slice(3);
  } else if (formattedPrice.length === 4) {
    // 8.000 -> ?000
    formattedPrice = "?." + formattedPrice.slice(1);
  }

  formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return formattedPrice;
};
