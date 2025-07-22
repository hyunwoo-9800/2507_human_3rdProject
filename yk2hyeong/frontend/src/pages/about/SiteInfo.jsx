import React from "react";
import SiteIntroduction from "../../components/about/SiteIntroduction";
import KeyFeatures from "../../components/about/KeyFeatures";
import DistributionItem from "../../components/about/DistributionItem";

function SiteInfo(){
    return(
        <div>
            <h1>사이트소개페이지</h1>

            <SiteIntroduction/>
            <KeyFeatures/>
            <DistributionItem/>
        </div>
    )
}

export default SiteInfo;