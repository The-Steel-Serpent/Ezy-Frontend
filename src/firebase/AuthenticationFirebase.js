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
 } from "firebase/auth";


import { authFirebase } from './firebase';

const auth = getAuth();
auth.useDeviceLanguage();

export const signUpWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(authFirebase, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);
        return user;
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Email này đã được sử dụng';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email không hợp lệ';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Operation not allowed.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Mật khẩu quá ngắn';
                break;
            default:
                errorMessage = 'An unknown error occurred.';
                break;
        }
        throw new Error(errorMessage);
    }
}


export const signInWithEmailPassword = async (email, password) => {
    try {
        await setPersistence(authFirebase, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(authFirebase, email, password);
        const user = userCredential.user;
        if (!user.emailVerified) {
            throw new Error('unverified');
        }
        return user; 
    } catch (error) {
        let errorMessage = '';
        if (error.message === 'unverified') {
            errorMessage = 'Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác nhận tài khoản.'; 
        } else {
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Tài khoản này đã bị vô hiệu hóa.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Không tìm thấy tài khoản với email này.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mật khẩu không chính xác. Vui lòng thử lại.';
                    break;
                default:
                    errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
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
            case 'auth/popup-closed-by-user':
                errorMessage = 'Đăng nhập bị hủy';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Đăng nhập bị hủy';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Lỗi mạng. Hãy kiểm tra lại kết nối';
                break;
            default:
                errorMessage = 'An unknown error occurred: ';
                break;
        }
        throw new Error(errorMessage);
    }
}

