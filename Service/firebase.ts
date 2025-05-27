// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZAUUQmG2R8Xbkp3VBSkO1-9c-e1tOx9c",
  authDomain: "application-41d5f.firebaseapp.com",
  databaseURL: "https://application-41d5f-default-rtdb.firebaseio.com",
  projectId: "application-41d5f",
  storageBucket: "application-41d5f.firebasestorage.app",
  messagingSenderId: "1080187857593",
  appId: "1:1080187857593:web:b0ccffde11e28232420968",
  measurementId: "G-D8X6VZ3XPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);