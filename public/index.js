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

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("/path/to/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get a Firestore instance
const db = admin.firestore();

// Function to add data to Firestore
function addDataToFirestore(collectionName, documentName, data) {
  const docRef = db.collection(collectionName).doc(documentName);
  return docRef
    .set(data)
    .then(() => {
      console.log("Data added to Firestore");
    })
    .catch((error) => {
      console.error("Error adding data to Firestore: ", error);
    });
}

// Function to read data from Firestore
function readDataFromFirestore(collectionName) {
  return db
    .collection(collectionName)
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    })
    .catch((error) => {
      console.error("Error reading data from Firestore: ", error);
    });
}

// Function to get document data of a person with a given name
function getPersonDataByName(collectionName, name) {
  return db
    .collection(collectionName)
    .where("name", "==", name)
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    })
    .catch((error) => {
      console.error("Error getting person data from Firestore: ", error);
    });
}

// Example usage
const data = {
  name: "John Doe",
  email: "johndoe@example.com",
  age: 30,
};
addDataToFirestore("users", "user1", data)
  .then(() => {
    return readDataFromFirestore("users");
  })
  .then((data) => {
    console.log("Data read from Firestore: ", data);
    return getPersonDataByName("users", "John Doe");
  })
  .then((data) => {
    console.log("Person data read from Firestore: ", data);
  })
  .catch((error) => {
    console.error("Error: ", error);
  });
