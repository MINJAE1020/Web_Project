import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/signup.css"

function SignupPage() {
    const [user_id, setId] = useState("");
    const [user_pw, setPw] = useState("");
    const [user_type, setUserType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user_type) {
            alert("사용자 유형을 선택해주세요.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/signup", {
                user_id,
                user_pw,
                user_type,
            });
            console.log(response.data);
            if (response.data.message === "회원가입 성공") {
                alert("회원가입 성공");
                navigate("/");
            } else {
                alert("회원가입 실패: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("회원가입 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
            <div>
                <input
                    type="text"
                    placeholder="ID"
                    value={user_id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="password"
                    value={user_pw}
                    onChange={(e) => setPw(e.target.value)}
                />
            </div>
            <select
                value={user_type}
                onChange={(e) => setUserType(e.target.value)}
            >
                <option value="">사용자 유형 선택</option>
                <option value="cust">고객</option>
                <option value="host">호스트</option>
            </select>
            <div>
                <button type="submit">회원가입</button>
            </div>
        </form>
    );
}

export default SignupPage;
