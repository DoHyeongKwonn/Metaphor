// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS1ZLV_vbAQ58BP2W8yayBmfFFi9nc77M",
  authDomain: "metaphor-c07b1.firebaseapp.com",
  projectId: "metaphor-c07b1",
  storageBucket: "metaphor-c07b1.appspot.com",
  messagingSenderId: "977136780583",
  appId: "1:977136780583:web:19eb711dc8bd4af5905502",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account", // 사용자에게 계정 선택을 강제합니다.
  });
  try {
    await signInWithPopup(auth, provider);
    // 로그인 성공 시, 필요한 경우 여기서 사용자 정보를 처리할 수 있습니다.
    return true; // 로그인 성공을 명시적으로 반환
  } catch (error) {
    console.error("구글 로그인 실패:", error);
    return false; // 로그인 실패를 명시적으로 반환
  }
};
