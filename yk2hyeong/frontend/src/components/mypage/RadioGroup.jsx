import React,{useState} from "react";

function RadioGroup(){
    // 라디오버튼 상태 제어
    const [readStatus, setReadStatus] = useState("total")
    const handleChange = (e) => {
        setReadStatus(e.target.value);
    };

    return (
        <div className="radio-group">
            <label>
                <input
                    type="radio"
                    name="readStatus"
                    value="total"
                    checked={readStatus === "total"}
                    onChange={handleChange}
                />
                전체
            </label>
            <label>
                <input
                    type="radio"
                    name="readStatus"
                    value="read"
                    checked={readStatus === "read"}
                    onChange={handleChange}
                />
                읽음
            </label>
            <label>
                <input
                    type="radio"
                    name="readStatus"
                    value="unread"
                    checked={readStatus === "unread"}
                    onChange={handleChange}
                />
                읽지 않음
            </label>
        </div>
    )
}

export default RadioGroup;