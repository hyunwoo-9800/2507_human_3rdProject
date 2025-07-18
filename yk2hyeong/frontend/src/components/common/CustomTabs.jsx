// CustomTabs.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'

const CustomTabs = ({ items = [], type = 'card', onChange, className = '', ...rest }) => {
  return <Tabs items={items} type={type} onChange={onChange} className={className} {...rest} />
}

CustomTabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      key: PropTypes.string.isRequired,
      children: PropTypes.node,
    })
  ).isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
}

export default CustomTabs
