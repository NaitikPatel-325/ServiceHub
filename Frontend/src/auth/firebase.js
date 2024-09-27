import { initializeApp } from 'firebase/app';

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const firebaseConfig = {
  apiKey: "AIzaSyBPzJYpelAR8bBF3CP5He1iKx6hYT0m3DU",
  authDomain: "servicehub-32dfd.firebaseapp.com",
  projectId: "servicehub-32dfd",
  storageBucket: "servicehub-32dfd.appspot.com",
  messagingSenderId: "697941381072",
  appId: "1:697941381072:web:0abdf89534d85496c073d5",
  measurementId: "G-N1EXC1EX3Y"
};

const app = initializeApp(firebaseConfig);
