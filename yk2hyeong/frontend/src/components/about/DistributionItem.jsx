import React,{useState,useEffect,useRef} from "react";
import {useNavigate} from "react-router-dom";

function DistributionItem(){

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    const categories = [
        {name: "과일류", color: "#F46364", image: "/static/images/intro-fruit.jpg"},
        {name: "채소류", color: "#67AE42", image: "/static/images/intro-vegetable.jpg"},
        {name: "특용작물", color: "#3677C1", image: "/static/images/intro-omija.jpg"},
        {name: "식량작물", color: "#C18C36", image: "/static/images/intro-rice.jpg"},
    ];

    const subItemMap = {
        과일류: ["사과", "배", "복숭아", "포도", "감귤", "단감", "바나나", "참다래", "파인애플", "오렌지", "자몽", "레몬", "체리", "건포도", "건블루베리", "망고", "블루베리", "아보카도", "레드향", "매실", "무화과", "복분자", "샤인머스켓", "곶감", "골드키위"],
        채소류: [
            "배추", "양배추", "시금치", "상추", "얼갈이배추", "갓", "연근", "우엉", "수박", "참외", "오이", "호박",
            "토마토", "딸기", "무", "당근", "열무", "건고추", "풋고추", "붉은고추", "피마늘", "양파", "파", "생강",
            "고춧가루", "가지", "미나리", "깻잎", "부추", "피망", "파프리카", "멜론", "깐마늘(국산)", "깐마늘(수입)",
            "브로콜리", "양상추", "청경채", "케일", "콩나물", "절임배추", "쑥", "달래", "두릅", "로메인 상추",
            "취나물", "쥬키니호박", "청양고추", "대파", "고사리", "쪽파", "다발무", "겨울 배추", "알배기배추", "방울토마토"
        ],
        특용작물: [
            "참깨", "들깨", "땅콩", "느타리버섯", "팽이버섯", "새송이버섯",
            "호두", "아몬드", "양송이버섯", "표고버섯", "더덕"
        ],
        식량작물: [
            "쌀", "찹쌀", "혼합곡", "기장", "콩", "팥", "녹두", "메밀",
            "고구마", "감자", "귀리", "보리", "수수", "율무"
        ]
    }

    const handleClick = (categoryName) => {
        if (selectedCategory === categoryName){
            //닫기 애니메이션
            setPanelOpen(false);
            setTimeout(()=>setSelectedCategory(null),500);
        }else{
            setSelectedCategory(categoryName);
            setPanelOpen(true);
        }
        setShowAll(false);
    };
    useEffect(() => {
        const el = panelRef.current;
        if (!el) return;

        if (panelOpen) {
            el.classList.add("open");
        } else {
            el.classList.remove("open");
        }
    }, [panelOpen]);




    const toggleExpand = () => {
        setShowAll(prev => !prev);
    };


    return (
        <div className="category-container">
            <h2>유통품목</h2>

            <div className="category-cards">
                {categories.map(({ name, color, image }) => (
                    <div
                        key={name}
                        className={`category-card ${selectedCategory === name ? "clicked" : ""}`}
                        style={selectedCategory === name ? { Color: color } : {}}
                        onClick={() => handleClick(name)}
                    >
                        <div className="category-title" style={{ color }}>{name}</div>
                        <img src={image} alt={name} className="category-image" />
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className={`subcategory-panel-wrapper ${selectedCategory ? "open" : ""}`} ref={panelRef}>
                    {selectedCategory && (
                        <div className="subcategory-panel" style={{
                            "--bg-image": `url(${categories.find(c => c.name === selectedCategory)?.image})`
                        }}>
                            <div className="subcategory-panel-content">
                                <h3>{selectedCategory} 세부품목</h3>
                                <ul className={`subcategory-list ${showAll ? "expanded" : "collapsed"}`}>
                                    {(showAll
                                            ? subItemMap[selectedCategory]
                                            : subItemMap[selectedCategory].slice(0, 15)  // 약 4줄 (열당 4개 기준)
                                    ).map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                                {!showAll && subItemMap[selectedCategory].length > 16 && (
                                    <span className="more-button" onClick={toggleExpand}>더보기 ∨</span>
                                )}
                                {showAll && (
                                    <span className="more-button" onClick={toggleExpand}>접기 ∧</span>
                                )}
                                <button className="view-button" onClick={()=>navigate("/productlist")}>상품 확인하러 가기</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default DistributionItem;