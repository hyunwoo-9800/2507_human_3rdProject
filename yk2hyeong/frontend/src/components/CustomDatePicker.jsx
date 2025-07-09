// CustomDatePicker.jsx
import React from 'react';
import { DatePicker } from 'antd';

const CustomDatePicker = ({
                              onChange,
                              needConfirm = false,
                              disabled = false,
                              format = 'YYYY-MM-DD',
                              className = '',
                              ...rest
                          }) => {
    return (
        <DatePicker
            onChange={onChange}
            needConfirm={needConfirm}
            disabled={disabled}
            format={format}
            className={className}
            {...rest}
        />
    );
};

export default CustomDatePicker;
