import { initializeApp, getApps, getApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt3BReJucVCbDBD5QwUPvQHRGQvGGUjT8",

  authDomain: "saha-labs-716f0.firebaseapp.com",

  projectId: "saha-labs-716f0",

  storageBucket: "saha-labs-716f0.firebasestorage.app",

  messagingSenderId: "342233235443",

  appId: "1:342233235443:web:790f0a73e7801b32531c86",
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;