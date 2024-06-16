import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/login.css"

function LoginPage() {
    const [user_id, setId] = useState("");
    const [user_pw, setPw] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/login", {
                user_id,
                user_pw,
            });
            console.log(response.data);
            if (response.data.message === "로그인 성공") {
                alert("로그인 성공");
                localStorage.setItem("user_id", user_id);
                if (response.data.user_type === "cust") {
                    navigate("/camp_home");
                } else if (response.data.user_type === "host") {
                    navigate("/host");
                }
            } else {
                alert("로그인 실패: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("로그인 실패");
        }
    };

    const handleRegister = () => {
        navigate("/signup");
    };

    return (
        <div className="main-content">
            <div className="login-Content">
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="ID"
                        value={user_id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={user_pw}
                        onChange={(e) => setPw(e.target.value)}
                    />
                    <button type="submit" style={{ color: "black" }}>
                        로그인
                    </button>
                </form>
                <p className="message">
                    <button onClick={handleRegister} style={{ color: "black" }}>
                        회원가입
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
