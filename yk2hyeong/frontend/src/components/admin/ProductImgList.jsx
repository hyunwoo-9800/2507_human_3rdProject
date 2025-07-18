import React, {useState, useEffect, useRef} from "react";

function ProductImgList({images}){
    const [modalImg, setModalImg] = useState(null);
    const scrollRef = useRef();

    //이미지 스크롤
    const scrollLeft=()=>{
        if(images.length > 3){
            scrollRef.current.scrollBy({
                left: -150, behavior: 'smooth'
            });
        }
    };
    const scrollRight=()=>{
        if(images.length > 3){
            scrollRef.current.scrollBy({
                left: 150, behavior: 'smooth'
            });
        }
    };
    console.log("images 전체 확인:", images);
    return(
        <div className="image-scroll-wrapper">
            <button onClick={scrollLeft}>&lt;</button>
            <div className="image-scroll-container" ref={scrollRef}>
                {Array.isArray(images) && images.length > 0 ? (
                    images.map((img, index) => {
                        console.log("imageName 확인:", img.imageName);  // ← 여기 콘솔 추가
                        return (
                            <div key={index} className="image-box" onClick={() => setModalImg(img)}>
                                <img
                                    src={`/images/detailimages/${img.imageName}`}
                                    alt="상품이미지"
                                    onError={(e) => {
                                        const currentRetry = e.target.dataset.retry;

                                        if (!currentRetry) {
                                            e.target.dataset.retry = 'thumbnail';
                                            e.target.src = `/static/images/thumbnail/${img.imageName}`;
                                        } else if (currentRetry === 'thumbnail') {
                                            e.target.dataset.retry = 'fallback';
                                            e.target.src = `/static/images/detailimages/no-image.png`;
                                        }else {
                                            e.target.onerror = null;
                                        }
                                    }}
                                />

                            </div>
                        );
                    })
                ) : (
                    <p className="no-image-text">이미지가 없습니다</p>
                )}
            </div>
            <button onClick={scrollRight}>&gt;</button>

            {modalImg && (
                <div className="modal-overlay" onClick={() => setModalImg(null)}>
                    <img
                        className="modal-image"
                        src={`/static/images/detailimages/${modalImg.imageName}`}
                        alt="확대 이미지"
                        onError={(e) => {
                            const currentRetry = e.target.dataset.retry;

                            if (!currentRetry) {
                                e.target.dataset.retry = 'thumbnail';
                                e.target.src = `/images/thumbnail/${modalImg.imageName}`;
                            } else if (currentRetry === 'thumbnail') {
                                e.target.dataset.retry = 'fallback';
                                e.target.src = `/static/images/detailimages/no-image.png`;
                            }else {
                                e.target.onerror = null;
                            }
                        }}
                    />
                    <button className="close-btn" onClick={() => setModalImg(null)}>X</button>
                </div>
            )}
        </div>
    )
}
export default ProductImgList;