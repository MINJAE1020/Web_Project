import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // BrowserRouter와 Routes로 변경

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/camp_home" element={<LoginForm />} />
                <Route path="/camp_detail" element={<LoginForm />} />
                <Route path="/camp_book" element={<LoginForm />} />
                <Route path="/cust" element={<LoginForm />} />
                <Route path="/camp_register" element={<LoginForm />} />
                <Route path="/site_register" element={<LoginForm />} />
                <Route path="/host" element={<LoginForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<LoginForm />} />
                <Route path="/review" element={<LoginForm />} />
            </Routes>
        </Router>
    );
};

export default App;
