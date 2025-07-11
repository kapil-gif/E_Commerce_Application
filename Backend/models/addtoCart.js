import pool from "../config/DbConnection.config.js";

// Check if product is already in the cart
const checkCartQuery = `SELECT 1 FROM Cart WHERE userId = ? AND productId = ? LIMIT 1`;
// Insert new product into cart
const insertCartQuery = `INSERT INTO Cart (userId, productId, quantity,price) VALUES (?, ?, ?,?)`;
// Fetch cart products for a user
const fetchCartQuery = ` SELECT c.CartID ,p.id, p.title, p.price, p.img, c.quantity FROM Cart AS c JOIN Products AS p ON c.productId = p.id
    WHERE c.userId = ?`;
// removecart for a products
const removecartquery = `delete from Cart where CartID = ?`;

// Check if the product already exists in the user's cart.
export function checkProductInCart(user_id, product_id) {
    return new Promise((resolve, reject) => {
        pool.query(checkCartQuery, [user_id, product_id], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0); // returns true if product exists
        });
    });
}
// Add a product to the user's cart, only if it doesn't already exist.
export async function addtocart({ product_id, user_id, quantity, pprice }) {
    try {
        const alreadyExists = await checkProductInCart(user_id, product_id);
        if (alreadyExists) {
            throw { message: "Product already in cart", code: "DUPLICATE" };
        }
        return new Promise((resolve, reject) => {
            pool.query(insertCartQuery, [user_id, product_id, quantity, pprice], (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    } catch (err) {
        throw err;
    }
}
//Fetch all cart products for a user.
export async function fetchcart(user_id) {
    return new Promise((resolve, reject) => {
        pool.query(fetchCartQuery, [user_id], (err, result) => {
            if (err) { return reject(err) };
            return resolve(result);
        });
    });
}

//remove product on cart

export async function removeproductOncart(carts_id) {
    const CartID = carts_id;
    return new Promise((resolve, reject) => {
        pool.query(removecartquery, [CartID], (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result);
        });
    });
}


//update quantity
const updateQuantityQuery = `UPDATE cart SET quantity = ? WHERE cartid = ? AND userid = ?`;
export async function updatedQuantity(quantity, cart_id, user_id) {
    return new Promise((resolve, reject) => {
        //console.log(" details ", quantity, cart_id, user_id);
        pool.query(updateQuantityQuery, [quantity, cart_id, user_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

