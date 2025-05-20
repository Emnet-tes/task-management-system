// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF_UbFxRT3NpKz6GAtPuznZBmlrGGsa70",
  authDomain: "task-management-f38b4.firebaseapp.com",
  projectId: "task-management-f38b4",
  storageBucket: "task-management-f38b4.firebasestorage.app",
  messagingSenderId: "141910669297",
  appId: "1:141910669297:web:6177acfaa18b6f66efb650",
  measurementId: "G-W3QLVMD5K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);