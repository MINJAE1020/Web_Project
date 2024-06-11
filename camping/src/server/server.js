const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
const cron = require("cron");
const axios = require("axios");
const app = express();
const port = 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "camping",
    port: 3306,
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
