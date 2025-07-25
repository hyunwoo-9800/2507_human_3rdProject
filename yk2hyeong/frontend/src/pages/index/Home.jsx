import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Banner from "../../components/index/Banner";
import MarketTrend from "../../components/index/MarketTrend";
import PopularItem from "../../components/index/PopularItem";
import NoticeBoard from "../../components/index/NoticeBoard";
import CustomCarousel from "../../components/common/CustomCarousel";

export default function Home() {

    const navigate = useNavigate();

    const bannerImages = [
        <img src="/static/images/banner.png" alt="배너1" style={{width: '100%', height: '200px', objectFit: 'cover'}}/>,
        <img src="/static/images/banner2.jpg" alt="배너2" style={{width: '100%', height: '200px', objectFit: 'cover'}}/>,
        <img src="/static/images/banner3.jpg" alt="배너3" style={{width: '100%', height: '200px', objectFit: 'cover'}}/>,
        <img src="/static/images/banner4.jpg" alt="배너4" style={{width: '100%', height: '200px', objectFit: 'cover'}}/>,
    ];

    // 코나미 커맨드 입력 순서
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    const [inputSequence, setInputSequence] = useState([]);
    const [isKonamiEntered, setIsKonamiEntered] = useState(false);

    // 키 입력 처리
    useEffect(() => {
        const handleKeyDown = (e) => {
            setInputSequence((prevSequence) => {
                const newSequence = [...prevSequence, e.code];
                if (newSequence.length > konamiCode.length) {
                    newSequence.shift();
                }
                return newSequence;
            });
        };

        const checkKonamiCode = () => {
            if (inputSequence.join('') === konamiCode.join('')) {
                setIsKonamiEntered(true); // 코나미 커맨드가 입력된 경우
            }
        };

        const interval = setInterval(checkKonamiCode, 200); // 주기적으로 체크

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(interval);
        };
    }, [inputSequence]);

    // 코나미 커맨드 실행 후 동작
    useEffect(() => {
        if (isKonamiEntered) {
            console.log('코나미 커맨드가 입력되었습니다!');
            navigate('/ygstory'); // 코나미 커맨드 입력 시 /ygstory로 이동
        }
    }, [isKonamiEntered, navigate]);

    return (
        <div style={{marginTop:'3px'}}>
            <CustomCarousel
                items={[
                    {image: '/static/images/banner_1.png', link: 'https://www.korea.kr/news/policyNewsView.do?newsId=156670035'},
                    {image: '/static/images/banner_2.png', link: 'https://www.geoje.go.kr/board/view.geoje?boardId=BBS_0000008&contentsSid=13478&dataSid=306170244&menuCd=DOM_000008902001001000&paging=ok&startPage=1&utm_source=chatgpt.com'},
                    {image: '/static/images/banner_3.png'},
                    {image: '/static/images/banner_4.png', link: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C127/AX/210/view.do?eventInfoId=EVEN_000000000066793&utm_source=chatgpt.com'},
                    {image: '/static/images/banner_5.png', link: 'https://www.krei.re.kr/krei/page/53?cmd=view&biblioId=542351&pageIndex=1'},
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
