import React from "react";
import './Home.css';
import Banner from "./components/Banner";
import MarketTrend from "./components/MarketTrend";
import PopularItem from "./components/PopularItem";
import NoticeBoard from "./components/NoticeBoard";

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
