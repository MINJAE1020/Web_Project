import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/campRegister.css"

function CampRegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        host_id: "",
        camp_name: "",
        camp_type: [],
        camp_address: "",
        Information: "",
        facility: "",
        environment: [],
        start_manner: { hour: "00", minute: "00" },
        over_manner: { hour: "00", minute: "00" },
        contact: "",
        introduction: "",
        check_in_time: { hour: "00", minute: "00" },
        check_out_time: { hour: "00", minute: "00" },
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                host_id: userId,
            }));
        }
    }, []);

    const campTypes = ["캠핑", "글램핑", "카라반", "펜션"];
    const environments = ["산", "계곡", "바다"];
    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0")
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
        String(i).padStart(2, "0")
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCampTypeChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => {
            const updatedCampType = checked
                ? [...prevFormData.camp_type, value]
                : prevFormData.camp_type.filter((type) => type !== value);
            return { ...prevFormData, camp_type: updatedCampType };
        });
    };

    const handleEnvironmentChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => {
            const updatedEnvironment = checked
                ? [...prevFormData.environment, value]
                : prevFormData.environment.filter((env) => env !== value);
            return { ...prevFormData, environment: updatedEnvironment };
        });
    };

    const handleTimeChange = (e, field, part) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: { ...prevFormData[field], [part]: value },
        }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            camp_type: formData.camp_type.join(","),
            environment: formData.environment.join(","),
            start_manner: `${formData.start_manner.hour}:${formData.start_manner.minute}`,
            over_manner: `${formData.over_manner.hour}:${formData.over_manner.minute}`,
            check_in_time: `${formData.check_in_time.hour}:${formData.check_in_time.minute}`,
            check_out_time: `${formData.check_out_time.hour}:${formData.check_out_time.minute}`,
        };

        const form = new FormData();
        Object.keys(formattedData).forEach((key) => {
            form.append(key, formattedData[key]);
        });
        for (let i = 0; i < images.length; i++) {
            form.append("images", images[i]);
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/camp_register",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert(response.data.message);
            navigate("/host");
        } catch (error) {
            console.error("캠프 등록 에러:", error);
            alert("캠프 등록 에러");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="campRegister">
            <h1>Camp Register Page</h1>
            <input
                type="text"
                name="host_id"
                placeholder="호스트 ID"
                value={formData.host_id}
                readOnly
            />
            <input
                type="text"
                name="camp_name"
                placeholder="캠핑장 이름"
                onChange={handleChange}
            />
            <div>
                <h3>Camp Type</h3>
                {campTypes.map((type) => (
                    <label key={type}>
                        <input
                            type="checkbox"
                            value={type}
                            onChange={handleCampTypeChange}
                        />
                        {type}
                    </label>
                ))}
            </div>
            <input
                type="text"
                name="camp_address"
                placeholder="캠핑장 주소"
                onChange={handleChange}
            />
            <input
                type="text"
                name="Information"
                placeholder="시설정보"
                onChange={handleChange}
            />
            <input
                type="text"
                name="facility"
                placeholder="부대시설"
                onChange={handleChange}
            />
            <div>
                <h3>Environment</h3>
                {environments.map((env) => (
                    <label key={env}>
                        <input
                            type="checkbox"
                            value={env}
                            onChange={handleEnvironmentChange}
                        />
                        {env}
                    </label>
                ))}
            </div>
            <div>
                <h3>Start Manner</h3>
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "start_manner", "hour")
                    }
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                :
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "start_manner", "minute")
                    }
                >
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h3>Over Manner</h3>
                <select
                    onChange={(e) => handleTimeChange(e, "over_manner", "hour")}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                :
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "over_manner", "minute")
                    }
                >
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
            <input
                type="text"
                name="contact"
                placeholder="연락처"
                onChange={handleChange}
            />
            <input
                type="text"
                name="introduction"
                placeholder="숙소 소개"
                onChange={handleChange}
            />
            <div>
                <h3>Check-In Time</h3>
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "check_in_time", "hour")
                    }
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                :
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "check_in_time", "minute")
                    }
                >
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h3>Check-Out Time</h3>
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "check_out_time", "hour")
                    }
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                :
                <select
                    onChange={(e) =>
                        handleTimeChange(e, "check_out_time", "minute")
                    }
                >
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
            <input type="file" multiple onChange={handleImageChange} />
            <button type="submit">Register Camp</button>
        </form>
    );
}

export default CampRegisterPage;
