import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/campDetailPage.css';
import { Carousel } from "react-responsive-carousel";

function CampDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campsite, setCampsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Check if campsite is null or not before fetching reviews
        if (campsite) {
          const reviewsResponse = await axios.get(`http://localhost:8080/review/${campsite.camp_id}`);
          setReviews(reviewsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [campsite]);

  const handleBookClick = () => {
    if (campsite) {
      console.log("Navigating to booking page for camp ID:", campsite.camp_id);
      navigate(`/camp_book/${campsite.camp_id}`);
    }
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!campsite) {
    return (
      <div className="container">
        <div>캠핑장을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">{campsite.camp_name}</h1>
      <div className="campsite-detail">
        <div className="main-image">
        <Carousel showThumbs={false} showArrows={true}>
                        {campsite.img_url.split(",").map((imageUrl, index) => (
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
        <div className="reviews">
          <h2>리뷰</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className="review">
                <p><strong>고객 ID:</strong> {review.cust_id}</p>
                <p>{review.comments}</p>
              </div>
            ))
          ) : (
            <p>등록된 리뷰가 없습니다.</p>
          )}
        </div>
        <button onClick={handleBookClick}>예약하기</button>
      </div>
    </div>
  );
}

export default CampDetailPage;
