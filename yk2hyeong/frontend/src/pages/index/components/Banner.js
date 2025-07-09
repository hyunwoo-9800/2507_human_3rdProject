import React,{useState} from "react";

function Banner(){
    return(
        <div className="banner">
            <img src="/static/images/banner.png" alt="배너" className="banner-img"/>
            <button className="left-scroll-btn">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button className="right-scroll-btn">
                <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
);
}

export default Banner;