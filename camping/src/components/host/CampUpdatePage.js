import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CampUpdatePage = () => {
    const [campData, setCampData] = useState([]);
    const [editingCampId, setEditingCampId] = useState(null); // 수정 중인 캠프의 ID
    const [formData, setFormData] = useState({
        camp_name: "",
        camp_type: "",
        camp_address: "",
        Information: "",
        facility: "",
        environment: "",
        start_manner: "",
        over_manner: "",
        contact: "",
        introduction: "",
        check_in_time: "",
        check_out_time: "",
    });
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (userId) {
            axios
                .get(`http://localhost:8080/camps_view?host_id=${userId}`)
                .then((response) => {
                    setCampData(response.data);
                })
                .catch((error) => {
                    console.error(
                        "캠프 정보를 가져오는 데 실패했습니다:",
                        error
                    );
                });
        }
    }, [userId]);

    // 입력 폼 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 수정 폼 제출 핸들러
    const handleSubmit = (campId) => {
        axios
            .post(`http://localhost:8080/camp_update/${campId}`, formData)
            .then((response) => {
                console.log(
                    "캠프 정보가 성공적으로 수정되었습니다:",
                    response.data
                );
                alert("캠프 정보가 성공적으로 수정되었습니다.");
                // 수정 완료 후 새로고침하거나 다시 데이터를 가져오는 등의 작업 수행
                setEditingCampId(null); // 수정 상태 초기화
                // 수정 후에 캠프 목록 다시 가져오기
                fetchCampData();
            })
            .catch((error) => {
                console.error("캠프 정보 수정에 실패했습니다:", error);
            });
    };

    // 캠프 목록 다시 가져오기
    const fetchCampData = () => {
        axios
            .get(`http://localhost:8080/camps_view?host_id=${userId}`)
            .then((response) => {
                setCampData(response.data);
            })
            .catch((error) => {
                console.error(
                    "캠프 정보를 다시 가져오는 데 실패했습니다:",
                    error
                );
            });
    };

    // 수정 폼 표시 핸들러
    const handleEdit = (campId) => {
        setEditingCampId(campId); // 수정 중인 캠프의 ID 설정
        // 해당 캠프의 정보를 초기 값으로 설정
        const editingCamp = campData.find((camp) => camp.camp_id === campId);
        if (editingCamp) {
            setFormData({
                camp_name: editingCamp.camp_name,
                camp_type: editingCamp.camp_type,
                camp_address: editingCamp.camp_address,
                Information: editingCamp.Information,
                facility: editingCamp.facility,
                environment: editingCamp.environment,
                start_manner: editingCamp.start_manner,
                over_manner: editingCamp.over_manner,
                contact: editingCamp.contact,
                introduction: editingCamp.introduction,
                check_in_time: editingCamp.check_in_time,
                check_out_time: editingCamp.check_out_time,
            });
        }
    };

    return (
        <div>
            <ul>
                {campData.map((camp) => (
                    <li key={camp.camp_id}>
                        {editingCampId === camp.camp_id ? (
                            <div>
                                <input
                                    type="text"
                                    name="camp_name"
                                    value={formData.camp_name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="camp_type"
                                    value={formData.camp_type}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="camp_address"
                                    value={formData.camp_address}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="Information"
                                    value={formData.Information}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="facility"
                                    value={formData.facility}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="environment"
                                    value={formData.environment}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="start_manner"
                                    value={formData.start_manner}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="over_manner"
                                    value={formData.over_manner}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="check_in_time"
                                    value={formData.check_in_time}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="check_out_time"
                                    value={formData.check_out_time}
                                    onChange={handleInputChange}
                                />
                                <button
                                    onClick={() => handleSubmit(camp.camp_id)}
                                >
                                    저장
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>캠핑장 이름: {camp.camp_name}</p>
                                <p>캠핑장 종류: {camp.camp_type}</p>
                                <p>캠핑장 주소: {camp.camp_address}</p>
                                <p>정보: {camp.Information}</p>
                                <p>시설: {camp.facility}</p>
                                <p>환경: {camp.environment}</p>
                                <p>입장 방법: {camp.start_manner}</p>
                                <p>퇴장 방법: {camp.over_manner}</p>
                                <p>연락처: {camp.contact}</p>
                                <p>소개: {camp.introduction}</p>
                                <p>체크인 시간: {camp.check_in_time}</p>
                                <p>체크아웃 시간: {camp.check_out_time}</p>
                                <button
                                    onClick={() => handleEdit(camp.camp_id)}
                                >
                                    수정
                                </button>
                            </div>
                        )}
                        <Carousel showThumbs={false} showArrows={true}>
                            {camp.img_url.split(",").map((imageUrl, index) => (
                                <div key={index}>
                                    <img
                                        src={`http://localhost:8080${imageUrl.trim()}`}
                                        alt={`Image ${index + 1}`}
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "contain", // 이미지 비율 유지
                                        }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CampUpdatePage;
