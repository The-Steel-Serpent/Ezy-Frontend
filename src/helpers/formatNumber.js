const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // Hàng triệu
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // Hàng nghìn
  } else {
    return num?.toString(); // Dưới 1000 không cần format
  }
};

export default formatNumber;
