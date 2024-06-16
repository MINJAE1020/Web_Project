import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HostPage() {
    const [campData, setCampData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/camps_view/${userId}`
                );
                setCampData(response.data);
            } catch (error) {
                console.error("Error fetching camp data:", error);
            }
        };

        if (userId) {
            fetchCampData();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCampData((prevCampData) => ({
            ...prevCampData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/camp_update/${campData.camp_id}`,
                campData
            );
            alert(response.data.message);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating camp data:", error);
            alert("캠핑장 정보 업데이트 중 오류 발생");
        }
    };

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

    const inputStyle = {
        margin: "10px",
        padding: "10px",
        fontSize: "16px",
        width: "300px",
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
            {campData.length > 0 ? (
                campData.map((camp, index) => (
                    <div key={index}>
                        {isEditing ? (
                            <>
                                <input
                                    style={inputStyle}
                                    name="camp_name"
                                    value={camp.camp_name || ""}
                                    onChange={handleInputChange}
                                    placeholder="캠핑장 이름"
                                />
                                <input
                                    style={inputStyle}
                                    name="camp_type"
                                    value={camp.camp_type || ""}
                                    onChange={handleInputChange}
                                    placeholder="캠핑장 유형"
                                />
                                <input
                                    style={inputStyle}
                                    name="camp_address"
                                    value={camp.camp_address || ""}
                                    onChange={handleInputChange}
                                    placeholder="주소"
                                />
                                <textarea
                                    style={inputStyle}
                                    name="Information"
                                    value={camp.Information || ""}
                                    onChange={handleInputChange}
                                    placeholder="정보"
                                />
                                <input
                                    style={inputStyle}
                                    name="facility"
                                    value={camp.facility || ""}
                                    onChange={handleInputChange}
                                    placeholder="시설"
                                />
                                <input
                                    style={inputStyle}
                                    name="environment"
                                    value={camp.environment || ""}
                                    onChange={handleInputChange}
                                    placeholder="환경"
                                />
                                <input
                                    style={inputStyle}
                                    name="start_manner"
                                    value={camp.start_manner || ""}
                                    onChange={handleInputChange}
                                    placeholder="체크인 방법"
                                />
                                <input
                                    style={inputStyle}
                                    name="over_manner"
                                    value={camp.over_manner || ""}
                                    onChange={handleInputChange}
                                    placeholder="체크아웃 방법"
                                />
                                <input
                                    style={inputStyle}
                                    name="contact"
                                    value={camp.contact || ""}
                                    onChange={handleInputChange}
                                    placeholder="연락처"
                                />
                                <textarea
                                    style={inputStyle}
                                    name="introduction"
                                    value={camp.introduction || ""}
                                    onChange={handleInputChange}
                                    placeholder="소개"
                                />
                                <input
                                    style={inputStyle}
                                    name="check_in_time"
                                    value={camp.check_in_time || ""}
                                    onChange={handleInputChange}
                                    placeholder="체크인 시간"
                                />
                                <input
                                    style={inputStyle}
                                    name="check_out_time"
                                    value={camp.check_out_time || ""}
                                    onChange={handleInputChange}
                                    placeholder="체크아웃 시간"
                                />
                                <button
                                    style={buttonStyle}
                                    onClick={handleSave}
                                >
                                    저장
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setIsEditing(false)}
                                >
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>캠핑장 이름:</strong>{" "}
                                    {camp.camp_name}
                                </p>
                                <p>
                                    <strong>캠핑장 유형:</strong>{" "}
                                    {camp.camp_type}
                                </p>
                                <p>
                                    <strong>주소:</strong> {camp.camp_address}
                                </p>
                                <p>
                                    <strong>정보:</strong> {camp.Information}
                                </p>
                                <p>
                                    <strong>시설:</strong> {camp.facility}
                                </p>
                                <p>
                                    <strong>환경:</strong> {camp.environment}
                                </p>
                                <p>
                                    <strong>체크인 방법:</strong>{" "}
                                    {camp.start_manner}
                                </p>
                                <p>
                                    <strong>체크아웃 방법:</strong>{" "}
                                    {camp.over_manner}
                                </p>
                                <p>
                                    <strong>연락처:</strong> {camp.contact}
                                </p>
                                <p>
                                    <strong>소개:</strong> {camp.introduction}
                                </p>
                                <p>
                                    <strong>체크인 시간:</strong>{" "}
                                    {camp.check_in_time}
                                </p>
                                <p>
                                    <strong>체크아웃 시간:</strong>{" "}
                                    {camp.check_out_time}
                                </p>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setIsEditing(true)}
                                >
                                    수정
                                </button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default HostPage;
