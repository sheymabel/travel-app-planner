import { initializeApp } from "firebase/app";
import { getAuth,} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Ta configuration Firebase
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

// Initialiser Firebase
const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);

// Initialiser les autres services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
