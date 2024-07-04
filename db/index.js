const { Pool } = require("pg");

const pool = new Pool (
    {
        user: "kristyyip",
        password: "",
        host: "localhost",
        database: "employee_db"
    },
    console.log("Connected to the employee_db database")
);

pool.connect();