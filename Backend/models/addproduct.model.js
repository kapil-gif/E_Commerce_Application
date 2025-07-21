import pool from "../config/DbConnection.config.js";

export function AddNewProduct(data) {
    const {
        title,
        description,
        category,
        price,
        discountPercentage,
        img,
        thumbnail,
        brand,

    } = data;
    //console.log("data in model new product :", data.title, data.description, data.category, data.price, data.discountPercentage, data.img, data.thumbnail, data.brand, data.rating);

    const newproductquery = `
        INSERT INTO PRODUCTS 
        (TITLE, description, category, price, discountPercentage, img, thumbnail, brand)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        pool.execute(
            newproductquery,
            [data.title, data.description, data.category, data.price, data.discountPercentage, data.img, data.thumbnail, data.brand],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            }
        );
    });
}
