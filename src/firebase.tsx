import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKkZr5FGcbG-L_mtnuQG8ySFAt8JGXHIo",
  authDomain: "mealplan-1a268.firebaseapp.com",
  projectId: "mealplan-1a268",
  storageBucket: "mealplan-1a268.firebasestorage.app",
  messagingSenderId: "783674475499",
  appId: "1:783674475499:web:fe5616e80a3bca28e48fae",
  measurementId: "G-LT4GHKCB98",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
console.log("Firebase initialized", app.name);