import React, { useEffect, useState } from 'react'
import ProductImgList from './ProductImgList'

function UserForm({ user }) {
  const [form, setForm] = useState({
    memberId: '',
    memberEmail: '',
    memberPwd: '',
    memberName: '',
    memberBname: '',
    memberBnum: '',
    memberShipperName: '',
    memberTel: '',
    memberAddr: '',
    memberDetailAddr: '',
    memberBankCode: '', //실제 응답 시 low_code_name 값으로
    memberAccountNum: '',
    memberRole: '', //실제 응답 시 low_code_name 값으로
    memberStatus: '',
    createdDate: '',
    businessFileUrl: '', //사업자등록증파일
    bankFileUrl: '', //통장 사본 파일 링크
  })

  useEffect(() => {
    if (user) {
      setForm({
        memberId: user.memberId,
        memberEmail: user.memberEmail,
        memberPwd: user.memberPwd,
        memberName: user.memberName,
        memberBname: user.memberBname,
        memberBnum: user.memberBnum,
        memberShipperName: user.memberShipperName,
        memberTel: user.memberTel,
        memberAddr: user.memberAddr,
        memberDetailAddr: user.memberDetailAddr,
        memberBankCode: user.memberBankCodeName,
        memberAccountNum: user.memberAccountNum,
        memberRole: user.memberRoleName,
        memberStatus: user.memberStatus,
        createdDate: user.createdDate,
        businessFileUrl: user.businessFileUrl,
        bankFileUrl: user.bankFileUrl,
        memberFileUrls: [user.businessFileUrl, user.bankFileUrl].filter(Boolean),
      })
    }
  }, [user])
  useEffect(() => {
    if (user) {
      setForm({
        memberId: user.memberId || '',
        memberEmail: user.memberEmail || '',
        memberPwd: user.memberPwd || '',
        memberName: user.memberName || '',
        memberBname: user.memberBname || '',
        memberBnum: user.memberBnum || '',
        memberShipperName: user.memberShipperName || '',
        memberTel: user.memberTel || '',
        memberAddr: user.memberAddr || '',
        memberDetailAddr: user.memberDetailAddr || '',
        memberBankCode: user.memberBankCodeName || '',
        memberAccountNum: user.memberAccountNum || '',
        memberRole: user.memberRoleName || '',
        memberStatus: user.memberStatus || '',
        createdDate: user.createdDate || '',
        memberFileUrls: user.memberFileUrls || [],
      })
    }
  }, [user])
  return (
    <form className="product-form-content">
      <label>
        <span>사업자명:</span>
        <input type="text" value={form.memberName} readOnly />
      </label>
      <label>
        <span>회원 역할:</span>
        <input type="text" value={form.memberRole} readOnly />
      </label>
      <label>
        <span>이메일:</span>
        <input type="email" value={form.memberEmail} readOnly />
      </label>
      <label>
        <span>연락처:</span>
        <input type="tel" value={form.memberTel} readOnly />
      </label>
      <label>
        <span>주소:</span>
        <input type="text" value={form.memberAddr} readOnly />
      </label>
      <label>
        <span>상세주소:</span>
        <input type="text" value={form.memberDetailAddr} readOnly />
      </label>
      <label>
        <span>상호명:</span>
        <input type="text" value={form.memberBname} readOnly />
      </label>
      <label>
        <span>사업자 등록번호:</span>
        <input type="text" value={form.memberBnum} readOnly />
      </label>
      <label>
        <span>은행코드:</span>
        <input type="text" value={form.memberBankCode} readOnly />
      </label>
      <label>
        <span>계좌번호:</span>
        <input type="text" value={form.memberAccountNum} readOnly />
      </label>
      <label>
        <span>등록일:</span>
        <input type="text" value={form.createdDate} readOnly />
      </label>
      {form.memberFileUrls?.length > 0 && (
        <label>
          <span>첨부파일:</span>
          <button
            type="button"
            onClick={() => {
              form.memberFileUrls.forEach((url) => {
                const filename = url.split('/').pop() // 파일명만 추출
                const apiUrl = `${window.location.origin}/api/image/${filename}`
                window.open(apiUrl, '_blank')
              })
            }}
          >
            다운로드
          </button>
        </label>
      )}
    </form>
  )
}

export default UserForm
