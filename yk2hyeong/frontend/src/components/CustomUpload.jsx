// CustomUpload.jsx
import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CustomUpload = ({
                          action = '',
                          onChange,
                          defaultFileList = [],
                          buttonText = 'Upload',
                          buttonIcon = <UploadOutlined />,
                          ...rest
                      }) => {
    return (
        <Upload action={action} onChange={onChange} defaultFileList={defaultFileList} {...rest}>
            <Button icon={buttonIcon}>{buttonText}</Button>
        </Upload>
    );
};

export default CustomUpload;
