// Import the required functions
import { auth } from "./config.js"; // Import auth from config.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Form Event Listener
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Create user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User successfully registered
            const user = userCredential.user;
            alert("User successfully created!");
            console.log(user);
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
        });
});
