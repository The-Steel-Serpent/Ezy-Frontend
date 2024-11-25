import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  fetchSignInMethodsForEmail,
  updatePassword,
  onIdTokenChanged,
  verifyBeforeUpdateEmail,
  unlink,
} from "firebase/auth";
import { authFirebase } from "./firebase";
import { TrophyFilled } from "@ant-design/icons";
import { message } from "antd";
import generateToken from "../helpers/randomToken";

const auth = getAuth();
auth.useDeviceLanguage();

export const startTokenRefreshListener = () => {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken(); // No forced refresh
        localStorage.setItem("token", token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    } else {
      localStorage.removeItem("token");
    }
  });
};

export const signUpWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      authFirebase,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);
    return user;
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email này đã được sử dụng";
        break;
      case "auth/invalid-email":
        errorMessage = "Email không hợp lệ";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Operation not allowed.";
        break;
      case "auth/weak-password":
        errorMessage = "Mật khẩu quá ngắn";
        break;
      default:
        errorMessage = "An unknown error occurred.";
        break;
    }
    throw new Error(errorMessage);
  }
};

export const signInWithEmailPassword = async (email, password) => {
  try {
    await setPersistence(authFirebase, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      authFirebase,
      email,
      password
    );
    const user = userCredential.user;
    // Kiểm tra nếu email đã được xác thực
    if (!user.emailVerified) {
      throw new Error("unverified");
    }
    return user;
  } catch (error) {
    let errorMessage = "";
    if (error.message === "unverified") {
      errorMessage =
        "Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác nhận tài khoản.";
    } else {
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "Tài khoản của bạn đã bị vô hiệu hóa. Vui long liên hệ với Ezy Hotline 0849919901 để được hỗ trợ.";
          break;
        case "auth/user-not-found":
          errorMessage = "Không tìm thấy tài khoản với email này.";
          break;
        case "auth/wrong-password":
          errorMessage = "Mật khẩu không chính xác. Vui lòng thử lại.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Lỗi mạng. Vui lòng kiểm tra kết nối.";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "Đăng nhập bị hủy.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Đăng nhập bị hủy.";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.";
          break;

        default:
          errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      }
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const signInWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);

    return result.user;
  } catch (error) {
    let errorMessage;
    console.log(error);
    const errorCode = error.code;
    switch (errorCode) {
      case "auth/popup-closed-by-user":
        errorMessage = "Đăng nhập bị hủy";
        break;
      case "auth/cancelled-popup-request":
        errorMessage = "Đăng nhập bị hủy";
        break;
      case "auth/network-request-failed":
        errorMessage = "Lỗi mạng. Hãy kiểm tra lại kết nối";
        break;
      case "auth/user-disabled":
        errorMessage =
          "Tài khoản của bạn đã bị vô hiệu hóa. Vui long liên hệ với Ezy Hotline 0849919901 để được hỗ trợ.";
        break;
      default:
        errorMessage = "An unknown error occurred: ";
        break;
    }
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Email không hợp lệ";
        break;
      case "auth/user-not-found":
        errorMessage = "Không tìm thấy tài khoản với email này";
        break;
      default:
        errorMessage = "An unknown error occurred";
        break;
    }
    throw new Error(errorMessage);
  }
};

export const verifyNewEmailWithLink = async (href) => {
  const newEmail = localStorage.getItem("newEmail");

  if (newEmail && isSignInWithEmailLink(auth, href)) {
    try {
      await signInWithEmailLink(auth, newEmail, href);
      console.log("Email mới đã được xác thực.");
      return true;
    } catch (error) {
      console.error("Lỗi khi xác thực email:", error.message);
      return false;
    }
  }
  return false;
};

const actionCodeSettings = {
  url: `http://localhost:3000/user/account?type=email&step=2`,
  handleCodeInApp: true,
};

export const handleSendSignInLinkToEmail = async (email) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      throw new Error("Email đã được sử dụng");
    }
    const user = auth.currentUser;
    await sendEmailVerification(user, actionCodeSettings);
    localStorage.setItem("newEmail", email);
    return true;
  } catch (error) {
    console.error(error);
    let errorMessage;
    switch (error.code) {
      case "auth/quota-exceeded":
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau một thời gian.";
        break;
      case "auth/invalid-email":
        errorMessage = "Email không hợp lệ";
        break;
      case "auth/operation-not-allowed":
        errorMessage =
          "Hành động không được phép. Vui lòng kiểm tra cấu hình xác thực trong Firebase Console.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.";
        break;
      default:
        errorMessage = "An unknown error occurred";
        break;
    }
    throw new Error(errorMessage);
  }
};

export const updateNewEmail = async (newEmail, currentPassword) => {
  const user = getAuth().currentUser;

  if (!user) {
    console.error("Người dùng chưa đăng nhập.");
    return false;
  }

  // Kiểm tra xem email mới có khác với email hiện tại không
  const userEmail = user.email;
  if (userEmail === newEmail) {
    console.error("Email mới phải khác với email hiện tại.");
    return false;
  }

  // Kiểm tra định dạng email mới
  if (!newEmail || !newEmail.includes("@")) {
    console.error("Email mới không hợp lệ.");
    return false;
  }

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
    await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật email:", error.message);

    // Xử lý lỗi cụ thể
    if (error.code === "auth/invalid-email") {
      console.error("Email mới không hợp lệ.");
      message.error("Email mới không hợp lệ.");
    } else if (error.code === "auth/email-already-in-use") {
      console.error("Email đã được sử dụng.");
      message.error("Email đã được sử dụng.");
    } else if (error.code === "auth/requires-recent-login") {
      console.error("Bạn cần đăng nhập lại để thay đổi thông tin.");
      message.error("Bạn cần đăng nhập lại để thay đổi thông tin.");
    } else if (error.code === "auth/invalid-credential") {
      message.error("Mật khẩu không chính xác");
    } else {
      console.error("Lỗi không xác định:", error.message);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }

    return false;
  }
};
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    if (oldPassword === newPassword) {
      throw new Error("Mật khẩu mới không được giống mật khẩu cũ");
    }
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    let errorMessage;
    console.log(error);
    switch (error.code) {
      case "auth/weak-password":
        errorMessage = "Mật khẩu mới quá yếu";
        break;
      case "auth/requires-recent-login":
        errorMessage = "Vui lòng đăng nhập lại trước khi thay đổi mật khẩu";
        break;
      case "auth/invalid-credential":
        errorMessage = "Mật khẩu cũ không chính xác";
        break;
      case "auth/too-many-requests":
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau";
        break;
      default:
        errorMessage = "An unknown error occurred";
        break;
    }
    throw new Error(errorMessage);
  }
};

export const sendEmailVerificationAgain = async (password) => {
  const randomVerifyToken = generateToken();
  const actionCodeSettingss = {
    url:
      "http://localhost:3000/user/account?type=security-password&step=2&verifyToken=" +
      randomVerifyToken,
    handleCodeInApp: true, // Có xử lý trong ứng dụng không
  };
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await sendEmailVerification(user, actionCodeSettingss);
    localStorage.setItem("verifyToken", randomVerifyToken);
    localStorage.setItem("tokenExpiration", Date.now() + 5 * 60 * 1000);
  } catch (error) {
    let errorMessage;
    console.log(error);
    switch (error.code) {
      case "auth/requires-recent-login":
        errorMessage = "Vui lòng đăng nhập lại trước khi thay đổi mật khẩu";
        break;
      case "auth/invalid-credential":
        errorMessage = "Mật khẩu không chính xác";
        break;
      case "auth/too-many-requests":
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau";
        break;
      default:
        errorMessage = "An unknown error occurred";
        break;
    }
    throw new Error(errorMessage);
  }
};

export const sendEmailVerificationAgainForAdmin = async (password) => {
  const randomVerifyToken = generateToken();
  const actionCodeSettingss = {
    url:
      "http://localhost:3000/admin/account?type=security-password&step=2&verifyToken=" +
      randomVerifyToken,
    handleCodeInApp: true, // Có xử lý trong ứng dụng không
  };
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await sendEmailVerification(user, actionCodeSettingss);
    localStorage.setItem("verifyToken", randomVerifyToken);
    localStorage.setItem("tokenExpiration", Date.now() + 5 * 60 * 1000);
  } catch (error) {
    let errorMessage;
    console.log(error);
    switch (error.code) {
      case "auth/requires-recent-login":
        errorMessage = "Vui lòng đăng nhập lại trước khi thay đổi mật khẩu";
        break;
      case "auth/invalid-credential":
        errorMessage = "Mật khẩu không chính xác";
        break;
      case "auth/too-many-requests":
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau";
        break;
      default:
        errorMessage = "An unknown error occurred";
        break;
    }
    throw new Error(errorMessage);
  }
};

const checkAndUnLinkProvider = async (newEmail) => {
  const user = auth.currentUser;

  if (user.email !== newEmail) {
    unlink(user, "google.com")
      .then(() => {
        console.log("Unlink successfully");
      })
      .catch((error) => {
        console.error("Unlink failed", error);
      });
  }
};
