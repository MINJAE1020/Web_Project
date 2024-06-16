import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SiteRegisterPage() {
    const [camps, setCamps] = useState([]);
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (userId) {
            axios
                .get(`http://localhost:8080/camps?host_id=${userId}`)
                .then((response) => {
                    setCamps(response.data);
                })
                .catch((error) => {
                    console.error(
                        "캠프 정보를 가져오는 데 실패했습니다:",
                        error
                    );
                });
        }
    }, [userId]);

    return (
        <div>
            <h1>사이트 등록 페이지</h1>
            <h2>호스트 ID: {userId}</h2>
            <h3>호스트와 관련된 캠핑장 정보:</h3>
            <ul>
                {camps.map((camp) => (
                    <li key={camp.camp_id}>
                        <Link to={`/site_register_detail/${camp.camp_id}`}>
                            <p>캠핑장 ID: {camp.camp_id}</p>
                        </Link>
                        <p>캠핑장 이름: {camp.camp_name}</p>
                        <p>캠핑장 주소: {camp.camp_address}</p>
                        <p>연락처: {camp.contact}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SiteRegisterPage;
