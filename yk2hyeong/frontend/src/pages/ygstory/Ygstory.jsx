import React, { useEffect } from 'react';

const Ygstory = () => {

    useEffect(() => {
        // 컴포넌트가 마운트되면 바로 /ygstory/html/index.html로 이동
        window.location.href = '/ygstory/html/index.html';
    }, []);

    return (
        <div>
            <h1>영근 이야기</h1>
            {/* Spring Boot의 static 리소스로 직접 접근 */}
            <a href="/ygstory/html/index.html" target="_blank" rel="noopener noreferrer">
                영근 이야기 이동
            </a>
        </div>
    );
};

export default Ygstory;
