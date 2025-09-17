// Firebase Configuration
// Replace these values with your actual Firebase project configuration

const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your API key
    authDomain: "luxe-smile-xxxxx.firebaseapp.com", // Replace with your project domain
    projectId: "luxe-smile-xxxxx", // Replace with your project ID
    storageBucket: "luxe-smile-xxxxx.appspot.com", // Replace with your storage bucket
    messagingSenderId: "123456789012", // Replace with your sender ID
    appId: "1:123456789012:web:abcdefghijklmnop" // Replace with your app ID
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export Firebase functions for use in other scripts
window.firebaseDB = {
    db: db,
    doc: doc,
    setDoc: setDoc,
    getDoc: getDoc,
    onSnapshot: onSnapshot
};

console.log('Firebase initialized successfully');
