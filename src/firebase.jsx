// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";




// todo: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOi1ow3AfecNsNYtq5S7wsZUs5Q9qbDl4",
  authDomain: "financely-tracker-92db8.firebaseapp.com",
  projectId: "financely-tracker-92db8",
  storageBucket: "financely-tracker-92db8.firebasestorage.app",
  messagingSenderId: "484554875757",
  appId: "1:484554875757:web:f965ab5464372af464b064",
  measurementId: "G-BX9DPRRVCM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc}

