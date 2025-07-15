import React, {useState, useEffect} from "react";
import {validate} from "uuid";

function DropboxGroup({selectRole, selectStatus, onRoleChange, onStatusChange, roleOption, statusOption}){
    // 드롭박스 onChange 관리
    const handleRoleChange = (value) => {
        onRoleChange(value[1]);
    };
    const handleStatusChange = (value) => {
        onStatusChange(value[1]);
    }
    return(
        <div className="drop-box-group">
            {/* 분류 드롭박스 */}
            <select
                className="input input-md"
                value={selectRole}
                onChange={(e) => onRoleChange(e.target.value)}
            >
                <option value="전체">분류</option>
                {roleOption.map((role, idx) => (
                    <option key={idx} value={role}>{role}</option>
                ))}
            </select>

            {/* 상태 드롭박스 */}
            <select
                className="input input-md"
                value={selectStatus}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option value="전체">상태</option>
                {statusOption.map((status, idx) => (
                    <option key={idx} value={status}>{status}</option>
                ))}
            </select>
        </div>
    )
}

export default DropboxGroup;