// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔹 Your Firebase Config (Replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyD9FhwPKZL-u5wX_I4kiox-Lf2HG0Zsy7U",
  authDomain: "arqevent-9ac90.firebaseapp.com",
  projectId: "arqevent-9ac90",
  storageBucket: "arqevent-9ac90.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "18080128092",
  appId: "1:18080128092:web:ac4302d91ced259fc29a99"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL };