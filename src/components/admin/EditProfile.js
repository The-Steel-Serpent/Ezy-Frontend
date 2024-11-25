import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Input,
  message,
  Radio,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { memo, useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import uploadFile from "../../helpers/uploadFile";
import { updateProfile } from "../../services/userService";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { checkNumberPhone } from "../../helpers/formatPhoneNumber";
const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uploadPhotoRef = useRef();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setLoading":
          return { ...state, loading: action.payload };
        case "setPreviewImage":
          return { ...state, previewImage: action.payload };
        case "update":
          return { ...state, ...action.payload };
        case "isEditing":
          return { ...state, isEditing: action.payload };
        case "setError": {
          return {
            ...state,
            error: action.payload,
          };
        }
        default:
          return state;
      }
    },
    {
      loading: false,
      previewImage: null,
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dob: "",
      avt_url: "",
      isEditing: {
        phoneNumber: false,
        dob: false,
      },
      error: {
        fullName: "",
        phoneNumber: "",
        dob: "",
      },
    }
  );
  useEffect(() => {
    if (user) {
      setState({
        type: "update",
        payload: {
          fullName: user.full_name,
          email: user.email,
          phoneNumber: user?.phone_number,
          gender: user?.gender,
          dob: user?.dob,
          avt_url: user?.avt_url,
        },
      });
    }
  }, [user]);
  const {
    previewImage,
    loading,
    fullName,
    email,
    phoneNumber,
    gender,
    dob,
    avt_url,
    isEditing,
    error,
  } = state;

  const handleEditClick = (field) => () => {
    setState({
      type: "isEditing",
      payload: {
        ...state.isEditing,
        [field]: true,
      },
    });
  };
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Chưa cập nhật";
    return phoneNumber.replace(/.(?=.{2})/g, "*");
  };

  const formatEmail = (email) => {
    if (!email) return "Chưa cập nhật";
    const [name, domain] = email.split("@");
    return `${name[0]}${"*".repeat(name.length - 1)}@${domain}`;
  };

  const formatDateOfBirth = (dob) => {
    if (!dob) return "Chưa cập nhật";
    const [year, month, day] = dob.split("-");
    return `${year.slice(0, 2)}**-${month}-**`;
  };

  const renderFormRow = (label, value, onChange, isInput = true) => (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-3 text-neutral-600 justify-end flex">
        {label}
      </div>
      <div className="col-span-9">
        {label === "Tên" && isInput && (
          <div className="w-full">
            <Input className="w-full" value={value} onChange={onChange} />
            <span className="text-red-500">{error?.fullName}</span>
          </div>
        )}
        {/* {label === "Email" && (
          <span>
            {formatEmail(value)}{" "}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => navigate("/admin/account?type=email&step=1")}
            >
              Thay Đổi
            </span>
          </span>
        )} */}
        {label === "Số điện thoại" &&
          (isEditing["phoneNumber"] ? (
            <div className="w-full">
              <Input className="w-full" value={value} onChange={onChange} />
              <span className="text-red-500">{error?.phoneNumber}</span>
            </div>
          ) : (
            <span className="flex gap-2">
              {value ? formatPhoneNumber(value) : "Chưa cập nhật"}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={handleEditClick("phoneNumber")}
              >
                Thay Đổi
              </span>
            </span>
          ))}
        {label === "Tên đăng nhập" && value}
        {label === "Giới tính" && (
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={"Nam"}>Nam</Radio>
            <Radio value={"Nữ"}>Nữ</Radio>
            <Radio value={"Khác"}>Khác</Radio>
          </Radio.Group>
        )}
        {label === "Ngày sinh" &&
          (isEditing["dob"] ? (
            <div className="w-full">
              <DatePicker
                value={value ? dayjs(value, "YYYY-MM-DD") : null}
                format={"YYYY-MM-DD"}
                onChange={onChange}
              />
              <span className="text-red-500">{error?.dob}</span>
            </div>
          ) : (
            <span className="flex gap-2">
              {value ? formatDateOfBirth(value) : "Chưa cập nhật"}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={handleEditClick("dob")}
              >
                Thay Đổi
              </span>
            </span>
          ))}
      </div>
    </div>
  );

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setState({ type: "update", payload: { [field]: value } });
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("Ảnh phải có định dạng JPEG/JPG/PNG");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setState({
        type: "setPreviewImage",
        payload: {
          url: reader.result,
          file: file,
        },
      });
    };
    reader.readAsDataURL(file);
  };
  const handleChangeDateOfBirth = (date, dateString) => {
    setState({ type: "update", payload: { dob: dateString } });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ type: "setLoading", payload: true });
    let localErrors = {
      fullName: "",
      phoneNumber: "",
      dob: "",
    };
    const errorPhoneNumber = checkNumberPhone(phoneNumber);
    if (!fullName) {
      localErrors.fullName = "Tên không được để trống";
    } else if (fullName?.length > 100 && isEditing["fullName"]) {
      localErrors.fullName = "Tên không được quá 100 ký tự";
    }
    //Validate
    if (!phoneNumber && isEditing["phoneNumber"]) {
      localErrors.phoneNumber = "Số điện thoại không được để trống";
    } else if (
      (phoneNumber?.length < 10 || phoneNumber?.length > 10) &&
      isEditing["phoneNumber"]
    ) {
      localErrors.phoneNumber = "Số điện thoại không hợp lệ";
    } else if (
      phoneNumber?.length === 10 &&
      errorPhoneNumber !== "" &&
      isEditing["phoneNumber"]
    ) {
      localErrors.phoneNumber = errorPhoneNumber;
    }

    // Validate dob
    if (!dob && isEditing["dob"]) {
      localErrors.dob = "Ngày sinh không được để trống";
    } else if (dayjs(dob).isAfter(dayjs()) && isEditing["dob"]) {
      localErrors.dob = "Ngày sinh không hợp lệ";
    } else if (dayjs().diff(dayjs(dob), "year") < 16 && isEditing["dob"]) {
      localErrors.dob = "Bạn phải đủ 16 tuổi để sử dụng";
    }

    const hasErrors = Object.values(localErrors).some((error) => error !== "");

    if (hasErrors) {
      setState({
        type: "setError",
        payload: localErrors,
      });
      setState({ type: "setLoading", payload: false });
      return;
    }
    //End Validate
    try {
      let updatedUserData = { ...state };
      if (previewImage?.file !== undefined) {
        const uploadFilePhoto = await uploadFile(previewImage.file, "user-avt");
        if (!uploadFilePhoto) {
          message.error("Có lỗi xảy ra khi tải ảnh lên, vui lòng thử lại sau");
          setState({ type: "setLoading", payload: false });
          return;
        }
        updatedUserData.avt_url = uploadFilePhoto.url;
      }

      const res = await updateProfile(user.user_id, updatedUserData);
      if (res.success) {
        message.success("Cập nhật thông tin thành công");
        dispatch(setUser(res.data));
        setState({ type: "setLoading", payload: false });
      }
    } catch (error) {
      console.log("error", error);
      message.error(error?.response?.data?.message);
      setState({ type: "setLoading", payload: false });
    }
  };

  useEffect(() => {
    if (fullName !== "") {
      setState({
        type: "setError",
        payload: {
          fullName: "",
        },
      });
    }
    if (
      phoneNumber?.length > 0 &&
      phoneNumber?.length === 10 &&
      phoneNumber.startsWith("0")
    ) {
      setState({
        type: "setError",
        payload: {
          phoneNumber: "",
        },
      });
    }

    if (
      dob !== "" &&
      dayjs(dob).isBefore(dayjs()) &&
      dayjs().diff(dayjs(dob), "year") >= 16
    ) {
      setState({
        type: "setError",
        payload: {
          dob: "",
        },
      });
    }
  }, [fullName, phoneNumber, dob]);

  return (
    <div className="w-full bg-white p-5">
      <section className="flex flex-col">
        <span className="text-xl font-garibato">Hồ Sơ Của Tôi</span>
        <span className="text-sm">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </span>
      </section>
      <Divider className="my-3" />
      <form className="grid grid-cols-12 p-3 gap-10" onSubmit={handleOnSubmit}>
        <div className="col-span-8  w-full flex gap-8 flex-col">
          {renderFormRow("Tên đăng nhập", user?.username, null, false)}
          {renderFormRow("Tên", fullName, handleInputChange("fullName"))}
          {/* {renderFormRow("Email", email, handleInputChange("email"), false)} */}
          {renderFormRow(
            "Số điện thoại",
            phoneNumber,
            handleInputChange("phoneNumber"),
            false
          )}
          {renderFormRow(
            "Giới tính",
            gender,
            handleInputChange("gender"),
            false
          )}
          {renderFormRow("Ngày sinh", dob, handleChangeDateOfBirth, false)}
          <div className="w-full justify-center items-center flex">
            <Button
              className="w-[30%] bg-primary text-white hover:opacity-80"
              htmlType="submit"
              loading={loading}
            >
              Lưu
            </Button>
          </div>
        </div>
        <div className="col-span-4 w-full">
          <section>
            <label
              htmlFor="avt_url"
              className="flex justify-center items-center flex-col gap-3 border-l-[1px] "
            >
              {avt_url || avt_url !== "" ? (
                <Avatar
                  size={120}
                  src={previewImage?.url ? previewImage?.url : avt_url}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    uploadPhotoRef.current.click();
                  }}
                />
              ) : (
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    uploadPhotoRef.current.click();
                  }}
                />
              )}
              <input
                type="file"
                className="hidden"
                accept=".jpg,.png,.jpeg"
                name="avt_url"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
              <Button
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  uploadPhotoRef.current.click();
                }}
              >
                Chọn Ảnh
              </Button>

              <div className="flex flex-col text-sm text-neutral-500">
                <span>Dung lượng file tối đa 2 MB</span>
                <span>Định dạng:.JPEG, .PNG, .JPG</span>
              </div>
            </label>
          </section>
        </div>
      </form>
    </div>
  );
};

export default memo(EditProfile);
