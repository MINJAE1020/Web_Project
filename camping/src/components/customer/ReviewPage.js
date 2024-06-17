import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
function ReviewPage() {
    const location = useLocation();
    const { campId, userId } = location.state || {};
    const [comments, setComments] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comments) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("campId", campId);
        formData.append("userId", userId);
        formData.append("comments", comments);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            setUploading(true);
            const response = await axios.post(
                "http://localhost:8080/reviews",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setUploading(false);
            alert("리뷰가 성공적으로 등록되었습니다.");
            navigate("/camp_home");
        } catch (error) {
            setUploading(false);
            console.error("리뷰 업로드 오류:", error);
            alert("리뷰 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h1>리뷰 작성</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>리뷰 내용:</label>
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>사진 업로드:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" disabled={uploading}>
                    {uploading ? "업로드 중..." : "리뷰 등록"}
                </button>
            </form>
        </div>
    );
}

export default ReviewPage;
