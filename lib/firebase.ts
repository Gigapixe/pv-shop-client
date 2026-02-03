// Firebase.js
import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider, 
} from "firebase/app-check";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  try {
    const siteKey = process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY;
    // console.log("Initializing Firebase App Check with site key:", siteKey);
    if (!siteKey) {
      throw new Error("reCAPTCHA site key is missing.");
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });

    console.log("Firebase App Check initialized.");
  } catch (error) {
    console.error("Failed to initialize App Check:", error);
  }
}

export const auth = getAuth(app);
