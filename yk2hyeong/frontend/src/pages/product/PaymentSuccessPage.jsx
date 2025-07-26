import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const orderNumber = searchParams.get('orderNumber')
        const orderType = searchParams.get('orderType')
        const productId = searchParams.get('productId')
        const memberId = searchParams.get('memberId')
        const buyQty = Number(searchParams.get('buyQty'))
        const buyUnitPrice = Number(searchParams.get('buyUnitPrice'))
        const buyTotalPrice = Number(searchParams.get('buyTotalPrice'))
        const buyDeliveryDate = searchParams.get('buyDeliveryDate')
        const createdId = searchParams.get('createdId')


        axios.post('/api/payment/complete', {
            orderNumber,
            orderType,
            productId,
            memberId,
            buyQty,
            buyUnitPrice,
            buyTotalPrice,
            buyDeliveryDate,
            createdId,
        })
            .then(() => {
                alert('결제가 성공적으로 처리되었습니다!')
                //navigate(`/product/${productId}`)
                navigate(`/mypage`)
            })
            .catch(() => {
                alert('결제 처리 중 오류가 발생했습니다.')
                navigate('/')
            })
            .finally(() => setLoading(false))
    }, [searchParams, navigate])

    return (
        <div style={{ padding: 30 }}>
            <h2>{loading ? '결제 처리 중...' : '처리 완료'}</h2>
        </div>
    )
}

export default PaymentSuccessPage
