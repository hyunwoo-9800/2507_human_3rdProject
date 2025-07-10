// src/components/CustomStatistic.jsx
import React from 'react';
import { Statistic, Card } from 'antd';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

const { Timer } = Statistic;

const CustomStatistic = ({
                             variant = 'default',
                             isTimer = false,
                             timerType = 'countdown',
                             value,
                             title,
                             timerFormat = 'HH:mm:ss',
                             onFinish,
                             onChange,
                             prefix,
                             suffix,
                             precision,
                             valueStyle,
                             cardProps = {},
                         }) => {
    const formattedValue = isTimer ? dayjs(value) : value;

    const StatisticComponent = isTimer ? (
        <Timer
            type={timerType}
            title={title}
            value={formattedValue}
            format={timerFormat}
            onFinish={onFinish}
            onChange={onChange}
        />
    ) : (
        <Statistic
            title={title}
            value={value}
            precision={precision}
            valueStyle={valueStyle}
            prefix={prefix}
            suffix={suffix}
            formatter={(val) => <CountUp end={val} separator="," />}
        />
    );

    return variant === 'card' ? (
        <Card className="custom-stat-card" {...cardProps}>
            {StatisticComponent}
        </Card>
    ) : (
        StatisticComponent
    );
};

export default CustomStatistic;
