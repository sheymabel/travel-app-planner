// firebase.js (for React Native Firebase)
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

// Optional: Initialize Firebase if not already initialized
// This is usually handled automatically, but you can add it for safety.
if (!firebase.apps.length) {
  firebase.initializeApp();
}

export { auth, firestore, storage, messaging, firebase }; // Export messaging for push notifications
