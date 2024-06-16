const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const uuid4 = require("uuid4");
const fs = require("fs");
const app = express();
const port = 8080;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuid4() + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

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
            const user_type = rows[0].user_type;
            return res.status(200).json({
                message: "로그인 성공",
                user_id: user_id,
                user_type: user_type,
            });
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

app.post("/camp_register", upload.array("images", 10), async (req, res) => {
    const {
        host_id,
        camp_name,
        camp_type,
        camp_address,
        Information,
        facility,
        environment,
        start_manner,
        over_manner,
        contact,
        introduction,
        check_in_time,
        check_out_time,
    } = req.body;

    const imagePaths = req.files.map((file) => file.path);

    try {
        await db.query(
            "INSERT INTO camp (host_id, camp_name, camp_type, camp_address, Information, facility, environment, start_manner, over_manner, contact, introduction, check_in_time, check_out_time, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                host_id,
                camp_name,
                camp_type,
                camp_address,
                Information,
                facility,
                environment,
                start_manner,
                over_manner,
                contact,
                introduction,
                check_in_time,
                check_out_time,
                imagePaths.join(","), // Store image paths as a comma-separated string
            ]
        );
        return res.status(201).json({ message: "캠프 등록 성공" });
    } catch (error) {
        console.error("캠프 등록 에러:", error);
        return res.status(500).json({ message: "캠프 등록 에러" });
    }
});

////////////////////////////////////////camp_home, detail, book
app.get("/camp_details", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM camp");
        return res.status(200).json(rows);
    } catch (error) {
        console.error("캠프 상세 정보 조회 에러:", error);
        return res.status(500).json({ message: "캠프 상세 정보 조회 에러" });
    }
});

app.get("/camp_details/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM camp WHERE camp_id = ?", [id]);
        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            return res.status(404).json({ message: "캠핑장을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("캠핑장 상세 정보 조회 에러:", error);
        return res.status(500).json({ message: "캠핑장 상세 정보 조회 에러" });
    }
});
app.post("/booking", async (req, res) => {
    const {
      cust_id,
      camp_id,
      adults,
      children,
      check_in_date,
      check_out_date,
      book_status,
    } = req.body;
  
    // 예약 정보를 데이터베이스에 저장하는 코드
    try {
      const insertQuery = "INSERT INTO book (cust_id, camp_id, adults, children, check_in_date, check_out_date, book_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [cust_id, camp_id, adults, children, check_in_date, check_out_date, book_status];
      
      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error("예약 등록 중 오류:", err);
          return res.status(500).json({ message: "예약 등록 중 오류가 발생했습니다." });
        }
        
        console.log("예약이 성공적으로 등록되었습니다.");
        return res.status(201).json({ message: "예약이 성공적으로 등록되었습니다." });
      });
    } catch (error) {
      console.error("예약 등록 중 오류:", error);
      return res.status(500).json({ message: "예약 등록 중 오류가 발생했습니다." });
    }
  });

app.get("/camps", async (req, res) => {
    const { host_id } = req.query;

    if (!host_id) {
        return res.status(400).json({ message: "호스트 ID가 필요합니다." });
    }

    try {
        const [rows] = await db.query(
            "SELECT camp_id, camp_name, camp_address, contact FROM camp WHERE host_id = ?",
            [host_id]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error("캠프 정보 조회 에러:", error);
        return res.status(500).json({ message: "캠프 정보 조회 에러" });
    }
});

app.post("/site_register_detail", upload.single("image"), async (req, res) => {
    const { camp_id, price, capacity } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        await db.query(
            "INSERT INTO site (camp_id, price, capacity, img_url) VALUES (?, ?, ?, ?)",
            [camp_id, price, capacity, image]
        );
        return res.status(201).json({ message: "사이트 등록 성공" });
    } catch (error) {
        console.error("사이트 등록 에러:", error);
        return res.status(500).json({ message: "사이트 등록 에러" });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
