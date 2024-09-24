const formatAddress = (address) => {
  if (!address) return "N/A";

  // Kiểm tra xem địa chỉ có kết thúc bằng "Việt Nam" hay không
  const vietnamRegex = /Việt Nam$/;
  if (!vietnamRegex.test(address)) {
    return "Nước Ngoài";
  }

  // Tách địa chỉ thành các phần và lấy phần trước cuối cùng (thường là tỉnh/thành phố)
  const parts = address.split(",");
  const city = parts[parts.length - 2].trim();
  return `${city}, Việt Nam`;
};

export default formatAddress;
