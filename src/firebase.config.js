import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwXvjVlys3Q0bdEqgBSVwaGfwRl4tUwY4",
  authDomain: "lavarap-18ef0.firebaseapp.com",
  projectId: "lavarap-18ef0",
  storageBucket: "lavarap-18ef0.firebasestorage.app",
  messagingSenderId: "509887694211",
  appId: "1:509887694211:web:3a30f06dfd2d12e548a2b6"
};

// Inicializa primero
const app = initializeApp(firebaseConfig);

// Luego exporta la base de datos
export const db = getFirestore(app);