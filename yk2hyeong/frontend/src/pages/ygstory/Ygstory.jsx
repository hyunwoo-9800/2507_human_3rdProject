import React, { useEffect } from 'react';
import axios from 'axios';

const Ygstory = () => {

    useEffect(() => {

        const memberId = localStorage.getItem('memberId');

        // 게임 로그인 처리
        axios.get(`/member/gameLogin?memberId=${memberId}`)
            .then((res) => {

                const member = res.data;

                alert('게임 로그인 완료!');
                window.location.href =
                    `/ygstory/html/index.html?memberId=${memberId}` +
                    `&memberName=${encodeURIComponent(member.memberName)}` +
                    `&memberCredit=${member.memberCredit}`;

            })
            .catch(() => {
                alert('게임 로그인 실패');
                window.location.href = '/';
            });
    }, []);

    return <></>;
};

export default Ygstory;
