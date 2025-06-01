// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";




const firebaseConfig = {
  apiKey: "AIzaSyAt90IPuaKE9sXZ5MikTMdckctqINcmSVM",
  authDomain: "bachatjarcom.firebaseapp.com",
  projectId: "bachatjarcom",
  storageBucket: "bachatjarcom.firebasestorage.app",
  messagingSenderId: "707302994886",
  appId: "1:707302994886:web:c8984937e8ef7d32bff8c7",
  measurementId: "G-M5G14YQV1D"
};


const firebase_app = initializeApp(firebaseConfig);

const firebase_auth = getAuth(firebase_app);
const google_provider = new GoogleAuthProvider();

export { firebase_auth, google_provider, firebase_app };

