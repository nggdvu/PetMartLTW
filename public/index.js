// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLnO2As0AemLgqtaYQSBqaFF_oQn1O1K8",
  authDomain: "petmart-8be2a.firebaseapp.com",
  projectId: "petmart-8be2a",
  storageBucket: "petmart-8be2a.appspot.com",
  messagingSenderId: "998283466149",
  appId: "1:998283466149:web:b11584035bc5ac6740844c",
  measurementId: "G-E9B9YHYBHE",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
const auth = getAuth();

function login(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Đăng nhập thành công cho user " + user.email);
      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return false;
    });
  return false;
}

function register(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Created a new account successfully: " + user.displayName);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Get Firestore instance
const db = getFirestore(app);

// Write data to Firestore
async function writeData(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function readDataById(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log(`${docSnapshot.id} => ${JSON.stringify(docSnapshot.data())}`);
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}
