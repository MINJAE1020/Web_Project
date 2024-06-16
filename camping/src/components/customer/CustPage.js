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
        navigate(`/review/${bookingId}`);
    };

    const handleCancelClick = async (bookingId) => {
        try {
            await axios.put(`http://localhost:8080/bookings/${bookingId}`, {
                book_status: "예약취소",
            });

            setBookings((prevBookings) => {
                return prevBookings.map((booking) => {
                    if (booking.book_id === bookingId) {
                        return {
                            ...booking,
                            book_status: "예약취소",
                        };
                    }
                    return booking;
                });
            });
            alert("예약이 취소되었습니다.");
        } catch (error) {
            alert("예약 취소 중 오류가 발생했습니다.");
            console.error("Error cancelling booking:", error);
        }
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
                            <p>
                                <strong>예약 ID:</strong> {booking.book_id}
                            </p>
                            <p>
                                <strong>캠핑장 ID:</strong> {booking.camp_id}
                            </p>
                            <p>
                                <strong>체크인:</strong> {booking.check_in_date}
                            </p>
                            <p>
                                <strong>체크아웃:</strong>{" "}
                                {booking.check_out_date}
                            </p>
                            <p>
                                <strong>상태:</strong> {booking.book_status}
                            </p>
                            {booking.book_status === "예약대기" ? (
                                <button
                                    onClick={() =>
                                        handleCancelClick(booking.book_id)
                                    }
                                >
                                    예약 취소
                                </button>
                            ) : booking.book_status === "예약종료" ? (
                                <button
                                    onClick={() =>
                                        handleReviewClick(booking.book_id)
                                    }
                                >
                                    리뷰 작성
                                </button>
                            ) : (
                                <button disabled>
                                    {booking.book_status === "예약취소"
                                        ? "예약 취소됨"
                                        : "예약 확정"}
                                </button>
                            )}
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
