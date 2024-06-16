import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/campBookPage.css";

function CampBookPage() {
    const { camp_id } = useParams();
    const [campsite, setCampsite] = useState(null);
    const [user_id, setUserId] = useState("user1"); // Example user_id
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [check_in_date, setCheckInDate] = useState("");
    const [check_out_date, setCheckOutDate] = useState("");
    const [book_status, setBookStatus] = useState("예약대기");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampsite = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/camp_details/${camp_id}`);
                setCampsite(response.data);
            } catch (error) {
                console.error("Error fetching campsite:", error);
            }
        };

        fetchCampsite();
    }, [camp_id]);

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formattedToday = today.toISOString().split("T")[0];
        const formattedTomorrow = tomorrow.toISOString().split("T")[0];
        setCheckInDate(formattedToday);
        setCheckOutDate(formattedTomorrow);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const newBooking = {
            book_id: `B${Date.now()}`,
            user_id,
            camp_id: campsite.camp_id,
            adults,
            children,
            check_in_date,
            check_out_date,
            book_status,
        };
    
        try {
            const response = await axios.post(
                "http://localhost:8080/booking",
                newBooking
            );
            console.log("서버 응답:", response.data);
    
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
                        min="1"
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                    />
                    <label>어린이</label>
                    <input
                        type="number"
                        min="0"
                        value={children}
                        onChange={(e) => setChildren(parseInt(e.target.value))}
                    />
                </div>
                <div className="date-selection">
                    <h3>체크인/체크아웃 날짜</h3>
                    <label>체크인</label>
                    <input
                        type="date"
                        value={check_in_date}
                        onChange={(e) => setCheckInDate(e.target.value)}
                    />
                    <label>체크아웃</label>
                    <input
                        type="date"
                        value={check_out_date}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                </div>
                <button type="submit">예약하기</button>
            </form>
        </div>
    );
}

export default CampBookPage;
