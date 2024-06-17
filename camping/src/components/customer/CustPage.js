import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/custPage.css";

const CustPage = () => {
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showBookings, setShowBookings] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingsResponse = await axios.get(
                    `http://localhost:8080/bookings/${userId}`
                );
                setBookings(bookingsResponse.data);

                const reviewsResponse = await axios.get(
                    `http://localhost:8080/reviews/${userId}`
                );
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleReviewClick = (bookingId) => {
        const booking = bookings.find(
            (booking) => booking.book_id === bookingId
        );
        if (booking) {
            navigate(`/review/${bookingId}`, {
                state: {
                    campId: booking.camp_id,
                    userId: userId,
                },
            });
        }
    };

    const handleCancelClick = async (bookingId) => {
        try {
            await axios.put(`http://localhost:8080/bookings/${bookingId}`, {
                book_status: "예약취소",
            });

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.book_id === bookingId
                        ? { ...booking, book_status: "예약취소" }
                        : booking
                )
            );
            alert("예약이 취소되었습니다.");
        } catch (error) {
            alert("예약 취소 중 오류가 발생했습니다.");
            console.error("Error cancelling booking:", error);
        }
    };

    const toggleShowBookings = () => {
        setShowBookings(true);
    };

    const toggleShowReviews = () => {
        setShowBookings(false);
    };

    return (
        <div className="container">
            <h1 className="header">{userId}님, My Page</h1>
            <button onClick={() => navigate("/camp_home")}>Home</button>
            <div className="toggle-buttons">
                <button onClick={toggleShowBookings}>내 예약</button>
                <button onClick={toggleShowReviews}>내 리뷰</button>
            </div>
            {showBookings ? (
                <div>
                    <div className="bookings-section">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking.book_id} className="booking">
                                    <p>
                                        <strong>캠핑장 ID:</strong>{" "}
                                        {booking.camp_id}
                                    </p>
                                    <p>
                                        <strong>체크인:</strong>{" "}
                                        {booking.check_in_date}
                                    </p>
                                    <p>
                                        <strong>체크아웃:</strong>{" "}
                                        {booking.check_out_date}
                                    </p>
                                    <p>
                                        <strong>상태:</strong>{" "}
                                        {booking.book_status}
                                    </p>
                                    {booking.book_status === "예약대기" ? (
                                        <button
                                            onClick={() =>
                                                handleCancelClick(
                                                    booking.book_id
                                                )
                                            }
                                        >
                                            예약 취소
                                        </button>
                                    ) : booking.book_status === "예약종료" ? (
                                        <button
                                            onClick={() =>
                                                handleReviewClick(
                                                    booking.book_id
                                                )
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
            ) : (
                <div>
                    <div className="reviews-section">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.review_id} className="review">
                                    <p>
                                        <strong>캠핑장 ID:</strong>{" "}
                                        {review.camp_id}
                                    </p>
                                    <p>
                                        <strong>내용:</strong> {review.comments}
                                    </p>
                                    {review.img_url && (
                                        <img
                                            src={`http://localhost:8080${review.img_url}`}
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                            }}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>리뷰 내역이 없습니다.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustPage;
