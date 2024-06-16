import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function SiteRegisterDetailPage() {
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState(null);
    const [sites, setSites] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editSiteId, setEditSiteId] = useState(null);
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

    const handleEdit = (siteId) => {
        const siteToEdit = sites.find((site) => site.site_id === siteId);
        if (siteToEdit) {
            setEditSiteId(siteId);
            setPrice(siteToEdit.price);
            setCapacity(siteToEdit.capacity);
            setEditMode(true);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditSiteId(null);
        setPrice("");
        setCapacity("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:8080/site_update/${editSiteId}`,
                {
                    price,
                    capacity,
                }
            );
            alert(response.data.message);
            fetchSites();
            setEditMode(false);
            setEditSiteId(null);
            setPrice("");
            setCapacity("");
        } catch (error) {
            console.error("사이트 수정 중 오류 발생:", error);
            alert("사이트 수정 중 오류 발생");
        }
    };

    return (
        <div>
            <h1>사이트 등록 상세 페이지</h1>
            <h2>캠핑장 ID: {campId}</h2>
            <form onSubmit={editMode ? handleUpdate : handleSubmit}>
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
                {editMode ? (
                    <>
                        <button type="submit">사이트 정보 수정</button>
                        <button type="button" onClick={handleCancelEdit}>
                            취소
                        </button>
                    </>
                ) : (
                    <button type="submit">사이트 정보 등록</button>
                )}
            </form>
            <h2>등록된 사이트 목록</h2>
            {sites.length === 0 ? (
                <p>등록된 사이트가 없습니다.</p>
            ) : (
                <ul>
                    {sites.map((site) => (
                        <li key={site.site_id}>
                            <p>사이트 ID: {site.site_id}</p>
                            <p>가격: {site.price} 원</p>
                            <p>수용 인원: {site.capacity} 명</p>
                            {site.img_url && (
                                <img
                                    src={`http://localhost:8080${site.img_url}`}
                                    alt="Site"
                                    style={{ width: "150px", height: "150px" }}
                                />
                            )}
                            <button onClick={() => handleEdit(site.site_id)}>
                                수정
                            </button>
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
