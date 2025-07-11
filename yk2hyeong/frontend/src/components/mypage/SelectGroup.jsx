import React from "react";

function SelectGroup(){
    return (
        <div className="select-group">
            <select className="year-select">
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
            </select>
            <select className="month-select">
                <option value="total">전체</option>
                <option value="5">5월</option>
                <option value="6">6월</option>
                <option value="7">7월</option>
            </select>
        </div>
    )
}

export default SelectGroup;