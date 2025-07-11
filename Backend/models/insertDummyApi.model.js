import axios from "axios";
import pool from "../config/DbConnection.config.js"; // already configured pool

export async function insertDummyProducts() {
    try {
        // Fetch data from dummyjson
        const response = await axios.get('https://dummyjson.com/products?limit=100');
        const products = response.data.products;

        const insertQuery = `
      INSERT INTO products 
        (id, title, description, category, price, discountPercentage, img, thumbnail, brand, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        for (const product of products) {
            const values = [
                product.id,
                product.title,
                product.description,
                product.category,
                product.price,
                product.discountPercentage,
                JSON.stringify(product.images), // save whole array
                product.thumbnail,
                product.brand,
                product.rating
            ];


            try {
                await pool.execute(insertQuery, values);
                //console.log(`Inserted: ${product.title}`);
            } catch (insertErr) {
                console.error(`Error inserting ${product.title}:`, insertErr.message);
            }
        }

        console.log("All products inserted.");
    } catch (error) {
        console.error("Failed to insert data:", error.message);
    }
}

insertDummyProducts();
