import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/custPage.css';

function CustPage() {
  const [tab, setTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    // Load reviews and bookings data for the user
    const fetchData = async () => {
      try {
        const reviewsResponse = await axios.get(`http://localhost:8080/api/reviews/${userId}`);
        setReviews(reviewsResponse.data);

        const bookingsResponse = await axios.get(`http://localhost:8080/api/bookings/${userId}`);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleReviewClick = (bookingId) => {
    navigate(`/write_review/${bookingId}`);
  };

  const handleDetailClick = (bookingId) => {
    navigate(`/booking_detail/${bookingId}`);
  };

  // 예약이 완료된 경우만 필터링하여 보여줍니다.
  const completedBookings = bookings.filter(booking => booking.status === '완료');

  return (
    <div className="container">
      <h1 className="header">My Page</h1>
      <div className="tab-buttons">
        <button onClick={() => setTab('reviews')} className={tab === 'reviews' ? 'active' : ''}>리뷰</button>
        <button onClick={() => setTab('bookings')} className={tab === 'bookings' ? 'active' : ''}>예약</button>
      </div>
      {tab === 'reviews' ? (
        <div className="reviews-section">
          <div className="reviews-list">
            <h2>내 리뷰</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.review_id} className="review">
                  <p><strong>캠핑장 ID:</strong> {review.camp_id}</p>
                  <p><strong>예약 ID:</strong> {review.book_id}</p>
                  <p>{review.comments}</p>
                  {review.reply && <p><strong>답글:</strong> {review.reply}</p>}
                </div>
              ))
            ) : (
              <p>작성한 리뷰가 없습니다.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bookings-section">
          <h2>내 예약</h2>
          {completedBookings.length > 0 ? (
            completedBookings.map((booking) => (
              <div key={booking.booking_id} className="booking">
                <p><strong>예약 ID:</strong> {booking.booking_id}</p>
                <p><strong>캠핑장 ID:</strong> {booking.camp_id}</p>
                <p><strong>체크인:</strong> {booking.check_in}</p>
                <p><strong>체크아웃:</strong> {booking.check_out}</p>
                <p><strong>상태:</strong> {booking.status}</p>
                <button onClick={() => handleDetailClick(booking.booking_id)}>Detail</button>
                {booking.status === '완료' && (
                  <button onClick={() => handleReviewClick(booking.booking_id)}>Review</button>
                )}
              </div>
            ))
          ) : (
            <p>완료된 예약 내역이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CustPage;
