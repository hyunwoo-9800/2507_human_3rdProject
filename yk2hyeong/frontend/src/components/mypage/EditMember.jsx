import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import CustomSelect from '../../components/common/CustomSelect'
import AddressSearchModal from '../../components/common/AddressSearchModal'
import axios from 'axios'
// import './signupForm.css' // 스타일도 반영

function EditMember() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        memberEmail: '',
        memberName: '',
        memberTel: '',
        memberAddr: '',
        memberDetailAddr: '',
        memberBname: '',
        memberBnum: '',
        memberShipperName: '',
        memberBankCode: '',
        memberAccountNum: '',
    })

    const [address, setAddress] = useState('')
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [bankOptions, setBankOptions] = useState([])

    useEffect(() => {
        const memberId = localStorage.getItem('memberId')
        axios.get(`/member/${memberId}`).then((res) => {
            const data = res.data
            setForm(data)
            setAddress(data.memberAddr || '')
        })
    }, [])

    useEffect(() => {
        axios.get('/common/bank').then((res) => {
            const options = res.data.map((code) => ({
                value: code.lowCodeValue,
                label: code.lowCodeName,
            }))
            setBankOptions(options)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        const onlyNumberFields = ['memberTel', 'memberBnum', 'memberAccountNum']

        if (onlyNumberFields.includes(name)) {
            const numeric = value.replace(/[^0-9]/g, '')
            setForm((prev) => ({ ...prev, [name]: numeric }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleBankSelect = (value) => {
        setForm((prev) => ({ ...prev, memberBankCode: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const memberId = localStorage.getItem('memberId')
        try {
            await axios.put(`/member/${memberId}`, form)
            alert('회원정보가 수정되었습니다.')
            navigate('/')
        } catch (err) {
            console.error(err)
            alert('수정 실패')
        }
    }

    return (
        <div className="signup-form-container">
            <h2>회원정보 수정</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <Input
                    label="이메일"
                    name="memberEmail"
                    value={form.memberEmail}
                    readOnly
                    disabled
                    placeholder="이메일"
                />
                <Input
                    label="이름"
                    name="memberName"
                    value={form.memberName}
                    onChange={handleChange}
                    placeholder="이름"
                    maxLength={30}
                    required
                />
                <Input
                    label="전화번호"
                    name="memberTel"
                    value={form.memberTel}
                    onChange={handleChange}
                    placeholder="연락처"
                    maxLength={13}
                    required
                />

                <div className="input-group">
                    <label className="input-label">주소</label>
                    <div className="address-search-input-container">
                        <input
                            type="text"
                            placeholder="주소 검색"
                            value={address}
                            readOnly
                            className="address-input"
                            onClick={() => setIsAddressModalOpen(true)}
                        />
                        <button
                            type="button"
                            className="search-icon-button"
                            onClick={() => setIsAddressModalOpen(true)}
                        >
                            🔍
                        </button>
                    </div>
                </div>

                {isAddressModalOpen && (
                    <AddressSearchModal
                        onClose={() => setIsAddressModalOpen(false)}
                        onComplete={(selectedAddress) => {
                            setAddress(selectedAddress)
                            setForm((prev) => ({ ...prev, memberAddr: selectedAddress }))
                            setIsAddressModalOpen(false)
                        }}
                    />
                )}

                <Input
                    label="상세 주소"
                    name="memberDetailAddr"
                    value={form.memberDetailAddr}
                    onChange={handleChange}
                    placeholder="상세주소"
                    maxLength={100}
                />
                <Input
                    label="사업자명"
                    name="memberBname"
                    value={form.memberBname}
                    onChange={handleChange}
                    placeholder="사업자명"
                    maxLength={60}
                />
                <Input
                    label="사업자 등록번호"
                    name="memberBnum"
                    value={form.memberBnum}
                    onChange={handleChange}
                    placeholder="사업자등록번호"
                    maxLength={30}
                />
                <div className="input-group">
                    <label htmlFor="memberBankCode" className="input-label">은행</label>
                    <CustomSelect
                        placeholder="은행을 선택하세요"
                        onChange={handleBankSelect}
                        options={bankOptions}
                        value={form.memberBankCode}
                    />
                </div>
                <Input
                    label="계좌번호"
                    name="memberAccountNum"
                    value={form.memberAccountNum}
                    onChange={handleChange}
                    placeholder="계좌번호"
                    maxLength={30}
                />
                <div className="signup-btn-row">
                    <Button type="button" size="md" color="secondary" onClick={() => navigate('/')}>
                        취소하기
                    </Button>
                    <Button type="submit" size="md" color="primary">
                        수정하기
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EditMember
