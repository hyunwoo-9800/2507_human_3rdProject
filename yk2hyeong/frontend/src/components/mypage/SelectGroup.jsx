import React from "react";

function SelectGroup({ selectedYear, selectedMonth, onYearChange, onMonthChange }) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // 최근 3개월 구하기
    const recentMonths = [];
    for (let i = 0; i < 3; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month <= 0) {
            month += 12;
            year -= 1;
        }
        recentMonths.push({ year, month });
    }

    // 연도 옵션 (2020~현재)
    const yearOptions = [];
    for (let y = currentYear; y >= 2020; y--) {
        yearOptions.push(y);
    }

    return (
        <div className="select-group">
            <select className="year-select" value={selectedYear} onChange={onYearChange}>
                {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>

            <select className="month-select" value={selectedMonth} onChange={onMonthChange}>
                <option value="total">전체</option>
                {recentMonths.map(({ year, month }) => (
                    <option key={`${year}-${month}`} value={month}>
                        {month}월
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectGroup;
