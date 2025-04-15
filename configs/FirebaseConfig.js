// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
