import React from 'react';
import axios from 'axios';

const ReportDownloadButton = ({ form }) => {
    const handleDownload = async () => {
        try {
            const res = await axios.get('http://localhost:8001/report/download', {
                params: {
                    lowCodeValue: form.lowCodeValue,
                    timeFrame: form.timeFrame,
                },
                responseType: 'blob',
            });

            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '시세리포트.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('엑셀 다운로드 실패:', err);
            alert('엑셀 다운로드에 실패했습니다.');
        }
    };

    const isDisabled = !form.lowCodeValue || !form.timeFrame;

    return (
        <div style={{ marginTop: '1rem' }}>
            <button
                onClick={handleDownload}
                disabled={isDisabled}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: isDisabled ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
            >
                시세 리포트 다운로드
            </button>

            {isDisabled && (
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    부류, 품목, 기간을 모두 선택하면 다운로드가 가능합니다.
                </p>
            )}
        </div>
    );
};

export default ReportDownloadButton;
