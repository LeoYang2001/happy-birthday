// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBlhjxAmvGEnb4HIM8BzoA5nPXiIktCVY",
  authDomain: "birthday-userbehavior.firebaseapp.com",
  projectId: "birthday-userbehavior",
  storageBucket: "birthday-userbehavior.firebasestorage.app",
  messagingSenderId: "65372225861",
  appId: "1:65372225861:web:8b9970316f3dbfaf727e2c"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db,app };