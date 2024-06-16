import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function SiteRegisterDetailPage() {
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const { campId } = useParams();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("camp_id", campId);
        formData.append("price", price);
        formData.append("capacity", capacity);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/site_register_detail",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert(response.data.message);
            navigate("/host");
        } catch (error) {
            console.error("상세 정보 등록 에러:", error);
            alert("상세 정보 등록 에러");
        }
    };

    return (
        <div>
            <h1>사이트 등록 상세 페이지</h1>
            <h2>캠핑장 ID: {campId}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    가격:
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    수용 인원:
                    <input
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    이미지 업로드:
                    <input type="file" onChange={handleImageChange} />
                </label>
                <br />
                <button type="submit">사이트 정보 등록</button>
            </form>
        </div>
    );
}

export default SiteRegisterDetailPage;
