import React from "react";
import { useNavigate } from "react-router-dom";

function HostPage() {
    const navigate = useNavigate();

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
    };

    const buttonStyle = {
        margin: "10px",
        padding: "10px 20px",
        fontSize: "16px",
    };

    return (
        <div style={containerStyle}>
            <h1>Host Page</h1>
            <button
                style={buttonStyle}
                onClick={() => navigate("/camp_register")}
            >
                Camp Register
            </button>
            <button
                style={buttonStyle}
                onClick={() => navigate("/book_approve")}
            >
                Book Approve
            </button>
            <button
                style={buttonStyle}
                onClick={() => navigate("/site_register")}
            >
                Site Register
            </button>
            <button
                style={buttonStyle}
                onClick={() => navigate("/site_controller")}
            >
                Site Controller
            </button>
        </div>
    );
}

export default HostPage;
