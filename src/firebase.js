// Firebase SDKsから必要な関数をインポートします
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/functions";

// Firebaseの設定を記述します
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Firebaseを初期化します
firebase.initializeApp(firebaseConfig);

const analytics = firebase.analytics();
const auth = firebase.auth();
const functions = firebase.functions();
const provider = new firebase.auth.GoogleAuthProvider();

export { functions, auth, provider };