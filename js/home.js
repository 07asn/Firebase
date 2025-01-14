import { db } from "./config.js";
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Firestore functions

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

// Fetch Products from Firestore
async function fetchProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        productContainer.innerHTML = "";

        // Render Products
        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            const product = new Product(
                productData.title,
                productData.price,
                productData.description,
                productData.image
            );
            productContainer.innerHTML += product.render(doc.id);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

fetchProducts();

// Create Product
async function createProduct(title, price, description, image) {
    const newProduct = { title, price, description, image };

    try {
        // Save to Firestore
        const docRef = await addDoc(collection(db, "products"), newProduct);
        console.log("Product added to Firestore with ID:", docRef.id);

        // Refresh product list
        fetchProducts(); 
    } catch (error) {
        console.error("Error adding product to Firestore:", error);
    }
}

// Update Product
async function updateProduct(id, updatedData) {
    try {
        // Update Product in Firestore
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, updatedData);
        console.log("Product updated in Firestore:", updatedData);

        // Update Product Card in DOM
        const productCard = document.querySelector(`[data-id="${id}"]`);
        productCard.querySelector("h3").textContent = updatedData.title;
        productCard.querySelector("p:nth-child(3)").textContent = updatedData.description;
        productCard.querySelector("p:nth-child(4)").textContent = `Price: $${updatedData.price}`;
        productCard.querySelector("img").src = updatedData.image;
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

// Delete
async function deleteProduct(id) {
    try {
        // Delete From DB
        const productRef = doc(db, "products", id);
        await deleteDoc(productRef);
        console.log("Product deleted from Firestore:", id);

        // Remove From DOM
        document.querySelector(`[data-id="${id}"]`).remove();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

// Listening for Dynamic Buttons
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update-btn")) {
        const productId = e.target.parentElement.dataset.id;

        // Fetch Data When Update Button
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
    }
});

// Model Form
const formModal = document.getElementById("form-modal");
const toggleFormBtn = document.getElementById("toggle-form-btn");
const submitItemBtn = document.getElementById("submit-item-btn");

//Model Visibility
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

// Close Button
document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("form-modal").style.display = "none";
});
