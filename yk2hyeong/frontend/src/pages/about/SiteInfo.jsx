import React from "react";
import SiteIntroduction from "../../components/about/SiteIntroduction";
import KeyFeatures from "../../components/about/KeyFeatures";
import DistributionItem from "../../components/about/DistributionItem";
import './SiteInfo.css';


function SiteInfo(){
    return(
        <div style={{margin:'40px 0'}}>
            <h2>사이트 소개</h2>

            <SiteIntroduction/>
            <KeyFeatures/>
            <DistributionItem/>
            <div className="bottom-img-container">
                <img src="/static/images/happy-farmer.PNG" alt="footer-banner" className="bottom-image"/>
            </div>
        </div>
    )
}

export default SiteInfo;