import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBO_-uCvRlpPCIdyjhSpQ-OCDuiXAqP0vs",
  authDomain: "chatter-47ba0.firebaseapp.com",
  projectId: "chatter-47ba0",
  storageBucket: "chatter-47ba0.appspot.com",
  messagingSenderId: "427962050830",
  appId: "1:427962050830:web:f89d5ea9d9ac9ec0a74f5f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const storage = getStorage();
export const db=getFirestore()