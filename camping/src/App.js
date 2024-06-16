import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // BrowserRouter와 Routes로 변경
import CampHomePage from "./components/customer/CampHomePage";
import CustPage from "./components/customer/CustPage";
import CampBookPage from "./components/customer/CampBookPage";
import CampDetailPage from "./components/customer/CampDetailPage";
import CampRegisterPage from "./components/host/CampRegisterPage";
import CampUpdatePage from "./components/host/CampUpdatePage";
import SiteRegisterPage from "./components/host/SiteRegisterPage";
import SiteRegisterDetailPage from "./components/host/SiteRegisterDetailPage";
import BookApprove from "./components/host/BookApprove";
import HostPage from "./components/host/HostPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ReviewPage from "./components/ReviewPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/camp_home" element={<CampHomePage />} />
                <Route path="/camp_detail/:id" element={<CampDetailPage />} />
                <Route path="/camp_book/:camp_id" element={<CampBookPage />} />
                <Route path="/cust" element={<CustPage />} />
                <Route path="/camp_register" element={<CampRegisterPage />} />
                <Route path="/camp_update" element={<CampUpdatePage />} />
                <Route
                    path="/site_register"
                    element={<SiteRegisterPage />}
                />\{" "}
                <Route
                    path="/site_register_detail/:campId"
                    element={<SiteRegisterDetailPage />}
                />
                <Route path="/book_approve" element={<BookApprove />} />
                <Route path="/host" element={<HostPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/review" element={<ReviewPage />} />
            </Routes>
        </Router>
    );
};

export default App;
