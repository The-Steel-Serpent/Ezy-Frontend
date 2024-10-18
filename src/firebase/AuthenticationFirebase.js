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
} from "firebase/auth";

import { authFirebase } from "./firebase";
import { TrophyFilled } from "@ant-design/icons";

const auth = getAuth();
auth.useDeviceLanguage();

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
          errorMessage = "Tài khoản này đã bị vô hiệu hóa.";
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

export const handleSendSignInLinkToEmail = async (email) => {
  const actionCodeSettings = {
    url: `http://localhost:3000/user/account?type=email&step=2`,
    handleCodeInApp: true,
  };

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      throw new Error("Email đã được sử dụng");
    }
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
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

export const updateNewEmail = async (email, href, password) => {
  const user = auth.currentUser;
  if (email === "") {
    throw new Error("Vui lòng nhập email mới");
  }
  let errorMessage;
  if (!user) {
    errorMessage = "Bạn cần đăng nhập trước khi thay đổi email.";
    throw new Error(errorMessage);
  }
  const checkHref = await isSignInWithEmailLink(auth, href);
  if (!checkHref) {
    errorMessage = "Liên kết không hợp lệ";
    throw new Error(errorMessage);
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, email);
    return true;
  } catch (error) {
    switch (error.code) {
      case "auth/quota-exceeded":
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau một thời gian.";
        break;
      case "auth/invalid-email":
        errorMessage = "Email không hợp lệ";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Vui lòng xác thực trước khi thực hiện hành động.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.";
        break;
      default:
        errorMessage = "An unknown error occurred";
        break;
    }
    throw new Error(error.message);
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
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
