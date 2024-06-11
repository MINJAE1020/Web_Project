import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // BrowserRouter와 Routes로 변경
import CampHomePage from "./components/customer/CampHomePage";
import CampHomePage from "./components/customer/CustPage";
import CampRegisterPage from "./components/host/CampRegisterPage";
import SiteRegisterPage from "./components/host/SiteRegisterPage";
import HostPage from "./components/host/HostPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ReviewPage from "./components/ReviewPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/camp_home" element={<CampHomePage />} />
                <Route path="/camp_detail" element={<CampDetailPage />} />
                <Route path="/camp_book" element={<CampDetailPage />} />
                <Route path="/cust" element={<CustPage />} />
                <Route path="/camp_register" element={<CampRegisterPage />} />
                <Route path="/site_register" element={<SiteRegisterPage />} />
                <Route path="/host" element={<HostPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/review" element={<ReviewPage />} />
            </Routes>
        </Router>
    );
};

export default App;
