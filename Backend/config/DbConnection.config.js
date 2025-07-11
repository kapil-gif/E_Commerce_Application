import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config();

const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// export default pool;




// import mysql2 from 'mysql2';

// const pool = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123456',
//     database: 'ecommerce',
// });

pool.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    // console.log('Connected with ID', pool);
});

export default pool



