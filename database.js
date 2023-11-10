const mysql = require('mysql2')

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '11337799Ee__',
    database: 'new_db'
}).promise()

const result = await pool.query("SELECT * FROM task;")
console.log(result)