import { db } from "./config.js"; // Import db from config.js
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Firestore functions

// Create Product Objects
class Product {
    constructor(title, price, description, image) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    // Create Product Cards
    render(id) {
        return `
            <div class="card" data-id="${id}">
                <img src="${this.image}" alt="${this.title}">
                <h3>${this.title}</h3>
                <p>${this.description}</p>
                <p><strong>Price:</strong> $${this.price}</p>
                <button class="update-btn">Update</button>
                <button class="delete-btn">Delete</button>
            </div>`;
    }
}

const productContainer = document.getElementById("product-container");

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch("https://67855e481ec630ca33a85e27.mockapi.io/products");
        const products = await response.json();

        // Render Products
        products.map((productData) => {
            const product = new Product(
                productData.title,
                productData.price,
                productData.description,
                productData.image
            );
            productContainer.innerHTML += product.render(productData.id);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

fetchProducts();

// Create New Product
async function createProduct(title, price, description, image) {
    const newProduct = { title, price, description, image };

    try {
        // Save to Firestore
        const docRef = await addDoc(collection(db, "products"), newProduct);
        console.log("Product added to Firestore with ID:", docRef.id);

        // Add product to the DOM dynamically
        const product = new Product(
            newProduct.title,
            newProduct.price,
            newProduct.description,
            newProduct.image
        );
        productContainer.innerHTML += product.render(docRef.id);
    } catch (error) {
        console.error("Error adding product to Firestore:", error);
    }
}

// Update Product
async function updateProduct(id) {
    const updatedData = {
        title: "Updated Product Title",
        price: "0.0",
    };

    try {
        const response = await fetch(`https://67855e481ec630ca33a85e27.mockapi.io/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        const updatedProduct = await response.json();
        console.log("Product updated:", updatedProduct);

        // Dynamic Update the title in the DOM
        const productCard = document.querySelector(`[data-id="${id}"]`);
        productCard.querySelector("h3").textContent = updatedData.title;
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

// Delete Product
async function deleteProduct(id) {
    try {
        const response = await fetch(`https://67855e481ec630ca33a85e27.mockapi.io/products/${id}`, {
            method: "DELETE",
        });
        console.log("Product deleted:", await response.json());

        // Remove product from the DOM
        document.querySelector(`[data-id="${id}"]`).remove();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

// Listening for Dynamic Buttons
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update-btn")) {
        const productId = e.target.parentElement.dataset.id;
        updateProduct(productId);
    }

    if (e.target.classList.contains("delete-btn")) {
        const productId = e.target.parentElement.dataset.id;
        deleteProduct(productId);
    }
});

// Modal Functionality
const formModal = document.getElementById("form-modal");
const toggleFormBtn = document.getElementById("toggle-form-btn");
const submitItemBtn = document.getElementById("submit-item-btn");

// Toggle the modal visibility
toggleFormBtn.addEventListener("click", () => {
    if (formModal.style.display === "flex") {
        formModal.style.display = "none";
        toggleFormBtn.textContent = "Show Form";
    } else {
        formModal.style.display = "flex";
        toggleFormBtn.textContent = "Hide Form";
    }
});

// Form Submission
submitItemBtn.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;

    if (title && price && description && image) {
        createProduct(title, price, description, image);
        formModal.style.display = "none";
        toggleFormBtn.textContent = "Show Form"; // Reset button text after submission
        document.getElementById("product-form").reset();
    } else {
        alert("Please fill out all fields!");
    }
});

// Close Button Logic
document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("form-modal").style.display = "none";
});

// Show Form Modal Logic (already implemented)
document.getElementById("add-item-btn").addEventListener("click", () => {
    document.getElementById("form-modal").style.display = "flex"; // Show modal
});
