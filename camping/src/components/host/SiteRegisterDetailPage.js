import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function SiteRegisterDetailPage() {
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState(null);
    const [sites, setSites] = useState([]);
    const navigate = useNavigate();
    const { campId } = useParams();

    useEffect(() => {
        fetchSites();
    }, [campId]);

    const fetchSites = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/site_views/${campId}`
            );
            setSites(response.data);
        } catch (error) {
            console.error("사이트 정보를 가져오는 중 오류 발생:", error);
        }
    };

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
            fetchSites(); // 새로 등록한 사이트를 포함하도록 목록 갱신
            setPrice("");
            setCapacity("");
            setImage(null);
        } catch (error) {
            console.error("상세 정보 등록 에러:", error);
            alert("상세 정보 등록 에러");
        }
    };

    const handleDelete = async (siteId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/site_delete/${siteId}`
            );
            alert(response.data.message);
            fetchSites(); // 삭제 후 목록 갱신
        } catch (error) {
            console.error("사이트 삭제 중 오류 발생:", error);
            alert("사이트 삭제 중 오류 발생");
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
            <h2>등록된 사이트 목록</h2>
            {sites.length === 0 ? (
                <p>등록된 사이트가 없습니다.</p>
            ) : (
                <ul>
                    {sites.map((site) => (
                        <li key={site.site_id}>
                            <p>가격: {site.price}</p>
                            <p>수용 인원: {site.capacity}</p>
                            {site.img_url && (
                                <img
                                    src={`http://localhost:8080${site.img_url}`}
                                    alt="Site"
                                />
                            )}
                            <button onClick={() => handleDelete(site.site_id)}>
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SiteRegisterDetailPage;
