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

    return(
        <div className="image-scroll-wrapper">
            <button onClick={scrollLeft}>&lt;</button>
            <div className="image-scroll-container" ref={scrollRef}>
                {Array.isArray(images) && images.length > 0 ? (
                    images.map((img, index) => (
                        <div key={index} className="image-box" onClick={() => setModalImg(img)}>
                            <img
                                src={`static/images/${img.imageName}`}
                                alt="상품이미지"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/no-image.png';
                                }}
                            />
                    </div>
                ))
                ) : (
                    <p className="no-image-text">이미지가 없습니다</p>
                )}
            </div>
            <button onClick={scrollRight}>&gt;</button>

            {modalImg && (
                <div className="modal-overlay" onClick={() => setModalImg(null)}>
                    <img
                        className="modal-image"
                        src={`/static/images/${modalImg.imageName}`}
                        alt="확대 이미지"
                        onError={(e) =>{
                            e.target.onerror = null;
                            e.target.src = '/images/no-image.png'; //기본이미지경로
                        }}
                    />
                    <button className="close-btn" onClick={() => setModalImg(null)}>X</button>
                </div>
            )}
        </div>
    )
}
export default ProductImgList;