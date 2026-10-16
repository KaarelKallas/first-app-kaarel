import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore — getReactNativePersistence puudub praegu firebase/auth tüübimääratlustest,
// aga funktsioon on olemas ja töötab (vt expo/fyi/firebase-js-auth-setup.md)
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9xIrF6khkAGBtwjShfRb9ldfQMAfLbgU",
  authDomain: "kaarel-app.firebaseapp.com",
  projectId: "kaarel-app",
  storageBucket: "kaarel-app.firebasestorage.app",
  messagingSenderId: "281891154999",
  appId: "1:281891154999:web:9dfb27f93b212a255863b2"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
