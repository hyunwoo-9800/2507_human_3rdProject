import React,{useState} from "react";

function Banner(){
    const images = [
        "/static/images/banner.png",
        "/static/images/banner2.jpg",
        "/static/images/banner3.jpg",
        "/static/images/banner4.jpg"
    ]
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };
    
    return(
        <div className="banner">
            <img
                src={images[currentIndex]}
                alt={`배너 ${currentIndex+1}`}
                className="banner-img"
            />
            <button className="left-scroll-btn" onClick={handlePrev}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button className="right-scroll-btn" onClick={handleNext}>
                <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    );
}

export default Banner;