import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/campHomePage.css"; // CSS 파일 경로 변경

function CampHomePage() {
    const [searchName, setSearchName] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedSiteType, setSelectedSiteType] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [filteredCampsites, setFilteredCampsites] = useState([]);
    const [camps, setCamps] = useState([]);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("캠핑장 데이터를 요청합니다...");
        axios
            .get(`http://localhost:8080/camp_details`)
            .then((response) => {
                console.log("캠핑장 데이터 응답:", response.data);
                setCamps(response.data);
                setFilteredCampsites(response.data); // 초기 데이터를 전체 캠핑장 리스트로 설정
                
                // 첫 번째 요청 완료 후 두 번째 요청 보내기
                return axios.get("http://localhost:8080/get_bookList");
            })
            .then((response) => {
                console.log("책 목록 데이터 응답:", response.data);
                // 책 목록 데이터 처리
            })
            .catch((error) => {
                console.error("캠프 정보를 가져오는 데 실패했습니다:", error);
            });
    }, []);
    
    const handleSearch = async () => {
        try {
            console.log("캠핑장 데이터를 필터링합니다...");
            const response = await axios.get("http://localhost:8080/camp_details");
            console.log("필터링 전 캠프 데이터:", response.data);
            const filtered = response.data.filter(
                (campsite) =>
                    campsite.camp_name
                        .toLowerCase()
                        .includes(searchName.toLowerCase()) &&
                    campsite.camp_address
                        .toLowerCase()
                        .includes(searchLocation.toLowerCase()) &&
                    (selectedSiteType === "" ||
                        campsite.camp_type.includes(selectedSiteType)) &&
                    (checkInDate === "" ||
                        checkOutDate === "" ||
                        checkInDate <= checkOutDate)
            );
            console.log("필터링 후 캠프 데이터:", filtered);
            setFilteredCampsites(filtered);
        } catch (error) {
            console.error("캠핑장 데이터를 필터링하는 중 오류 발생:", error);
        }
    };

    const handleSearchName = (event) => {
        setSearchName(event.target.value);
    };

    const handleSearchLocation = (event) => {
        setSearchLocation(event.target.value);
    };

    const handleSiteTypeChange = (event) => {
        setSelectedSiteType(event.target.value);
    };

    const handleCheckInDateChange = (event) => {
        setCheckInDate(event.target.value);
    };

    const handleCheckOutDateChange = (event) => {
        setCheckOutDate(event.target.value);
    };

    const goToDetailPage = (campsite) => {
        localStorage.setItem("selectedCampsite", JSON.stringify(campsite));
        navigate(`/camp_detail/${campsite.camp_id}`);
    };

    const goToCustPage = () => {
        navigate("/cust");
    };

    return (
        <div className="container">
            <header>
            <h1 className="header">여긴 어디?</h1>
            </header>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="캠핑장 이름을 검색해주세요."
                    value={searchName}
                    onChange={handleSearchName}
                    className="search-input"
                />
                <input
                    type="text"
                    placeholder="주소를 검색해주세요."
                    value={searchLocation}
                    onChange={handleSearchLocation}
                    className="search-input"
                />
                <select
                    value={selectedSiteType}
                    onChange={handleSiteTypeChange}
                    className="type-select"
                >
                    <option value="">모두</option>
                    <option value="캠핑">캠핑</option>
                    <option value="글램핑">글램핑</option>
                    <option value="카라반">카라반</option>
                    <option value="펜션">펜션</option>
                </select>
                <div className="date-inputs">
                    <input
                        type="date"
                        value={checkInDate}
                        onChange={handleCheckInDateChange}
                        className="date-input"
                    />
                    <span className="date-separator">-</span>
                    <input
                        type="date"
                        value={checkOutDate}
                        onChange={handleCheckOutDateChange}
                        className="date-input"
                    />
                </div>
                <button onClick={handleSearch} className="search-button">
                    검색
                </button>
            </div>

            <ul className="campsite-list">
                {console.log("렌더링할 캠프 데이터:", filteredCampsites)}
                {filteredCampsites.map((campsite) => (
                    <li key={campsite.camp_id} className="campsite-item">
                        <div className="campsite-info">
                            <h3>{campsite.camp_name}</h3>
                            <p>
                                <strong>Address:</strong> {campsite.camp_address}
                            </p>
                            <p>
                                <strong>Contact:</strong> {campsite.contact}
                            </p>
                        </div>
                        <button onClick={() => goToDetailPage(campsite)}>상세정보</button>
                    </li>
                ))}
            </ul>
            <button onClick={goToCustPage} className="my-page-button">
                마이페이지
            </button>
        </div>
    );
}

export default CampHomePage;
