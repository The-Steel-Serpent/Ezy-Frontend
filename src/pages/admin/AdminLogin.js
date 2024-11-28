import React, { useEffect, useState } from "react";
import wallpaper from "../../assets/wallpaper-seller1.png";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import { signInWithEmailPassword } from "../../firebase/AuthenticationFirebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
const ALLOWED_ROLES = [3, 4, 5, 6];// 3: Admin, 4: Event manager, 5: Shop manager

const AdminLogin = () => {
  const [hidePassword, setHidePassword] = useState(false);
  const [data, setData] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Nếu có token, thực hiện tự động đăng xuất
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.clear(); // Xóa token khỏi localStorage
      dispatch(logout()); // Cập nhật redux state
      message.warning("Bạn đã được đăng xuất. Vui lòng đăng nhập lại.");
    }
  }, [dispatch]);

  const handleHidePassword = (e) => {
    e.preventDefault();
    setHidePassword(!hidePassword);
  };

  const handleSignIn = async ({ email, password }) => {
    try {
      setLoading(true);
      const user = await signInWithEmailPassword(email, password);

      if (user.emailVerified) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        console.log("Thông tin tài khoản:", {
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
        });
        message.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        message.error("Tài khoản của bạn chưa xác thực. Vui lòng xác thực email trước khi đăng nhập");
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      message.error(error.message || "Đăng nhập thất bại");
    }
    finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!data.identifier || !data.password) {
      message.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/find-user-email-or-username`;
    try {
      const response = await axios.post(
        url,
        { identifier: data.identifier },
        { withCredentials: true }
      );

      if (response.status === 200) {
        if (!ALLOWED_ROLES.includes(response.data.user.role_id)) {
          message.error("Tài khoản của bạn không có quyền truy cập vào trang này");
        } else {
          const email = response.data.user.email;
          const password = data.password;
          await handleSignIn({ email, password });
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error("Tài khoản không tồn tại");
      } else {
        message.error("Đăng nhập thất bại");
      }
    }
  };

  return (
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32 mb-[-40px]">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-3xl font-[490]">Quản lý chuyên nghiệp</div>
        <div className="text-slate-600 text-[21px] py-2">Kênh quản trị hệ thống của Ezy</div>
        <img src={wallpaper} width={500} alt="wallpaper" />
      </div>
      <div>
        <form className="w-96 shadow-lg px-6 py-10 mb-10">
          <h1 className="font-[450] text-xl mb-10">Đăng nhập</h1>
          <input
            type="text"
            placeholder="Email/Tên Đăng nhập"
            className="p-3 w-full border rounded mb-8"
            id="username"
            value={data.identifier}
            onChange={(e) => setData({ ...data, identifier: e.target.value })}
          />
          <div className="relative flex items-center mb-8">
            <input
              type={hidePassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="p-3 w-full border rounded"
              id="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button className="absolute right-3" onClick={handleHidePassword}>
              {hidePassword ? (
                <IoMdEye className="text-slate-500" size={25} />
              ) : (
                <RiEyeCloseLine className="text-slate-500" size={25} />
              )}
            </button>
          </div>
          <Button
            onClick={handleOnSubmit}
            loading={loading}
            type="submit" className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a]">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
