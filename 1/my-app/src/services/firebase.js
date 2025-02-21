import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBMZidq-S_7gZ0V8d3eF16E3mLC-Gfq0GI",
  authDomain: "homeworks-42d27.firebaseapp.com",
  databaseURL: "https://homeworks-42d27-default-rtdb.firebaseio.com",
  projectId: "homeworks-42d27",
  storageBucket: "homeworks-42d27.firebasestorage.app",
  messagingSenderId: "261417461821",
  appId: "1:261417461821:web:b01c640ec9ad3b3852a254",
  measurementId: "G-05R5RZ9ZPS",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
