import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HostPage() {
    const navigate = useNavigate(); // React Router의 navigate 함수
    const userId = localStorage.getItem("user_id"); // 로컬 스토리지에서 사용자 ID 가져오기

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
    };

    const buttonStyle = {
        margin: "10px",
        padding: "10px 20px",
        fontSize: "16px",
    };

    return (
        <div style={containerStyle}>
            <h1>호스트 페이지</h1>
            <button
                style={buttonStyle}
                onClick={() => navigate("/camp_register")}
            >
                캠핑장 등록
            </button>
            <button
                style={buttonStyle}
                onClick={() => navigate("/book_approve")}
            >
                예약 승인
            </button>
            <button
                style={buttonStyle}
                onClick={() => navigate("/site_register")}
            >
                사이트 등록
            </button>
            <button
                style={buttonStyle}
                onClick={() => navigate("/camp_update")}
            >
                캠핑장 변경
            </button>
        </div>
    );
}

export default HostPage;
