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

    // Create Cards
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

export async function fetchProducts(productContainer) {
    try {
        const request = await getDocs(collection(db, "products"));
        productContainer.innerHTML = "";

        // View Cards
        request.forEach((doc) => {
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

export async function createProduct(title, price, description, image) {
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

export async function updateProduct(id, updatedData) {
    try {
        // Update Product in Firestore
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, updatedData);
        console.log("Product updated in Firestore:", updatedData);
        fetchProducts();
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

export async function deleteProduct(id) {
    try {
        // Delete From DB
        const productRef = doc(db, "products", id);
        await deleteDoc(productRef);
        console.log("Product deleted from Firestore:", id);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}
