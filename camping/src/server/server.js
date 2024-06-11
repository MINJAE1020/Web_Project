const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const uuid4 = require("uuid4");
const app = express();
const port = 8080;
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

app.post("/login", async (req, res) => {
    const { user_id, user_pw } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM user WHERE user_id = ? AND user_pw = ?",
            [user_id, user_pw]
        );
        if (rows.length > 0) {
            return res
                .status(200)
                .json({ message: "로그인 성공", user_id: user_id });
        } else {
            return res.status(401).json({ message: "로그인 실패" });
        }
    } catch (error) {
        console.error("로그인 에러", error);
        return res.status(500).json({ message: "로그인 에러" });
    }
});

app.post("/signup", async (req, res) => {
    const { user_id, user_pw, user_type } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM user WHERE user_id = ?", [
            user_id,
        ]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "중복된 아이디입니다." });
        }

        await db.query(
            "INSERT INTO user (user_id, user_pw, user_type) VALUES (?, ?, ?)",
            [user_id, user_pw, user_type]
        );
        return res.status(201).json({ message: "회원가입 성공" });
    } catch (error) {
        console.error("회원가입 에러:", error);
        return res.status(500).json({ message: "회원가입 에러" });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
