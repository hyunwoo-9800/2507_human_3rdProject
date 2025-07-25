// useAuth.js
import { useEffect, useState } from 'react';
import axios from 'axios';

// 관리자 권한 커스텀 훅
export default function useAuth() {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/auth/me')
            .then((res) => {
                setAuth(res.data); // { memberId, memberRole }
            })
            .catch(() => {
                setAuth(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { auth, loading };
}
