import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZAUUQmG2R8Xbkp3VBSkO1-9c-e1tOx9c",
  authDomain: "application-41d5f.firebaseapp.com",
  databaseURL: "https://application-41d5f-default-rtdb.firebaseio.com",
  projectId: "application-41d5f",
  storageBucket: "application-41d5f.firebasestorage.app",
  messagingSenderId: "1080187857593",
  appId: "1:1080187857593:web:f14288987063bba7420968",
  measurementId: "G-NTRQLD2WFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize other services
export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

export default app;