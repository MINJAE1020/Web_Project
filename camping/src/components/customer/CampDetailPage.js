import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/campDetailPage.css';

function CampDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campsite, setCampsite] = useState(null);

  useEffect(() => {
    const fetchCampsite = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/campsites/${id}`);
        setCampsite(response.data);
      } catch (error) {
        console.error('Error fetching campsite:', error);
      }
    };

    fetchCampsite();
  }, [id]);

  const handleBookClick = () => {
    if (campsite) {
      navigate(`/camp_book/${campsite.camp_id}`);
    }
  };

  if (!campsite) {
    return <div>캠핑장을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container">
      <h1 className="header">{campsite.camp_name}</h1>
      <div className="campsite-detail">
        <div className="main-image">
          <img src={campsite.mainImage} alt={campsite.camp_name} />
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
