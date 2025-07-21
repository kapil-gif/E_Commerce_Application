import pool from "../config/DbConnection.config.js";

const addtowishlistquery = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
export function addtowishmodel(user_id, product_id) {
    //  const userid=user_id;
    //console.log("add to wish list product model ", user_id, product_id);
    return new Promise((resolve, reject) => {
        pool.query(addtowishlistquery, [user_id, product_id], (err, result) => {
            if (err) {
                console.log(" error in model add to wishlist", err);
                return reject(err);
            }
            // console.log("result model wishlist :", result);
            return resolve(result);

        })
    })

}

export function removewishlistmodel(user_id, product_id) {
    const removewishlistquery = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
    // console.log("remove userid ,productid in model : ", user_id, product_id);

    return new Promise((resolve, reject) => {
        pool.query(removewishlistquery, [user_id, product_id], (err, result) => {
            if (err) {
                console.log("remove wishlist product", err);
                return reject(err)
            }
            return resolve(result)
        })

    })

}

export function fetchwishlistproduct(user_id) {
    // console.log("user id in model:", user_id);

    const fetchWishlistQuery = `
        SELECT p.id,p.title, p.img, p.price, p.category, u.id AS user_id FROM wishlist w
        JOIN 
            products p ON w.product_id = p.id JOIN  user u ON w.user_id = u.id WHERE w.user_id = ?`;

    return new Promise((resolve, reject) => {
        pool.query(fetchWishlistQuery, [user_id], (err, result) => {
            if (err) {
                console.log("query error:", err);
                return reject(err);
            }
            //console.log("result:", result);
            return resolve(result);
        });
    });
}

export function fetchdetailsOrder(user_id, product_id) {
    const fetchdetailsorderquery = ``
    return new Promise((resolve, reject) => {
        pool.query(fetchdetailsorderquery, [], (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result);
        })
    })
}




