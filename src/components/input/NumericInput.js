import { Input, Tooltip } from "antd";
import React from "react";

const NumericInput = (props) => {
  const formatNumber = (value) => new Intl.NumberFormat().format(value);
  const { value, onChange, placeholder } = props;
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };
  const handleBlur = () => {
    let valueTemp = value;
    if ((value && value.charAt(value.length - 1) === ".") || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp ? valueTemp.replace(/0*(\d+)/, "$1") : "");
  };
  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    "Nhập vào giá tiền"
  );
  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={16}
      />
    </Tooltip>
  );
};

export default NumericInput;
