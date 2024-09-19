import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    sendEmailVerification,
    RecaptchaVerifier
 } from "firebase/auth";


import { authFirebase } from './firebase';

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
                errorMessage = 'Email is already in use.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Operation not allowed.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak.';
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
        const userCredential = await signInWithEmailAndPassword(authFirebase, email, password);
        const user = userCredential.user;

        if(user.emailVerified){
            return user;
        }
        else{
            throw new Error("Please verify your email");
        }
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/user-disabled':
                errorMessage = 'User account is disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No user found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            default:
                errorMessage = error.message || 'An unknown error occurred.';
                break;
        }
        throw new Error(errorMessage);
    }
}


export const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error
    }
}

export const signInWithNumberPhone = async (phoneNumber, appVerifier) => {
    const auth = getAuth();
    try {
        const confirmationResult = await signInWithNumberPhone(auth,phoneNumber, appVerifier);
        return confirmationResult;
    } catch (error) {
        console.error("Error:",error);
        throw error;
    }
}


