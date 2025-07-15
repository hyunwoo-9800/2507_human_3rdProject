import React, { useEffect } from 'react';
import Textarea from "../../components/common/Textarea";

export default function ProductRegisterDescription({
                                                       text,
                                                       setText,
                                                       thumbnail,
                                                       setThumbnail,
                                                       detailImages,
                                                       setDetailImages
                                                   }) {
    const [thumbnailPreview, setThumbnailPreview] = React.useState(null);
    const [detailPreviews, setDetailPreviews] = React.useState([]);

    const handleTextareaChange = (e) => {
        setText(e.target.value);
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) setThumbnail(file);
    };

    const handleDetailImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert("최대 3장까지 첨부할 수 있습니다.");
            return;
        }
        setDetailImages(files);
    };

    useEffect(() => {
        if (!thumbnail) {
            setThumbnailPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(thumbnail);
        setThumbnailPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [thumbnail]);

    useEffect(() => {
        if (detailImages.length === 0) {
            setDetailPreviews([]);
            return;
        }
        const objectUrls = detailImages.map(file => URL.createObjectURL(file));
        setDetailPreviews(objectUrls);
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [detailImages]);

    const RequiredLabel = ({ children }) => (
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
            {children} <span style={{ color: 'red' }}>*</span>
        </label>
    );

    const Label = ({ children }) => (
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
            {children}
        </label>
    );

    return (
        <div>
            <h2>3. 상품 소개</h2>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>상품소개를 적어주세요.</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <Textarea
                        value={text}
                        onChange={handleTextareaChange}
                        placeholder="여기에 내용을 입력하세요"
                        style={{ width: '100%', height: '300px', resize: 'vertical' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>썸네일 사진 첨부 (1장)</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                    {thumbnailPreview && (
                        <div style={{ marginTop: 8 }}>
                            <img
                                src={thumbnailPreview}
                                alt="썸네일 미리보기"
                                style={{ width: '200px', height: 'auto', borderRadius: 4 }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <Label>제품 상세 사진 첨부 (0~3장)</Label>
                <div style={{ marginLeft: '13px' }}>
                    <input type="file" accept="image/*" multiple onChange={handleDetailImagesChange} />
                    {detailPreviews.length > 0 && (
                        <div style={{ marginTop: 8, display: 'flex', gap: '10px' }}>
                            {detailPreviews.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={`상세사진 미리보기 ${idx + 1}`}
                                    style={{ width: '150px', height: 'auto', borderRadius: 4 }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
