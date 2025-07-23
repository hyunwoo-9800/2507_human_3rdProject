import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CustomLoading from "../common/CustomLoading";

const ReportDownloadButton = ({form}) => {

    const [isLoading, setIsLoading] = useState(false);

    const timeFrameLabelMap = {
        week: '주간',
        month: '월간',
        year: '연간',
    };

    const handleDownload = async () => {

        setIsLoading(true);

        try {
            const res = await axios.get('http://192.168.0.39:8001/report/download', {
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

            const label = timeFrameLabelMap[form.timeFrame] || form.timeFrame;

            const disposition = res.headers['content-disposition'];
            const match = disposition && disposition.match(/filename="?(.+)"?/);

            let filename = `시세리포트_${form.lowCodeName}_${label}.xlsx`;

            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('엑셀 다운로드 실패:', err);
            alert('엑셀 다운로드에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = !form.lowCodeValue || !form.timeFrame;

    return (
        <div style={{marginTop: '1rem'}}>
            {isLoading ? (
                <CustomLoading tipMessage="시세 리포트를 준비하는 중이에요..."/>) : (
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
            )}

            {isDisabled && (
                <p style={{color: '#888', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                    부류, 품목, 기간을 모두 선택하면 다운로드가 가능합니다.
                </p>
            )}
        </div>
    );
};

export default ReportDownloadButton;
