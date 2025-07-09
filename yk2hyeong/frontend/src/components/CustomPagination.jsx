// CustomPagination.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';

const CustomPagination = ({
                              defaultCurrent = 1,
                              total = 50,
                              onChange,
                              className = '',
                              ...rest
                          }) => {
    return (
        <Pagination
            defaultCurrent={defaultCurrent}
            total={total}
            onChange={onChange}
            className={className}
            showSizeChanger={false}  // 이 부분 추가
            {...rest}
        />
    );
};

CustomPagination.propTypes = {
    defaultCurrent: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
    className: PropTypes.string,
};

export default CustomPagination;
