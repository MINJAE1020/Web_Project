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
    const navigate = useNavigate();

    useEffect(() => {
        fetchCampsites();
    }, []);

    const fetchCampsites = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/campsites"
            );
            setFilteredCampsites(response.data);
        } catch (error) {
            console.error("Error fetching campsites:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/campsites"
            );
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
            setFilteredCampsites(filtered);
        } catch (error) {
            console.error("Error filtering campsites:", error);
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
            <h1 className="header">여긴 어디?</h1>
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
                    Search
                </button>
            </div>
            <ul className="campsite-list">
                {filteredCampsites.map((campsite) => (
                    <li key={campsite.camp_id} className="campsite-item">
                        <div className="campsite-info">
                            <h3>{campsite.camp_name}</h3>
                            <p>
                                <strong>Address:</strong>{" "}
                                {campsite.camp_address}
                            </p>
                            <p>
                                <strong>Contact:</strong> {campsite.contact}
                            </p>
                        </div>
                        <button onClick={() => goToDetailPage(campsite)}>
                            상세정보
                        </button>
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
