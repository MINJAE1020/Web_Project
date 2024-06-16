import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/campDetailPage.css';

function CampDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campsite, setCampsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampsite = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/camp_details/${id}`);
          setCampsite(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching campsite:", error);
          setError(error.message);
          setIsLoading(false);
        }
      };
    fetchCampsite();
  }, [id]);

  const handleBookClick = () => {
    if (campsite) {
      console.log("Navigating to booking page for camp ID:", campsite.camp_id); // 예약 버튼 클릭 확인
      navigate(`/camp_book/${campsite.camp_id}`);
    }
  };

  if (isLoading) {
    console.log("Loading state..."); // 로딩 상태 확인
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("Error state:", error); // 에러 상태 확인
    return <div>Error: {error}</div>;
  }

  if (!campsite) {
    console.log("No campsite found for ID:", id); // 캠프 데이터를 찾지 못한 경우 확인
    return <div>캠핑장을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container">
      <h1 className="header">{campsite.camp_name}</h1>
      <div className="campsite-detail">
        <div className="main-image">
          <img src={campsite.img_url} alt={campsite.camp_name} />
        </div>
        <div className="description">
          <h2>소개</h2>
          <p>{campsite.introduction}</p>
        </div>
        <div className="sites">
          <h2>시설</h2>
          <p>{campsite.facility}</p>
        </div>
        <div className="location">
          <h2>위치</h2>
          <p>{campsite.camp_address}</p>
        </div>
        <div className="type">
          <h2>유형</h2>
          <p>{campsite.camp_type}</p>
        </div>
        <div className="manners">
          <h2>매너타임</h2>
          <p>시작: {campsite.start_manner}, 종료: {campsite.over_manner}</p>
        </div>
        <button onClick={handleBookClick}>예약하기</button>
      </div>
    </div>
  );
}

export default CampDetailPage;
