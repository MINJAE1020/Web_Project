import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/custPage.css";

function CustPage() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingsResponse = await axios.get(
                    `http://localhost:8080/bookings/${userId}`
                );
                setBookings(bookingsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleReviewClick = (bookingId) => {
        navigate(`/write_review/${bookingId}`);
    };


    return (
        <div className="container">
            <h1 className="header">My Page</h1>
            <h1 className="header">로그인 한 user: {userId}</h1>
            <div className="bookings-section">
                <h2>내 예약</h2>
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.book_id} className="booking">
                            <p><strong>예약 ID:</strong> {booking.book_id}</p>
                            <p><strong>캠핑장 ID:</strong> {booking.camp_id}</p>
                            <p><strong>체크인:</strong> {booking.check_in_date}</p>
                            <p><strong>체크아웃:</strong> {booking.check_out_date}</p>
                            <p><strong>상태:</strong> {booking.book_status}</p>
                            <button onClick={() => handleReviewClick(booking.book_id)}>Review</button>
                            <button >예약 취소</button>
                        </div>
                    ))
                ) : (
                    <p>예약 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default CustPage;
