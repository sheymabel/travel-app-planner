// AuthService.ts
import { auth, db } from '../configs/FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthUser } from '../models/AuthUser';
import { BusinessOwner } from '../models/BusinessOwner';

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
    business: Omit<BusinessOwner, 'userId' | 'createdAt'>
  ): Promise<void> {
    const data: BusinessOwner = {
      userId,
      createdAt: new Date().toISOString(),
      ...business,
    };
    await setDoc(doc(db, 'businesses', userId), data);
  }
}
