// home.js
import { fetchProducts, createProduct, updateProduct, deleteProduct } from './productService.js';

const productContainer = document.getElementById("product-container");
const formModal = document.getElementById("form-modal");
const toggleFormBtn = document.getElementById("toggle-form-btn");
const submitItemBtn = document.getElementById("submit-item-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

// Fetch products and View Cards
fetchProducts(productContainer);

// Listening for Dynamic Buttons
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update-btn")) {
        const productId = e.target.parentElement.dataset.id;

        // Fetch Exist Data When Update Button
        const productCard = e.target.parentElement;
        document.getElementById("title").value = productCard.querySelector("h3").textContent;
        document.getElementById("price").value = productCard.querySelector("p:nth-child(4)").textContent.replace("Price: $", "");
        document.getElementById("description").value = productCard.querySelector("p:nth-child(3)").textContent;
        document.getElementById("image").value = productCard.querySelector("img").src;

        // Set product ID in the hidden input field
        document.getElementById("product-id").value = productId;

        // Show the form
        formModal.style.display = "flex";
    }

    if (e.target.classList.contains("delete-btn")) {
        const productId = e.target.parentElement.dataset.id;
        deleteProduct(productId);
        e.target.parentElement.remove(); // Remove from DOM
    }
});

// Model Visibility
toggleFormBtn.addEventListener("click", () => {
    if (formModal.style.display === "flex") {
        formModal.style.display = "none";
    } else {
        formModal.style.display = "flex";
    }
});

// Form Handler
submitItemBtn.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const productId = document.getElementById("product-id").value;

    // Check if Exist or New
    if (title && price && description && image) {
        if (productId) {
            updateProduct(productId, { title, price, description, image });
        } else {
            createProduct(title, price, description, image);
        }

        formModal.style.display = "none";
        document.getElementById("product-form").reset();
        document.getElementById("product-id").value = ""; // Reset hidden field
    } else {
        alert("Please fill out all fields!");
    }
});

// Close Modal Button
closeModalBtn.addEventListener("click", () => {
    formModal.style.display = "none";
});
