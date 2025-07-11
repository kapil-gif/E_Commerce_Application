import pool from "../config/DbConnection.config.js";

function fetchdata(offset, limit) {
    const QUERY = "SELECT * FROM products LIMIT ? OFFSET ?";

    return new Promise((resolve, reject) => {
        pool.query(QUERY, [limit, offset], (err, result) => {
            if (err) {
                console.log("DB Error:", err);
                return reject(err);
            }
            //console.log("result fetch product result model :", result);

            resolve(result);
        });
    });
}

export default fetchdata;
