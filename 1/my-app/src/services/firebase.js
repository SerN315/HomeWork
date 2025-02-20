import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBMZidq-S_7gZ0v*d3eF16E3mLC-Gfq0GI",
  authDomain: "homeworks-42d27.firebaseapp.com",
  projectId: "homeworks-42d27",
  storageBucket: "homeworks-42d27.firebasestorage.app",
  messagingSenderId: "261417461821",
  appId: "1:261417461821:web:b01c640ec9ad3b3852a254",
  measurementId: "G-05R5RZ9ZPS",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
