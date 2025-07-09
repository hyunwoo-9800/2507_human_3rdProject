import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

const CustomTable = ({ columns, data, selectionType = 'checkbox', onSelectionChange }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        // selectionType 변경될 때 선택 초기화
        setSelectedRowKeys([]);
        if (onSelectionChange) onSelectionChange([], []);
    }, [selectionType]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            if (onSelectionChange) onSelectionChange(selectedKeys, selectedRows);
        },
        type: selectionType,
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );
};

CustomTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    selectionType: PropTypes.oneOf(['checkbox', 'radio']),
    onSelectionChange: PropTypes.func,
};

export default CustomTable;
