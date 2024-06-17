import React, { useState, useEffect } from "react";
import axios from "axios";

function BookApprove() {
    const [bookings, setBookings] = useState([]);
    const userId = localStorage.getItem("user_id");

    const fetchBookings = async () => {
        try {
            if (!userId) {
                console.error("localStorage에서 사용자 ID를 찾을 수 없습니다.");
                return;
            }
            const response = await axios.get(
                `http://localhost:8080/view_bookings/${userId}`
            );
            setBookings(response.data);
        } catch (error) {
            console.error(
                "예약 정보를 불러오는 중 오류가 발생했습니다:",
                error
            );
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [userId]);

    const updateBookingStatus = async (bookingId, status) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/update_booking_status/${bookingId}`,
                { status }
            );
            fetchBookings();
        } catch (error) {
            console.error("예약 상태 업데이트 중 오류가 발생했습니다:", error);
        }
    };

    return (
        <div>
            <h1>예약 승인 페이지</h1>
            <ul>
                {bookings.length === 0 ? (
                    <p>예약 대기 상태인 예약이 없습니다.</p>
                ) : (
                    bookings.map((booking) => (
                        <li key={booking.book_id}>
                            <p>예약자 이름: {booking.cust_id}</p>
                            <p>
                                예약 날짜: {booking.check_in_date} ~{" "}
                                {booking.check_out_date}
                            </p>
                            <p>예약 상태: {booking.book_status}</p>
                            {booking.book_status === "예약대기" && (
                                <div>
                                    <button
                                        onClick={() =>
                                            updateBookingStatus(
                                                booking.book_id,
                                                "예약확정"
                                            )
                                        }
                                        style={{ marginRight: "10px" }}
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateBookingStatus(
                                                booking.book_id,
                                                "예약취소"
                                            )
                                        }
                                    >
                                        거부
                                    </button>
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default BookApprove;
