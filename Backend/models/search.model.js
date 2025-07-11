import pool from "../config/DbConnection.config.js";

export function searchCaterogry(category) {
    const searchquery = `
        SELECT * FROM products 
        WHERE category LIKE ?
    `;
    // console.log("category in model:", category);

    return new Promise((resolve, reject) => {
        pool.query(searchquery, [`%${category}%`], (err, result) => {
            if (err) {
                console.log("Error in model:", err);
                return reject(err);
            }
            // console.log("Result in search model:", result);
            return resolve(result);
        });
    });
}
