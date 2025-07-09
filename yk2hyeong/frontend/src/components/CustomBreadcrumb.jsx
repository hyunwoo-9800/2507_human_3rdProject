// CustomBreadcrumb.jsx
import React from 'react';
import { Breadcrumb } from 'antd';

const CustomBreadcrumb  = ({ separator = '>', items = [] }) => {
    return <Breadcrumb separator={separator} items={items} />;
};

export default CustomBreadcrumb ;
