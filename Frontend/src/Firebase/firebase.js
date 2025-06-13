// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB322oM6JqQwtiO8KGaOPPDFc6IkvNPqKg",
  authDomain: "test-5f195.firebaseapp.com",
  projectId: "test-5f195",
  storageBucket: "test-5f195.appspot.com",
  messagingSenderId: "914774848340",
  appId: "1:914774848340:web:7bc1ce9514435b3af74ec1",
  measurementId: "G-5HHGSSX4D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();