import React from "react";
import './Home.css';
import Banner from "../../components/index/Banner";
import MarketTrend from "../../components/index/MarketTrend";
import PopularItem from "../../components/index/PopularItem";
import NoticeBoard from "../../components/index/NoticeBoard";
import CustomCarousel from "../../components/common/CustomCarousel";

export default function Home() {

    const bannerImages = [
        <img src="/static/images/banner.png" alt="배너1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />,
        <img src="/static/images/banner2.jpg" alt="배너2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />,
        <img src="/static/images/banner3.jpg" alt="배너3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />,
        <img src="/static/images/banner4.jpg" alt="배너4" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />,
    ];


  return (
      <div>
          <CustomCarousel
              items={[
                  '/static/images/banner_tomato.png',
                  '/static/images/banner_potato.png',
                  '/static/images/banner_weed.png',
                  '/static/images/banner_poppy.png',
                  '/static/images/banner_opium.png',
              ]}
              height="300px"
          />
        {/*<Banner></Banner>*/}
        <div className="main-content">
          <div className="left-content">
            <MarketTrend/>
          </div>
          <div className="rignt-content">
            <PopularItem/>
            <NoticeBoard/>
          </div>
        </div>
      </div>
  )
}
