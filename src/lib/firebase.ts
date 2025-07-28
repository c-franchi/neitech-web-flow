
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtjtORVm5rHtWV5GME2t7PKdGBnG7_9sY",
  authDomain: "neitechweb.firebaseapp.com",
  projectId: "neitechweb",
  storageBucket: "neitechweb.firebasestorage.app",
  messagingSenderId: "664697345810",
  appId: "1:664697345810:web:770d0faffaf74ceafc05cb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configuração do Google Auth
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
