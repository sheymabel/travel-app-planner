// AuthService.ts
import { auth, db } from '../configs/FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';

interface AuthUser {
  uid: string;
  fullName: string;
  email: string;
  role: 'Traveler' | 'Business Owner';
  createdAt: Date;
}
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Business} from './../models/BusinnessOwner';
export class AuthService {
  static async signUp(
    fullName: string,
    email: string,
    password: string,
    role: 'Traveler' | 'Business Owner'
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUser: AuthUser = {
      uid: user.uid,
      fullName,
      email,
      role,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), newUser);
    return userCredential;
  }

  static async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  static async signOutUser(): Promise<void> {
    return await signOut(auth);
  }

  static async getUserProfile(uid: string): Promise<AuthUser | null> {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? (snapshot.data() as AuthUser) : null;
  }

  static async addBusinessDetails(
    userId: string,
    business: Omit<Business, 'userId' | 'createdAt'>
  ): Promise<void> {
    const data: Business = {
      userId,
      createdAt: new Date().toISOString(),
      ...business,
    };
    await setDoc(doc(db, 'business', userId), data);
  }
}
// Function to fetch business data from Firestore
export const fetchBusinessFromFirestore = async (userId: string) => {
  try {
    const businessDoc = await getDoc(doc(db, 'businesses', userId));
    
    if (businessDoc.exists) {
      return businessDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
};