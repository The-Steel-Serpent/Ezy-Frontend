import { Button, Checkbox, Input, message, Modal, Select } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../services/ghnService";
import { addAddress, updateAddress } from "../../services/addressService";
import { useSelector } from "react-redux";
import { checkNumberPhone } from "../../helpers/formatPhoneNumber";

const AddressInforModal = (props) => {
  const user = useSelector((state) => state.user);
  const {
    type,
    openModal,
    handleCancel,
    currentAddressItemSelected,
    fetchAddress,
  } = props;
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: action.payload };
        case "listProvince":
          return { ...state, listProvince: action.payload };
        case "enableConfirm":
          return { ...state, enableConfirm: action.payload };
        case "listDistrict":
          return { ...state, listDistrict: action.payload };
        case "listWard":
          return { ...state, listWard: action.payload };
        case "selected":
          return { ...state, selected: action.payload };
        case "error":
          return { ...state, error: action.payload };
        case "data":
          return { ...state, data: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      listProvince: [],
      listDistrict: [],
      listWard: [],
      selected: {
        province: null,
        district: null,
        ward: null,
      },
      enableConfirm: false,
      error: {
        full_name: "",
        phone_number: "",
        address: "",
        province: "",
        district: "",
        ward: "",
      },
      data: {
        full_name: "",
        phone_number: "",
        address: "",
        isDefault: 0,
      },
    }
  );

  const {
    listProvince,
    listDistrict,
    listWard,
    data,
    error,
    selected,
    loading,
  } = state;

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await getProvinces();
        if (res.code === 200)
          setState({ type: "listProvince", payload: res.data });
      } catch (error) {
        console.log(error);
      }
    };
    if (openModal) fetchProvinces();
    fetchProvinces();
  }, [openModal]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await getDistricts(selected?.province?.ProvinceID);
        if (res.code === 200) {
          setState({ type: "listDistrict", payload: res.data });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selected?.province !== null) {
      fetchDistricts();
    }
  }, [selected?.province]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await getWards(selected?.district?.DistrictID);
        if (res.code === 200) {
          setState({ type: "listWard", payload: res.data });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selected?.district !== null) {
      fetchWards();
    }
  }, [selected?.district]);

  const handleSelectProvince = (value) => {
    const selectedProvince = listProvince.find(
      (province) => province.ProvinceID === value
    );
    console.log(selectedProvince);
    setState({
      type: "listDistrict",
      payload: [],
    });
    setState({
      type: "listWard",
      payload: [],
    });
    setState({
      type: "data",
      payload: {
        ...data,
        address: "",
      },
    });
    setState({
      type: "selected",
      payload: {
        province: selectedProvince,
        district: null,
        ward: null,
      },
    });
  };

  const handleSelectDistrict = (value) => {
    const selectedDistrict = listDistrict.find(
      (district) => district.DistrictID === value
    );
    setState({
      type: "data",
      payload: {
        ...data,
        address: "",
      },
    });
    setState({
      type: "selected",
      payload: {
        ...selected,
        district: selectedDistrict,
        ward: null,
      },
    });
  };

  const handleSelectWard = (value) => {
    const selectedWard = listWard.find((ward) => ward.WardCode === value);
    setState({
      type: "data",
      payload: {
        ...data,
        address: "",
      },
    });
    setState({
      type: "selected",
      payload: {
        ...selected,
        ward: selectedWard,
      },
    });
  };
  const clearState = () => {
    setState({
      type: "selected",
      payload: { province: null, district: null, ward: null },
    });
    setState({ type: "listDistrict", payload: [] });
    setState({ type: "listWard", payload: [] });
    setState({ type: "listProvince", payload: [] });
    setState({
      type: "data",
      payload: {
        full_name: "",
        phone_number: "",
        address: "",
      },
    });
    setState({
      type: "error",
      payload: {
        full_name: "",
        phone_number: "",
        address: "",
        province: "",
        district: "",
        ward: "",
      },
    });
  };
  const handleOnTextChange = (e) => {
    setState({
      type: "data",
      payload: {
        ...state.data,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleSetDefault = (e) => {
    setState({
      type: "data",
      payload: {
        ...state.data,
        isDefault: e.target.checked ? 1 : 0,
      },
    });
  };
  const validate = () => {
    let localErrors = {
      full_name: "",
      phone_number: "",
      address: "",
      province: "",
      district: "",
      ward: "",
    };
    if (data.full_name?.length === 0) {
      localErrors = { ...localErrors, full_name: "Họ và tên không được trống" };
    } else if (data.full_name?.length > 100) {
      localErrors = {
        ...localErrors,
        full_name: "Họ và tên không được quá 100 ký tự",
      };
    }
    const checkPhoneNumber = checkNumberPhone(data.phone_number);
    if (data.phone_number?.length === 0) {
      localErrors = {
        ...localErrors,
        phone_number: "Số điện thoại không được trống",
      };
    } else if (
      data.phone_number?.length < 10 ||
      data.phone_number?.length > 10 ||
      checkPhoneNumber !== ""
    ) {
      localErrors = {
        ...localErrors,
        phone_number: checkPhoneNumber,
      };
    }
    if (data.address === "") {
      localErrors = { ...localErrors, address: "Địa chỉ không được trống" };
    } else if (data.address?.trim()?.length > 100) {
      localErrors = {
        ...localErrors,
        address: "Địa chỉ không được quá 100 ký tự",
      };
    }
    if (!selected.province) {
      localErrors = {
        ...localErrors,
        province: "Tỉnh/Thành phố không được trống",
      };
    }
    if (!selected.district) {
      localErrors = { ...localErrors, district: "Quận/Huyện không được trống" };
    }
    if (!selected.ward) {
      localErrors = { ...localErrors, ward: "Phường/Xã không được trống" };
    }
    console.log(localErrors);
    const hasErrors = Object.values(localErrors).some((error) => error !== "");
    if (hasErrors) {
      setState({ type: "error", payload: localErrors });
      setState({ type: "enableConfirm", payload: false });
      return false;
    }
    return true;
  };
  useEffect(() => {
    let newError = { ...error };

    if (data.full_name.length > 0 && data.full_name.length <= 100) {
      newError.full_name = "";
    }

    if (data.phone_number.length === 10 && data.phone_number.startsWith("0")) {
      newError.phone_number = "";
    }

    if (data.address.trim().length > 0 && data.address.trim().length <= 100) {
      newError.address = "";
    }

    if (selected.province) {
      newError.province = "";
    }

    if (selected.district) {
      newError.district = "";
    }

    if (selected.ward) {
      newError.ward = "";
    }

    setState({ type: "error", payload: newError });

    const isErrorFree = Object.values(newError).every((field) => field === "");
    setState({ type: "enableConfirm", payload: isErrorFree });
  }, [data, selected]);

  useEffect(() => {
    if (currentAddressItemSelected) {
      const addressParts = currentAddressItemSelected.address.split(",");
      const mainAddress = addressParts[0].trim();
      setState({
        type: "data",
        payload: {
          full_name: currentAddressItemSelected.full_name,
          phone_number: currentAddressItemSelected.phone_number,
          address: mainAddress,
          isDefault: currentAddressItemSelected.isDefault,
        },
      });
      setState({
        type: "selected",
        payload: {
          province: {
            ProvinceID: currentAddressItemSelected.province_id,
            ProvinceName: addressParts[3].trim(),
          },
          district: {
            DistrictID: currentAddressItemSelected.district_id,
            DistrictName: addressParts[2].trim(),
          },
          ward: {
            WardCode: currentAddressItemSelected.ward_code,
            WardName: addressParts[1].trim(),
          },
        },
      });
    }
  }, [currentAddressItemSelected]);
  const handleConfirm = async () => {
    setState({ type: "loading", payload: true });
    console.log(user);
    const check = validate();
    console.log(check);
    if (!check) {
      setState({ type: "loading", payload: false });

      return;
    }
    if (type === "add") {
      try {
        const res = await addAddress(user?.user_id, {
          full_name: data.full_name,
          phone_number: data.phone_number,
          province_id: selected.province.ProvinceID,
          district_id: selected.district.DistrictID,
          ward_code: selected.ward.WardCode,
          address:
            data.address +
            ", " +
            selected.ward.WardName +
            ", " +
            selected.district.DistrictName +
            ", " +
            selected.province.ProvinceName,
          isDefault: data.isDefault,
        });
        if (res.success) {
          message.success(res.message);
          await fetchAddress();
          clearState();
          handleCancel();
          setState({ type: "loading", payload: false });
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message);
        setState({ type: "loading", payload: false });
      }
    } else {
      try {
        const res = await updateAddress(user?.user_id, {
          user_address_id: currentAddressItemSelected.user_address_id,
          full_name: data.full_name,
          phone_number: data.phone_number,
          province_id: selected.province.ProvinceID,
          district_id: selected.district.DistrictID,
          ward_code: selected.ward.WardCode,
          address:
            data.address +
            ", " +
            selected.ward.WardName +
            ", " +
            selected.district.DistrictName +
            ", " +
            selected.province.ProvinceName,
          isDefault: data.isDefault,
        });
        if (res.success) {
          message.success(res.message);
          await fetchAddress();
          clearState();
          handleCancel();
          setState({ type: "loading", payload: false });
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message);
        setState({ type: "loading", payload: false });
      }
    }
  };

  return (
    <Modal
      visible={openModal}
      onCancel={() => {
        clearState();
        handleCancel();
      }}
      title={type === "add" ? "Thêm địa chỉ mới" : "Chỉnh sửa địa chỉ"}
      footer={[
        <Button
          size="large"
          className="bg-white border-secondary text-secondary hover:bg-secondary hover:text-white"
          onClick={() => {
            clearState();
            handleCancel();
          }}
        >
          Trở Lại
        </Button>,
        <Button
          size="large"
          className="bg-primary border-primary text-white hover:opacity-80"
          onClick={handleConfirm}
          disabled={!state.enableConfirm}
          loading={loading}
        >
          Hoàn Thành
        </Button>,
      ]}
    >
      <section className="flex flex-col gap-1 py-4">
        <div className="grid grid-cols-12 gap-3 w-full items-center">
          <div className="flex flex-col gap-1 w-full col-span-6">
            <Input
              size="large"
              placeholder="Họ và tên"
              name="full_name"
              value={data.full_name}
              onChange={handleOnTextChange}
            />
            <span className="text-red-500 text-sm">{error?.full_name}</span>
          </div>
          <div className="flex flex-col gap-1 col-span-6">
            <Input
              size="large"
              placeholder="Số Điện Thoại"
              name="phone_number"
              value={data.phone_number}
              onChange={handleOnTextChange}
            />
            <span className="text-red-500 text-sm">{error?.phone_number}</span>
          </div>
        </div>
        <div className="flex gap-3 w-full items-center">
          <div className="flex flex-col gap-1 w-full">
            <Select
              size="large"
              placeholder="Chọn Tỉnh/Thành phố"
              onChange={handleSelectProvince}
              value={
                selected?.province ? selected.province.ProvinceID : undefined
              }
            >
              {listProvince?.map((province) => (
                <Select.Option
                  key={province.ProvinceID}
                  value={province.ProvinceID}
                >
                  {province.ProvinceName}
                </Select.Option>
              ))}
            </Select>
            <span className="text-red-500">{error?.province}</span>
          </div>
        </div>
        <div className="flex gap-3 w-full items-center">
          <div className="flex flex-col gap-1 w-full">
            <Select
              size="large"
              placeholder="Chọn Quận/Huyện"
              onChange={handleSelectDistrict}
              value={
                selected?.district ? selected.district.DistrictID : undefined
              }
            >
              {listDistrict?.map((district) => (
                <Select.Option
                  key={district.DistrictID}
                  value={district.DistrictID}
                >
                  {district.DistrictName}
                </Select.Option>
              ))}
            </Select>
            <span className="text-red-500">{error?.district}</span>
          </div>
        </div>
        <div className="flex gap-3 w-full items-center">
          <div className="flex flex-col gap-1 w-full">
            <Select
              size="large"
              placeholder="Chọn Phường/Xã"
              value={selected?.ward ? selected.ward.WardCode : undefined}
              onChange={handleSelectWard}
            >
              {listWard?.map((ward) => (
                <Select.Option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </Select.Option>
              ))}
            </Select>
            <span className="text-red-500">{error?.ward}</span>
          </div>
        </div>
        <div className="flex gap-3 w-full items-center">
          <div className="flex flex-col gap-1 w-full">
            <Input
              size="large"
              placeholder="Địa chỉ cụ thể"
              name="address"
              value={data.address}
              onChange={handleOnTextChange}
            />
            <span className="text-red-500">{error?.address}</span>
          </div>
        </div>

        <Checkbox
          onChange={handleSetDefault}
          checked={data?.isDefault}
          disabled={currentAddressItemSelected?.isDefault === 1 ? true : false}
        >
          Thiết lập làm địa chỉ mặc định
        </Checkbox>
      </section>
    </Modal>
  );
};

export default memo(AddressInforModal);
