import React from 'react';
import { Select } from 'antd';

/**
 * @returns {JSX.Element}
 */
const CustomSelect = ({
    allowClear = false,
    loading = false,
    disabled = false,
    defaultValue,
    placeholder,
    onChange,
    onSearch,
    style = { width: '100%' },
    dropdownMatchSelectWidth = false,
    dropdownStyle = { textAlign: 'left' },
    names = null,
    options = null,
}) => {
    const handleChange = value => {
        console.log(`selected ${value}`);
        if (onChange) onChange(value);
    };

    const handleSearch = value => {
        console.log('search:', value);
        if (onSearch) onSearch(value);
    };

    const finalOptions = names
        ? names.map(name => ({
              value: name.toLowerCase(),
              label: name,
          }))
        : options || [
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'tom', label: 'Tom' },
              { value: 'disabled', label: 'Disabled', disabled: true },
          ];

    return (
        <Select
            showSearch
            placeholder={placeholder}
            optionFilterProp="label"
            allowClear={allowClear}
            loading={loading}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={handleChange}
            onSearch={handleSearch}
            style={style}
            options={finalOptions}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            dropdownStyle={dropdownStyle}
        />
    );
};

export default CustomSelect;
