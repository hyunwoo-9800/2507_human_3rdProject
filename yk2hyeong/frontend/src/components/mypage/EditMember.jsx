import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import CustomSelect from '../../components/common/CustomSelect'
import AddressSearchModal from '../../components/common/AddressSearchModal'
import axios from 'axios'
import './EditMember.css'

function EditMember() {
    const navigate = useNavigate()

    const isValidName = (value) => {
        const maxLength = 30
        const regex = /^[a-zA-Z가-힣\s]+$/
        const hasOnlyJamo = /^[ㄱ-ㅎㅏ-ㅣ]+$/
        const hasNumberOrSymbol = /[0-9~!@#$%^&*()_+`\-=[\]{};':"\\|,.<>/?]/

        if (!value || value.length > maxLength) return false
        if (!regex.test(value)) return false
        if (hasOnlyJamo.test(value)) return false
        if (hasNumberOrSymbol.test(value)) return false
        return true
    }

    const [form, setForm] = useState({
        memberId: '',
        memberEmail: '',
        memberName: '',
        memberTel: '',
        memberAddr: '',
        memberDetailAddr: '',
        memberBname: '',
        memberBnum: '',
        memberBankCode: '',
        memberAccountNum: '',
    })

    const [address, setAddress] = useState('')
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [bankOptions, setBankOptions] = useState([])

    const [nameMessage, setNameMessage] = useState('')
    const [isNameValid, setIsNameValid] = useState(true)

    useEffect(() => {
        axios.get('/auth/me', { withCredentials: true }).then((res) => {
            const data = res.data
            setForm({
                memberId: data.memberId,
                memberEmail: data.memberEmail,
                memberName: data.memberName || '',
                memberTel: data.memberTel || '',
                memberAddr: data.memberAddr || '',
                memberDetailAddr: data.memberDetailAddr || '',
                memberBname: data.memberBname || '',
                memberBnum: data.memberBnum || '',
                memberBankCode: data.memberBankCode || '',
                memberAccountNum: data.memberAccountNum || '',
            })
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

        if (name === 'memberName') {
            setForm((prev) => ({ ...prev, [name]: value }))

            if (isValidName(value)) {
                setNameMessage('사용 가능한 이름입니다.')
                setIsNameValid(true)
            } else {
                setNameMessage('이름은 영문/한글만 가능하며, 자음·모음·숫자·특수문자는 허용되지 않습니다.')
                setIsNameValid(false)
            }
        } else if (onlyNumberFields.includes(name)) {
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

        if (!isValidName(form.memberName)) {
            alert('이름 형식을 다시 확인해 주세요.')
            setIsNameValid(false)
            setNameMessage('이름은 영문/한글만 가능하며, 자음·모음·숫자·특수문자는 허용되지 않습니다.')
            return
        }

        try {
            await axios.put(`/member/${form.memberId}`, form, {
                withCredentials: true,
            })
            alert('회원정보가 수정되었습니다.')
            navigate('/')
        } catch (err) {
            console.error(err)
            alert('수정 실패')
        }
    }

    return (
        <div className="editmember-form-container">
            <h2>회원정보 수정</h2>
            <form onSubmit={handleSubmit} className="editmember-form">
                <Input label="이메일" name="memberEmail" value={form.memberEmail} disabled />
                <Input
                    label="이름"
                    name="memberName"
                    value={form.memberName}
                    onChange={handleChange}
                    placeholder="이름"
                    maxLength={30}
                    required
                />
                {form.memberName && (
                    <p className={`validation-message ${isNameValid ? 'valid' : 'invalid'}`}>
                        {nameMessage}
                    </p>
                )}
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
                    disabled
                    maxLength={60}
                />
                <Input
                    label="사업자 등록번호"
                    name="memberBnum"
                    value={form.memberBnum}
                    onChange={handleChange}
                    placeholder="사업자등록번호"
                    disabled
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
                    disabled
                    maxLength={30}
                />
                <div className="editmember-btn-row">
                    <Button type="button" size="md" color="secondary" onClick={() => navigate('/')}>취소하기</Button>
                    <Button type="submit" size="md" color="primary">수정하기</Button>
                    <Button type="button" size="md" color="error" >탈퇴하기</Button>
                </div>
            </form>
        </div>
    )
}

export default EditMember
