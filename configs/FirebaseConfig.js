import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDs5-O06Eo-QnXO0YRerUoiUWHG8_k9-kA",
  authDomain: "tourism-new-38561.firebaseapp.com",
  projectId: "tourism-new-38561",
  storageBucket: "tourism-new-38561.firebasestorage.app",
  messagingSenderId: "506934421757",
  appId: "1:506934421757:web:02a79f5eb5391010fe7694"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app)//,
  //{
  //persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//});

// Initialize other services
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

export default app;