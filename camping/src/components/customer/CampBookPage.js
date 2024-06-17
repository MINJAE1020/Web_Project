import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/campBookPage.css";
import './css/custom-datepicker.css'; 

function CampBookPage() {
    const { camp_id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    const [campsite, setCampsite] = useState(null);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [check_in_date, setCheckInDate] = useState(new Date()); // 시작 날짜 상태
    const [check_out_date, setCheckOutDate] = useState(new Date()); // 종료 날짜 상태
    const [bookings, setBookings] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        setCheckInDate(today); // 시작 날짜를 오늘로 설정
        setCheckOutDate(tomorrow); // 종료 날짜를 내일로 설정
    }, []);

    useEffect(() => {
        const fetchCampsite = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/camp_details/${camp_id}`
                );
                setCampsite(response.data);
            } catch (error) {
                console.error("Error fetching campsite:", error);
            }
        };

        if (camp_id) {
            fetchCampsite();
        }
    }, [camp_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingsResponse = await axios.get(
                    `http://localhost:8080/get_booking/${camp_id}`
                );
                setBookings(bookingsResponse.data);
                const blockedDatesArray = bookingsResponse.data.map(booking => ({
                    startDate: new Date(booking.check_in_date),
                    endDate: new Date(booking.check_out_date),
                    book_status: booking.book_status
                }));
                setBlockedDates(blockedDatesArray);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (camp_id) {
            fetchData();
        }
    }, [camp_id]);

    const isDayBlocked = (date) => {
        for (let i = 0; i < blockedDates.length; i++) {
            const { startDate, endDate, book_status } = blockedDates[i];
            if (book_status === "예약확정" && startDate <= date && date < endDate) {
                return true;
            }
        }
        return false;
    };

    const isDayLine = (date) => {
        for (let i = 0; i < blockedDates.length; i++) {
            const { startDate, endDate, book_status } = blockedDates[i];
            if (book_status === "예약대기" && startDate <= date && date < endDate) {
                return true;
            }
        }
        return false;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newBooking = {
            cust_id: userId,
            camp_id: campsite.camp_id,
            adults,
            children,
            check_in_date,
            check_out_date,
            book_status: "예약대기",
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/booking",
                newBooking
            );
            alert("예약이 성공적으로 완료되었습니다.");
            navigate("/cust");
        } catch (error) {
            console.error("예약 처리 중 오류 발생:", error);
            alert("예약을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    if (!campsite) {
        return <div>캠핑장을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="container">
            <h1 className="header">예약하기</h1>
            <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                    <label>캠핑장:</label>
                    <p>{campsite.camp_name}</p>
                </div>
                <div className="personnel-selection">
                    <h3>인원 선택</h3>
                    <label>성인</label>
                    <input
                        type="number"
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                    />
                    <label>어린이</label>
                    <input
                        type="number"
                        value={children}
                        onChange={(e) => setChildren(parseInt(e.target.value))}
                    />
                </div>
                <div className="date-selection">
                    <h3>체크인/체크아웃 날짜</h3>
                    <label>체크인</label>
                    <DatePicker
                        selected={check_in_date}
                        onChange={(date) => setCheckInDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()} 
                        filterDate={(date) => !isDayBlocked(date) && !isDayLine(date)}
                        dayClassName={(date) => {
                            if (isDayLine(date)) return 'yellow';
                            if (isDayBlocked(date)) return 'red'; 
                            return '';
                        }}
                        className="custom-datepicker"
                    />
                    <label>체크아웃</label>
                    <DatePicker
                        selected={check_out_date}
                        onChange={(date) => setCheckOutDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={check_in_date} 
                        filterDate={(date) => !isDayBlocked(date) && !isDayLine(date)}
                        dayClassName={(date) => {
                            if (isDayLine(date)) return 'yellow';
                            if (isDayBlocked(date)) return 'red';
                            return '';
                        }}
                        className="custom-datepicker"
                    />
                </div>
                <button type="submit">예약하기</button>
            </form>
        </div>
    );
}

export default CampBookPage;
