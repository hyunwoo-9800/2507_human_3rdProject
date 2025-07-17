import React, { useEffect, useState } from "react";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";

export default function ProductRegisterDescription({
                                                       text,
                                                       setText,
                                                       thumbnail,
                                                       setThumbnail,
                                                       detailImages,
                                                       setDetailImages,
                                                       onBack,
                                                   }) {
    const [thumbnailPreview, setThumbnailPreview] = useState(null); // 썸네일 미리보기 URL (blob URL)
    const [detailPreviews, setDetailPreviews] = useState([]); // 상세 이미지 미리보기 URLs
    const cropSize = 270; // 크롭 크기

    // textarea 내용 변경 핸들러
    const handleTextareaChange = (e) => {
        setText(e.target.value);
    };

    // 썸네일 이미지 선택 핸들러 (리사이징 + 중앙 크롭 자동 처리)
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = cropSize;
            canvas.height = cropSize;

            // 비율 유지하며 cropSize 이상이 되도록 scale 계산
            const scale = Math.max(cropSize / img.width, cropSize / img.height) * 0.8;  // 0.8배 크기로 줄임
            const resizedWidth = img.width * scale;
            const resizedHeight = img.height * scale;

            // 리사이즈용 임시 캔버스
            const resizeCanvas = document.createElement("canvas");
            resizeCanvas.width = resizedWidth;
            resizeCanvas.height = resizedHeight;
            const resizeCtx = resizeCanvas.getContext("2d");

            // 이미지 리사이징
            resizeCtx.drawImage(img, 0, 0, resizedWidth, resizedHeight);

            // 중앙 크롭 좌표
            const sx = (resizedWidth - cropSize) / 2;
            const sy = (resizedHeight - cropSize) / 2;

            // 최종 캔버스에 중앙 270x270 크롭
            ctx.drawImage(resizeCanvas, sx, sy, cropSize, cropSize, 0, 0, cropSize, cropSize);

            // Blob 생성 후 File 생성
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const croppedFile = new File([blob], file.name, { type: file.type });
                        setThumbnail(croppedFile);

                        // 미리보기 URL 설정
                        const previewUrl = URL.createObjectURL(blob);
                        setThumbnailPreview(previewUrl);
                    } else {
                        alert("이미지를 처리하는 데 실패했습니다.");
                    }
                    URL.revokeObjectURL(url);
                },
                file.type || "image/jpeg",
                1
            );
        };

        img.onerror = () => {
            alert("이미지 로드에 실패했습니다.");
            URL.revokeObjectURL(url);
        };

        img.src = url;
    };

    // detail 이미지 여러 장 선택 핸들러
    const handleDetailImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert("최대 3장까지 첨부할 수 있습니다.");
            return;
        }
        setDetailImages(files);
    };

    // detailImages가 변경되면 미리보기 URL 생성
    useEffect(() => {
        if (detailImages.length === 0) {
            setDetailPreviews([]);
            return;
        }
        const objectUrls = detailImages.map((file) => URL.createObjectURL(file));
        setDetailPreviews(objectUrls);
        return () => {
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [detailImages]);

    // thumbnailPreview가 바뀔 때 디버깅용 콘솔 출력
    useEffect(() => {
        console.log("thumbnailPreview:", thumbnailPreview);
    }, [thumbnailPreview]);

    // 필수 표시가 있는 레이블 컴포넌트
    const RequiredLabel = ({ children }) => (
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 20 }}>
            {children} <span style={{ color: "red" }}>*</span>
        </label>
    );

    // 일반 레이블 컴포넌트
    const Label = ({ children }) => (
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 20 }}>
            {children}
        </label>
    );

    return (
        <div>
            <h2>3. 상품 소개</h2>

            {/* 상품 소개 텍스트 영역 */}
            <div style={{ marginTop: "20px" }}>
                <Label>상품소개를 적어주세요. (선택)</Label>
                <div style={{ marginLeft: "13px" }}>
                    <Textarea
                        value={text}
                        onChange={handleTextareaChange}
                        placeholder="상품에 대한 간단한 설명을 입력해주세요."
                        style={{ width: "100%", height: "300px", resize: "vertical" }}
                    />
                </div>
            </div>

            {/* 썸네일 이미지 첨부 */}
            <div style={{ marginTop: "20px" }}>
                <RequiredLabel>썸네일 사진 첨부 (1장)</RequiredLabel>
                <p style={{ color: "red" }}>!! 썸네일 사진은 업로드한 사진의 중앙이 크롭되어 등록됩니다 !!</p>
                <div style={{ marginLeft: "13px" }}>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                    {/* 썸네일 미리보기 */}
                    {thumbnailPreview && (
                        <div style={{ marginTop: 8 }}>
                            <img
                                src={thumbnailPreview}
                                alt="썸네일 미리보기"
                                style={{ width: cropSize, height: cropSize, borderRadius: 4, objectFit: "cover" }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 상세 이미지 첨부 */}
            <div style={{ marginTop: "50px" }}>
                <Label>제품 상세 사진 첨부 (0~3장)</Label>
                <p style={{ color: "red" }}>!! 가로가 긴 사진을 권장합니다 !!</p>
                <div style={{ marginLeft: "13px" }}>
                    <input type="file" accept="image/*" multiple onChange={handleDetailImagesChange} />
                    {/* 상세 이미지 미리보기 */}
                    {detailPreviews.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", gap: "10px" }}>
                            {detailPreviews.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={`상세사진 미리보기 ${idx + 1}`}
                                    style={{ width: 150, height: "auto", borderRadius: 4 }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 이전 버튼 */}
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 30 }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#888",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    이전
                </button>
            </div>
        </div>
    );
}
