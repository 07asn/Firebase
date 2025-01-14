// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvUwExlnvDQOadvU4_uL94vhjQ1LT66DA",
    authDomain: "test-ce618.firebaseapp.com",
    projectId: "test-ce618",
    storageBucket: "test-ce618.firebasestorage.app",
    messagingSenderId: "314473188098",
    appId: "1:314473188098:web:5f9c6737906aedee3ad01b",
    measurementId: "G-3DQ7D8EJGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services
export { auth, db };
