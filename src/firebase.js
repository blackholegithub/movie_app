// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
//     appId: process.env.REACT_APP_APP_ID,
//     measurementId: process.env.REACT_APP_MEASUREMEN_ID,
// };

const firebaseConfig = { 
    apiKey : "AIzaSyB79gpLCfhNP0y0uvqRUU9V-e2euuHnVJ4" , 
    authDomain : "movie-app-924a9.firebaseapp.com" , 
    projectId : "movie-app-924a9" , 
    storageBucket : "movie-app-924a9.appspot.com" , 
    messagingSenderId : "82279237121" , 
    appId : "1:82279237121:web:0fcaf1b8674bd7d37b2200" , 
    measurementId : "G-8P6JSEWC4H" 
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)