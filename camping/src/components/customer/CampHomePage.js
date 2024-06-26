import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/campHomePage.css";

function CampHomePage() {
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSiteType, setSelectedSiteType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [filteredCampsites, setFilteredCampsites] = useState([]);
  const [camps, setCamps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const campResponse = await axios.get("http://localhost:8080/camp_details");
      setCamps(campResponse.data);
      setFilteredCampsites(campResponse.data);

      const bookingResponse = await axios.get("http://localhost:8080/get_bookList");
      setBookings(bookingResponse.data);
    } catch (error) {
      console.error("캠프 정보를 가져오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...camps];

    filtered = filtered.filter(campsite =>
      campsite.camp_name.toLowerCase().includes(searchName.toLowerCase()) &&
      campsite.camp_address.toLowerCase().includes(searchLocation.toLowerCase()) &&
      (selectedSiteType === "" || campsite.camp_type.includes(selectedSiteType)) &&
      (checkInDate === "" || checkOutDate === "" || checkInDate <= checkOutDate)
    );

    filtered = filtered.filter(campsite =>
      bookings.every(booking =>
        new Date(checkOutDate) <= new Date(booking.check_in_date) ||
        new Date(checkInDate) >= new Date(booking.check_out_date)
      )
    );

    setFilteredCampsites(filtered);
  };

  const handleSearchName = event => {
    setSearchName(event.target.value);
  };

  const handleSearchLocation = event => {
    setSearchLocation(event.target.value);
  };

  const handleSiteTypeChange = event => {
    setSelectedSiteType(event.target.value);
  };

  const handleCheckInDateChange = event => {
    setCheckInDate(event.target.value);
  };

  const handleCheckOutDateChange = event => {
    setCheckOutDate(event.target.value);
  };

  const goToDetailPage = campsite => {
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
        <button onClick={handleSearch} className="search-button" disabled={loading}>
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>

      <ul className="campsite-list">
        {filteredCampsites.length === 0 && !loading && (
          <li className="no-results">검색 결과가 없습니다.</li>
        )}
        {filteredCampsites.map(campsite => (
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
