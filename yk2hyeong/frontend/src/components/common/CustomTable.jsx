import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'

const CustomTable = ({ columns, data, selectionType = 'checkbox', onSelectionChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    setSelectedRowKeys([])
    if (onSelectionChange) onSelectionChange([], [])
  }, [selectionType])

  const rowSelection = selectionType
    ? {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
          setSelectedRowKeys(selectedKeys)
          if (onSelectionChange) onSelectionChange(selectedKeys, selectedRows)
        },
        type: selectionType,
      }
    : null

  return (
    <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false} />
  )
}

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  selectionType: PropTypes.oneOf(['checkbox', 'radio', null]),
  onSelectionChange: PropTypes.func,
}

export default CustomTable
