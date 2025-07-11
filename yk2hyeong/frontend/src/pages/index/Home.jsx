import React from "react";
import './Home.css';
import Banner from "../../components/index/Banner";
import MarketTrend from "../../components/index/MarketTrend";
import PopularItem from "../../components/index/PopularItem";
import NoticeBoard from "../../components/index/NoticeBoard";

export default function Home() {
  return (
      <div>
        <Banner></Banner>
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
