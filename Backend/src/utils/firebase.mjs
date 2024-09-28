import admin from "firebase-admin";
import config from "../config/index.mjs";

const firebaseConfig = {
    apiKey: "AIzaSyBSeTuFiUHC88ZAcAGPRnQbw9Ie0CjID74",
    authDomain: "servicehub-59dcd.firebaseapp.com",
    projectId: "servicehub-59dcd",
    storageBucket: "servicehub-59dcd.appspot.com",
    messagingSenderId: "801768227674",
    appId: "1:801768227674:web:dad7c219a7e59b1ee62963",
    measurementId: "G-9L1VZ222L7"
  };
const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default {
  auth: firebase.auth()
};