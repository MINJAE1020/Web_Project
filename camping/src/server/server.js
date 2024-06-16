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

app.use("/uploads", express.static(uploadDir));

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

    try {
        // Check if the camp exists
        const [campRows] = await db.query(
            "SELECT * FROM camp WHERE camp_id = ?",
            [camp_id]
        );

        if (campRows.length === 0) {
            return res
                .status(404)
                .json({ message: "캠핑장을 찾을 수 없습니다." });
        }

        // Insert booking into the database
        await db.query(
            "INSERT INTO book (cust_id, camp_id, adults, children, check_in_date, check_out_date, book_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                cust_id,
                camp_id,
                adults,
                children,
                check_in_date,
                check_out_date,
                book_status,
            ]
        );

        return res
            .status(201)
            .json({ message: "예약이 성공적으로 완료되었습니다." });
    } catch (error) {
        console.error("예약 처리 중 오류 발생:", error);
        return res
            .status(500)
            .json({ message: "예약을 처리하는 중 오류가 발생했습니다." });
    }
});

app.get("/bookings/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM book WHERE cust_id = ?", [
            userId,
        ]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "Error fetching bookings" });
    }
});

app.put("/bookings/:bookingId", async (req, res) => {
    const { bookingId } = req.params;
    const { book_status } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE book SET book_status = ? WHERE book_id = ?",
            [book_status, bookingId]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "예약 상태 업데이트 성공" });
        } else {
            return res
                .status(404)
                .json({ message: "예약을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("Error updating booking:", error);
        return res.status(500).json({ message: "예약 업데이트 중 오류 발생" });
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

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

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
        const [rows] = await db.query("SELECT * FROM camp WHERE camp_id = ?", [
            id,
        ]);
        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            return res
                .status(404)
                .json({ message: "캠핑장을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("캠핑장 상세 정보 조회 에러:", error);
        return res.status(500).json({ message: "캠핑장 상세 정보 조회 에러" });
    }
});

app.post("/camp_update/:campId", async (req, res) => {
    const { campId } = req.params;
    const {
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

    try {
        const [result] = await db.query(
            "UPDATE camp SET camp_name = ?, camp_type = ?, camp_address = ?, Information = ?, facility = ?, environment = ?, start_manner = ?, over_manner = ?, contact = ?, introduction = ?, check_in_time = ?, check_out_time = ? WHERE camp_id = ?",
            [
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
                campId,
            ]
        );

        if (result.affectedRows > 0) {
            return res
                .status(200)
                .json({ message: "캠프 정보가 업데이트되었습니다." });
        } else {
            return res
                .status(404)
                .json({ message: "캠프를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("캠프 정보 업데이트 에러:", error);
        return res.status(500).json({ message: "캠프 정보 업데이트 에러" });
    }
});

app.put("/site_update/:siteId", async (req, res) => {
    const { siteId } = req.params;
    const { price, capacity } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE site SET price = ?, capacity = ? WHERE site_id = ?",
            [price, capacity, siteId]
        );

        if (result.affectedRows > 0) {
            return res
                .status(200)
                .json({ message: "사이트 정보 업데이트 성공" });
        } else {
            return res
                .status(404)
                .json({ message: "사이트를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("사이트 정보 업데이트 중 오류:", error);
        return res
            .status(500)
            .json({ message: "사이트 정보 업데이트 중 오류" });
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

    try {
        const insertQuery =
            "INSERT INTO book (cust_id, camp_id, adults, children, check_in_date, check_out_date, book_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            cust_id,
            camp_id,
            adults,
            children,
            check_in_date,
            check_out_date,
            book_status,
        ];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error("예약 등록 중 오류:", err);
                return res
                    .status(500)
                    .json({ message: "예약 등록 중 오류가 발생했습니다." });
            }

            console.log("예약이 성공적으로 등록되었습니다.");
            return res
                .status(201)
                .json({ message: "예약이 성공적으로 등록되었습니다." });
        });
    } catch (error) {
        console.error("예약 등록 중 오류:", error);
        return res
            .status(500)
            .json({ message: "예약 등록 중 오류가 발생했습니다." });
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

app.get("/camps_view", async (req, res) => {
    const { host_id } = req.query;

    try {
        const [rows] = await db.query("SELECT * FROM camp WHERE host_id = ?", [
            host_id,
        ]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("캠프 정보 조회 에러:", error);
        return res.status(500).json({ message: "캠프 정보 조회 에러" });
    }
});

app.put("/camp_update/:campId", async (req, res) => {
    const { campId } = req.params;
    const {
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

    try {
        await db.query(
            "UPDATE camp SET camp_name = ?, camp_type = ?, camp_address = ?, Information = ?, facility = ?, environment = ?, start_manner = ?, over_manner = ?, contact = ?, introduction = ?, check_in_time = ?, check_out_time = ? WHERE camp_id = ?",
            [
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
                campId,
            ]
        );

        return res
            .status(200)
            .json({ message: "캠프 정보가 업데이트되었습니다." });
    } catch (error) {
        console.error("캠프 정보 업데이트 에러:", error);
        return res.status(500).json({ message: "캠프 정보 업데이트 에러" });
    }
});

app.post("/site_register_detail", upload.single("image"), async (req, res) => {
    const { camp_id, price, capacity } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

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

app.get("/site_views/:campId", async (req, res) => {
    const { campId } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM site WHERE camp_id = ?", [
            campId,
        ]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("사이트 조회 중 오류:", error);
        return res.status(500).json({ message: "사이트 조회 중 오류" });
    }
});

app.delete("/site_delete/:siteId", async (req, res) => {
    const { siteId } = req.params;

    try {
        const [result] = await db.query("DELETE FROM site WHERE site_id = ?", [
            siteId,
        ]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "사이트 삭제 성공" });
        } else {
            return res
                .status(404)
                .json({ message: "사이트를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("사이트 삭제 중 오류:", error);
        return res.status(500).json({ message: "사이트 삭제 중 오류" });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
